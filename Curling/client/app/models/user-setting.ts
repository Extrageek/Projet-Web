 export class UserSetting {
    _name : string = '';
    _difficulty : Difficulty = Difficulty.NORMAL;
}

enum Difficulty {
    NORMAL,
    HARD
}