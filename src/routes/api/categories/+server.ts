import { json } from '@sveltejs/kit';
import { database } from '$lib/server/database';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = () => {
	const categories = database
		.prepare(
			`SELECT c.id, c.name, c.description, COUNT(DISTINCT q.id) AS questionCount
			 FROM categories c
			 LEFT JOIN question_categories qc ON qc.category_id = c.id
			 LEFT JOIN questions q ON q.id = qc.question_id AND q.is_approved = 1
			 GROUP BY c.id
			 ORDER BY c.id`
		)
		.all();

	return json(categories);
};
