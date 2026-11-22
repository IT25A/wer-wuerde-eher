import { json } from '@sveltejs/kit';
import { database } from '$lib/server/database';
import type { RequestHandler } from './$types';

// #region Interfaces, more of a orientation, not yet perfectly implemented
interface patchBody {
	questionId: number;
	question_text?: string;
	is_approved?: boolean;
}

interface patchResponse {
	message?: string;
	error?: string;
	status: number;
}

interface postBody {
	question_text: string;
	is_approved?: boolean;
}

interface postResponse {
	message?: string;
	error?: string;
	status: number;
}

interface getUrlParams {
	questionId?: number | 'all';
	categoryId?: number;
}

interface getResponse {
	question_text: string;
	is_approved: boolean;
	message?: string;
	error?: string;
	status: number;
}

interface getMultipleResponse {
	questions: {
		id: number;
		question_text: string;
		is_approved: boolean;
	}[];
	message?: string;
	status: number;
}

// #endregion

export const GET: RequestHandler = async ({ url }) => {
	const questionIdParam = url.searchParams.get('questionId');
	const categoryIdParam = url.searchParams.get('categoryId');
	if (!questionIdParam && !categoryIdParam) {
		return json({ error: 'Missing required query parameters.' }, { status: 400 });
	}
	if (questionIdParam && categoryIdParam) {
		return json({ error: 'Provide either questionId or categoryId, not both.' }, { status: 400 });
	}
	if (questionIdParam === 'all') {
		const questions = database
			.prepare(
				`
            SELECT
    q.id,
    q.question_text AS questionText,
    q.is_approved AS isApproved,
    json_group_array(qc.category_id) FILTER (
        WHERE qc.category_id IS NOT NULL
    ) AS categoryIds
FROM questions q
LEFT JOIN question_categories qc
    ON qc.question_id = q.id
GROUP BY q.id
ORDER BY q.created_at DESC
        `
			)
			.all()
			.map((question: any) => ({
				...question,
				categoryIds: JSON.parse(question.categoryIds)
			}));
		return json({ questions });
	} else if (questionIdParam) {
		const questionId = Number(questionIdParam);
		if (isNaN(questionId)) {
			return json({ error: 'Invalid questionId parameter.' }, { status: 400 });
		}
		const question = database
			.prepare(
				`
            SELECT 
                q.id,
                q.question_text AS questionText,
                json_group_array(qc.category_id) FILTER (
                    WHERE qc.category_id IS NOT NULL
                ) AS categoryIds
            FROM questions q
            LEFT JOIN question_categories qc
                ON qc.question_id = q.id
            WHERE q.id = ?
            GROUP BY q.id
        `
			)
			.get(questionId);
		return json({ question });
	} else {
		const categoryId = Number(categoryIdParam);
		if (isNaN(categoryId)) {
			return json({ error: 'Invalid categoryId parameter.' }, { status: 400 });
		}
		const questions = database
			.prepare(
				`
                SELECT
                    q.id,
                    q.question_text AS questionText,
                    q.is_approved AS isApproved,
                    json_group_array(qc.category_id) FILTER (
                        WHERE qc.category_id IS NOT NULL
                    ) AS categoryIds
                FROM questions q
                LEFT JOIN question_categories qc
                    ON qc.question_id = q.id
                WHERE qc.category_id = ?
                GROUP BY q.id
                ORDER BY q.created_at DESC
            `
			)
			.all(categoryId);
		return json({ questions });
	}
};

export const PATCH: RequestHandler = async ({ request }) => {
	let payload: unknown;
	try {
		payload = await request.json();
	} catch {
		return json({ error: 'Invalid request body.' }, { status: 400 });
	}
	if (typeof payload !== 'object' || payload === null) {
		return json({ error: 'Invalid request body.' }, { status: 400 });
	}

	const body = payload as patchBody;
	if (!body.questionId || (body.question_text === undefined && body.is_approved === undefined)) {
		return json({ error: 'Missing required fields.' }, { status: 400 });
	}
	database
		.prepare(
			`UPDATE questions SET question_text = COALESCE(?, question_text), is_approved = COALESCE(?, is_approved) WHERE id = ?`
		)
		.run(body.question_text, body.is_approved, body.questionId);
	return json({ message: 'Question updated successfully.' }, { status: 200 });
};

export const DELETE: RequestHandler = async ({ request }) => {
	let payload: unknown;
	try {
		payload = await request.json();
	} catch {
		return json({ error: 'Invalid request body.' }, { status: 400 });
	}
	if (typeof payload !== 'object' || payload === null) {
		return json({ error: 'Invalid request body.' }, { status: 400 });
	}
	const body = payload as { questionId: number };
	if (!body.questionId) {
		return json({ error: 'Missing required field: questionId.' }, { status: 400 });
	}
	database.prepare(`DELETE FROM questions WHERE id = ?`).run(body.questionId);
	return json({ message: 'Question deleted successfully.' }, { status: 200 });
};

export const POST: RequestHandler = async ({ request }) => {
	let payload: unknown;
	try {
		payload = await request.json();
	} catch {
		return json({ error: 'Invalid request body.' }, { status: 400 });
	}
	if (typeof payload !== 'object' || payload === null) {
		return json({ error: 'Invalid request body.' }, { status: 400 });
	}
	const body = payload as { question_text: string };
	if (!body.question_text) {
		return json({ error: 'Missing required field: question_text.' }, { status: 400 });
	}
	database.prepare(`INSERT INTO questions (question_text) VALUES (?)`).run(body.question_text);
	return json({ message: 'Question created successfully.' }, { status: 201 });
};
