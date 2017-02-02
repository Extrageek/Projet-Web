import { Injectable } from '@angular/core';

import { PuzzleCommon } from '../commons/puzzle-common';
import { Puzzle, PuzzleItem } from '../models/puzzle';

declare var jQuery: any;

export const CELL_ID_PREFIX = "#";
export const CSS_BACKGROUND_PROPERTY = "background-color";
export const CSS_BACKGROUND_VALUE = "#E57373 ";
export const CSS_BACKGROUND_INIT = "";

@Injectable()
export class GridManagerService {
    constructor() {
        //Default constructor
    }

    //  Check if the value is valid
    public validateEnteredNumber(puzzle: Puzzle, rowIndex: number, columnIndex: number): boolean {

        let grid = puzzle._puzzle;

        let isColumnValid = this.isDuplicatedNumberInCurrentColumn(grid, rowIndex, columnIndex);
        let isRowValid = this.isDuplicatedNumberInCurrentRow(grid, rowIndex, columnIndex);
        let isSquareValid = this.isDuplicatedNumberInCurrentSquare(grid, rowIndex, columnIndex);

        if (isColumnValid && isRowValid && isSquareValid) {
            this.updateCurrentCellFormat(rowIndex, columnIndex, true);
        } else {
        if (!isSquareValid && grid[rowIndex][columnIndex]._value !== null) {
                this.updateCurrentCellFormat(rowIndex, columnIndex);
            }

            if (!isColumnValid && grid[rowIndex][columnIndex]._value !== null) {
                this.updateCurrentCellFormat(rowIndex, columnIndex);
            }

            if (!isRowValid && grid[rowIndex][columnIndex] !== null) {
                this.updateCurrentCellFormat(rowIndex, columnIndex);
            }
        }

        return (isRowValid && isColumnValid && isSquareValid);
    }

    updateCurrentCellFormat(rowIndex: number, columnIndex: number, removeErrorCSS?: boolean) {
        let borderPropertyValue = (!removeErrorCSS) ? CSS_BACKGROUND_VALUE : CSS_BACKGROUND_INIT;
        let cellId = CELL_ID_PREFIX + rowIndex + columnIndex;
        jQuery(cellId).css(CSS_BACKGROUND_PROPERTY, borderPropertyValue);
    }

    // Check if the row is valid.
    isDuplicatedNumberInCurrentRow(grid: PuzzleItem[][], rowIndex: number, columnIndex: number): boolean {
        // Check for duplicated number in the related row.
        for (let column = 0; column <= PuzzleCommon.maxColumnIndex; ++column) {
            let item = Number(grid[rowIndex][column]._value);

            if (item != null) {
                for (let column2 = 0; column2 <= PuzzleCommon.maxColumnIndex; ++column2) {
                    if (Number(grid[rowIndex][column2]._value) === item
                        && (Number(grid[rowIndex][column2]._value) !== 0)
                        && (column !== column2)) {
                        return false;
                    }
                }
            }
        }

        // The row is valid if a duplicated number is not found.
        return true;
    }

    // Update the current row format when an invalid number is entered or not
    updateCurrentRowFormat(rowIndex: number, removeBorder?: boolean) {


        let borderPropertyValue = (!removeBorder) ? CSS_BACKGROUND_VALUE : CSS_BACKGROUND_INIT;

        for (let colId = 0; colId <= PuzzleCommon.maxColumnIndex; ++colId) {
            let cellId = CELL_ID_PREFIX + rowIndex + colId;
            if (document.getElementById(cellId)) {
                document.getElementById(cellId).style.backgroundColor = borderPropertyValue;
            }
        }
    }

    // Update the current column format when an invalid number is entered or not
    updateCurrentColumnFormat(columnIndex: number, removeBorder?: boolean) {
        let borderPropertyValue = (!removeBorder) ? CSS_BACKGROUND_VALUE : CSS_BACKGROUND_INIT;

        for (let rowId = 0; rowId <= PuzzleCommon.maxColumnIndex; ++rowId) {
            let cellId = CELL_ID_PREFIX + rowId + columnIndex;
            if (document.getElementById(cellId)) {
                document.getElementById(cellId).style.backgroundColor = borderPropertyValue;
            }
        }
    }


