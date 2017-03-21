import { CommandsHelper } from "./commons/command/command-helper";
import { ExceptionHelper } from "./commons/exception-handler";
import { WordDirection } from "./commons/word-direction";
import { LetterHelper } from "../models/commons/letter-helper";

import { Player } from "../models/player";
import { Board } from '../models/board/board';
import { Letter } from "../models/letter";
import { SquareType } from "../models/square/square-type";
import { IPlaceWordResponse } from "../services/commons/command/place-word-response.interface";
import { LetterBankHandler } from './letterbank-handler';

export class BoardManagerService {

    private _exceptionHelper: ExceptionHelper;
    private _letterBankHandler: LetterBankHandler;
    private _player: Player;
    private _board: Board;

    public get board(): Board {
        return this._board;
    }
    public set board(v: Board) {
        this._board = v;
    }

    constructor() {
        this._letterBankHandler = new LetterBankHandler();
        this._exceptionHelper = new ExceptionHelper();
    }

    public placeWordInBoard(
        response: IPlaceWordResponse,
        board: Board,
        player: Player): boolean {

        this._board = board;
        this._player = player;

        let firstRowIndex = response._squarePosition._row.toUpperCase();
        let firstColumnIndex = response._squarePosition._column;
        let orientation = response._wordOrientation;
        let letters = response._letters;
        let scrabbleLetters = this._letterBankHandler.parseFromListOfStringToListOfLetter(letters);

        this._exceptionHelper.throwNullArgumentException(firstRowIndex);
        this._exceptionHelper.throwNullArgumentException(firstColumnIndex);
        this._exceptionHelper.throwNullArgumentException(scrabbleLetters);

        let isPlaced = false;
        if (orientation === CommandsHelper.HORIZONTAL_ORIENTATION) {
            isPlaced = this.placeLetterInHorizontalOrientation(firstRowIndex, firstColumnIndex, scrabbleLetters);

        } else if (orientation === CommandsHelper.VERTICAL_ORIENTATION) {

            let placedDown = this.placeLetterInVerticalOrientation(
                firstRowIndex, firstColumnIndex, scrabbleLetters, WordDirection.DOWN);

            isPlaced = (placedDown) ? placedDown : this.placeLetterInVerticalOrientation(
                firstRowIndex, firstColumnIndex, scrabbleLetters, WordDirection.UP
            );
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
            let currentSquare = this._board.squares[rowLetterToRowNumber][nextColumnIndex - 1];

            if (!currentSquare.isBusy) {
                this._board.squares[rowLetterToRowNumber][nextColumnIndex - 1].squareValue =
                    letters[index].alphabetLetter;
                this._board.squares[rowLetterToRowNumber][nextColumnIndex - 1].isBusy = true;
            } else {
                if (currentSquare.letter.alphabetLetter !== letters[index].alphabetLetter) {
                    return false;
                }
            }
        }

        return true;
    }

    private placeLetterInVerticalOrientation(
        firstRowIndex: string,
        columnIndex: number,
        letters: Array<Letter>,
        wordDirection: WordDirection): boolean {

        let firstRowNumber = firstRowIndex.toUpperCase().charCodeAt(0);

        if (!this.matchVerticalPlacementRules(firstRowNumber, columnIndex, letters, wordDirection)) {
            return false;
        }

        let isValid = true;
        for (let index = 0; index < letters.length && isValid; ++index) {

            let nextRowIndex = (wordDirection === WordDirection.UP) ?
                firstRowNumber - index :
                firstRowNumber + index;

            // Get the row number from the given letter
            let nextRowLetter = this.parseFromNumberToCharacter(nextRowIndex);
            let nextSquareRow = nextRowIndex - LetterHelper.LETTER_A_KEY_CODE;
            let nextSquare = this._board.squares[nextSquareRow][columnIndex - 1];

            if (!nextSquare.isBusy) {
                // let square = this._board.squares[nextSquareRow][columnIndex - 1];
                // TODO: Test with the letter in the easel of the player
                // let isLetterInTheEasel = this._player.easel.exist(square.letter);
                let isLetterInTheEasel = true;
                if (isLetterInTheEasel) {
                    this._board.squares[nextSquareRow][columnIndex - 1].isBusy = true;
                    this._board.squares[nextSquareRow][columnIndex - 1].squareValue =
                        letters[index].alphabetLetter;
                } else {
                    isValid = false;
                }

            } else if (nextSquare.letter.alphabetLetter !== letters[index].alphabetLetter) {
                isValid = false;
            }
        }

        return isValid;
    }

