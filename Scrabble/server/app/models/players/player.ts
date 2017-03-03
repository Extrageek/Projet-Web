import { Room } from "../rooms/room";

export class Player {

    private _username: string;
    private _numberOfPlayers: number;
    private _socketId: string;

    // The constructor of a player
    constructor(username: string, numberOfPlayers: number, socketId: string) {

        if (username === null) {
            throw new Error("Argument error: The username cannot be null");
        }
        if (numberOfPlayers < Room.roomMinCapacity || numberOfPlayers > Room.roomMaxCapacity) {
            throw new RangeError("Argument error: The number of players should be between 1 and 4");
        }

        if (socketId === null) {
            throw new Error("Argument error: The socket id of the player cannot be null");
        }

        this._username = username;
        this._numberOfPlayers = numberOfPlayers;
        this.socketId = socketId;
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
}
