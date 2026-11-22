import { database } from '$lib/server/database';

// Wird vom HEALTHCHECK im Dockerfile abgefragt und prüft dabei auch, ob die Datenbank lesbar ist.
export function GET() {
	database.prepare('SELECT 1').get();
	return new Response('ok');
}
