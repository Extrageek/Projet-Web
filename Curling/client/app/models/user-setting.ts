export class UserSetting {
    _name: string;
    _difficulty: Difficulty;

    /**
     *
     */
    constructor() {
        this._name = '';
        this._difficulty = Difficulty.NORMAL;
    }
}

export enum Difficulty {
    NORMAL,
    HARD
}