    public isValidRowPosition(rowIndex: number): boolean {
        this._exceptionHelper.throwNullArgumentException(rowIndex);
        let letter = String.fromCharCode(rowIndex)
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
        letters: Array<Letter>,
        wordDirection: WordDirection): boolean {

        let squaresAreAvailable = true;
        let centralSquareStartExist = false;

        for (let index = 0; index < letters.length && squaresAreAvailable; ++index) {

            // Calculate and find the next values for the placement
            let nextRowIndex = (wordDirection === WordDirection.UP) ?
                firstRowNumber - index :
                firstRowNumber + index;

            if (!this.isValidRowPosition(nextRowIndex)) {
                return false;
            }

            let nextRowLetter = this.parseFromNumberToCharacter(nextRowIndex);
            let nextSquareRow = nextRowIndex - LetterHelper.LETTER_A_KEY_CODE;

            // get the next square object
            let nextSquare = this._board.squares[nextSquareRow][columnIndex - 1];

            // Check if the square already contains a letter or not
            if (!nextSquare.isBusy) {
                squaresAreAvailable = true;

                // Check if it's a Star square (the middle of the board)
                if (nextSquare.type === SquareType.STAR) {
                    centralSquareStartExist = true;
                }
                // If we find an existing letter in the square that does not match the current one
            } else if (nextSquare.letter.alphabetLetter !== letters[index].alphabetLetter) {
                squaresAreAvailable = false;
            }

        }
        // Check if we have touched at least one existing letter in the board
        let hasTouchedLetterInTheBoard = this.hasVerticalWordTouchedAletterInTheBoard(
            firstRowNumber, columnIndex,
            letters, wordDirection);

        return (this._board.isEmpty) ?
            (squaresAreAvailable && centralSquareStartExist)
            : (squaresAreAvailable && hasTouchedLetterInTheBoard);
    }

    private hasVerticalWordTouchedAletterInTheBoard(
        firstRowNumber: number,
        columnIndex: number,
        letters: Array<Letter>,
        wordDirection: WordDirection): boolean {

        let touchedLeftOrRightSquare = this.hasVerticalWordTouchedLeftOrRightLetter(
            firstRowNumber, columnIndex,
            letters, wordDirection);

        let touchedBeforeOrAfterWord = this.hasTouchedBeforeOrAfterWord(
            firstRowNumber, columnIndex,
            letters, wordDirection);

        return touchedLeftOrRightSquare || touchedBeforeOrAfterWord;
    }

    private hasVerticalWordTouchedLeftOrRightLetter(firstRowNumber: number,
        columnIndex: number,
        letters: Array<Letter>,
        wordDirection: WordDirection): boolean {

        let touchedLeftOrRightSquare = false;
        let leftSquareOffset = 2;

        for (let index = 0; index < letters.length && !touchedLeftOrRightSquare; ++index) {

            // Calculate and find the next values for the placement
            let nextRowIndex = (wordDirection === WordDirection.UP) ?
                firstRowNumber - index :
                firstRowNumber + index;

            if (!this.isValidRowPosition(nextRowIndex)) {
                return false;
            }

            let nextRowLetter = this.parseFromNumberToCharacter(nextRowIndex);
            let nextSquareRow = nextRowIndex - LetterHelper.LETTER_A_KEY_CODE;

            let touchedLeftSquare = (this.isValidColumnPosition(columnIndex - leftSquareOffset)) ?
                this._board.squares[nextSquareRow][columnIndex - leftSquareOffset].isBusy : false;
            let touchedRightSquare = (this.isValidColumnPosition(columnIndex)) ?
                this._board.squares[nextSquareRow][columnIndex].isBusy : false;

            touchedLeftOrRightSquare = touchedLeftSquare || touchedRightSquare;
        }

        return touchedLeftOrRightSquare;
    }

    private hasTouchedBeforeOrAfterWord(firstRowNumber: number,
        columnIndex: number,
        letters: Array<Letter>,
        wordDirection: WordDirection): boolean {

        let touchedBeforeOrAfterWord = false;
        let firstSquareOffset = 1;
        let lastSquareOffset = letters.length;

        // Calculate and find the next values for the placement
        let beforeWordRowIndex = (wordDirection === WordDirection.UP) ?
            firstRowNumber + firstSquareOffset :
            firstRowNumber - firstSquareOffset;

        let afterWordRowIndex = (wordDirection === WordDirection.UP) ?
            firstRowNumber - lastSquareOffset :
            firstRowNumber + lastSquareOffset;

        let touchedBeforeWord = (this.isValidColumnPosition(columnIndex - 1)) ?
            (this.isValidRowPosition(beforeWordRowIndex) ?
                this._board.squares[beforeWordRowIndex - LetterHelper.LETTER_A_KEY_CODE][columnIndex - 1].isBusy : false)
            : false;

        let touchedAfterWord = (this.isValidColumnPosition(columnIndex - 1)) ?
            (this.isValidRowPosition(afterWordRowIndex) ?
                this._board.squares[afterWordRowIndex - LetterHelper.LETTER_A_KEY_CODE][columnIndex - 1].isBusy : false)
            : false;

        touchedBeforeOrAfterWord = touchedBeforeWord || touchedAfterWord;
        return touchedBeforeOrAfterWord;
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
