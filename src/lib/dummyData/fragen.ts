type question = {
    id: number,
    text: string,
    tags?: string[]
}

// Vorgefertigte Fragen (Anforderung "Vorgefertigte Fragen").
// Neue Fragen einfach als weiteren String ergänzen. Jede Frage ergänzt "Wer würde eher ...?"
export const questions: question[] = [
    {
        id: 1,
        text: 'im Urlaub den Zug verpassen',
        tags: ["Urlaub"]
    },
    {
        id: 2,
        text: 'sich auf einer Party im Schrank verstecken'
    },
    {
        id: 3,
        text: 'vor einer Prüfung nicht lernen und trotzdem bestehen',
        tags:["Schule und Uni"]
    },
    {
        id: 4,
        text: 'ein Vermögen im Lotto gewinnen und es in einem Monat ausgeben'
    },
    {
        id: 5,
        text: 'einen Marathon laufen, ohne zu trainieren'
    },
    {
        id: 6,
        text: 'beim Kochen die Küche abfackeln',
        tags: ["Kochen"]
    },
    {
        id: 7,
        text: 'mitten in einer Vorlesung einschlafen',
        tags: ["Schule und Uni"]
    },
    {
        id: 8,
        text: 'sein Handy in der Toilette versenken',
        tags: ["Technologie"]
    },
    {
        id: 9,
        text: 'eine Reise ohne Plan spontan antreten',
        tags: ["Reisen"]
    },
    {
        id: 10,
        text: 'mit einem Fremden im Zug beste Freunde werden',
        tags: ["Reisen"]
    },
    {
        id: 11,
        text: 'bei einem Escape Room als Erstes aufgeben',
        tags: ["Spiele"]
    },
    {
        id: 12,
        text: 'einen Tag lang nur rückwärts reden',
        tags: ["Alltag"]
    },
    {
        id: 13,
        text: 'sich für ein Tier-Kostüm im Alltag entscheiden',
        tags: ["Alltag"]
    },
    {
        id: 14,
        text: 'vergessen, wo das eigene Auto geparkt ist',
        tags: ["Alltag"]
    },
    {
        id: 15,
        text: 'zu spät zu seiner eigenen Geburtstagsfeier kommen',
        tags: ["Alltag"]
    },
    {
        id: 16,
        text: 'eine Woche ohne Handy überleben',
        tags: ["Technologie"]
    },
    {
        id: 17,
        text: 'bei einem Streit als Erstes nachgeben',
        tags: ["Alltag"]
    },
    {
        id: 18,
        text: 'einen ganzen Kuchen alleine essen',
        tags: ["Essen und Trinken"]
    },
    {
        id: 19,
        text: 'mit Promis befreundet sein',
        tags: ["Soziales"]
    },
    {
        id: 20,
        text: 'auf einer Hochzeit die Tanzfläche eröffnen',
        tags: ["Soziales"]
    },
    {
        id: 21,
        text: 'bei Karaoke das Mikrofon nicht mehr hergeben',
        tags: ["Soziales"]
    },
    {
        id: 22,
        text: 'sich in einer fremden Stadt verlaufen, obwohl er/sie Google Maps hat',
        tags: ["Reisen"]
    },
    {
        id: 23,
        text: 'ein Geheimnis nicht für sich behalten können',
        tags: ["Alltag"]
    },
    {
        id: 24,
        text: 'bei einem Horrorfilm am lautesten schreien',
        tags: ["Spiele"]
    },
    {
        id: 25,
        text: 'mitten in der Nacht eine Pizza bestellen',
        tags: ["Essen und Trinken"]
    },
    {
        id: 26,
        text: 'für eine Wette etwas Peinliches machen',
        tags: ["Alltag"]
    },
    {
        id: 27,
        text: 'ein eigenes Unternehmen gründen',
        tags: ["Beruf und Karriere"]
    },
    {
        id: 28,
        text: 'einen Wecker überhören und einen Termin verpassen',
        tags: ["Alltag"]
    },
    {
        id: 29,
        text: 'ein Haustier mit einem seltsamen Namen taufen',
        tags: ["Tiere"]
    },
    {
        id: 30,
        text: 'auswandern und nie wiederkommen',
        tags: ["Reisen"]
    }
];