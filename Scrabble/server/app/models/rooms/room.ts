import { Player } from "../players/player";
import { Letter } from '../../models/lettersBank/letter';
import { LetterBankHandler } from '../../services/lettersBank/letterbank-handler';
let uuid = require('node-uuid');

export class Room {

    static roomMinCapacity = 1;
    static roomMaxCapacity = 4;

    private _players: Array<Player>;
    private _letterBankHandler: LetterBankHandler;
    private _roomCapacity: number;
    private _roomId: string;

    // The constructor of the room
    constructor(roomCapacity: number) {
        if (roomCapacity < Room.roomMinCapacity || roomCapacity > Room.roomMaxCapacity) {
            throw new RangeError("Argument error: the number of players must be between 1 and 4.");
        }

        this._roomCapacity = roomCapacity;
        this._players = new Array<Player>();
        this._letterBankHandler = new LetterBankHandler();
        this._roomId = uuid.v1(); // Generate a v1 (time-based) id
    }

    // The player of the room
    public get players(): Array<Player> {
        return this._players;
    }
    public set players(value: Array<Player>) {
        this._players = value;
    }

    public get letterBankHandler(): LetterBankHandler {
        return this._letterBankHandler;
    }

    // The room unique id
    public get roomId(): string {
        return this._roomId;
    }

    // The room capacity
    public get roomCapacity(): number {
        return this._roomCapacity;
    }

    // Check if the room is full or not
    public isFull(): boolean {
        return this._players.length === this._roomCapacity;
    }

    // Add a new player to the current room
    public addPlayer(player: Player) {

        if (typeof (player) === "undefined" || player == null) {
            throw new Error("The player cannot be null");
        }

        if (this.isFull()) {
            throw new Error("The room is full, cannot add a new player");
        }

        if (this.isUsernameAlreadyExist(player.username)) {
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
        let playerRemoved: Player;
        playerRemoved = null;
        if (player === null || player === undefined) {
            throw new Error("Argument error: the player cannot be null");
        }

        let index = this._players.findIndex((element) => {
            return (element === player);
        });

        if (index !== -1) {
            playerRemoved = this._players.splice(index, 1)[0];
        }

        return playerRemoved;
    }

    // Check if the username of the player already exist in the current room
    public isUsernameAlreadyExist(username: string): Boolean {
        if (username === null) {
            throw new Error("Argument error: the username cannot be null");
        }

        let matchPlayer = this._players.filter((player) => (player.username === username))[0];

        return (matchPlayer !== null && matchPlayer !== undefined) ? true : false;
    }

    // Use to exchange letters from the a player easel
    public exchangeThePlayerLetters(letterToBeExchange: Array<string>): Array<string> {
        return this.letterBankHandler.exchangeLetters(letterToBeExchange);
    }
}
