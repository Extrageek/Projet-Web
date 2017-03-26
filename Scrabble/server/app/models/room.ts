import { Player } from "./player";
import { QueueCollection } from "./queue-collection";
import { Letter } from "./letter";
import { Board } from "./board/board";
import { TimerService } from "../services/timer.service";
import { LetterBankHandler } from "../services/letterbank-handler";
import { BoardManager } from "../services/board/board-manager";
import { IPlaceWordResponse } from "../services/commons/command/place-word-response.interface";

let uuid = require('node-uuid');

//TODO: To change to 5 minutes
const TIMER_DEFAULT_MINUTE = 4;

//TODO: To change to 0 secondes
const TIMER_DEFAULT_SECOND = 59;

export class Room {

    static roomMinCapacity = 1;
    static roomMaxCapacity = 4;

    private _playersQueue: QueueCollection<Player>;
    private _letterBankHandler: LetterBankHandler;
    private _boardManager: BoardManager;
    private _timerService: TimerService;

    private _roomCapacity: number;
    private _roomId: string;
    private _board: Board;

    public get timerService() {
        this._timerService.initializeCounter();
        return this._timerService;
    }
    // The constructor of the room
    constructor(roomCapacity: number) {
        if (roomCapacity < Room.roomMinCapacity || roomCapacity > Room.roomMaxCapacity) {
            throw new RangeError("Argument error: the number of players must be between 1 and 4.");
        }

        this._roomCapacity = roomCapacity;
        this._playersQueue = new QueueCollection<Player>();
        this._letterBankHandler = new LetterBankHandler();
        this._boardManager = new BoardManager();
        this._timerService = new TimerService(TIMER_DEFAULT_MINUTE, TIMER_DEFAULT_SECOND);
        this._roomId = uuid.v1(); // Generate a v1 (time-based) id
        this._board = new Board();
    }

    // The player of the room
    public get players(): QueueCollection<Player> {
        return this._playersQueue;
    }
    public set players(value: QueueCollection<Player>) {
        this._playersQueue = value;
    }

    public get letterBankHandler(): LetterBankHandler {
        return this._letterBankHandler;
    }

    // The room unique id
    public get roomId(): string {
        return this._roomId;
    }

    // The board of the room
    public get board(): Board {
        return this._board;
    }

    // The room capacity
    public get roomCapacity(): number {
        return this._roomCapacity;
    }

    // Check if the room is full or not
    public isFull(): boolean {
        return this._playersQueue.count === this._roomCapacity;
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

        this._playersQueue.enqueue(player);
    }

    // Get the number of missing player before the game
    public numberOfMissingPlayers(): number {
        return this._roomCapacity - this._playersQueue.count;
    }

    // Remove a player from the current room
    public removePlayer(player: Player): Player {
        let playerRemoved: Player = null;
        if (player === null || player === undefined) {
            throw new Error("Argument error: the player cannot be null");
        }

        playerRemoved = this._playersQueue.remove(player);
        return playerRemoved;
    }

    // Check if the username of the player already exist in the current room
    public isUsernameAlreadyExist(username: string): Boolean {
        if (username === null) {
            throw new Error("Argument error: the username cannot be null");
        }
        let exist = false;
        this._playersQueue.forEach((player: Player) => {
            if (player.username === username) {
                exist = true;
            }
        });

        return exist;
    }

    // Use to exchange letters from the a player easel
    public exchangeThePlayerLetters(socketId: String, letterToBeExchanged: Array<string>): boolean {
        let newLettersStr = this.letterBankHandler.exchangeLetters(letterToBeExchanged);
        let hasChanged = false;
        if (newLettersStr.length > 0) {
            this.players.forEach((player: Player) => {
                if (player.socketId === socketId && newLettersStr.length <= player.easel.letters.length) {
                    hasChanged = player.easel.exchangeLetters(letterToBeExchanged, newLettersStr);
                }
            });
        }
        return hasChanged;
    }

    public refillPlayerEasel(socketId: String) {
        this.players.forEach((player: Player) => {
            if (player.socketId === socketId) {
                let newLetters = this._letterBankHandler.refillEasel(7 - player.easel.letters.length);
                player.easel.addLetters(newLetters);
            }
        });
    }

    public getAndUpdatePlayersQueue(): Array<string> {
        let newPlayerOrder = new Array<string>();
        let players = this._playersQueue.updateAndGetQueuePriorities();

        for (let index = 0; index < players.length; ++index) {
            newPlayerOrder[index] = players[index].username;
        }
        this._timerService.initializeCounter();
        return newPlayerOrder;
    }

    public randomizePlayersPriorities() {
        if (this._playersQueue.count > 1) {
            this._playersQueue.randomizeTheListOfThePriorities();
        }
    }

    public getInitialsLetters(username: String): Array<string> {
        let lettersStr = this.letterBankHandler.initializeEasel();
        this._playersQueue.forEach((player: Player) => {
            if (player.username === username) {
                player.easel.letters = this.letterBankHandler.parseFromListOfStringToListOfLetter(lettersStr);
            }
        });
        return lettersStr;
    }

    public placeWordInTheBoard(response: IPlaceWordResponse, username: string): boolean {
        let hasBeenPlaced: boolean;
        this._playersQueue.forEach((player: Player) => {
            if (player.username === username) {
                hasBeenPlaced = this._boardManager.placeWordInBoard(response, this._board, player);
                player.easel.letters = this._boardManager.player.easel.letters;
            }
        });
        return hasBeenPlaced;
    }

    public verifyWordsCreated(response: IPlaceWordResponse, socketId: string): boolean {
        let areValidWords = false;
        this._playersQueue.forEach((player: Player) => {
            if (player.socketId === socketId) {
                areValidWords = this._board.verificationService.verifyWordsCreated(response, this._board);
                if (areValidWords) {
                    player.updateScore(this._board.verificationService.score);
                }
            }
        });
        return areValidWords;
    }

    public removeLastLettersPlacedAndRefill(socketId: string): Array<string> {
        let removedLetters = this._board.removeLastLettersAddedFromBoard();
        let previousEasel: Array<string>;
        this._playersQueue.forEach((player: Player) => {
            if (player.socketId === socketId) {
                player.easel.addLetters(removedLetters);
                previousEasel = this._letterBankHandler.parseFromListOfLetterToListOfString(player.easel.letters);
            }
        });
        return previousEasel;
    }
}