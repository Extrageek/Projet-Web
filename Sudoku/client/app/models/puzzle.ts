/**
 * puzzle.ts - Represent a Sudoku puzzle/grids
 *
 * @authors ...
 * @date 2017/01/22
 */

import { Difficulty } from '../commons/puzzle-common';

export class Puzzle {
    puzzle: Array<Array<PuzzleItem>>;
    difficulty: Difficulty.NORMAL;
}

export class PuzzleItem {
    number: number;
    hide: boolean;

    constructor(value: number, hide: boolean) {
        this.number = value;
        this.hide = hide;
    }
}
