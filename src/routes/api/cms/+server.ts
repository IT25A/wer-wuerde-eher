import { json } from '@sveltejs/kit';
import { database } from '$lib/server/database';
import type { RequestHandler } from './$types';

interface patchBody {
    categoryId: number;
    questionIds: number[] | number;
    action: 'add' | 'remove';
}
export interface patchResponse {
    message?: string;
    error?: string;
    status: number;
}
export interface getResponse {
    id: number;
    name: string;
    description: string;
    questionCount: number;
    status: number;
}
export interface getAllResponse {
    categories: {
        id: number;
        name: string;
        description: string;
        questionCount: number;
    }[];
    status: number;
}

interface deleteBody {
    categoryId: number;
}
export interface deleteResponse {
    message?: string;
    error?: string;
    status: number;
}
export interface postBody {
    categoryName: string;
    description?: string;
}
export interface postResponse {
    message?: string;
    error?: string;
    status: number;
}
export const PATCH: RequestHandler = async ({ request }) => {
    let payload: unknown;
    try {
        payload = await request.json();
    } catch {
        return json({ error: 'Ungültige Anfrage.' }, { status: 400 });
    }
    if (typeof payload !== 'object' || payload === null) {
        return json({ error: 'Ungültige Anfrage.' }, { status: 400 });
    }
    const body = payload as patchBody;
    if (!Array.isArray(body.questionIds)) {
        body.questionIds = [body.questionIds];
    }
    if (body.action === 'add') {
        const insert = database.prepare(
            'INSERT OR IGNORE INTO question_categories (question_id, category_id) VALUES (?, ?)'
        );
        for (const questionId of body.questionIds) {
            insert.run(questionId, body.categoryId);
        }
        return json({ message: 'Kategorie(n) erfolgreich hinzugefügt.' }, { status: 200 });
    }
    else if (body.action === 'remove') {
        const del = database.prepare(
            'DELETE FROM question_categories WHERE question_id = ? AND category_id = ?'
        );
        for (const questionId of body.questionIds) {
            del.run(questionId, body.categoryId);
        }
        return json({ message: 'Kategorie(n) erfolgreich entfernt.' }, { status: 200 });
    }
    else {
        return json({ error: 'Ungültige Aktion.' }, { status: 400 });
    }
}
export const GET: RequestHandler = async ({ url }) => {
    const categoryIdParam = url.searchParams.get('categoryId');
    if (!categoryIdParam) {
        return json({ error: 'Kategorie-ID ist erforderlich.' }, { status: 400 });
    }
    if (categoryIdParam.trim() === '' || (isNaN(Number(categoryIdParam))) && categoryIdParam.trim() !== "all") {
        return json({ error: 'Ungültige Kategorie-ID.' }, { status: 400 });
    }
    if (categoryIdParam.trim() === "all") {
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
        return json({ categories });
    }
    // else
    const categoryId = Number(categoryIdParam);
    const category = database
        .prepare('SELECT id, name, description, COUNT(DISTINCT q.id) AS questionCount FROM categories WHERE id = ?')
        .get(categoryId);
    if (!category) {
        return json({ error: 'Kategorie nicht gefunden.' }, { status: 404 });
    }
    return json(category, { status: 200 });
}

export const DELETE: RequestHandler = async ({ request }) => {
    let payload: unknown;
    try {
        payload = await request.json();
    } catch {
        return json({ error: 'Ungültige Anfrage.' }, { status: 400 });
    }
    if (typeof payload !== 'object' || payload === null) {
        return json({ error: 'Ungültige Anfrage.' }, { status: 400 });
    }
    const body = payload as deleteBody;
    const category = database
        .prepare('SELECT id, name FROM categories WHERE id = ?')
        .get(body.categoryId);
    if (!category) {
        return json({ error: 'Kategorie nicht gefunden.' }, { status: 404 });
    }
    database.prepare('DELETE FROM categories WHERE id = ?').run(body.categoryId);
    return json({ message: 'Kategorie erfolgreich gelöscht.' }, { status: 200 });
}

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
    const body = payload as postBody;
    if (typeof body.categoryName !== 'string' || body.categoryName.trim() === '') {
        return json({ error: 'Ungültige Kategorie.' }, { status: 400 });
    }
    database.prepare('INSERT INTO categories (name) VALUES (?)').run(body.categoryName.trim());
    return json({ message: 'Kategorie erfolgreich erstellt.' }, { status: 201 });
};