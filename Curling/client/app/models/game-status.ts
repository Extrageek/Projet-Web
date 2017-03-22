import { Injectable } from '@angular/core';

export enum CurrentPlayer {
    BLUE = 0,
    RED = 1,
    INVALID = 2
}

@Injectable()
export class GameStatus {

    public static readonly INITIAL_NUMBER_OF_STONES = 8;

    private _scorePlayer: number;
    private _scoreComputer: number;
    private _currentSet: number;
    private _currentStonesPlayer: number;
    private _currentStonesComputer: number;
    private _isLaunched: boolean;
    private _currentPlayer: CurrentPlayer;

    constructor() {
        this._scorePlayer = 0;
        this._scoreComputer = 0;
        this._currentSet = 1;
        this._currentStonesPlayer = GameStatus.INITIAL_NUMBER_OF_STONES;
        this._currentStonesComputer = GameStatus.INITIAL_NUMBER_OF_STONES;
        this._isLaunched = false;
        this._currentPlayer = CurrentPlayer.INVALID;
    }

    public get scorePlayer() : number {
        return this._scorePlayer;
    }

    public set scorePlayer(v : number) {
        this._scorePlayer = v;
    }

    public get scoreComputer() : number {
        return this._scoreComputer;
    }

    public set scoreComputer(v : number) {
        this._scoreComputer = v;
    }

    public get currentSet() : number {
        return this._currentSet;
    }

    public set currentSet(v : number) {
        this._currentSet = v;
    }

    public get currentStonesPlayer() : number {
        return this._currentStonesPlayer;
    }

    public set currentStonesPlayer(v : number) {
        this._currentStonesPlayer = v;
    }

    public get currentStonesComputer() : number {
        return this._currentStonesComputer;
    }

    public set currentStonesComputer(v : number) {
        this._currentStonesComputer = v;
    }

    public get isLaunched(): boolean {
        return this._isLaunched;
    }

    public set isLaunched(v: boolean ) {
        this._isLaunched = v ;
    }

    public set currentPlayer(v : number) {
        this._currentPlayer = v;
    }

    public get currentPlayer(): number {
        return this._currentPlayer;
    }

    public nextPlayer() {
        this._currentPlayer = (this._currentPlayer === CurrentPlayer.BLUE) ? CurrentPlayer.RED : CurrentPlayer.BLUE;
    }

    public usedStone(): void {
        if (this.currentPlayer === CurrentPlayer.BLUE) {
            this._currentStonesPlayer = this._currentStonesPlayer - 1;
        } else if (this.currentPlayer === CurrentPlayer.RED) {
            this._currentStonesComputer = this._currentStonesComputer - 1;
        }
    }

    public incrementScorePlayer(score: number): void {
        this._scorePlayer = this._scorePlayer + score;
    }

    public incrementScoreComputer(score: number): void {
        this._scoreComputer = this._scoreComputer + score;
    }

    public launchGame(){
        this._isLaunched = true;
    }

    public resetStones(): void {
        this._currentStonesComputer = GameStatus.INITIAL_NUMBER_OF_STONES;
        this._currentStonesPlayer = GameStatus.INITIAL_NUMBER_OF_STONES;
    }

    public resetGameStatus(): void {
        this._scorePlayer = 0;
        this._scoreComputer = 0;
        this._currentSet = 1;
        this._currentStonesPlayer = GameStatus.INITIAL_NUMBER_OF_STONES;
        this._currentStonesComputer = GameStatus.INITIAL_NUMBER_OF_STONES;
        this._isLaunched = true;
        this._currentPlayer = CurrentPlayer.INVALID;
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
