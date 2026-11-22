import { json } from '@sveltejs/kit';
import { database } from '$lib/server/database';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	let payload: unknown;
	try {
		payload = await request.json();
	} catch {
		return json({ error: 'Ungültige Anfrage.' }, { status: 400 });
	}
	if (typeof payload !== 'object' || payload === null) {
		return json({ error: 'Ungültige Anfrage.' }, { status: 400 });
	}
	const body = payload as { categoryIds?: unknown; count?: unknown };

	const categoryIds = Array.isArray(body.categoryIds)
		? [
			...new Set(
				body.categoryIds.filter(
					(id): id is number => typeof id === 'number' && Number.isInteger(id) && id > 0
				)
			)
		]
		: [];
	const count = Number(body.count);

	if (categoryIds.length === 0 || !Number.isInteger(count) || count < 1 || count > 100) {
		return json({ error: 'Bitte wählt Kategorien und eine gültige Rundenzahl aus.' }, { status: 400 });
	}

	const placeholders = categoryIds.map(() => '?').join(', ');
	const questions = database
		.prepare(
			`SELECT DISTINCT q.id, q.question_text AS questionText
			 FROM questions q
			 JOIN question_categories qc ON qc.question_id = q.id
			 WHERE q.is_approved = 1 AND qc.category_id IN (${placeholders})
			 ORDER BY RANDOM()
			 LIMIT ?`
		)
		.all(...categoryIds, count);

	if (questions.length === 0) {
		return json({ error: 'Für diese Kategorien wurden keine Fragen gefunden.' }, { status: 404 });
	}

	return json({ questions });
};
