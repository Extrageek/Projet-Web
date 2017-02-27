/**
 * puzzle.ts - Represent a Sudoku puzzle/grids
 *
 * @authors ...
 * @date 2017/01/22
 */

export class PuzzleItem {
    private _value: number;
    private _hide: boolean;
    private _isRed: boolean;

    constructor(value: number, hide: boolean) {
        this._value = value;
        this._hide = hide;
        this._isRed = false;
    }

    get isHidden(): boolean {
        return this._hide;
    }

    set isHidden(hidden: boolean) {
        this._hide = hidden;
    }

    get value(): number {
        return this._value;
    }

    set value(value: number) {
        this._value = value;
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
    [
        new PuzzleItem(1, false), new PuzzleItem(2, false), new PuzzleItem(3, false),
        new PuzzleItem(4, false), new PuzzleItem(5, false), new PuzzleItem(6, false),
        new PuzzleItem(7, false), new PuzzleItem(8, false), new PuzzleItem(9, false)
    ],
    [
        new PuzzleItem(4, false), new PuzzleItem(5, false), new PuzzleItem(6, false),
        new PuzzleItem(7, false), new PuzzleItem(8, false), new PuzzleItem(9, false),
        new PuzzleItem(1, false), new PuzzleItem(2, false), new PuzzleItem(3, false)
    ],
    [
        new PuzzleItem(7, false), new PuzzleItem(8, false), new PuzzleItem(9, false),
        new PuzzleItem(1, false), new PuzzleItem(2, false), new PuzzleItem(3, false),
        new PuzzleItem(4, false), new PuzzleItem(5, false), new PuzzleItem(6, false)
    ],
    [
        new PuzzleItem(2, false), new PuzzleItem(3, false), new PuzzleItem(4, false),
        new PuzzleItem(5, false), new PuzzleItem(6, false), new PuzzleItem(7, false),
        new PuzzleItem(8, false), new PuzzleItem(9, false), new PuzzleItem(1, false)
    ],
    [
        new PuzzleItem(5, false), new PuzzleItem(6, false), new PuzzleItem(7, false),
        new PuzzleItem(8, false), new PuzzleItem(9, false), new PuzzleItem(1, false),
        new PuzzleItem(2, false), new PuzzleItem(3, false), new PuzzleItem(4, false)
    ],
    [
        new PuzzleItem(8, false), new PuzzleItem(9, false), new PuzzleItem(1, false),
        new PuzzleItem(2, false), new PuzzleItem(3, false), new PuzzleItem(4, false),
        new PuzzleItem(5, false), new PuzzleItem(6, false), new PuzzleItem(7, false)
    ],
    [
        new PuzzleItem(3, false), new PuzzleItem(4, false), new PuzzleItem(5, false),
        new PuzzleItem(6, false), new PuzzleItem(7, false), new PuzzleItem(8, false),
        new PuzzleItem(9, false), new PuzzleItem(1, false), new PuzzleItem(2, false)
    ],
    [
        new PuzzleItem(6, false), new PuzzleItem(7, false), new PuzzleItem(8, false),
        new PuzzleItem(9, false), new PuzzleItem(1, false), new PuzzleItem(2, false),
        new PuzzleItem(3, false), new PuzzleItem(4, false), new PuzzleItem(5, false)
    ],
    [
        new PuzzleItem(9, false), new PuzzleItem(1, false), new PuzzleItem(2, false),
        new PuzzleItem(3, false), new PuzzleItem(4, false), new PuzzleItem(5, false),
        new PuzzleItem(6, false), new PuzzleItem(7, false), new PuzzleItem(8, false)
    ]
/*
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
*/
];

// 415638972
// 362479185
// 789215364
// 926341758
// 138756429
// 574982631
// 257164893
// 843597216
// 691823547


export class Puzzle {

