/**
 * puzzle-manager.service.ts - Manage the puzzles generation
 *
 * @authors ...
 * @date 2017/01/22
 */

import { Puzzle, AxisDiagonal } from './../models/puzzle';

const NOMBRE_ITERATION = 1;

// Used to generate the type of transformation and to give a number of holes to dig in sudoku
function getRandomInRange(min: number, max: number) {
    return function (): number {
        return Math.floor(Math.random() * (max - min)) + min;
    };
}

module PuzzleManagerService {

    export class PuzzleManager {

        _easySudoku: Array<Puzzle>;
        _hardSudoku: Array<Puzzle>;

        /**
         * The getNewPuzzle function, return a new puzzle.
         *
         * @class PuzzleManager
         * @method getNewPuzzle
         * @return newPuzzle
         */
        public getNewPuzzle() {
            let getRandomSudoku = getRandomInRange(1, 9);
            let newPuzzle: Puzzle = new Puzzle();

            for (let it = 0; it < NOMBRE_ITERATION; ++it) {
                let iterationChoice = getRandomInRange(0, 5);

                // Must be removed after a clean debug
                let dummyValue = 2;

                switch (dummyValue) {
                    case 0 :
                        newPuzzle.swapRow(getRandomSudoku(), getRandomSudoku());
                        break;
                    case 1 :
                        newPuzzle.swapColumn(getRandomSudoku(), getRandomSudoku());
                        break;
                    case 2 :
                        newPuzzle.horizontalSymmetry();
                        break;
                    case 3 :
                        newPuzzle.verticalSymmetry();
                        break;
                    case 4 :
                        newPuzzle.diagonalSymmetry(AxisDiagonal.UP_LEFT_TO_DOWN_RIGHT);
                        break;
                    case 5 :
                        newPuzzle.diagonalSymmetry(AxisDiagonal.DOWN_LEFT_TO_UP_RIGHT);
                        break;
                }
            }
            // TODO: Must be completed after a clean debug

            // console.log(newPuzzle);

            return newPuzzle;
        }
    }
}

export = PuzzleManagerService;
