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
    constructor(username: string, numberOfPlayers: number) {

        if (username === null) {
            throw new Error("Argument error: the username cannot be null");
        }
        if (numberOfPlayers < 1 || numberOfPlayers > 4) {
            throw new RangeError("Argument error: the number of players must be between 1 and 4");
        }

        this._username = username;
        this._numberOfPlayers = numberOfPlayers;
    }
}
