import { Injectable } from '@angular/core';
declare var jQuery: any;

import { EaselManagerService } from "../services/easel/easel-manager.service";
import { CommandsHelper } from "../services/commands/commons/commands-helper";
import { LetterHelper } from "../commons/letter-helper";
import { ExceptionHelperService } from "../services/helpers/exception-helper.service";

import { Board } from '../models/board/board';
import { ScrabbleLetter } from "../models/letter/scrabble-letter";
import { IPlaceWordResponse } from "./commands/commandPlaceWord/place-command-response.interface";
import { ICommandRequest } from './commands/commons/command-request';

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

    public placeWordInBoard(response: IPlaceWordResponse, board: Board): boolean {
        console.log("-", response._squarePosition.row);

        this._board = board;
        let firstRow = response._squarePosition.row.toUpperCase();
        let firstColumn = response._squarePosition.column;
        let orientation = response._wordOrientation;
        let letters = response._letters;

        let scrabbleLetters = this.easelManagerService.getScrabbleLetterFromStringLetter(letters);

        if (orientation === CommandsHelper.HORIZONTAL_ORIENTATION) {
            return (this.placeLetterInHorizontalOrientation(firstRow, firstColumn, scrabbleLetters));
        } else if (orientation === CommandsHelper.VERTICAL_ORIENTATION) {
            return (this.placeLetterInVerticalOrientation(firstRow, firstColumn, scrabbleLetters));
        } else {
            return false;
        }
    }

    private placeLetterInHorizontalOrientation(
        firstRowIndex: string,
        firstColumnIndex: number,
        scrabbleLetters: Array<ScrabbleLetter>): boolean {

        this.exceptionHelperService.throwNullArgumentException(firstRowIndex);
        this.exceptionHelperService.throwNullArgumentException(firstColumnIndex);
        this.exceptionHelperService.throwNullArgumentException(scrabbleLetters);

        let lastLetterColumnPosition = scrabbleLetters.length + firstColumnIndex - 1;

        // TODO: We can check many staff here before placing the word
        if (!this.isValidColumnPosition(lastLetterColumnPosition)) {
            return false;
        }

        for (let index = 0; index < (scrabbleLetters.length); ++index) {
            let nextColumnIndex = index + firstColumnIndex;

            let rowLetterToRowNumber = firstRowIndex.toUpperCase()
                .charCodeAt(0) - LetterHelper.letterAKeyCode;
            // console.log("square", this._board.squares[rowLetterToRowNumber][nextColumnIndex].isBusy);
            let currentSquare = this._board.squares[rowLetterToRowNumber][nextColumnIndex];

            if (!currentSquare.isBusy) {
                let position = [INPUT_ID_PREFIX, firstRowIndex, nextColumnIndex].join('');
                let imageSource = [BACKGROUND_URL_PREFIX,
                    scrabbleLetters[index].imageSource,
                    BACKGROUND_URL_SUFFIX].join('');

                jQuery(position).css(CSS_BACKGROUND_IMAGE, imageSource);
                this._board.squares[rowLetterToRowNumber][nextColumnIndex].isBusy = true;

            } else {
                if (currentSquare.letter.letter !== ""
                    && currentSquare.letter.letter !== scrabbleLetters[index].letter) {
                    return false;
                }
            }
        }

        return true;
    }

    private placeLetterInVerticalOrientation(
        firstRowIndex: string,
        firstColumnIndex: number,
        scrabbleLetters: Array<ScrabbleLetter>): boolean {

        this.exceptionHelperService.throwNullArgumentException(firstRowIndex);
        this.exceptionHelperService.throwNullArgumentException(firstColumnIndex);
        this.exceptionHelperService.throwNullArgumentException(scrabbleLetters);

        if (!this.isValidRowPosition(firstRowIndex)) {
            return false;
        }

        return true;
    }

    public isValidRowPosition(letter: string): boolean {
        this.exceptionHelperService.throwNullArgumentException(letter);
        let keyCode = letter.toUpperCase().charCodeAt(0);
        return keyCode >= LetterHelper.letterAKeyCode
            && keyCode <= LetterHelper.letterOKeyCode;
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
}
