import { Puzzle } from "../models/puzzle";

export class GridSolver {

    private _puzzleToSolve: Puzzle;

    constructor(puzzleToSolve: Puzzle) {
        this._puzzleToSolve = puzzleToSolve;
    }

    public getNumberOfSolutionsAfterRemovingNumber(rowIndex: number, columnIndex: number): number {
        if (Puzzle.MIN_ROW_SIZE - 1 > rowIndex || Puzzle.MAX_ROW_SIZE < rowIndex) {
            throw new Error("The row index is not between " + (Puzzle.MIN_ROW_SIZE - 1).toString()
                + " and " + (Puzzle.MAX_ROW_SIZE - 1).toString() + " inclusively.");
        }
        if (Puzzle.MIN_COLUMN_SIZE - 1 > columnIndex || Puzzle.MAX_COLUMN_SIZE < columnIndex) {
            throw new Error("The row index is not between " + (Puzzle.MIN_COLUMN_SIZE - 1).toString()
                + " and " + (Puzzle.MAX_COLUMN_SIZE - 1).toString() + " inclusively.");
        }
        if (this._puzzleToSolve._puzzle[rowIndex][columnIndex].isHidden === false) {
            throw new Error("The value at rowIndex and columnIndex is not hidden.");
        }
        return this.findPossibleValuesAtAPosition(rowIndex, columnIndex).length;
    }

    private findPossibleValuesAtAPosition(rowIndex: number, columnIndex: number): Array<number> {
        let rowPresentValues = this.getPresentValuesInARange(rowIndex, rowIndex
            , Puzzle.MIN_COLUMN_SIZE - 1, Puzzle.MAX_COLUMN_SIZE - 1);
        let columnPresentValues = this.getPresentValuesInARange(Puzzle.MIN_ROW_SIZE - 1, Puzzle.MAX_ROW_SIZE - 1
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
                if (this._puzzleToSolve._puzzle[row][column].isHidden === false) {
                    presentValues.push(this._puzzleToSolve._puzzle[row][column].value);
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
