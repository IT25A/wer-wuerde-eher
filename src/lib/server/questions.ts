import { database } from './database.ts';

// Zufällige, freigegebene Fragen aus den gewählten Kategorien (Hot Seat und Online-Modus).
export function getRandomQuestions(categoryIds: number[], count: number): string[] {
	if (categoryIds.length === 0 || count < 1) return [];

	const placeholders = categoryIds.map(() => '?').join(', ');
	const rows = database
		.prepare(
			`SELECT DISTINCT q.id, q.question_text AS questionText
			 FROM questions q
			 JOIN question_categories qc ON qc.question_id = q.id
			 WHERE q.is_approved = 1 AND qc.category_id IN (${placeholders})
			 ORDER BY RANDOM()
			 LIMIT ?`
		)
		.all(...categoryIds, count) as { id: number; questionText: string }[];

	// Die Anzeige ergänzt "Wer würde eher …?" selbst, daher ein abschließendes "?" entfernen.
	return rows.map((row) => row.questionText.trim().replace(/\?+$/, ''));
}

// Nimmt nur gültige, eindeutige Kategorie-IDs (positive Ganzzahlen) an.
export function sanitizeCategoryIds(value: unknown): number[] {
	if (!Array.isArray(value)) return [];
	return [
		...new Set(
			value.filter((id): id is number => typeof id === 'number' && Number.isInteger(id) && id > 0)
		)
	];
}
