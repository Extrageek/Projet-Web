/**
 * puzzle.ts - Represent a Sudoku puzzle/grids
 *
 * @authors ...
 * @date 2017/01/22
 */

export class Puzzle {
    puzzle: Array<PuzzleItem>;
}

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
}
