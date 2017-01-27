import { Injectable } from '@angular/core';


import { PuzzleCommon } from '../commons/puzzle-common';
import { Puzzle, PuzzleItem } from '../models/puzzle';

declare var jQuery:any;

@Injectable()
export class PuzzleManagerService {

    constructor(){
        //Default constructor
    }

    //  Check if the value is valid
    public isValidNumber(puzzle : Puzzle, rowIndex: number, columnIndex : number) {
        let grid = puzzle.puzzle;

        // TODO: Must be checked
        let isColumnValid = this.isDuplicatedNumberInCurrentColumn(grid, rowIndex, columnIndex);
        let isRowValid = this.isDuplicatedNumberInCurrentRow(grid, rowIndex, columnIndex);
        let isSquareValid =  this.isDuplicatedNumberInCurrentSquare(grid, rowIndex, columnIndex);

        if(isColumnValid && isRowValid && isSquareValid){
            this.updateCurrentSquareFormat(rowIndex, columnIndex, true);
            this.updateCurrentColumnFormat(columnIndex, true);
            this.updateCurrentRowFormat(rowIndex, true);

        }else { 

            if(!isSquareValid) {
                this.updateCurrentSquareFormat(rowIndex, columnIndex);
            }

            if(!isColumnValid) {
                this.updateCurrentColumnFormat(columnIndex);

            }

            if(!isRowValid) {
                this.updateCurrentRowFormat(rowIndex);
            }
        }

        return (isRowValid && isColumnValid && isSquareValid);
    }

    // Check if the row is valid.
    isDuplicatedNumberInCurrentRow(grid: PuzzleItem[][], rowIndex: number, columnIndex : number) : boolean{
        
        let enteredNumber =  Number(grid[rowIndex][columnIndex].number);

        // Check for duplicated number in the related row.
        for (let column = 0; column <= PuzzleCommon.maxColumnIndex; column++){
            let item = Number(grid[rowIndex][column].number);
           
            if( item != null){
                for (let column2 = 0; column2 <= PuzzleCommon.maxColumnIndex; column2++){
                    if(Number(grid[rowIndex][column2].number) == item
                    && (Number(grid[rowIndex][column2].number) != 0)
                    && (column != column2)
                     ){                  
                        return false;
                    }
                }
            } 
        }

        // The row is valid if a duplicated number is not found.        
        return true;
    }

    // Update the current row format when an invalid number is entered or not
    updateCurrentRowFormat(rowIndex: number, removeBorder?:boolean){

        let borderPropertyValue = (!removeBorder) ? CSS_BORDER_VALUE: "";

        for (let colId = 0; colId <= PuzzleCommon.maxColumnIndex; colId++){

            let cellId = CELL_ID_PREFIX + rowIndex + colId;
            jQuery(cellId).css(CSS_BORDER_TOP, borderPropertyValue);
            jQuery(cellId).css(CSS_BORDER_BOTTOM, borderPropertyValue);
        }
    }

    // Check if the column is valid.
    isDuplicatedNumberInCurrentColumn(grid: PuzzleItem[][], rowIndex: number, columnIndex : number): boolean{
        
        // Check for duplicated number in the related column.
        for (let row = 0; row <= PuzzleCommon.maxRowIndex; row++){
            let item = Number(grid[row][columnIndex].number);
           
            if( item != null){
                for (let row2 = 0; row2 <= PuzzleCommon.maxRowIndex; row2++){
                    if(Number(grid[row2][columnIndex].number) == item
                    && (Number(grid[row2][columnIndex].number) != 0)
                    && (row != row2)
                     ){                 
                        return false;
                    }
                }
            } 
        }

        // return true if a duplicated number is not found.
        return true;
    }

