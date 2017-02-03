import { Injectable } from '@angular/core';

@Injectable()
export class GameStatus {
    _scorePlayer: number;
    _scoreComputer: number;
    _currentSet: number;
    _currentStonesPlayer: number;
    _currentStonesComputer: number;
    _isLaunched: boolean;

    constructor() {
        this._scorePlayer = 0;
        this._scoreComputer = 0;
        this._currentSet = 0;
        this._currentStonesPlayer = 8;
        this._currentStonesComputer = 8;
        this._isLaunched = false;
    }

    public usedStonePlayer(): void {
        this._currentStonesPlayer = this._currentStonesPlayer - 1;
    }

    public usedStoneComputer(): void {
        this._currentStonesComputer = this._currentStonesComputer - 1;
    }

    public incrementScorePlayer(): void {
        this._scorePlayer = this._scorePlayer + 1;
    }

    public incrementScoreComputer(): void {
        this._scoreComputer = this._scoreComputer + 1;
    }

    public launchGame(){
        this._isLaunched = true;
    }

    public resetStones(): void {
        this._currentStonesComputer = 8;
        this._currentStonesPlayer = 8;
    }

    public resetGameStatus(): void {
        this._scorePlayer = 0;
        this._scoreComputer = 0;
        this._currentSet = 0;
        this._currentStonesPlayer = 8;
        this._currentStonesComputer = 8;
        this._isLaunched = true;
    }
}
