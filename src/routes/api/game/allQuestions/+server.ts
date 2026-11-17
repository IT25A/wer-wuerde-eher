import { json } from '@sveltejs/kit';
import { database } from '$lib/server/database';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = () => {
    const questions = database
        .prepare(`
            SELECT
    q.id,
    q.question_text AS questionText,
    json_group_array(qc.category_id) FILTER (
        WHERE qc.category_id IS NOT NULL
    ) AS categoryIds
FROM questions q
LEFT JOIN question_categories qc
    ON qc.question_id = q.id
GROUP BY q.id
ORDER BY q.created_at DESC
        `)
        .all().map((question: any) => ({
            ...question,
            categoryIds: JSON.parse(question.categoryIds)
        }));;
    return json({ questions });
}