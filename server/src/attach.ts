// attach.ts hängt den Socket.IO-Server an einen bestehenden HTTP-Server.
// So laufen Webseite und Game-Server im selben Prozess und auf demselben Port.

import type { Server as HttpServer } from 'node:http';
import type { Http2SecureServer } from 'node:http2';
import { Server } from 'socket.io';
import { registerSocketHandlers } from './socket.ts';
import type { ClientToServerEvents, ServerToClientEvents } from '../../shared/socket-events.ts';

export function attachSocketServer(httpServer: HttpServer | Http2SecureServer) {
	const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer);
	registerSocketHandlers(io);
	return io;
}
