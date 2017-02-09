export class Player {

    // The player name
    private _username: string;
    public get username(): string {
        return this._username;
    }
    public set username(value: string) {
        this._username = value;
    }

    // The number of player needed in the room
    private _numberOfPlayers: number;
    public get numberOfPlayers(): number {
        return this._numberOfPlayers;
    }
    public set numberOfPlayers(value: number) {
        this._numberOfPlayers = value;
    }

    // The constructor of a player
    constructor(playerName: string, numberOfPlayers: number, socket: SocketIOClient.Socket) {

        if (playerName === null) {
            throw new Error("Invalid parameters.");
        }

        let playerNameTrimed = playerName.trim();
        if ((playerNameTrimed === "")
            || numberOfPlayers < 1
            || numberOfPlayers > 4) {
            throw new Error("Invalid parameters.");
        }
        this._username = playerName;
        this._numberOfPlayers = numberOfPlayers;
    }
}
