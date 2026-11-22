import { json } from '@sveltejs/kit';
import { getRandomQuestions, sanitizeCategoryIds } from '$lib/server/questions';
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

	const categoryIds = sanitizeCategoryIds(body.categoryIds);
	const count = Number(body.count);

	if (categoryIds.length === 0 || !Number.isInteger(count) || count < 1 || count > 100) {
		return json(
			{ error: 'Bitte wählt Kategorien und eine gültige Rundenzahl aus.' },
			{ status: 400 }
		);
	}

	const questions = getRandomQuestions(categoryIds, count);

	if (questions.length === 0) {
		return json({ error: 'Für diese Kategorien wurden keine Fragen gefunden.' }, { status: 404 });
	}

	return json({ questions: questions.map((questionText) => ({ questionText })) });
};
