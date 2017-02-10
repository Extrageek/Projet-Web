export class Player {

    private _username: string;
    private _numberOfPlayers: number;

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
}
