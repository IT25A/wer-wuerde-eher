/** Messages sent by clients to the server. */
export type ClientMessage =
	| CreateGameMessage
	| JoinGameMessage
	| StartGameMessage
	| SubmitChoiceMessage
	| NextRoundMessage
	| LeaveGameMessage
	| RejoinGameMessage;

export interface CreateGameMessage {
	type: "create_game";
	playerName: string;
}

export interface JoinGameMessage {
	type: "join_game";
	gameCode: string;
	playerName: string;
}

export interface StartGameMessage {
	type: "start_game";
}

export interface SubmitChoiceMessage {
	type: "vote";
	targetName: string;
}

export interface NextRoundMessage {
	type: "next_round";
}

export interface LeaveGameMessage {
	type: "leave_game";
}

export interface RejoinGameMessage {
    type: "rejoin_game";
    privateId: string;
    gameCode: string;
}