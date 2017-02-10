import { Player } from "./player";
let uuid = require('node-uuid');

export class Room {

    private static roomIdCounter = 0;

    // The player of the room
    private _players: Array<Player>;
    public get players(): Array<Player> {
        return this._players;
    }
    public set players(value: Array<Player>) {
        this._players = value;
    }

    // The room capacity
    private _roomCapacity: number;
    public get roomCapacity(): number {
        return this._roomCapacity;
    }
    public set roomCapacity(value: number) {
        this._roomCapacity = value;
    }

    // The room unique id
    private _roomId: string;
    public get roomId(): string {
        return this._roomId;
    }
    public set roomId(value: string) {
        this._roomId = value;
    }

    // TODO: Can be removed, must be checked with the group before
    private _roomNumber: number;
    public get roomNumber(): number {
        return this._roomNumber;
    }
    public set roomNumber(value: number) {
        this._roomNumber = value;
    }

    // The constructor of the room
    constructor(roomCapacity: number) {
        if (roomCapacity < 1 || roomCapacity > 4) {
            throw new RangeError("Argument error: the number of players must be between 1 and 4.");
        }

        ++Room.roomIdCounter;
        this._roomCapacity = roomCapacity;
        this._players = new Array<Player>();
        this._roomId = uuid.v1(); // Generate a v1 (time-based) id
        this._roomNumber = Room.roomIdCounter;
    }

    // Check if the room is full or not
    public isFull(): boolean {
        return this._players.length === this._roomCapacity;
    }

    // Add a new player to the current room
    public addPlayer(player: Player) {

        if (typeof (player) === "undefined" || player == null) {
            throw new Error("The player is undefined");
        }

        if (this.isFull()) {
            throw new Error("The room is full, cannot add a new player");
        }

        if (this.usernameAlreadyExist(player.username)) {
            throw new Error("The username already exist in this room");
        }

        this._players.push(player);
    }

    // Get the number of missing player before the game
    public numberOfMissingPlayers(): number {
        return this._roomCapacity - this._players.length;
    }

    // Remove a player from the current room
    public removePlayer(player: Player): Player {
        if (player === null || player === undefined) {
            throw new Error("Argument error: the player cannot be null");
        }

        let index = this._players.findIndex((element) => {
            return (element === player);
        });

        if (index !== -1) {

            let playerRemoved = this._players.splice(index, 1)[0];
            return playerRemoved;
        }

        return null;
    }

    // Check if the username of the player already exist in the current room
    public usernameAlreadyExist(username: string): Boolean {
        if (username === null) {
            throw new Error("Argument error: the username cannot be null");
        }

        let matchPlayer = this._players.filter((player) => (player.username === username))[0];

        return (matchPlayer !== null && matchPlayer !== undefined) ? true : false;
    }
}
