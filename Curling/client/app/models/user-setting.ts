 export class UserSetting {
    _name : string = '';
    _difficulty : Difficulty = Difficulty.NORMAL;
}

export enum Difficulty {
    NORMAL,
    HARD
}