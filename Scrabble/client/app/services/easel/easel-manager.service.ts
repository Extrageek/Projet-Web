import { Injectable } from '@angular/core';
import { EaselControl } from '../../commons/easel-control';
import { ScrabbleLetter } from "../../models/letter/scrabble-letter";

declare var jQuery: any;

export const INPUT_ID_PREFIX = '#easelCell_';
const MIN_POSITION_INDEX = 0;
const MAX_POSITION_INDEX = 6;
const CSS_BORDER = 'border';
const CSS_BOX_SHADOW = 'box-shadow';
const CSS_OUT_LINE = 'out-line';

const EASEL_INIT_ELEMENT_CSS = {
    'border': '1px solid #000',
    'boxShadow': 'none',
    'outline': '0 none'
};

const EASEL_FOCUS_ELEMENT_CSS = {
    'border': '3px solid red',
    'boxShadow': '0 1px 1px red inset, 0 0 8px red',
    'outline': '0 none'
};

@Injectable()
export class EaselManagerService {

    constructor() {
        // Default constructor
    }

    public isDirection(keyCode: number): boolean {
        return 37 === keyCode || keyCode === 39;
    }

    public isScrabbleLetter(keyCode: number): boolean {
        return EaselControl.letterAKeyCode <= keyCode && keyCode <= EaselControl.letterZKeyCode;
    }

    public isTabKey(keyCode: number): boolean {
        return (keyCode === EaselControl.tabKeyCode);
    }

    public onKeyEventUpdateCurrentCursor(easelLength: number, keyCode: number, currentPosition?: number): number {
        this.removeFocusFormatInEasel(easelLength);

        let newPosition = this.getNextLetterPosition(keyCode, currentPosition);
        if (newPosition !== null) {
            this.setFocusToElementWithGivenIndex(easelLength, newPosition);
        }

        return newPosition;
    }

    public setFocusToElementWithGivenIndex(easelLength: number, index: number) {
        let newInputId = [INPUT_ID_PREFIX, index].join('');
        this.removeFocusFormatInEasel(easelLength);
        if (jQuery(newInputId) !== undefined) {
            jQuery(newInputId).focus();
            jQuery(newInputId).css(CSS_BORDER, EASEL_FOCUS_ELEMENT_CSS.border);
            jQuery(newInputId).css(CSS_OUT_LINE, EASEL_FOCUS_ELEMENT_CSS.outline);
            jQuery(newInputId).css(CSS_BOX_SHADOW, EASEL_FOCUS_ELEMENT_CSS.boxShadow);
        }
    }

    public removeFocusFormatToElementWithGivenIndex(index: number) {
        let newInputId = [INPUT_ID_PREFIX, index].join('');

        if (jQuery(newInputId) !== undefined) {
            jQuery(newInputId).css(CSS_BORDER, EASEL_INIT_ELEMENT_CSS.border);
            jQuery(newInputId).css(CSS_OUT_LINE, EASEL_INIT_ELEMENT_CSS.outline);
            jQuery(newInputId).css(CSS_BOX_SHADOW, EASEL_INIT_ELEMENT_CSS.boxShadow);
        }
    }

    public removeFocusFormatInEasel(easelLength: number) {
        for (let index = 0; index < easelLength; ++index) {
            this.removeFocusFormatToElementWithGivenIndex(index);
        }
    }

    public getNextLetterPosition(keyCode: number, currentPosition: number): number {
        let newPosition = 0;

        switch (keyCode) {
            case EaselControl.leftArrowKeyCode:
                newPosition = currentPosition - 1;
                return (newPosition < MIN_POSITION_INDEX) ? MAX_POSITION_INDEX : newPosition;
            case EaselControl.rightArrowKeyCode:
                newPosition = currentPosition + 1;
                return (newPosition > MAX_POSITION_INDEX) ? MIN_POSITION_INDEX : newPosition;
            case EaselControl.tabKeyCode:
                return MIN_POSITION_INDEX;
            default:
                break;
        }
    }

    public getIndexOfLettersToChangeIfValidRequest(
        lettersInEasel: Array<ScrabbleLetter>,
        enteredletters: Array<string>): Array<number> {

        if (lettersInEasel === null || enteredletters === null) {
            throw new Error("Null argument error: the parameters cannot be null");
        }

        if (enteredletters.length > lettersInEasel.length || enteredletters.length === 0) {
            throw new Error("Invalid argument error");
        }

        let listOfLettersToChange = new Array<number>();

        for (let index = 0; index < enteredletters.length; ++index) {

            //let letter: ScrabbleLetter;
            if (enteredletters[index] === '*') {
                enteredletters[index] = 'blank';
            }

            let letterIndex = lettersInEasel.findIndex((letter: ScrabbleLetter) =>
                letter.letter.toUpperCase() === enteredletters[index].toUpperCase());

            if (letterIndex === -1 || letterIndex === undefined) {
                return null;
            }

            listOfLettersToChange.push(letterIndex);
        }
        return listOfLettersToChange;
    }

    public getStringListofChar(texte: string): Array<string> {

        if (texte === null) {
            throw new Error("Null argument error: The parameter cannot be null");
        }
        let listOfChar = new Array<string>();
        for (let index = 0; index < texte.length; ++index) {
            listOfChar.push(texte[index].toUpperCase());
        }
        return listOfChar;
    }
}
