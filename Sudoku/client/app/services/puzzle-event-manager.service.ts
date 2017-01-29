/**
 * puzzle-event-manager.service.ts - Manage all the events associated to the puzzle grids
 *
 * @authors ...
 * @date 2017/01/22
 */

import { Injectable } from '@angular/core';
import { PuzzleCommon } from '../commons/puzzle-common';
import { GridManagerService } from './grid-manager.service';

declare var jQuery: any;

export const INPUT_ID_PREFIX = '#';
export const READ_ONLY_ATTRIBUTE ='readonly';
export enum ArrayDirection {
    LEFT = 0,
    RIGHT = 1,
    UP = 2,
    DOWN = 3
}


@Injectable()
export class PuzzleEventManagerService {

    _newPositionX = 0;
    _newPositionY = 0;
    _nextInputPositionYX : string;
    _newInputId ="";
    
    constructor(private puzzleManagerService: GridManagerService) {
        // Default constructor
     }

    /**
     * The isDirection function, check if the keypress source is one of the Left/Right/Up/Down arrow keycode.
     *
     * @class PuzzleEventManagerService
     * @method isDeleteKey
     * @return true for a delete keypress
     */
    isDirection (keyCode: number): boolean {
        // If code of the key is an arrow (left/right/up/downArrowKeyCode)
        return 37 <= keyCode && keyCode <= 40;
    }

     /**
     * The isDeleteKey function, check if the keypress source is a delete button.
     *
     * @class PuzzleEventManagerService
     * @method isDeleteKey
     * @return true for a delete keypress
     */
    isDeleteKey (keyCode: number): boolean {
        return (keyCode === PuzzleCommon.deleteKeyCode);
    }

    /**
     * The isSudokuNumber function, check if the keypress source is a valid number for the puzzle.
     *
     * @class PuzzleEventManagerService
     * @method isDeleteKey
     * @return true for a valid number for the puzzle
     */
    isSudokuNumber (keyCode: number): boolean {
        return PuzzleCommon.oneKey <= keyCode && keyCode <= PuzzleCommon.nineKey;
    }

    /**
     * The PuzzleEventManagerService function, update the cursor according to the keyCode.
     *
     * @class PuzzleEventManagerService
     * @method onKeyEventUpdateCurrentCursor
     */
    onKeyEventUpdateCurrentCursor(event: KeyboardEvent): void {
        let currentPositionXY = event.srcElement.id.split('');
        let keyCode = event.which;

        if (this.isDirection(keyCode)) {
            this.updateFocus(currentPositionXY, keyCode);
        } else if (this.isDeleteKey(keyCode)) {
            this.deleteCellContent(currentPositionXY);
        }
    }

     /**
     * The updateFocus function, update the cursor in the correct input box according to the keyCode.
     *
     * @class PuzzleEventManagerService
     * @method updateFocus
     */
    updateFocus(currentPositionXY: string[], keyCode: number): void {
        // Reads next direction of arrow keys and decide if it warps to the other end
        // or if it goes to the next cell

        switch (keyCode) {
            case PuzzleCommon.downArrowKeyCode:
                this.jumpToNextUpOrDownEmptyCell(currentPositionXY, ArrayDirection.DOWN)
                break;
            case PuzzleCommon.upArrowKeyCode:
                this.jumpToNextUpOrDownEmptyCell(currentPositionXY, ArrayDirection.UP)
                break;
            case PuzzleCommon.leftArrowKeyCode:
                this.jumpToNextLeftOrRightEmptyCell(currentPositionXY, ArrayDirection.LEFT);
                break;
            case PuzzleCommon.rightArrowKeyCode:
                 this.jumpToNextLeftOrRightEmptyCell(currentPositionXY, ArrayDirection.RIGHT);
                break;
            default:
                break;
        }

        // Give the focus to next read/write cell.
        jQuery(this._newInputId).focus();
    }

