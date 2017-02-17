import { Injectable } from '@angular/core';
import { EaselControl } from '../../commons/easel-control';

declare var jQuery: any;

export const INPUT_ID_PREFIX = '#';

const MIN_POSITION_INDEX = 0;
const MAX_POSITION_INDEX = 6;

@Injectable()
export class PuzzleEventManagerService {

    private _position: number;
    private _newInputId: string;
    private _nextInputPosition = "";

    constructor() {
        // Default constructor
    }

    isDirection(keyCode: number): boolean {
        return 37 === keyCode || keyCode === 39;
    }

    isScrabbleLetter(keyCode: number): boolean {
        return EaselControl.letterAKeyCode <= keyCode && keyCode <= EaselControl.letterAKeyCode;
    }

    onKeyEventUpdateCurrentCursor(event: KeyboardEvent, id: string): void {
        let currentPosition: string;
        let keyCode = event.which;
        if (this.isDirection(keyCode)) {
            this.updateFocus(currentPosition, keyCode);
        }
    }

    updateFocus(currentPosition: string, keyCode: number): void {
        switch (keyCode) {
            case EaselControl.leftArrowKeyCode:
                this.jumpToNextLetter(currentPosition, ArrayDirection.LEFT);
                break;
            case EaselControl.rightArrowKeyCode:
                this.jumpToNextLetter(currentPosition, ArrayDirection.RIGHT);
                break;
            default:
                break;
        }

        // Calculate and give the focus to next cell.
        this._newInputId = INPUT_ID_PREFIX + this._nextInputPosition;
        jQuery(this._newInputId).focus();
    }

    // On Left/Right Arrow key press, jump to the next left/right empty cell, according to the direction.
    jumpToNextLetter(currentPosition: string, arrayDirection: ArrayDirection) {
        let newPosition = 0;

        // Find the new left or right postion index
        if (arrayDirection === ArrayDirection.LEFT) {
            newPosition = Number(currentPosition) - 1;
            this._position = (newPosition < MIN_POSITION_INDEX)
                ? MAX_POSITION_INDEX : newPosition;

        } else if (arrayDirection === ArrayDirection.RIGHT) {
            newPosition = Number(currentPosition) + 1;
            this._position = (newPosition > MAX_POSITION_INDEX)
                ? MIN_POSITION_INDEX : newPosition;
        }
    }
}

export enum ArrayDirection {
    LEFT = 0,
    RIGHT = 1,
}
