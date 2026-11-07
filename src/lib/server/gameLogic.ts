class Player {
    // Name soll unique sein -> Public ID
    // Private ID gilt als Verfikiation, damit kein Spieler sich als ein anderer Spieler ausgeben kann.
	name: string;
    readonly privateId: string;
	roundsWon: number;
	totalVotes: number;
	roundVotes: number;
	voted: Player | null;
	color?: string;
    isAdmin: boolean;
    constructor(name: string, isAdmin: boolean = false, privateId: string) {
        this.name = name.slice(0, 20).trim();
        this.roundsWon = 0;
        this.totalVotes = 0;
        this.roundVotes = 0;
        this.voted = null;
        this.isAdmin = isAdmin;
        this.privateId = privateId;
    }
}

export class Game {
    players: Map<Player["privateId"], Player> = new Map();
    playersByName: Map<Player["name"], Player> = new Map();
    totalRounds: number = 5;
    currentRound: number = 0
    maxPlayers: number = 10;
    owner: Player;
    phase: "setup" | "vote" | "result" | "final" = "setup";
    constructor(privateId: string, name: string) {
        const player = new Player(name, true, privateId);
        this.players.set(privateId, player);
        this.playersByName.set(name, player);
        this.owner = player;
    }
    nextPhase(calledById: string) {
        const calledBy = this.players.get(calledById);
        if(!calledBy || !calledBy.isAdmin) {
            throw new Error("Only the admin can advance the phase.");
        }
        else{
            switch(this.phase) {
                case "setup":
                    this.phase = "vote";
                    break;
                case "vote":
                    this.players.forEach((p) => {
                        p.roundVotes = 0;
                    });
                    this.currentRound++;
                    this.phase = "result";
                    break;
                case "result":
                    this.players.forEach((p) => {
                        p.totalVotes += p.roundVotes;
                    });
                    this.phase = "final";
                    break;
                case "final":
                    this.players.forEach((p) => {
                        p.roundsWon = 0;
                        p.totalVotes = 0;
                        p.roundVotes = 0;
                        p.voted = null;
                    });
                    this.currentRound = 0;
                    this.phase = "setup";
                    break;
            }
        }
    }
    playerJoins(name: string, isAdmin: boolean = false, privateId: string) {
        if(this.phase !== "setup") {
            throw new Error("Cannot join a game that has already started.");
        }
        if(this.players.size >= this.maxPlayers) {
            throw new Error("Game is full.");
        }
        const player = new Player(name, isAdmin, privateId);
        if(this.playersByName.has(name)) {
            throw new Error("Player name already taken.");
        }
        this.players.set(privateId, player);
        this.playersByName.set(name, player);
    }
    kickPlayer(targetName: string, calledById: string) {
        const calledBy = this.players.get(calledById);
        if(!calledBy || !calledBy.isAdmin) {
            throw new Error("Only the admin can kick players.");
        }
        const target = this.playersByName.get(targetName);
        if(!target) {
            throw new Error("Player not found.");
        }
        this.players.delete(target.privateId);
        this.playersByName.delete(target.name);
    }
    vote(voterId: string, targetId: string) {
        const voter = this.players.get(voterId);
        const target = this.players.get(targetId);
        if(!voter || !target) {
            throw new Error("Voter or target not found.");
        }
        if(this.phase !== "vote") {
            throw new Error("Cannot vote at this time.");
        }
        if(voter.voted) {
            if(voter.voted === target) {
                return;
            }
            voter.voted.roundVotes--;
        }
        voter.voted = target;
        target.roundVotes++;
    }
    leave(playerId: string) {
        const player = this.players.get(playerId);
        if(!player) {
            throw new Error("Player doesn't exist.");
        }
        this.players.delete(playerId);
        this.playersByName.delete(player.name);
    }
    player(privateId: string): Player | undefined {
        return this.players.get(privateId);
    }
    gameToPublic(): publicGame {
    return {
        players: Array.from(this.players.values()).map(playerToPublic),
        totalRounds: this.totalRounds,
        currentRound: this.currentRound,
        maxPlayers: this.maxPlayers,
        phase: this.phase
    };
}
};


export interface publicPlayer {
    name: string;
    roundsWon: number;
    totalVotes: number;
    roundVotes: number;
    voted: publicPlayer | null;
    color?: string;
    isAdmin: boolean;
}

export interface publicGame {
    players: publicPlayer[];
    totalRounds: number;
    currentRound: number;
    maxPlayers: number;
    phase: "setup" | "vote" | "result" | "final";
};

function playerToPublic(player: Player): publicPlayer {
    return {
        name: player.name,
        roundsWon: player.roundsWon,
        totalVotes: player.totalVotes,
        roundVotes: player.roundVotes,
        voted: player.voted ? playerToPublic(player.voted) : null,
        color: player.color,
        isAdmin: player.isAdmin
    };
}

