/**
 * puzzle-manager.service.ts - Manage the puzzles generation
 *
 * @authors ...
 * @date 2017/01/22
 */

import { Puzzle } from "./../models/puzzle";

// Used to generate the type of transformation and to give a number of holes to dig in sudoku
function getRandomNumberInRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module GridGenerationService {

    export enum Difficulty {
        NORMAL = 0,
        HARD = 1,
        NUMBER_OF_DIFFICULTIES = 2
    }

    export class GridGenerationManager {

        private static readonly MILLISECONDS_TO_WAIT = 5000;
        private static readonly NUMBER_OF_SUDOKUS_TO_GENERATE = 3;
        private static readonly NOMBRE_ITERATIONS_MIN = 1;
        private static readonly NOMBRE_ITERATIONS_MAX = 200;

        private _sudokusGenerated: Array<Array<Puzzle>>;

        constructor() {
            this._sudokusGenerated = new Array<Array<Puzzle>>();
            for (let i = 0; i < Difficulty.NUMBER_OF_DIFFICULTIES; ++i) {
                this._sudokusGenerated.push(new Array<Puzzle>());
                this.fillArrayWithSudokus(i);
            }
        }

        private fillArrayWithSudokus(arrayIndex: number) {
            for (let i = 0; i < GridGenerationManager.NUMBER_OF_SUDOKUS_TO_GENERATE; ++i) {
                this.getNewPuzzle(arrayIndex).then((puzzle: Puzzle) => {
                    this._sudokusGenerated[arrayIndex].push(puzzle);
                });
            }
        }

        public getNewPuzzle(difficulty: Difficulty): Promise<Puzzle> {
            return new Promise((resolve, reject) => {
                if (this._sudokusGenerated[difficulty].length !== 0) {
                    //Launch a new sudoku generation after the existing sudoku is returned.
                    let sudokuGenerated = this._sudokusGenerated[difficulty].pop();
                    resolve(sudokuGenerated);
                    this.performGenerationWithDelay(difficulty).then((puzzle: Puzzle) => {
                        this._sudokusGenerated[difficulty].push(puzzle);
                    });
                }
                else {
                    //Launch a new sudoku generation and return the sudoku generated
                    this.performGenerationWithDelay(difficulty).then((puzzle: Puzzle) => {
                        resolve(puzzle);
                    });
                }
            });
        }

        //Generate a new puzzle and wait until 5 seconds is elapsed to return the sudoku generated.
        private performGenerationWithDelay(difficulty: Difficulty): Promise<Puzzle> {
            return new Promise<Puzzle>((resolve, reject) => {
                    let time = Date.now();
                    let sudokuGenerated = this.generateNewPuzzle(difficulty);
                    let intervalOfTimeForGeneration = Date.now() - time;
                    let waitTime = (GridGenerationManager.MILLISECONDS_TO_WAIT - intervalOfTimeForGeneration);
                    setTimeout(resolve.bind(resolve, sudokuGenerated), waitTime > 0 ? waitTime : 0);
            });
        }

        /**
         * The getNewPuzzle function, return a new puzzle.
         *
         * @class PuzzleManager
         * @method getNewPuzzle
         * @return newPuzzle
         */
        private generateNewPuzzle(difficulty?: Difficulty) {
            let newPuzzle: Puzzle = new Puzzle();
            let nbIterations: number = getRandomNumberInRange(
                GridGenerationManager.NOMBRE_ITERATIONS_MIN, GridGenerationManager.NOMBRE_ITERATIONS_MAX);

            let operations = [
                (puzzle: Puzzle) => {
                    let [rowA, rowB] = this.numberGeneratorForSwaping();
                    newPuzzle.swapRow(rowA, rowB);
                },

                (puzzle: Puzzle) => {
                    let [columnA, columnB] = this.numberGeneratorForSwaping();
                    newPuzzle.swapColumn(columnA, columnB);
                },

                (puzzle: Puzzle) => {
                    newPuzzle.horizontalSymmetry();
                },

                (puzzle: Puzzle) => {
                    newPuzzle.verticalSymmetry();
                },

                (puzzle: Puzzle) => {
                    newPuzzle.diagonal1Symmetry();
                },

                (puzzle: Puzzle) => {
                    newPuzzle.diagonal2Symmetry();
                }
            ];

            for (let i = 0; i < nbIterations; ++i) {
                let operationNumberToDo = getRandomNumberInRange(0, operations.length - 1);
                operations[operationNumberToDo](newPuzzle);
            }
            newPuzzle.createPuzzleHoles();
            return newPuzzle;
        }

        //Generate 2 numbers. The first and the second numbers are one of the following :
        //Between 0 and 2 and cannot be equals.
        //Between 3 and 5 and cannot be equals.
        //Between 6 and 8 and cannot be equals.
        //They specifie the columns or rows of the same square to be changed.
        private numberGeneratorForSwaping(): Array<number> {
            let rowNumbers = [-1, -1];
            let squareNumber: number;
            rowNumbers[0] = getRandomNumberInRange(Puzzle.MIN_COLUMN_SIZE, Puzzle.SQUARE_LENGTH) - 1;
            rowNumbers[1] = (rowNumbers[0] + getRandomNumberInRange(Puzzle.MIN_COLUMN_SIZE, Puzzle.SQUARE_LENGTH - 1))
                % Puzzle.SQUARE_LENGTH;
            squareNumber = getRandomNumberInRange(Puzzle.MIN_COLUMN_SIZE, Puzzle.SQUARE_LENGTH) - 1;
            rowNumbers[0] = rowNumbers[0] + squareNumber * Puzzle.SQUARE_LENGTH;
            rowNumbers[1] = rowNumbers[1] + squareNumber * Puzzle.SQUARE_LENGTH;
            return rowNumbers;
        }
    }
}

export = GridGenerationService;
