/**
 * puzzle.ts - Represent a Sudoku puzzle/grids
 *
 * @authors ...
 * @date 2017/01/22
 */

export class Puzzle {
    _puzzle: Array<Array<PuzzleItem>>;

    constructor(grid: PuzzleItem[][]) {
        this._puzzle = grid;
     }
}

export class PuzzleItem {

    public _value: number;
    public _hide: boolean;
    public _isRed: boolean;

    constructor(value: number, hide: boolean) {
        this._value = value;
        this._hide = hide;
        this._isRed = false;
    }

}
