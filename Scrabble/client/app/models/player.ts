export class Player {

    private _username: string;
    private _numberOfPlayers: number;
    private _socketId: string;
    private _score: number;

    // The constructor of a player
    constructor(username: string) {

        if (username === null) {
            throw new Error("Argument error: The username cannot be null");
        }
        this._username = username;
        this._score = 0;
    }

    // The player name
    public get username(): string {
        return this._username;
    }

    public set username(value: string) {
        this._username = value;
    }

    // The number of player needed in the room
    public get numberOfPlayers(): number {
        return this._numberOfPlayers;
    }
    public set numberOfPlayers(value: number) {
        this._numberOfPlayers = value;
    }

    // The socket id using by the player, use to hanle deconnection event
    public get socketId(): string {
        return this._socketId;
    }
    public set socketId(value: string) {
        this._socketId = value;
    }

    public get score() : number {
        return this._score;
    }
    public set score(v : number) {
        this._score = v;
    }
}
