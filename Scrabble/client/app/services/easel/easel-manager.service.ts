import { Injectable } from '@angular/core';
import { EaselControl } from '../../commons/easel-control';
import { ScrabbleLetter } from '../../models/letter/scrabble-letter';

declare var jQuery: any;

export const INPUT_ID_PREFIX = '#easelCell_';
export const MIN_POSITION_INDEX = 0;
export const MAX_POSITION_INDEX = 6;
export const CSS_BORDER = 'border';
export const CSS_BOX_SHADOW = 'box-shadow';
export const CSS_OUT_LINE = 'out-line';

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
        let verification: boolean;
        if (keyCode === null) {
            throw new Error("Argument error: the keyCode cannot be null");
        }
        verification = (EaselControl.leftArrowKeyCode === keyCode || keyCode === EaselControl.rightArrowKeyCode);
        return verification;
    }

    public isScrabbleLetter(keyCode: number): boolean {
        let verification: boolean;
        if (keyCode === null) {
            throw new Error("Argument error: the keyCode cannot be null");
        }
        verification = (EaselControl.letterAKeyCode <= keyCode && keyCode <= EaselControl.letterZKeyCode);
        return verification;
    }

    public isTabKey(keyCode: number): boolean {
        let verification: boolean;
        if (keyCode === null) {
            throw new Error("Argument error: the keyCode cannot be null");
        }
        verification = (keyCode === EaselControl.tabKeyCode);
        return verification;
    }

    public onKeyEventUpdateCurrentCursor(easelLength: number, keyCode: number, currentPosition?: number): number {
        if (easelLength === null) {
            throw new Error("Argument error: the easelLenght cannot be null");
        }
        this.removeFocusFormatInEasel(easelLength);

        if (keyCode === null) {
            throw new Error("Argument error: the keyCode cannot be null");
        }

        let newPosition = this.getNextLetterPosition(keyCode, currentPosition);
        if (newPosition !== null) {
            this.setFocusToElementWithGivenIndex(easelLength, newPosition);
        }

        return newPosition;
    }

    private getNextLetterPosition(keyCode: number, currentPosition: number): number {
        let newPosition: number;

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
                return newPosition = 0;
        }
    }

    private removeFocusFormatToElementWithGivenIndex(index: number) {
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

    public parseStringToListofChar(texte: string): Array<string> {
        if (texte === null
            || texte === undefined) {
            throw new Error("Null argument error: The parameter cannot be null");
        }
        let listOfChar = new Array<string>();
        for (let index = 0; index < texte.length; ++index) {
            listOfChar.push(texte[index].toUpperCase());
        }
        return listOfChar;
    }

    public parseScrabbleLettersToListofChar(scrabbleLetters: Array<ScrabbleLetter>): Array<string> {
        if (scrabbleLetters === null) {
            throw new Error("Null argument error: The parameter cannot be null");
        }
        let listOfChar = new Array<string>();
        for (let index = 0; index < scrabbleLetters.length; ++index) {
            listOfChar.push(scrabbleLetters[index].letter.toUpperCase());
        }
        return listOfChar;
    }

    public getScrabbleWordFromTheEasel(
        easelLetters: Array<ScrabbleLetter>,
        enteredLetters: Array<string>):
        Array<ScrabbleLetter> {
        if (enteredLetters === null
            || easelLetters === null) {
            throw new Error("Null argument error: The parameter cannot be null");
        }

        let words = new Array<ScrabbleLetter>();
        let tempEaselLetters = new Array<string>();

        easelLetters.forEach((letter) => {
            tempEaselLetters.push(letter.letter);
        });

        // Since the char '*' should be recognize has the blank letter,
        // We have to check if the input list is not a '*' because the easel does not contains a '*' char.
        for (let index = 0; index < enteredLetters.length; ++index) {
            let letterIndex = tempEaselLetters.findIndex((letter) => {
                return letter === enteredLetters[index]
                    || enteredLetters[index] === '*';
            });

            //console.log("Easel manager", letterIndex);

            if (letterIndex !== -1) {
                words.push(easelLetters[letterIndex]);
                tempEaselLetters[letterIndex] = null;
            }
        }

        words = (words.length === enteredLetters.length) ? words : null;
        return words;
    }
}
