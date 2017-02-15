
export class PuzzleCommon {

    static leftArrowKeyCode = 37;
    static rightArrowKeyCode = 39;
    static upArrowKeyCode = 38;
    static downArrowKeyCode = 40;

    static deleteKeyCode = 46;

    // Use backspace for Delete keycode on mac /backspace
    // Need to be improved.
    static backspaceKeyCode = 8;

    static oneKey = 49;
    static twoKey = 50;
    static threeKey = 51;
    static fourKey = 52;
    static fiveKey = 53;
    static sixKey = 54;
    static sevenKey = 55;
    static eightKey = 56;
    static nineKey = 57;

    static oneNumpad = 97;
    static twoNumpad = 98;
    static threeNumpad = 99;
    static fourNumpad = 100;
    static fiveNumpad = 101;
    static sixNumpad = 102;
    static sevenNumpad = 103;
    static eightNumpad = 104;
    static nineNumpad = 105;

    static yPosition = 0;
    static xPosition = 1;

    static minRowIndex = 0;
    static minColumnIndex = 0;
    static maxColumnIndex = 8;
    static maxRowIndex = 8;

    constructor() {
        //Default constructor
    }
}

export enum Difficulty {
    NORMAL = 0,
    HARD = 1
}