    // Update the current column format when an invalid number is entered or not
    updateCurrentColumnFormat(columnIndex: number, removeBorder?: boolean ){
        let borderPropertyValue = (!removeBorder) ? CSS_BORDER_VALUE: "";
        
        let topCellId = CELL_ID_PREFIX + PuzzleCommon.minColumnIndex + columnIndex;
        let bottomCellId = CELL_ID_PREFIX + PuzzleCommon.maxColumnIndex + columnIndex;
        
        jQuery(topCellId).css(CSS_BORDER_TOP, borderPropertyValue);
        jQuery(bottomCellId).css(CSS_BORDER_BOTTOM, borderPropertyValue);

        for (let rowId = 0; rowId <= PuzzleCommon.maxColumnIndex; rowId++){
            let cellId = CELL_ID_PREFIX + rowId + columnIndex;

            jQuery(cellId).css(CSS_BORDER_LEFT, borderPropertyValue);
            jQuery(cellId).css(CSS_BORDER_RIGHT, borderPropertyValue);
        }
    }

    // Check if the square around the value is valid.
    isDuplicatedNumberInCurrentSquare(grid: PuzzleItem[][], rowIndex: number, columnIndex : number) : boolean{
        let item = grid[rowIndex][columnIndex];

        // TODO: remove number 3 and replace it by variable (squareSize) for better readeability
        // TODO: Find a good way to avoid code duplication
        let squareMinRowIndex = Math.floor(rowIndex / 3) * 3;
        let squareMaxRowIndex = squareMinRowIndex + 2;

        let squareMinColumnIndex = Math.floor(columnIndex / 3) * 3;
        let squareMaxColumnIndex = squareMinColumnIndex + 2;

        for (let rowId = squareMinRowIndex; rowId <= squareMaxRowIndex; ++rowId) {

            for (let columnId = squareMinColumnIndex; columnId <= squareMaxColumnIndex; ++columnId) {
                
                let count = 0;
                let cellValue = grid[rowId][columnId].number;

                for (let rowId = squareMinRowIndex; rowId <= squareMaxRowIndex; ++rowId) {
                 
                    for (let columnId = squareMinColumnIndex; columnId <= squareMaxColumnIndex; ++columnId) {

                        if (grid[rowId][columnId].number == Number(cellValue)) count++;
                        if(count > 1) { 

                            return false;
                        }
                    }
                }
            }
         }

        return true;
    }

     updateCurrentSquareFormat(rowIndex: number, columnIndex : number, removeBorder?: boolean ){

        let borderPropertyValue = (!removeBorder) ? CSS_BORDER_VALUE: "";

        // TODO: Find a good way to avoid code duplication
        let squareMinRowIndex = Math.floor(rowIndex / 3) * 3;
        let squareMaxRowIndex = squareMinRowIndex + 2;
        let squareMinColumnIndex = Math.floor(columnIndex / 3) * 3;
        let squareMaxColumnIndex = squareMinColumnIndex + 2;

        let topCellId = CELL_ID_PREFIX + PuzzleCommon.minColumnIndex + columnIndex;
        let bottomCellId = CELL_ID_PREFIX + PuzzleCommon.maxColumnIndex + columnIndex;

        for (let columnId = squareMinColumnIndex; columnId <= squareMaxColumnIndex; ++columnId) {

            let topCellId = CELL_ID_PREFIX + squareMinRowIndex + columnId;
            let bottomCellId = CELL_ID_PREFIX + squareMaxRowIndex + columnId;

            jQuery(topCellId).css(CSS_BORDER_TOP, borderPropertyValue);
            jQuery(bottomCellId).css(CSS_BORDER_BOTTOM, borderPropertyValue);
        }

        for (let rowId = squareMinRowIndex; rowId <= squareMaxRowIndex; ++rowId) {

            let leftCellId = CELL_ID_PREFIX + rowId + squareMinColumnIndex;
            let rightCellId = CELL_ID_PREFIX + rowId + squareMaxColumnIndex;

            jQuery(leftCellId).css(CSS_BORDER_LEFT, borderPropertyValue);
            jQuery(rightCellId).css(CSS_BORDER_RIGHT, borderPropertyValue);
        }
    }
}

export const CELL_ID_PREFIX = "#";
export const CSS_BORDER_TOP = "background-color";
export const CSS_BORDER_BOTTOM = "background-color";
export  const CSS_BORDER_LEFT = "background-color";
export const CSS_BORDER_RIGHT = "background-color";
export const CSS_BORDER_VALUE = "#E57373";