/**
 * puzzle-manager.service.ts - Manage the puzzles generation
 *
 * @authors ...
 * @date 2017/01/22
 */

import { Puzzle } from './../models/puzzle';

const NOMBRE_ITERATION = 1;

// Used to generate the type of transformation and to give a number of holes to dig in sudoku
function getRandomInRange(min: number, max: number) {
    return function (): number {
        return Math.floor((Math.random() / Math.random() / Math.random()) % (max - min)) + min;
    };
}

module GridGenerationService {

    export enum Difficulty {
        NORMAL,
        HARD
    }

    export class GridGenerationManager {
        // UNUSED FOR NOW
        // private _easySudoku: Array<Puzzle>;
        // private _hardSudoku: Array<Puzzle>;

        constructor() {
            //
        }

        public getNewPuzzle(difficulty: Difficulty): Puzzle {
            //this._easySudoku.push(this.generateNewPuzzle());
            //return this._easySudoku.pop();
            return this.generateNewPuzzle(difficulty);
        }

        /**
         * The getNewPuzzle function, return a new puzzle.
         *
         * @class PuzzleManager
         * @method getNewPuzzle
         * @return newPuzzle
         */
        public generateNewPuzzle(difficulty?: Difficulty) {
            let endTime = new Date().getTime() / 1000 + 5;
            let getRandomSudoku = getRandomInRange(1, 9);
            let newPuzzle: Puzzle = new Puzzle();
            let deltaIteration: number = Math.round(NOMBRE_ITERATION * Math.random());

            for (let it = 0; it < NOMBRE_ITERATION + deltaIteration; ++it) {
                // Rows swapping
                let rowA: number;
                let rowB: number;
                do {
                    rowA = getRandomSudoku() - 1;
                    rowB = getRandomSudoku() - 1;
                } while (rowA === rowB || Math.floor(rowA / 3) * 3 !== Math.floor(rowB / 3) * 3);
                // While the rows aren't in the same square (3x3) or while the rows are equal
                newPuzzle.swapRow(rowA, rowB);

                // Column swapping
                let columnA: number;
                let columnB: number;
                do {
                    columnA = getRandomSudoku() - 1;
                    columnB = getRandomSudoku() - 1;
                } while (columnA === columnB || Math.floor(columnA / 3) * 3 !== Math.floor(columnB / 3) * 3);
                // While the columns aren't in the same square (3x3) or while the columns are equal
                newPuzzle.swapColumn(columnA, columnB);

                // Horizontal Symmetry
                newPuzzle.horizontalSymmetry();

                // Vertical Symmetry
                newPuzzle.verticalSymmetry();
            }
            while (new Date().getTime() / 1000 < endTime) {
                // Wait until five seconds
            }
            return this.createPuzzleHoles(newPuzzle);
        }

        /**
         * The extractNewPuzzle function, extract the new puzzle without the solution.
         *
         * @class PuzzleManagerService
         * @method createPuzzleHoles
         * @return Puzzle
         */
        public createPuzzleHoles(puzzle: Puzzle) {

            if (puzzle === null) {
                throw new Error("The parameter cannot be null");
            }
            puzzle._puzzle.forEach((puzzleItems) => {
                puzzleItems.forEach((puzzleItem) => {
                    puzzleItem._value = (puzzleItem._hide) ? null : puzzleItem._value;
                });
            });
            return puzzle;
        }
    }
}

export = GridGenerationService;