    // On Left/Right Arrow key press, jump to the next left/right empty cell, according to the direction.
    jumpToNextLeftOrRightEmptyCell(currentPositionXY: string[], arrayDirection: ArrayDirection) {

        let newPosition = 0;

        // Find the new left or right postion index
        if(arrayDirection === ArrayDirection.LEFT) {
            newPosition = Number(currentPositionXY[PuzzleCommon.xPosition]) - 1;
            this._newPositionY = (newPosition < PuzzleCommon.minColumnIndex)
                ? PuzzleCommon.maxRowIndex : newPosition;

        }else if(arrayDirection === ArrayDirection.RIGHT) {
            newPosition = Number(currentPositionXY[PuzzleCommon.xPosition]) + 1;
            this._newPositionY = (newPosition > PuzzleCommon.maxColumnIndex)
                ? PuzzleCommon.minColumnIndex : newPosition;
        }

        // Loop the related column and find the new empty cell position.
        for(let rowRightIndex = PuzzleCommon.minRowIndex, rowLeftIndex = PuzzleCommon.maxRowIndex;
            rowRightIndex <= PuzzleCommon.maxRowIndex, rowLeftIndex >= PuzzleCommon.minRowIndex; 
            ++rowRightIndex, --rowLeftIndex) {

            this._nextInputPositionYX = [currentPositionXY[PuzzleCommon.yPosition], this._newPositionY.toString()].join('');
            this._newInputId = INPUT_ID_PREFIX + this._nextInputPositionYX;

            // Check if the new position is a read only cell and jump to next in this case.
            if(jQuery(this._newInputId ).prop(READ_ONLY_ATTRIBUTE)) { 

                // Increment or Decrement according the specified direction.
                if(arrayDirection === ArrayDirection.LEFT) {
                    --newPosition;

                    if(newPosition < PuzzleCommon.minRowIndex) {
                        this._newPositionY = rowLeftIndex;
                    }else {
                        this._newPositionY = newPosition;
                    }
                }else if(arrayDirection === ArrayDirection.RIGHT) {
                    ++newPosition;

                    if(newPosition > PuzzleCommon.maxRowIndex) {
                        this._newPositionY = rowRightIndex;
                    }else {
                        this._newPositionY = newPosition;
                    }
                }

            }else {
                // If we are in a read/write cell, break and allow the focus option
                break;
            }
        }
    }

    // On Up/Down Arrow key press, jump to the next Up/Down empty cell, according to the direction.
    jumpToNextUpOrDownEmptyCell(currentPositionXY: string[], arrayDirection: ArrayDirection) {

        let newPositionIndex = 0;

        // Find the new up or down postion index
        if(arrayDirection === ArrayDirection.UP) {
            newPositionIndex = Number(currentPositionXY[PuzzleCommon.yPosition]) - 1;
            this._newPositionX = (newPositionIndex < PuzzleCommon.minColumnIndex)
                ? PuzzleCommon.maxColumnIndex : newPositionIndex;

        }else if(arrayDirection === ArrayDirection.DOWN) {
            newPositionIndex = Number(currentPositionXY[PuzzleCommon.yPosition]) + 1;
            this._newPositionX = (newPositionIndex > PuzzleCommon.maxColumnIndex)
                ? PuzzleCommon.minColumnIndex : newPositionIndex;
        }

        // Loop the related row and find the new empty cell position.
        for(let rowDownIndex = PuzzleCommon.minColumnIndex, rowUpIndex = PuzzleCommon.maxColumnIndex;
            rowDownIndex <= PuzzleCommon.maxColumnIndex, rowUpIndex >= PuzzleCommon.minColumnIndex; 
            ++rowDownIndex, --rowUpIndex) {

                this._nextInputPositionYX = [ this._newPositionX.toString(), currentPositionXY[PuzzleCommon.xPosition] ].join('');
                this._newInputId = INPUT_ID_PREFIX + this._nextInputPositionYX;


                // Check if the new position is a read only cell and jump to next in this case.
                if(jQuery(this._newInputId ).prop(READ_ONLY_ATTRIBUTE)) { 

                    // Increment or Decrement according the specified direction.
                    if(arrayDirection === ArrayDirection.UP) {
                        --newPositionIndex;

                        if(newPositionIndex < PuzzleCommon.minColumnIndex) {
                            this._newPositionX = rowUpIndex;
                        }else {
                            this._newPositionX = newPositionIndex;
                        }
                    }else if(arrayDirection === ArrayDirection.DOWN) {
                        ++newPositionIndex;

                        if(newPositionIndex > PuzzleCommon.maxColumnIndex) {
                            this._newPositionX = rowDownIndex;
                        }else {
                            this._newPositionX = newPositionIndex;
                        }
                    }

                }else {
                    // If we are in a read/write cell, break and allow the focus option
                    break;
                }
        }
    }

     /**
     * The deleteCellContent function, delete the value in the selected cell of the grid.
     *
     * @class PuzzleEventManagerService
     * @method deleteCellContent
     */
    deleteCellContent(currentPositionXY: string[]): void {
        // Get the id of the current input id and delete it value
        let inputId = INPUT_ID_PREFIX + currentPositionXY.join('');
        jQuery(inputId).val("");
    }
}
