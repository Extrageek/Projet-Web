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

export class Puzzle {

    public static readonly MAX_ROW_SIZE = 9;
    public static readonly MAX_COLUMN_SIZE = 9;
    public static readonly MID_ROW_INDEX = Math.floor(Puzzle.MAX_ROW_SIZE / 2);
    public static readonly MID_COLUMN_INDEX = Math.floor(Puzzle.MAX_COLUMN_SIZE / 2);
    public static readonly SQUARE_LENGTH = 3;
    public static readonly MIN_ROW_SIZE = 1;
    public static readonly MIN_COLUMN_SIZE = 1;
    public static readonly ALL_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

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

    public hideAllItemsInRange(minRow: number, maxRow: number, minColumn: number, maxColumn: number) {
        if (minRow < Puzzle.MIN_ROW_SIZE - 1 || minRow >= Puzzle.MAX_ROW_SIZE || minColumn < Puzzle.MIN_COLUMN_SIZE - 1
            || maxColumn >= Puzzle.MAX_COLUMN_SIZE || minRow > maxRow || minColumn > maxColumn) {
                throw new Error("Une parameter is invalid. The min must be smaller or equals than the max"
                    + " and they must be in the range of the sudoku index.");
        }
        for (let row = minRow; row <= maxRow; ++row) {
            for (let column = minColumn; column <= maxColumn; ++column) {
                this._puzzle[row][column].isHidden = true;
            }
        }
    }
}