    public static readonly MAX_ROW_SIZE = 9;
    public static readonly MAX_COLUMN_SIZE = 9;
    public static readonly MID_ROW_INDEX = Math.floor(Puzzle.MAX_ROW_SIZE / 2);
    public static readonly MID_COLUMN_INDEX = Math.floor(Puzzle.MAX_COLUMN_SIZE / 2);
    public static readonly SQUARE_LENGTH = 3;
    public static readonly MIN_ROW_SIZE = 1;
    public static readonly MIN_COLUMN_SIZE = 1;

    public _puzzle: Array<Array<PuzzleItem>>;

    /*Initialize the following sudoku : 
        1 2 3 | 4 5 6 | 7 8 9
        4 5 6 | 7 8 9 | 1 2 3
        7 8 9 | 1 2 3 | 4 5 6
        ------+-------+------
        2 3 4 | 5 6 7 | 8 9 1
        5 6 7 | 8 9 1 | 2 3 4
        8 9 1 | 2 3 4 | 5 6 7
        ------+-------+------
        3 4 5 | 6 7 8 | 9 1 2
        6 7 8 | 9 1 2 | 3 4 5
        9 1 2 | 3 4 5 | 6 7 8
    */
    constructor() {
        this._puzzle = new Array<Array<PuzzleItem>>();
        for (let squareRow = 0; squareRow < Puzzle.SQUARE_LENGTH; ++squareRow) {
            let numberShift = 0;
            for (let insideSquare = 0; insideSquare < Puzzle.SQUARE_LENGTH; ++insideSquare) {
                let rowIndex = squareRow * Puzzle.SQUARE_LENGTH + insideSquare;
                this._puzzle[rowIndex] = new Array<PuzzleItem>();
                let initialNumber = squareRow + numberShift;
                for (let column = 0; column < Puzzle.MAX_ROW_SIZE; ++column) {
                    this._puzzle[rowIndex][column] = new PuzzleItem(initialNumber % Puzzle.MAX_ROW_SIZE + 1, false);
                    ++initialNumber;
                }
                numberShift += Puzzle.SQUARE_LENGTH;
            }
            numberShift += 1;
        }
    }

    /// For future use :
    // isValidSquare3b3(firstRow: number, firstColumn: number): boolean {
    //     let contained: number[];
    //     for (let i = 0; i < 3; ++i) {
    //         for (let j = 0; j < 3; ++j) {
    //             if (contained.indexOf(this._puzzle[firstRow + i][firstColumn + j]._value) === -1) {
    //                 contained.push(this._puzzle[firstRow + i][firstColumn + j]._value);
    //             } else {
    //                 return false;
    //             }
    //         }
    //     }
    //     return true;
    // }

    // isValidSudoku(): boolean {
    //     for (let i = 0; i < MAX_ROW_SIZE; i + 3) {
    //         for (let j = 0; j < MAX_COLUMN_SIZE; j + 3) {
    //             if (!this.isValidSquare3b3(i, j)) {
    //                 return false;
    //             }
    //         }
    //     }
    //     return true;
    // }
    ///

    public swapRow(rowA: number, rowB: number) {
        for (let j = 0; j < this._puzzle.length; ++j) {
            this._puzzle[rowA][j].swap(this._puzzle[rowB][j]);
        }
    }

    public swapColumn(columnA: number, columnB: number) {
        for (let i = 0; i < this._puzzle.length; ++i) {
            this._puzzle[i][columnA].swap(this._puzzle[i][columnB]);
        }
    }

    public horizontalSymmetry() {
        for (let i = 0; i < Puzzle.MID_COLUMN_INDEX; ++i) {
            this.swapRow(i, Puzzle.MAX_COLUMN_SIZE - i - 1);
        }
    }

    public verticalSymmetry() {
        for (let j = 0; j < Puzzle.MID_ROW_INDEX; ++j) {
            this.swapColumn(j, Puzzle.MAX_ROW_SIZE - j - 1);
        }
    }

    //Erase the PuzzleItem marked hidden.
    public createPuzzleHoles() {
        this._puzzle.forEach((puzzleItems) => {
            puzzleItems.forEach((puzzleItem) => {
                puzzleItem.value = (puzzleItem.isHidden) ? null : puzzleItem.value;
            });
        });
    }
}