    // Check if the column is valid.
    isDuplicatedNumberInCurrentColumn(grid: PuzzleItem[][], rowIndex: number, columnIndex: number): boolean {

        // Check for duplicated number in the related column.
        for (let row = 0; row <= PuzzleCommon.maxRowIndex; ++row) {
            let item = Number(grid[row][columnIndex]._value);

            if (item != null) {
                for (let row2 = 0; row2 <= PuzzleCommon.maxRowIndex; ++row2) {
                    if (Number(grid[row2][columnIndex]._value) === item
                        && (Number(grid[row2][columnIndex]._value) !== 0)
                        && (row !== row2)) {
                        return false;
                    }
                }
            }
        }

        // return true if a duplicated number is not found.
        return true;
    }

    // Check if the square around the value is valid.
    isDuplicatedNumberInCurrentSquare(grid: PuzzleItem[][], rowIndex: number, columnIndex: number): boolean {
        // TODO: remove number 3 and replace it by variable (squareSize) for better readeability
        // TODO: Find a good way to avoid code duplication
        let squareMinRowIndex = Math.floor(rowIndex / 3) * 3;
        let squareMaxRowIndex = squareMinRowIndex + 2;
        let squareMinColumnIndex = Math.floor(columnIndex / 3) * 3;
        let squareMaxColumnIndex = squareMinColumnIndex + 2;

        //let squareLimit = this.getSquareLimit(rowIndex, columnIndex);

        for (let rowId1 = squareMinRowIndex; rowId1 <= squareMaxRowIndex; ++rowId1) {

            for (let columnId1 = squareMinColumnIndex; columnId1 <= squareMaxColumnIndex; ++columnId1) {

                let count = 0;
                let cellValue = grid[rowId1][columnId1]._value;

                for (let rowId2 = squareMinRowIndex; rowId2 <= squareMaxRowIndex; ++rowId2) {
                    for (let columnId2 = squareMinColumnIndex; columnId2 <= squareMaxColumnIndex; ++columnId2) {

                        if (Number(grid[rowId2][columnId2]._value) === Number(cellValue)
                            && Number(cellValue) !== 0) {
                            ++count;
                        }
                        if (count > 1) {
                            return false;
                        }
                    }
                }
            }
        }

        return true;
    }

    updateCurrentSquareFormat(rowIndex: number, columnIndex: number, removeBorder?: boolean) {

        let borderPropertyValue = (!removeBorder) ? CSS_BACKGROUND_VALUE : CSS_BACKGROUND_INIT;

        // TODO: Find a good way to avoid code duplication
        let squareMinRowIndex = Math.floor(rowIndex / 3) * 3;
        let squareMaxRowIndex = squareMinRowIndex + 2;
        let squareMinColumnIndex = Math.floor(columnIndex / 3) * 3;
        let squareMaxColumnIndex = squareMinColumnIndex + 2;

        for (let rowId = squareMinRowIndex; rowId <= squareMaxRowIndex; ++rowId) {

            for (let columnId = squareMinColumnIndex; columnId <= squareMaxColumnIndex; ++columnId) {
                let cellId = CELL_ID_PREFIX + rowId + columnId;

                if (document.getElementById(cellId)) {
                    document.getElementById(cellId).style.backgroundColor = borderPropertyValue;
                }

            }
        }
    }

    // TODO: to be completed, we need to handle the code duplication by using this method.
    getSquareLimit(rowIndex: number, columnIndex: number): any {

        let squareMinRowIndex = Math.floor(rowIndex / 3) * 3;
        let squareMaxRowIndex = squareMinRowIndex + 2;
        let squareMinColumnIndex = Math.floor(columnIndex / 3) * 3;
        let squareMaxColumnIndex = squareMinColumnIndex + 2;

        return {
            squareMinRowIndex: squareMinRowIndex,
            squareMaxRowIndex: squareMaxRowIndex,
            squareMinColumnIndex: squareMinColumnIndex,
            squareMaxColumnIndex: squareMaxColumnIndex
        };
    }

    // Clears the cells the user filled.
    // Initialize the grid format to prevent when an invalid grid format is applied.
    initializeGrid(puzzle: Puzzle) {

        if (puzzle === null
            || puzzle._puzzle === null) {
            throw new Error("The initial grid cannot be null");
        }

        for (let row = 0; row < puzzle._puzzle.length; ++row) {

            // Initialize the current row format.
            this.updateCurrentRowFormat(row, true);

            for (let column = 0; column < puzzle._puzzle.length; ++column) {

                if (puzzle._puzzle[row][column]._hide) {
                    puzzle._puzzle[row][column]._value = null;
                }

                // Initialize the current colum/square format
                this.updateCurrentColumnFormat(column, true);
                this.updateCurrentSquareFormat(row, column, true);
            }
        }

    }
}
