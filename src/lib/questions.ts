export type QuestionCategory = 'Alltag' | 'Lustig' | 'Abenteuer' | 'Schule & Arbeit' | 'Beziehungen';

export const QUESTION_CATEGORIES: QuestionCategory[] = [
	'Alltag',
	'Lustig',
	'Abenteuer',
	'Schule & Arbeit',
	'Beziehungen'
];

// Vorgefertigte Fragen. Jede Frage ergänzt "Wer würde eher ...?"
export const categorizedQuestions: { text: string; category: QuestionCategory }[] = [
	{ text: 'im Urlaub den Zug verpassen', category: 'Abenteuer' },
	{ text: 'sich auf einer Party im Schrank verstecken', category: 'Lustig' },
	{ text: 'vor einer Prüfung nicht lernen und trotzdem bestehen', category: 'Schule & Arbeit' },
	{ text: 'ein Vermögen im Lotto gewinnen und es in einem Monat ausgeben', category: 'Alltag' },
	{ text: 'einen Marathon laufen, ohne zu trainieren', category: 'Abenteuer' },
	{ text: 'beim Kochen die Küche abfackeln', category: 'Lustig' },
	{ text: 'mitten in einer Vorlesung einschlafen', category: 'Schule & Arbeit' },
	{ text: 'sein Handy in der Toilette versenken', category: 'Alltag' },
	{ text: 'eine Reise ohne Plan spontan antreten', category: 'Abenteuer' },
	{ text: 'mit einem Fremden im Zug beste Freunde werden', category: 'Beziehungen' },
	{ text: 'bei einem Escape Room als Erstes aufgeben', category: 'Lustig' },
	{ text: 'einen Tag lang nur rückwärts reden', category: 'Lustig' },
	{ text: 'sich für ein Tier-Kostüm im Alltag entscheiden', category: 'Lustig' },
	{ text: 'vergessen, wo das eigene Auto geparkt ist', category: 'Alltag' },
	{ text: 'zu spät zu seiner eigenen Geburtstagsfeier kommen', category: 'Beziehungen' },
	{ text: 'eine Woche ohne Handy überleben', category: 'Alltag' },
	{ text: 'bei einem Streit als Erstes nachgeben', category: 'Beziehungen' },
	{ text: 'einen ganzen Kuchen alleine essen', category: 'Lustig' },
	{ text: 'mit Promis befreundet sein', category: 'Beziehungen' },
	{ text: 'auf einer Hochzeit die Tanzfläche eröffnen', category: 'Beziehungen' },
	{ text: 'bei Karaoke das Mikrofon nicht mehr hergeben', category: 'Lustig' },
	{ text: 'sich in einer fremden Stadt verlaufen, obwohl er/sie Google Maps hat', category: 'Abenteuer' },
	{ text: 'ein Geheimnis nicht für sich behalten können', category: 'Beziehungen' },
	{ text: 'bei einem Horrorfilm am lautesten schreien', category: 'Lustig' },
	{ text: 'mitten in der Nacht eine Pizza bestellen', category: 'Alltag' },
	{ text: 'für eine Wette etwas Peinliches machen', category: 'Lustig' },
	{ text: 'ein eigenes Unternehmen gründen', category: 'Schule & Arbeit' },
	{ text: 'einen Wecker überhören und einen Termin verpassen', category: 'Schule & Arbeit' },
	{ text: 'ein Haustier mit einem seltsamen Namen taufen', category: 'Alltag' },
	{ text: 'auswandern und nie wiederkommen', category: 'Abenteuer' }
];

export const questions: string[] = categorizedQuestions.map((question) => question.text);

export function getQuestionsByCategories(categories: QuestionCategory[]): string[] {
	if (categories.length === 0) return [];
	return categorizedQuestions
		.filter((question) => categories.includes(question.category))
		.map((question) => question.text);
}

// Alte einfache Liste wird weiterhin für andere Ansichten unterstützt.
/*
	'im Urlaub den Zug verpassen',
	'sich auf einer Party im Schrank verstecken',
	'vor einer Prüfung nicht lernen und trotzdem bestehen',
	'ein Vermögen im Lotto gewinnen und es in einem Monat ausgeben',
	'einen Marathon laufen, ohne zu trainieren',
	'beim Kochen die Küche abfackeln',
	'mitten in einer Vorlesung einschlafen',
	'sein Handy in der Toilette versenken',
	'eine Reise ohne Plan spontan antreten',
	'mit einem Fremden im Zug beste Freunde werden',
	'bei einem Escape Room als Erstes aufgeben',
	'einen Tag lang nur rückwärts reden',
	'sich für ein Tier-Kostüm im Alltag entscheiden',
	'vergessen, wo das eigene Auto geparkt ist',
	'zu spät zu seiner eigenen Geburtstagsfeier kommen',
	'eine Woche ohne Handy überleben',
	'bei einem Streit als Erstes nachgeben',
	'einen ganzen Kuchen alleine essen',
	'mit Promis befreundet sein',
	'auf einer Hochzeit die Tanzfläche eröffnen',
	'bei Karaoke das Mikrofon nicht mehr hergeben',
	'sich in einer fremden Stadt verlaufen, obwohl er/sie Google Maps hat',
	'ein Geheimnis nicht für sich behalten können',
	'bei einem Horrorfilm am lautesten schreien',
	'mitten in der Nacht eine Pizza bestellen',
	'für eine Wette etwas Peinliches machen',
	'ein eigenes Unternehmen gründen',
	'einen Wecker überhören und einen Termin verpassen',
	'ein Haustier mit einem seltsamen Namen taufen',
	'auswandern und nie wiederkommen'
];
*/
