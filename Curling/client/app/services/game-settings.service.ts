export class GameSettingService {
    private _isFirstPlayer: boolean;

    constructor() {
        this.randomFirstPlayer();
    }

    private randomFirstPlayer(): void {
        this._isFirstPlayer = Math.random() >= 0.5;
    }

    // private getIsFirstPlayer(): boolean {
    //     return this._isFirstPlayer;
    // }
}
