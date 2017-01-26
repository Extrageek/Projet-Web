/**
 * puzzle-event-manager.service.ts - Manage all the events associated to the puzzle grids
 *
 * @authors ...
 * @date 2017/01/22
 */

import { Injectable } from '@angular/core';
import { PuzzleCommon } from '../commons/puzzle-common';

@Injectable()
export class PuzzleEventManagerService {

    _newPositionX = 0;
    _newPositionY = 0;
    _nextInputPositionYX : string;

    constructor() {
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
        return keyCode === PuzzleCommon.deleteKeyCode ||
            keyCode === PuzzleCommon.deleteKeyCodeOnMac;
    }

    /**
     * The isSudokuNumber function, check if the keypress source is a valid number for the puzzle.
     *
     * @class PuzzleEventManagerService
     * @method isDeleteKey
     * @return true for a valid number for the puzzle
     */
    isSudokuNumber (keyCode: number): boolean {
        return 49 <= keyCode && keyCode <= 57;
    }

    /**
     * The PuzzleEventManagerService function, update the cursor according to the keyCode.
     *
     * @class PuzzleEventManagerService
     * @method onKeyEventUpdateCurrentCursor
     */
    onKeyEventUpdateCurrentCursor(event: KeyboardEvent): void {

        let currentPositionXY = event.srcElement.id.split('');
        let keyCode = event.keyCode;

        // TODO: Remove after a clean debug
        //console.log(this.isDeleteKey(keyCode));
        //console.log(keyCode);
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
                let downPosition = Number(currentPositionXY[PuzzleCommon.yPosition]) + 1;
                this._newPositionX = ( downPosition > PuzzleCommon.maxColumnIndex)
                    ? PuzzleCommon.minColIndex : downPosition;
                break;
            case PuzzleCommon.upArrowKeyCode:
                let upPosition = Number(currentPositionXY[PuzzleCommon.yPosition]) - 1;
                this._newPositionX = (upPosition < PuzzleCommon.minColIndex)
                    ? PuzzleCommon.maxRowIndex : upPosition;
                break;
            case PuzzleCommon.leftArrowKeyCode:
                let leftPosition = Number(currentPositionXY[PuzzleCommon.xPosition]) - 1;
                this._newPositionY = (leftPosition < PuzzleCommon.minColIndex)
                    ? PuzzleCommon.maxRowIndex : leftPosition;
                break;
            case PuzzleCommon.rightArrowKeyCode:
                let rightPosition = Number(currentPositionXY[PuzzleCommon.xPosition]) + 1;
                this._newPositionY = (rightPosition > PuzzleCommon.maxColumnIndex)
                    ? PuzzleCommon.minColIndex : rightPosition;
                break;
            case PuzzleCommon.deleteKeyCode:
                event.srcElement.innerHTML = "";
                break;
            default:
                break;
        }

        if (keyCode === PuzzleCommon.leftArrowKeyCode || keyCode === PuzzleCommon.rightArrowKeyCode) {
            // TODO: To be removed after a clean debug
            //console.log("Left/Right Key Pressed");
            this._nextInputPositionYX = currentPositionXY[PuzzleCommon.yPosition] + this._newPositionY.toString();
        } else if (keyCode === PuzzleCommon.upArrowKeyCode || keyCode === PuzzleCommon.downArrowKeyCode) {
            // TODO: To be removed after a clean debug
            //console.log("Up/Down Key Pressed");            
            this._nextInputPositionYX = this._newPositionX.toString() + currentPositionXY[PuzzleCommon.xPosition];
        }
        let focusElement = <HTMLInputElement>document.getElementById(this._nextInputPositionYX);
        focusElement.focus();
    }

     /**
     * The deleteCellContent function, delete the value in the selected cell of the grid.
     *
     * @class PuzzleEventManagerService
     * @method deleteCellContent
     */
    deleteCellContent(currentPositionXY: string[]): void {

        let focusElement = <HTMLInputElement>document.getElementById(currentPositionXY.join(''));
        //console.log(focusElement.innerHTML);
        focusElement.innerHTML = "";
    }
}
