import type { Plugin } from 'vite';
import { attachSocketServer } from './server/src/attach.ts';

// Hängt den Socket.IO-Server im Dev-Modus an den Vite-Server (gleicher Port wie die Webseite).
export function socketServerPlugin(): Plugin {
	return {
		name: 'socket-server',
		configureServer(server) {
			if (!server.httpServer) return;
			const io = attachSocketServer(server.httpServer);
			server.httpServer.on('close', () => io.close());
		}
	};
}
