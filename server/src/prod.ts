// prod.ts startet die gebaute SvelteKit-App (adapter-node) zusammen mit dem Socket.IO-Server.

import { createServer, type RequestListener } from 'node:http';
import { attachSocketServer } from './attach.ts';

const handlerPath = new URL('../../build/handler.js', import.meta.url).href;
const { handler } = (await import(handlerPath)) as { handler: RequestListener };

const PORT = Number(process.env.PORT ?? 3000);
const HOST = process.env.HOST ?? '0.0.0.0';

const httpServer = createServer(handler);
const io = attachSocketServer(httpServer);

httpServer.listen(PORT, HOST, () => {
	console.log(`Server läuft auf http://${HOST}:${PORT}`);
});

function shutdown() {
	io.close(() => process.exit(0));
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
