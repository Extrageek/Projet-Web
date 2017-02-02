import { Injectable } from '@angular/core';

@Injectable()
export class GameSettingsService {
    private _isFirstPlayer: boolean;

    constructor() {
        this.randomFirstPlayer();
    }

    private randomFirstPlayer(): void {
        let qlq = Math.round(Math.random() * 100) % 2;
        console.log("HASARD ", qlq);
        if (qlq === 0){
            this._isFirstPlayer = true;
        }
        else{
            this._isFirstPlayer = false;
        }
    }

    public getIsFirstPlayer(): boolean {
         return this._isFirstPlayer;
    }
}
