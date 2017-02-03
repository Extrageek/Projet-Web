import { Injectable } from '@angular/core';

import { GameStatus } from '../models/game-status';

@Injectable()
export class GameStatusService {
    private _gameStatus: GameStatus;

    constructor() {
        this._gameStatus = new GameStatus();
    }

    public get gameStatus(): GameStatus {
        return this._gameStatus;
    }

    public set gameStatus(value: GameStatus) {
        this._gameStatus = value;
    }
}
