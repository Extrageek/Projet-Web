import { Injectable } from '@angular/core';
declare var jQuery: any;

import { EaselManagerService } from "./easel-manager.service";
import { CommandsHelper } from "./commons/commands-helper";
import { LetterHelper } from "../commons/letter-helper";
import { ExceptionHelperService } from "./exception-helper.service";

import { Board } from '../models/board';
import { IScrabbleLetter } from "../models/scrabble-letter";
import { IPlaceWordResponse } from "./place-command-response.interface";
import { ICommandRequest } from './commons/command-request';

export const INPUT_ID_PREFIX = '#';
export const CSS_BACKGROUND_IMAGE = 'background-image';
export const BACKGROUND_URL_PREFIX = 'url(';
export const BACKGROUND_URL_SUFFIX = ')';

@Injectable()
export class BoardManagerService {

    private _board: Board;
    public get board(): Board {
        return this._board;
    }
    public set board(v: Board) {
        this._board = v;
    }

    constructor(
        private easelManagerService: EaselManagerService,
        private exceptionHelperService: ExceptionHelperService) {
        // Constructor
    }

    // public placeWordInBoard(response: IPlaceWordResponse, board: Board): boolean {
    //     console.log("-", response._squarePosition.row);

    //     this._board = board;
    //     let firstRowIndex = response._squarePosition.row.toUpperCase();
    //     let firstColumnIndex = response._squarePosition.column;
    //     let orientation = response._wordOrientation;
    //     let letters = response._letters;
    //     let scrabbleLetters = this.easelManagerService.getScrabbleLetterFromStringLetter(letters);

    //     this.exceptionHelperService.throwNullArgumentException(firstRowIndex);
    //     this.exceptionHelperService.throwNullArgumentException(firstColumnIndex);
    //     this.exceptionHelperService.throwNullArgumentException(scrabbleLetters);

    //     if (orientation === CommandsHelper.HORIZONTAL_ORIENTATION) {
    //         return (this.placeLetterInHorizontalOrientation(firstRowIndex, firstColumnIndex, scrabbleLetters));
    //     } else if (orientation === CommandsHelper.VERTICAL_ORIENTATION) {
    //         return (this.placeLetterInVerticalOrientation(firstRowIndex, firstColumnIndex, scrabbleLetters));
    //     } else {
    //         return false;
    //     }
    // }

    // private placeLetterInHorizontalOrientation(
    //     firstRowIndex: string,
    //     firstColumnIndex: number,
    //     scrabbleLetters: Array<IScrabbleLetter>): boolean {

    //     let lastLetterColumnPosition = scrabbleLetters.length + firstColumnIndex - 1;

    //     // TODO: We can check more staff here before placing the word
    //     if (!this.isValidColumnPosition(lastLetterColumnPosition)) {
    //         return false;
    //     }

    //     for (let index = 0; index < (scrabbleLetters.length); ++index) {
    //         let nextColumnIndex = index + firstColumnIndex;

    //         // Get the row number from the given letter
    //         let rowLetterToRowNumber = firstRowIndex.toUpperCase()
    //             .charCodeAt(0) - LetterHelper.LETTER_A_KEY_CODE;
    //         // console.log("square", this._board.squares[rowLetterToRowNumber][nextColumnIndex].isBusy);
    //         let currentSquare = this._board.squares[rowLetterToRowNumber][nextColumnIndex];

    //         if (!currentSquare.isBusy) {
    //             let position = [INPUT_ID_PREFIX, firstRowIndex, nextColumnIndex].join('');
    //             let imageSource = [BACKGROUND_URL_PREFIX,
    //                 scrabbleLetters[index].imageSource,
    //                 BACKGROUND_URL_SUFFIX].join('');

    //             jQuery(position).css(CSS_BACKGROUND_IMAGE, imageSource);
    //             this._board.squares[rowLetterToRowNumber][nextColumnIndex].isBusy = true;

    //         } else {
    //             if (currentSquare.letter.letter !== ""
    //                 && currentSquare.letter.letter !== scrabbleLetters[index].letter) {

    //                 // TODO: Reinitialiser les lettres déjà placées ici
    //                 return false;
    //             }
    //         }
    //     }

    //     return true;
    // }

    // private placeLetterInVerticalOrientation(
    //     firstRowIndex: string,
    //     columnIndex: number,
    //     scrabbleLetters: Array<IScrabbleLetter>): boolean {

    //     let firstRowLetterToRowNumber = firstRowIndex
    //         .toUpperCase()
    //         .charCodeAt(0);

    //     let lastRowPosition = scrabbleLetters.length
    //         + firstRowLetterToRowNumber
    //         - 1;


    //     console.log("first", firstRowLetterToRowNumber);
    //     console.log("lastRowPosition", lastRowPosition);


    //     if (!this.isValidRowPosition(String.fromCharCode(lastRowPosition))) {
    //         return false;
    //     }

    //     for (let index = 0; index < (scrabbleLetters.length); ++index) {
    //         let nextRowIndex = firstRowLetterToRowNumber + index;

    //         // Get the row number from the given letter
    //         let nextRowLetter = this.parseFromNumberToCharacter(nextRowIndex);
    //         let nextSquareRow = nextRowIndex - LetterHelper.LETTER_A_KEY_CODE;
    //         let nextSquare = this._board.squares[nextSquareRow][columnIndex];

    //         if (!nextSquare.isBusy) {
    //             let position = [INPUT_ID_PREFIX, nextRowLetter, columnIndex].join('');
    //             let imageSource = [BACKGROUND_URL_PREFIX,
    //                 scrabbleLetters[index].imageSource,
    //                 BACKGROUND_URL_SUFFIX].join('');

    //             jQuery(position).css(CSS_BACKGROUND_IMAGE, imageSource);
    //             this._board.squares[nextSquareRow][columnIndex].isBusy = true;

    //         } else {
    //             if (nextSquare.letter.letter !== ""
    //                 && nextSquare.letter.letter !== scrabbleLetters[index].letter) {

    //                 // TODO: Reinitialiser les lettres déjà placées ici
    //                 return false;
    //             }
    //         }
    //     }

    //     return true;
    // }

    public isValidRowPosition(letter: string): boolean {
        this.exceptionHelperService.throwNullArgumentException(letter);
        let keyCode = letter.toUpperCase().charCodeAt(0);
        return keyCode >= LetterHelper.LETTER_A_KEY_CODE
            && keyCode <= LetterHelper.LETTER_O_KEY_CODE;
    }

    public isValidColumnPosition(index: number): boolean {
        this.exceptionHelperService.throwNullArgumentException(index);
        return index !== 0 && !isNaN(Number(index))
            && index >= CommandsHelper.MIN_BOARD_POSITION_INDEX
            && index <= CommandsHelper.MAX_BOARD_POSITION_INDEX;
    }

    public isValidOrientation(orientation: string): boolean {
        this.exceptionHelperService.throwNullArgumentException(orientation);
        return orientation === CommandsHelper.VERTICAL_ORIENTATION
            || orientation === CommandsHelper.HORIZONTAL_ORIENTATION;
    }

    public parseFromNumberToCharacter(value: number) {
        this.exceptionHelperService.throwNullArgumentException(value);
        this.exceptionHelperService.throwOutOfRangeException(
            LetterHelper.LETTER_A_KEY_CODE,
            LetterHelper.LETTER_Z_KEY_CODE,
            value);
        return String.fromCharCode(value);
    }
}
