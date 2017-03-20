
import { CommandsHelper } from "./commons/command/command-helper";
import { LetterHelper } from "../models/commons/letter-helper";
import { ExceptionHelper } from "./commons/exception-handler";

import { Board } from '../models/board/board';
import { Letter } from "../models/letter";
import { SquareType } from "../models/square/square-type";
import { IPlaceWordResponse } from "../services/commons/command/place-word-response.interface";

import { LetterBankHandler } from './letterbank-handler';


export class BoardManagerService {

    private _exceptionHelper: ExceptionHelper;
    private letterBankHandler: LetterBankHandler;
    private _board: Board;
    public get board(): Board {
        return this._board;
    }
    public set board(v: Board) {
        this._board = v;
    }

    constructor() {
        this.letterBankHandler = new LetterBankHandler();
        this._exceptionHelper = new ExceptionHelper();
    }

    public placeWordInBoard(
        response: IPlaceWordResponse,
        board: Board): boolean {

        this._board = board;
        let firstRowIndex = response._squarePosition._row.toUpperCase();
        let firstColumnIndex = response._squarePosition._column;
        let orientation = response._wordOrientation;
        let letters = response._letters;
        let scrabbleLetters = this.letterBankHandler.parseFromListOfStringToListOfLetter(letters);

        this._exceptionHelper.throwNullArgumentException(firstRowIndex);
        this._exceptionHelper.throwNullArgumentException(firstColumnIndex);
        this._exceptionHelper.throwNullArgumentException(scrabbleLetters);

        let isPlaced = false;
        if (orientation === CommandsHelper.HORIZONTAL_ORIENTATION) {
            isPlaced = this.placeLetterInHorizontalOrientation(firstRowIndex, firstColumnIndex, scrabbleLetters);
        } else if (orientation === CommandsHelper.VERTICAL_ORIENTATION) {
            isPlaced = this.placeLetterInVerticalOrientation(firstRowIndex, firstColumnIndex, scrabbleLetters);
        }

        if (isPlaced) {
            this._board.isEmpty = false;
        }

        return isPlaced;
    }

    private placeLetterInHorizontalOrientation(
        firstRowIndex: string,
        firstColumnIndex: number,
        letters: Array<Letter>): boolean {

        let lastLetterColumnPosition = letters.length + firstColumnIndex - 1;
        if (!this.isValidColumnPosition(lastLetterColumnPosition)) {
            return false;
        }

        for (let index = 0; index < (letters.length); ++index) {
            let nextColumnIndex = index + firstColumnIndex;

            // Get the row number from the given letter
            let rowLetterToRowNumber = firstRowIndex.toUpperCase()
                .charCodeAt(0) - LetterHelper.LETTER_A_KEY_CODE;
            let currentSquare = this._board.squares[rowLetterToRowNumber][nextColumnIndex];

            if (!currentSquare.isBusy) {
                this._board.squares[rowLetterToRowNumber][nextColumnIndex].squareValue =
                    letters[index].alphabetLetter;
                this._board.squares[rowLetterToRowNumber][nextColumnIndex].isBusy = true;
            }
        }

        return true;
    }

    private placeLetterInVerticalOrientation(
        firstRowIndex: string,
        columnIndex: number,
        scrabbleLetters: Array<Letter>): boolean {

        let firstRowNumber = firstRowIndex
            .toUpperCase()
            .charCodeAt(0);

        if (!this.matchVerticalPlacementRules(
            firstRowNumber,
            columnIndex,
            scrabbleLetters)) {
            return false;
        }

        for (let index = 0; index < (scrabbleLetters.length); ++index) {
            let nextRowIndex = firstRowNumber + index;

            // Get the row number from the given letter
            let nextRowLetter = this.parseFromNumberToCharacter(nextRowIndex);
            let nextSquareRow = nextRowIndex - LetterHelper.LETTER_A_KEY_CODE;
            let nextSquare = this._board.squares[nextSquareRow][columnIndex - 1];

            if (!nextSquare.isBusy) {
                this._board.squares[nextSquareRow][columnIndex - 1].isBusy = true;
                this._board.squares[nextSquareRow][columnIndex - 1].squareValue =
                    scrabbleLetters[index].alphabetLetter;

            } else {
                if (nextSquare.letter.alphabetLetter !== ""
                    && nextSquare.letter.alphabetLetter !== scrabbleLetters[index].alphabetLetter) {
                    return false;
                }
            }
        }
        return true;
    }

    public isValidRowPosition(letter: string): boolean {
        this._exceptionHelper.throwNullArgumentException(letter);
        let keyCode = letter.toUpperCase().charCodeAt(0);
        return keyCode >= LetterHelper.LETTER_A_KEY_CODE
            && keyCode <= LetterHelper.LETTER_O_KEY_CODE;
    }

    public isValidColumnPosition(index: number): boolean {
        this._exceptionHelper.throwNullArgumentException(index);
        return index !== 0 && !isNaN(Number(index))
            && index >= CommandsHelper.MIN_BOARD_POSITION_INDEX
            && index <= CommandsHelper.MAX_BOARD_POSITION_INDEX;
    }

    public isValidOrientation(orientation: string): boolean {
        this._exceptionHelper.throwNullArgumentException(orientation);
        return orientation === CommandsHelper.VERTICAL_ORIENTATION
            || orientation === CommandsHelper.HORIZONTAL_ORIENTATION;
    }

    private matchVerticalPlacementRules(
        firstRowNumber: number,
        columnIndex: number,
        letters: Array<Letter>): boolean {

        let wordCanBePlaced = false;
        let centralSquareStartExist = false;
        let touchExistingLetterInTheBoard = false;

        let lastRowPosition = letters.length
            + firstRowNumber
            - 1;

        if (!this.isValidRowPosition(String.fromCharCode(lastRowPosition))) {
            return false;
        }

        for (let index = 0; index < (letters.length); ++index) {

            // Calculate and find the nex values for the placement
            let nextRowIndex = firstRowNumber + index;
            let nextRowLetter = this.parseFromNumberToCharacter(nextRowIndex);
            let nextSquareRow = nextRowIndex - LetterHelper.LETTER_A_KEY_CODE;

            // get the next square object
            let nextSquare = this._board.squares[nextSquareRow][columnIndex - 1];

            // Check if the square already contains a letter or not
            if (!nextSquare.isBusy) {
                wordCanBePlaced = true;
                if (nextSquare.type === SquareType.STAR) {
                    centralSquareStartExist = true;
                }
            } else {
                // Check if the letter match in the existing letter in the board
                if (nextSquare.letter.alphabetLetter !== ""
                    && nextSquare.letter.alphabetLetter !== letters[index].alphabetLetter) {
                    return false;
                }
            }
        }

        return (this._board.isEmpty) ? centralSquareStartExist : wordCanBePlaced;
    }

    public parseFromNumberToCharacter(value: number) {
        this._exceptionHelper.throwNullArgumentException(value);
        this._exceptionHelper.throwOutOfRangeException(
            LetterHelper.LETTER_A_KEY_CODE,
            LetterHelper.LETTER_Z_KEY_CODE,
            value);
        return String.fromCharCode(value);
    }
}
