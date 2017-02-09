
let uuid = require('node-uuid');

import { Player } from "./player";

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

    // TODO: Can be removed, must be checked
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
            throw new RangeError("Invalid room capacity. Must be between 1 and 4.");
        }

        ++Room.roomIdCounter;
        this._roomCapacity = roomCapacity;
        this._players = new Array<Player>();
        this._roomId = uuid.v1(); // Generate a v1 (time-based) id
        this._roomNumber = Room.roomIdCounter;
    }

    // Check if the room is full or not
    public roomIsFull(): boolean {
        return this._players.length === this._roomCapacity;
    }

    // Add a new player to the current room
    public addPlayer(player: Player): Boolean {

        if (typeof (player) === "undefined" || player == null) {
            throw new Error("The player is undefined");
        }

        //TODO: remove not necessary statement
        // Find a duplicated player name
        if (this.isUsernameAvailable(player)) {
            // console.log("---");
            // console.log("added a  player");

            this._players.push(player);

            return true;

        }

        // console.log("---");
        // console.log("player not added");
        // console.log("---");

        //console.log("Players list ", this._players);
        return false;
    }

    // Get the number of missing player before the game start
    public numberOfMissingPlayers(): number {
        return this._roomCapacity - this._players.length;
    }

    // Remove a player from the room
    public removePlayer(player: Player): Player {

        let index = this._players.findIndex((element) => {
            return (element === player);
        });

        if (index !== -1) {

            let playerRemoved = this._players.splice(index, 1);

            console.log("The removed player: ", playerRemoved);

            // TODO: remove the player from here
            // And send a missing member event to the room members
            return null;
        }

        // TODO: Must return the removed player

        return null;
    }

    // Check for a duplicated Player name
    public isUsernameAvailable(player: Player): boolean {

        let playerWithSameName = this._players.filter((element: Player) => element.username === player.username)[0];

        if (playerWithSameName !== undefined) {

            console.log("player with the same name", playerWithSameName.username);
        }
        return typeof (playerWithSameName) === "undefined";
    }
}
