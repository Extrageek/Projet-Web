import { Puzzle } from "../models/puzzle";

export interface FittingNumbers {
    row: number;
    column: number;
    numbersThatFit: Array<number>;
}

export class GridSolver {

    private _puzzleToSolve: Puzzle;

    constructor(puzzleToSolve: Puzzle) {
        this._puzzleToSolve = puzzleToSolve;
    }

    public getNumberOfSolutionsAfterRemovingNumber(rowIndex: number, columnIndex: number): number {
        if (Puzzle.MIN_ROW_INDEX > rowIndex || Puzzle.MAX_ROW_INDEX < rowIndex) {
            throw new Error("The row index is not between " + (Puzzle.MIN_ROW_INDEX).toString()
                + " and " + (Puzzle.MAX_ROW_INDEX).toString() + " inclusively.");
        }
        if (Puzzle.MIN_COLUMN_INDEX > columnIndex || Puzzle.MAX_COLUMN_INDEX < columnIndex) {
            throw new Error("The row index is not between " + (Puzzle.MIN_COLUMN_INDEX).toString()
                + " and " + (Puzzle.MAX_COLUMN_INDEX).toString() + " inclusively.");
        }
        if (!this._puzzleToSolve.getPuzzleTileVisibility(rowIndex, columnIndex)) {
            throw new Error("The value at rowIndex and columnIndex is not hidden.");
        }

        let numberOfSolutions: number;
        if (this.findPossibleValuesAtAPosition(rowIndex, columnIndex).length === 1) {
            numberOfSolutions = 1;
        }
        else {
            numberOfSolutions = this.fillSudoku(0);
        }
        return numberOfSolutions;
    }

    //This recursive function says if there is 0, 1 or multiple solutions for the _puzzleToSolve.
    //It first fill all the tiles which have only one numbers that can go there.
    //Then, if the sudoku is not full, it takes the first tile that can fill multiple numbers and choose one.
    //Then, it calls himself again to resolve the other tiles.
    public fillSudoku(numberOfAlreadyFoundedSolutions: number): number {
        let stateSaved = this._puzzleToSolve;
        this._puzzleToSolve = new Puzzle(this._puzzleToSolve);
        let oldNumberOfHoles: number;
        let haveASolution = true;
        let numbersFittingInTheHoles: Array<FittingNumbers>;
        do
        {
            oldNumberOfHoles = this._puzzleToSolve.getNumberOfHoles();
            numbersFittingInTheHoles = this.getMappingOfAllPossibilities();
            if (numbersFittingInTheHoles[numbersFittingInTheHoles.length - 1].numbersThatFit.length !== 0) {
                let fittingNumbers = numbersFittingInTheHoles[0];
                if (fittingNumbers.numbersThatFit.length === 1) {
                    this._puzzleToSolve.setPuzzleTileValue(
                        fittingNumbers.row, fittingNumbers.column, fittingNumbers.numbersThatFit[0]);
                    this._puzzleToSolve.setPuzzleTileVisibility(
                        fittingNumbers.row, fittingNumbers.column, false);
                }
            }
            else {
                let numberFit = numbersFittingInTheHoles[numbersFittingInTheHoles.length - 1];
                haveASolution = false;
            }
        }
        while (haveASolution && this._puzzleToSolve.getNumberOfHoles() !== 0
            && oldNumberOfHoles !== this._puzzleToSolve.getNumberOfHoles());

        if (haveASolution) {
            if (this._puzzleToSolve.getNumberOfHoles() === 0) {
                ++numberOfAlreadyFoundedSolutions;
            }
            else {
                let numberIndex = 0;
                while (numberIndex < numbersFittingInTheHoles[0].numbersThatFit.length
                    && numberOfAlreadyFoundedSolutions < 2) {
                        let row = numbersFittingInTheHoles[0].row;
                        let column = numbersFittingInTheHoles[0].column;
                        let numberToPut = numbersFittingInTheHoles[0].numbersThatFit[numberIndex];
                        this._puzzleToSolve.setPuzzleTileValue(row, column, numberToPut);
                        this._puzzleToSolve.setPuzzleTileVisibility(row, column, false);
                        numberOfAlreadyFoundedSolutions = this.fillSudoku(numberOfAlreadyFoundedSolutions);
                        ++numberIndex;
                }
            }
        }
        this._puzzleToSolve = stateSaved;
        return numberOfAlreadyFoundedSolutions;
    }

