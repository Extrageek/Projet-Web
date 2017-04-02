import { Injectable } from "@angular/core";
import { CurrentPlayer } from "./../models/current-player";

@Injectable()
export class GameStatusService {
    public static readonly INITIAL_NUMBER_OF_STONES = 6;
    public static readonly DEFAULT_SCORE = 0;
    public static readonly DEFAULT_SET = 0;

    private _scorePlayer: number;
    private _scoreComputer: number;
    private _currentSet: number;
    private _currentStonesPlayer: number;
    private _currentStonesComputer: number;
    private _isLaunched: boolean;
    private _currentPlayer: CurrentPlayer;

    public get scorePlayer(): number {
        return this._scorePlayer;
    }

    public set scorePlayer(score: number) {
        this._scorePlayer = score;
    }

    public get scoreComputer(): number {
        return this._scoreComputer;
    }

    public set scoreComputer(score: number) {
        this._scoreComputer = score;
    }

    public get currentSet(): number {
        return this._currentSet;
    }

    public set currentSet(set: number) {
        this._currentSet = set;
    }

    public get currentStonesPlayer(): number {
        return this._currentStonesPlayer;
    }

    public set currentStonesPlayer(count: number) {
        this._currentStonesPlayer = count;
    }

    public get currentStonesComputer(): number {
        return this._currentStonesComputer;
    }

    public set currentStonesComputer(count: number) {
        this._currentStonesComputer = count;
    }

    public get isLaunched(): boolean {
        return this._isLaunched;
    }

    public set isLaunched(value: boolean) {
        this._isLaunched = value;
    }

    public get currentPlayer(): number {
        return this._currentPlayer;
    }
    public set currentPlayer(value: number) {
        this._currentPlayer = value;
    }

    constructor() {
        this._scorePlayer = GameStatusService.DEFAULT_SCORE;
        this._scoreComputer = GameStatusService.DEFAULT_SCORE;
        this._currentSet = GameStatusService.DEFAULT_SET;
        this._currentStonesPlayer = GameStatusService.INITIAL_NUMBER_OF_STONES;
        this._currentStonesComputer = GameStatusService.INITIAL_NUMBER_OF_STONES;
        this._isLaunched = false;
        this._currentPlayer = CurrentPlayer.INVALID;
    }

    public nextPlayer() {
        if (this.currentPlayer === CurrentPlayer.BLUE) {
            this.currentPlayer = CurrentPlayer.RED;
        }
        else {
            this.currentPlayer = CurrentPlayer.BLUE;
        }
    }

    public usedStone(): void {
        if (this.currentPlayer === CurrentPlayer.BLUE) {
            this.currentStonesPlayer = this.currentStonesPlayer - 1;
        } else if (this.currentPlayer === CurrentPlayer.RED) {
            this.currentStonesComputer = this.currentStonesComputer - 1;
        }
    }

    public incrementScorePlayer(score: number): void {
        this.scorePlayer = this.scorePlayer + score;
    }

    public incrementScoreComputer(score: number): void {
        this.scoreComputer = this.scoreComputer + score;
    }

    public launchGame() {
        this.isLaunched = true;
    }

    public resetStones(): void {
        this.currentStonesComputer = GameStatusService.INITIAL_NUMBER_OF_STONES;
        this.currentStonesPlayer = GameStatusService.INITIAL_NUMBER_OF_STONES;
    }

    public resetGameStatus(): void {
        this.scorePlayer = GameStatusService.DEFAULT_SCORE;
        this.scoreComputer = GameStatusService.DEFAULT_SCORE;
        this.currentSet = GameStatusService.DEFAULT_SET;
        this.currentStonesPlayer = GameStatusService.INITIAL_NUMBER_OF_STONES;
        this.currentStonesComputer = GameStatusService.INITIAL_NUMBER_OF_STONES;
        this.isLaunched = true;
        this.currentPlayer = CurrentPlayer.INVALID;
    }

    public randomFirstPlayer(): boolean {
        let randomNumber = Math.round(Math.random() * 1000) % 2;
        if (randomNumber === 0) {
            this.currentPlayer = CurrentPlayer.BLUE;
            return true;
        }
        else {
            this.currentPlayer = CurrentPlayer.RED;
            return false;
        }
    }
}
