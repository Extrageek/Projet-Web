/**
 * puzzle-event-manager.service.ts - Manage all the events associated to the puzzle grids
 *
 * @authors ...
 * @date 2017/01/22
 */

import { Injectable } from '@angular/core';
import { PuzzleCommon } from '../commons/puzzle-common';
import { PuzzleManagerService } from './grid-manager.service';

declare var jQuery:any;

@Injectable()
export class PuzzleEventManagerService {

    _newPositionX = 0;
    _newPositionY = 0;
    _nextInputPositionYX : string;

    constructor(private puzzleManagerService: PuzzleManagerService) {
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
        // TODO: Must be checked, let's keep this for now
        return keyCode == PuzzleCommon.deleteKeyCode;
    }

    /**
     * The isSudokuNumber function, check if the keypress source is a valid number for the puzzle.
     *
     * @class PuzzleEventManagerService
     * @method isDeleteKey
     * @return true for a valid number for the puzzle
     */
    isSudokuNumber (keyCode: number): boolean{
        return 49 <= keyCode && keyCode <= 57;
    }

    /**
     * The PuzzleEventManagerService function, update the cursor according to the keyCode.
     *
     * @class PuzzleEventManagerService
     * @method onKeyEventUpdateCurrentCursor
     */
    onKeyEventUpdateCurrentCursor(event: KeyboardEvent): void{
        let currentPositionXY = event.srcElement.id.split('');
        let keyCode = event.keyCode;

        // TODO: Remove after a clean debug
        if (this.isDirection(keyCode)) {
            this.updateFocus(currentPositionXY, keyCode);
        }
        else if (this.isDeleteKey(keyCode)) {

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
        switch (keyCode) {
            case PuzzleCommon.downArrowKeyCode:
                let downPosition = Number(currentPositionXY[PuzzleCommon.yPosition]) + 1;
                this._newPositionX = ( downPosition > PuzzleCommon.maxColumnIndex)
                    ? PuzzleCommon.minColumnIndex : downPosition;
                break;
            case PuzzleCommon.upArrowKeyCode:
                let upPosition = Number(currentPositionXY[PuzzleCommon.yPosition]) - 1;
                this._newPositionX = (upPosition < PuzzleCommon.minColumnIndex)
                    ? PuzzleCommon.maxRowIndex : upPosition;
                break;
            case PuzzleCommon.leftArrowKeyCode:
                let leftPosition = Number(currentPositionXY[PuzzleCommon.xPosition]) - 1;
                this._newPositionY = (leftPosition < PuzzleCommon.minColumnIndex)
                    ? PuzzleCommon.maxRowIndex : leftPosition;
                break;
            case PuzzleCommon.rightArrowKeyCode:
                let rightPosition = Number(currentPositionXY[PuzzleCommon.xPosition]) + 1;
                this._newPositionY = (rightPosition > PuzzleCommon.maxColumnIndex)
                    ? PuzzleCommon.minColumnIndex : rightPosition;
                break;
            default:
                break;
        }

        if (keyCode === PuzzleCommon.leftArrowKeyCode || keyCode === PuzzleCommon.rightArrowKeyCode) {

            this._nextInputPositionYX = currentPositionXY[PuzzleCommon.yPosition] + this._newPositionY.toString();

        } else if (keyCode === PuzzleCommon.upArrowKeyCode || keyCode === PuzzleCommon.downArrowKeyCode) {           
          
            this._nextInputPositionYX = this._newPositionX.toString() + currentPositionXY[PuzzleCommon.xPosition];
        }
        
        let inputId = "#" + this._nextInputPositionYX;
        jQuery(inputId).focus();
    }

     /**
     * The deleteCellContent function, delete the value in the selected cell of the grid.
     *
     * @class PuzzleEventManagerService
     * @method deleteCellContent
     */
    deleteCellContent(currentPositionXY: string[]): void {
        let inputId = "#" + currentPositionXY.join('');
        jQuery(inputId).text = "";
    }
}
