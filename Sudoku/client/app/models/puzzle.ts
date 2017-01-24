/**
 * puzzle.ts - Represent a Sudoku puzzle/grids
 *
 * @authors ...
 * @date 2017/01/22
 */

import { Difficulty } from '../commons/puzzle-common';


export class Puzzle{
    puzzle : Array<PuzzleItem> = [];
    difficulty : Difficulty.NORMAL;
}

export class PuzzleItem {
    value : number;
    hide: boolean;
}

// export const puzzle = [
//     [4, 1, 5,  6, 3, 8,  9, 7, 2],
//     [3, 6, 2,  4, 7, 9,  1, 8, 5],
//     [7, 8, 9,  2, 1, 5,  3, 6, 4],

//     [9, 2, 6,  3, 4, 1,  7, 5, 8],
//     [1, 3, 8,  7, 5, 6,  4, 2, 9],
//     [5, 7, 4,  9, 8, 2,  6, 3, 1],

//     [2, 5, 7,  1, 6, 4,  8, 9, 3],
//     [8, 4, 3,  5, 9, 7,  2, 1, 6],
//     [6, 9, 1,  8, 2, 3,  5, 4, 7]
// ]
