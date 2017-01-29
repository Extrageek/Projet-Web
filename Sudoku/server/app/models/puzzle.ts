/**
 * puzzle.ts - Represent a Sudoku puzzle/grids
 *
 * @authors ...
 * @date 2017/01/22
 */

export class PuzzleItem {
    _value: number;
    _hide: boolean;

    constructor(value: number, hide: boolean) {
        this._value = value;
        this._hide = hide;
    }

    get isHidden(): boolean {
        return this._hide;
    }

    public swap(other: PuzzleItem) {
        let tempValue = this._value;
        let tempHide = this._hide;

        this._value = other._value;
        this._hide = other._hide;

        other._value = tempValue;
        other._hide = tempHide;
    }
}

export const puzzleSeed = [
    // [
    //     new PuzzleItem(1, false), new PuzzleItem(2, false), new PuzzleItem(3, false),
    //     new PuzzleItem(4, false), new PuzzleItem(5, false), new PuzzleItem(6, false),
    //     new PuzzleItem(7, false), new PuzzleItem(8, false), new PuzzleItem(9, false)
    // ],
    // [
    //     new PuzzleItem(4, false), new PuzzleItem(5, false), new PuzzleItem(6, false),
    //     new PuzzleItem(7, false), new PuzzleItem(8, false), new PuzzleItem(9, false),
    //     new PuzzleItem(1, false), new PuzzleItem(2, false), new PuzzleItem(3, false)
    // ],
    // [
    //     new PuzzleItem(7, false), new PuzzleItem(8, false), new PuzzleItem(9, false),
    //     new PuzzleItem(1, false), new PuzzleItem(2, false), new PuzzleItem(3, false),
    //     new PuzzleItem(4, false), new PuzzleItem(5, false), new PuzzleItem(6, false)
    // ],
    // [
    //     new PuzzleItem(2, false), new PuzzleItem(3, false), new PuzzleItem(4, false),
    //     new PuzzleItem(5, false), new PuzzleItem(6, false), new PuzzleItem(7, false),
    //     new PuzzleItem(8, false), new PuzzleItem(9, false), new PuzzleItem(1, false)
    // ],
    // [
    //     new PuzzleItem(5, false), new PuzzleItem(6, false), new PuzzleItem(7, false),
    //     new PuzzleItem(8, false), new PuzzleItem(9, false), new PuzzleItem(1, false),
    //     new PuzzleItem(2, false), new PuzzleItem(3, false), new PuzzleItem(4, false)
    // ],
    // [
    //     new PuzzleItem(8, false), new PuzzleItem(9, false), new PuzzleItem(1, false),
    //     new PuzzleItem(2, false), new PuzzleItem(3, false), new PuzzleItem(4, false),
    //     new PuzzleItem(5, false), new PuzzleItem(6, false), new PuzzleItem(7, false)
    // ],
    // [
    //     new PuzzleItem(3, false), new PuzzleItem(4, false), new PuzzleItem(5, false),
    //     new PuzzleItem(6, false), new PuzzleItem(7, false), new PuzzleItem(8, false),
    //     new PuzzleItem(9, false), new PuzzleItem(1, false), new PuzzleItem(2, false)
    // ],
    // [
    //     new PuzzleItem(6, false), new PuzzleItem(7, false), new PuzzleItem(8, false),
    //     new PuzzleItem(9, false), new PuzzleItem(1, false), new PuzzleItem(2, false),
    //     new PuzzleItem(3, false), new PuzzleItem(4, false), new PuzzleItem(5, false)
    // ],
    // [
    //     new PuzzleItem(9, false), new PuzzleItem(1, false), new PuzzleItem(2, false),
    //     new PuzzleItem(3, false), new PuzzleItem(4, false), new PuzzleItem(5, false),
    //     new PuzzleItem(6, false), new PuzzleItem(7, false), new PuzzleItem(8, false)
    // ]
    [
        new PuzzleItem(4, true), new PuzzleItem(1, true), new PuzzleItem(5, true),
        new PuzzleItem(6, true), new PuzzleItem(3, false), new PuzzleItem(8, true),
        new PuzzleItem(9, true), new PuzzleItem(7, true), new PuzzleItem(2, false)
    ],
    [
        new PuzzleItem(3, true), new PuzzleItem(6, false), new PuzzleItem(2, false),
        new PuzzleItem(4, false), new PuzzleItem(7, true), new PuzzleItem(9, true),
        new PuzzleItem(1, true), new PuzzleItem(8, false), new PuzzleItem(5, true)
    ],
    [
        new PuzzleItem(7, false), new PuzzleItem(8, true), new PuzzleItem(9, true),
        new PuzzleItem(2, false), new PuzzleItem(1, true), new PuzzleItem(5, false),
        new PuzzleItem(3, true), new PuzzleItem(6, true), new PuzzleItem(4, true)
    ],
    [
        new PuzzleItem(9, true), new PuzzleItem(2, true), new PuzzleItem(6, false),
        new PuzzleItem(3, true), new PuzzleItem(4, true), new PuzzleItem(1, true),
        new PuzzleItem(7, true), new PuzzleItem(5, true), new PuzzleItem(8, false)
    ],
    [
        new PuzzleItem(1, true), new PuzzleItem(3, true), new PuzzleItem(8, true),
        new PuzzleItem(7, true), new PuzzleItem(5, true), new PuzzleItem(6, true),
        new PuzzleItem(4, true), new PuzzleItem(2, true), new PuzzleItem(9, true)
    ],
    [
        new PuzzleItem(5, true), new PuzzleItem(7, false), new PuzzleItem(4, true),
        new PuzzleItem(9, true), new PuzzleItem(8, true), new PuzzleItem(2, true),
        new PuzzleItem(6, true), new PuzzleItem(3, false), new PuzzleItem(1, true)
    ],
    [
        new PuzzleItem(2, false), new PuzzleItem(5, true), new PuzzleItem(7, true),
        new PuzzleItem(1, false), new PuzzleItem(6, true), new PuzzleItem(4, false),
        new PuzzleItem(8, false), new PuzzleItem(9, true), new PuzzleItem(3, true)
    ],
    [
        new PuzzleItem(8, true), new PuzzleItem(4, true), new PuzzleItem(3, true),
        new PuzzleItem(5, false), new PuzzleItem(9, true), new PuzzleItem(7, true),
        new PuzzleItem(2, true), new PuzzleItem(1, true), new PuzzleItem(6, true)
    ],
    [
        new PuzzleItem(6, true), new PuzzleItem(9, true), new PuzzleItem(1, true),
        new PuzzleItem(8, false), new PuzzleItem(2, false), new PuzzleItem(3, true),
        new PuzzleItem(5, true), new PuzzleItem(4, true), new PuzzleItem(7, false)
    ]
];