    //Return a mapping of all possibilities at hidden tiles. If a tile with zero possibilities is meet,
    //the computation of the mapping stop. It is useless to continue the mapping of the sudoku if it is not valid.
    //When the sudoku is not valid, the last element of the returned mapping will have an empty array for
    //the numbers that fit at that location.
    public getMappingOfAllPossibilities(): Array<FittingNumbers> {
        let row = 0;
        let possibilities = new Array<FittingNumbers>();
        let tileWithZeroPossibilityFound = false;
        while (!tileWithZeroPossibilityFound && row <= Puzzle.MAX_ROW_INDEX) {
            let column = 0;
            while (!tileWithZeroPossibilityFound && column <= Puzzle.MAX_COLUMN_INDEX) {
                if (this._puzzleToSolve.getPuzzleTileVisibility(row, column)) {
                    let possibleValues = this.findPossibleValuesAtAPosition(row, column);
                    possibilities.push({row: row, column: column, numbersThatFit: possibleValues});
                    tileWithZeroPossibilityFound = possibleValues.length === 0;
                }
                ++column;
            }
            ++row;
        }
        return possibilities;
    }

    public findPossibleValuesAtAPosition(rowIndex: number, columnIndex: number): Array<number> {
        if (!this._puzzleToSolve.getPuzzleTileVisibility(rowIndex, columnIndex)) {
            throw new Error("The number at the rowIndex = " + rowIndex + " and columnIndex = " + columnIndex);
        }
        let rowPresentValues = this.getPresentValuesInARange(rowIndex, rowIndex
            , Puzzle.MIN_COLUMN_INDEX, Puzzle.MAX_COLUMN_INDEX);
        let columnPresentValues = this.getPresentValuesInARange(Puzzle.MIN_ROW_INDEX, Puzzle.MAX_ROW_INDEX
            , columnIndex, columnIndex);
        let rowSquareBegin = rowIndex - rowIndex % Puzzle.SQUARE_LENGTH;
        let columnSquareBegin = columnIndex - columnIndex % Puzzle.SQUARE_LENGTH;
        let squarePresentValues = this.getPresentValuesInARange(rowSquareBegin
            , rowSquareBegin + Puzzle.SQUARE_LENGTH - 1
            , columnSquareBegin, columnSquareBegin + Puzzle.SQUARE_LENGTH - 1);

        let numbersNotPresent = this.getNumbersNotInArray(Puzzle.ALL_NUMBERS, rowPresentValues);
        numbersNotPresent = this.getNumbersNotInArray(numbersNotPresent, columnPresentValues);
        numbersNotPresent = this.getNumbersNotInArray(numbersNotPresent, squarePresentValues);
        return numbersNotPresent;
    }

    private getPresentValuesInARange(minRow: number, maxRow: number, minColumn: number, maxColumn: number) {
        let presentValues = new Array<number>();
        for (let row = minRow; row <= maxRow; ++row) {
            for (let column = minColumn; column <= maxColumn; ++ column) {
                if (!this._puzzleToSolve.getPuzzleTileVisibility(row, column)) {
                    presentValues.push(this._puzzleToSolve.getPuzzleTileValue(row, column));
                }
            }
        }
        return presentValues;
    }

    private getNumbersNotInArray(arrayToFilter: Array<number>, referenceArray: Array<Number>): Array<number> {
        return arrayToFilter.filter((value: number, index: number, array: number[]) => {
            return referenceArray.indexOf(value) === -1;
        });
    }
}
