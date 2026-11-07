import { WebSocketServer, WebSocket } from 'ws';
import type { ClientMessage } from './messages.ts';
import { Game } from './gameLogic.ts';
import type { HttpServer } from 'vite';

// Der Server selbst
const wss = new WebSocketServer({ noServer: true, path: '/ws' });

// Linkt die Websocket Verbindung zu einem uniquen User, wenn wir das nicht tun könnte ein Websocket unendlich viele User erstellen.
// The map only contains WebSockets that have completed a create or join action.
const wsUsers: Map<WebSocket, User> = new Map();

// Linkt die Räume mit einer ID
const rooms = new Map<Room['id'], Room>();

function sendGame(ws: WebSocket, room: Room) {
	ws.send(JSON.stringify({ ...room.game.gameToPublic(), gameCode: room.id }));
}

function broadcastGame(room: Room) {
	for (const [ws, user] of wsUsers) {
		if (user.room === room && ws.readyState === WebSocket.OPEN) {
			sendGame(ws, room);
		}
	}
}

class User {
	privateId: string = crypto.randomUUID();
	name: string;
	room?: Room;
	isActive: boolean = true;
	constructor(name?: string) {
		this.name = name?.slice(0, 20).trim() || generateRandomName();
	}
}

function deleteRoom(roomId: string) {
	rooms.delete(roomId);
}

function generateRoomCode(length: number = 6): string {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	let result = '';
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * characters.length));
	}
	return result;
}

class Room {
	id: string;
	users: Map<User['privateId'], User> = new Map();
	messages: string[] = [];
	game: Game;
	activePlayers: number;
	constructor(admin: User, id: string) {
		this.id = id;
		this.users = new Map([[admin.privateId, admin]]);
		this.game = new Game(admin.privateId, admin.name || '');
		this.activePlayers = 1;
	}
}

wss.on('connection', (ws) => {
	ws.on('error', console.error);
	ws.on('message', (data) => {
		const message: ClientMessage = JSON.parse(data.toString());
		const userExists = wsUsers.has(ws);
		switch (message.type) {
			case 'create_game': {
				if (userExists) {
					console.error('User already exists for this WebSocket');
					return;
				}
				const user = new User(message.playerName);
				wsUsers.set(ws, user);
				const room = new Room(user, generateRoomCode());
				rooms.set(room.id, room);
				user.room = room;
				break;
			}

			case 'join_game': {
				if (userExists) {
					console.error('User already exists for this WebSocket');
					return;
				}
				const room = rooms.get(message.gameCode);
				if (!room) {
					console.error('Room does not exist');
					return;
				}
				const user = new User(message.playerName);
				wsUsers.set(ws, user);
				room.users.set(user.privateId, user);
				room.activePlayers++;
				user.room = room;
				break;
			}
			case 'start_game':
				if (!userExists) {
					console.error('User does not exist for this WebSocket');
					return;
				}
				if (!wsUsers.get(ws)?.room) {
					console.error('User is not in a room');
					return;
				}
				wsUsers.get(ws)?.room?.game.nextPhase(wsUsers.get(ws)!.privateId!);
				break;
			case 'vote':
				if (!userExists) {
					console.error('User does not exist for this WebSocket');
					return;
				}
				if (!wsUsers.get(ws)?.room) {
					console.error('User is not in a room');
					return;
				}
				wsUsers.get(ws)?.room?.game.vote(wsUsers.get(ws)!.privateId!, message.targetName);
				break;
			case 'next_round':
				if (!userExists) {
					console.error('User does not exist for this WebSocket');
					return;
				}
				if (!wsUsers.get(ws)?.room) {
					console.error('User is not in a room');
					return;
				}
				wsUsers.get(ws)?.room?.game.nextPhase(wsUsers.get(ws)!.privateId!);

				break;
			case 'leave_game': {
				if (!userExists) {
					console.error('User does not exist for this WebSocket');
					return;
				}
				const user = wsUsers.get(ws);
				const room = user?.room;
				if (!room) {
					console.error('User is not in a room');
					return;
				}

				if (room) {
					if (user.isActive) {
						room.activePlayers--;
					}
					user!.isActive = false;
					user.room = undefined;
					if (room.activePlayers <= 0) {
						deleteRoom(room.id);
					}
				}
				room?.game.leave(wsUsers.get(ws)!.privateId!);
				room?.users.delete(wsUsers.get(ws)!.privateId);
				wsUsers.delete(ws);
				break;
			}
			case 'rejoin_game':
				{
					const room = rooms.get(message.gameCode);
					if (!room) {
						console.error('Room does not exist');
						return;
					}
					const user = room.users.get(message.privateId);
					if (!user) {
						console.error('User not found in room');
						return;
					}
					wsUsers.set(ws, user);
					if (!user.isActive) {
						user.isActive = true;
						room.activePlayers++;
					}
				}
				break;
			default:
				// @ts-expect-error - if message is not of type ClientMessage, this will throw an error
				console.error('Unknown message type:', message.type);
				break;
		}
		const room = wsUsers.get(ws)?.room;
		if (room) {
			broadcastGame(room);
		}
	});
	ws.on('close', () => {
		const user = wsUsers.get(ws);
		if (!user) {
			return;
		}
		wsUsers.delete(ws);
		const room = user.room;
		if (room) {
			user.isActive = false;
			room.activePlayers--;
			if (room.activePlayers <= 0) {
				deleteRoom(room.id);
			} else {
				broadcastGame(room);
			}
		}
	});
});

function generateRandomName(): string {
	const adjectives = [
		'Quick',
		'Lazy',
		'Happy',
		'Sad',
		'Angry',
		'Silly',
		'Brave',
		'Clever',
		'Calm',
		'Curious',
		'Daring',
		'Eager',
		'Friendly',
		'Gentle',
		'Jolly',
		'Kind',
		'Lucky',
		'Mighty',
		'Nimble',
		'Playful',
		'Quiet',
		'Rapid',
		'Sleepy',
		'Witty'
	];
	const animals = [
		'Fox',
		'Dog',
		'Cat',
		'Mouse',
		'Bear',
		'Lion',
		'Tiger',
		'Elephant',
		'Wolf',
		'Rabbit',
		'Panda',
		'Penguin',
		'Dolphin',
		'Otter',
		'Monkey',
		'Koala',
		'Giraffe',
		'Zebra',
		'Turtle',
		'Owl',
		'Eagle',
		'Hawk',
		'Frog',
		'Squirrel'
	];
	const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
	const animal = animals[Math.floor(Math.random() * animals.length)];
	return `${adjective}${animal}`;
}

export function attachWebSocket(server: HttpServer) {
	server.on('upgrade', (request: any, socket: any, head: any) => {
		const { pathname } = new URL(request.url!, `http://${request.headers.host}`);
		if (pathname === '/ws') {
			wss.handleUpgrade(request, socket, head, (ws) => {
				wss.emit('connection', ws, request);
			});
		}
	});
}