const MAX_ROW_SIZE = 9;
const MAX_COLUMN_SIZE = 9;

const MID_ROW_INDEX = Math.floor(MAX_ROW_SIZE / 2);
const MID_COLUMN_INDEX = Math.floor(MAX_COLUMN_SIZE / 2);


export class Puzzle {
    _puzzle: Array<Array<PuzzleItem>>;

    constructor() {
        this._puzzle = puzzleSeed;
    }

    public swapRow(rowA: number, rowB: number) {
        for (let j = 0; j < MAX_ROW_SIZE; ++j) {
            this._puzzle[rowA][j].swap(this._puzzle[rowB][j]);
        }
    }

    public swapColumn(columnA: number, columnB: number) {
        for (let i = 0; i < MAX_COLUMN_SIZE; ++i) {
            this._puzzle[i][columnA].swap(this._puzzle[i][columnB]);
        }
    }

    public horizontalSymmetry() {
        for (let i = 0; i < MID_COLUMN_INDEX; ++i) {
                this.swapRow(i, MAX_COLUMN_SIZE - i - 1);
        }
    }

    public verticalSymmetry() {
        for (let j = 0; j < MID_ROW_INDEX; ++j) {
            this.swapColumn(j, MAX_ROW_SIZE - j - 1);
        }
    }

    /**
    *       Axis 0 :    [X] [ ] [ ]
    *                   [ ] [X] [ ]
    *                   [ ] [ ] [X]
    *
    *       Axis 1 :    [ ] [ ] [X]
    *                   [ ] [X] [ ]
    *                   [X] [ ] [ ]
    */
    public diagonalSymmetry(axis: AxisDiagonal) {
        if (axis === AxisDiagonal.UP_LEFT_TO_DOWN_RIGHT) {
            for (let i = 0; i < MAX_ROW_SIZE; ++i) {
                for (let j = 0; j < MAX_COLUMN_SIZE; ++j) {
                    this._puzzle[i][j].swap(this._puzzle[j][i]);
                }
            }
        } else if (AxisDiagonal.DOWN_LEFT_TO_UP_RIGHT) {
            for (let i = MAX_ROW_SIZE - 1; i >= 0; --i) {
                for (let j = 0; j < MAX_COLUMN_SIZE; ++j) {
                    this._puzzle[i][j].swap(this._puzzle[j][i]);
                }
            }
        }
    }
}

export enum AxisDiagonal {
    UP_LEFT_TO_DOWN_RIGHT = 0,
    DOWN_LEFT_TO_UP_RIGHT = 1
}

