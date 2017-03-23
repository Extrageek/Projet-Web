
import { ExceptionHelper } from "../commons/exception-helper";
import { WordDirection } from "../commons/word-direction";
import { CommandsHelper } from '../commons/command/command-helper';
import { Letter } from "../../models/letter";
import { LetterHelper } from "../../models/commons/letter-helper";
import { SquareType } from "../../models/square/square-type";
import { Player } from "../../models/player";
import { Easel } from "../../models/easel";
import { Board } from '../../models/board/board';
import { BoardHelper } from './board-helper';
import { IValidationRequest } from './validation-request.interface';

export class VerticalWordValidator {
    private _player: Player;
    private _board: Board;
    readonly CENTER_ROW = 7;
    readonly CENTER_COLUMN = 7;

    constructor() {
        // Constructor
    }

    public matchVerticalPlacementRules(request: IValidationRequest, board: Board): boolean {
        this._board = board;
        this._player = request._player;
        let easel = new Easel(this._player.easel.letters);
        let isWordFit = true;
        let firstRowIndex = request._firstRowNumber - LetterHelper.LETTER_A_KEY_CODE;
        console.log(firstRowIndex);

        let columnIndex = request._columnIndex - 1;
        console.log(columnIndex);

        if (this._board.isEmpty
            && !this.isFirstVerticalWordCrossedMiddle(firstRowIndex, columnIndex, request._letters.length)) {
            console.log("board empty et mot pas au milieu");
            isWordFit = false;
        }

        for (let index = 0; index < request._letters.length && isWordFit; index++) {
            let rowIndex = firstRowIndex + index;
            if (!BoardHelper.isValidRowPosition(rowIndex + LetterHelper.LETTER_A_KEY_CODE)) {
                console.log("position row not valid   ", rowIndex);

                isWordFit = false;
            }

            // get the next square object
            let nextSquare = this._board.squares[rowIndex][columnIndex];
            let letterToBePlaced = request._letters[index];

            console.log("is quare busy -- ", nextSquare.isBusy);
            // Check if the square already contains a letter or not
            if (!nextSquare.isBusy) {

                // If the letter to be placed is not in the player easel
                // we have an invalid word
                console.log("easel contient lettre -- ", easel.containsLetter(letterToBePlaced));
                if (!easel.containsLetter(letterToBePlaced)) {
                    console.log("ne contient pas");
                    isWordFit = false;
                }
                else {
                    console.log("contient et remove it");

                    easel.removeLetter(letterToBePlaced.alphabetLetter);
                }
            }
            // If we find an existing letter in the square that does not match the current one
            else if (nextSquare.letter.alphabetLetter !== letterToBePlaced.alphabetLetter) {
                isWordFit = false;
            }

            console.log("isWordFit --- ", isWordFit);
        }

        // Check if we have touched at least one existing letter in the board
        let hasTouchedLetterInTheBoard = false;
        if (isWordFit && !this._board.isEmpty) {
            hasTouchedLetterInTheBoard = this.hasTouchedAletterVerticallyInTheBoard(
                firstRowIndex, columnIndex, request._letters);
        }

        return (isWordFit && (this._board.isEmpty || hasTouchedLetterInTheBoard));
    }

    private isFirstVerticalWordCrossedMiddle(firstRow: number, column: number, wordLength: number): boolean {
        if (column === this.CENTER_COLUMN
            && (firstRow === this.CENTER_ROW
                || (firstRow < this.CENTER_ROW && firstRow + wordLength >= this.CENTER_ROW))) {
            return true;
        }
        else {
            return false;
        }
    }

    private hasTouchedAletterVerticallyInTheBoard(
        firstRowNumber: number,
        columnIndex: number,
        letters: Array<Letter>): boolean {

        let touchedLeftOrRightLetter = this.hasTouchedLetterOnLeftOrRightVertically(
            firstRowNumber, columnIndex, letters);

        let touchedBeforeOrAfterWord = this.hasTouchedALetterBeforeOrAfterWord(
            firstRowNumber, columnIndex, letters.length);

        return touchedLeftOrRightLetter || touchedBeforeOrAfterWord;
    }

    private hasTouchedLetterOnLeftOrRightVertically(
        firstRowNumber: number,
        columnIndex: number,
        letters: Array<Letter>): boolean {

        let touchedLeftOrRightSquare = false;

        for (let index = 0; index < letters.length && !touchedLeftOrRightSquare; index++) {
            // Calculate and find the next values for the placement
            let nextRowIndex = firstRowNumber + index;

            let nextSquareRow = nextRowIndex - LetterHelper.LETTER_A_KEY_CODE;

            let touchedLeftSquare = (BoardHelper.isValidColumnPosition(columnIndex - 1)) ?
                this._board.squares[nextSquareRow][columnIndex - 1].isBusy : false;
            let touchedRightSquare = (BoardHelper.isValidColumnPosition(columnIndex + 1)) ?
                this._board.squares[nextSquareRow][columnIndex + 1].isBusy : false;

            touchedLeftOrRightSquare = touchedLeftSquare || touchedRightSquare;
        }

        return touchedLeftOrRightSquare;
    }

    private hasTouchedALetterBeforeOrAfterWord(
        firstRowNumber: number,
        columnIndex: number,
        wordLength: number): boolean {

        let touchedBeforeOrAfterWord = false;

        // Calculate and find the next values for the placement
        let beforeWordRowIndex = firstRowNumber - 1;

        let afterWordRowIndex = firstRowNumber + wordLength;

        let touchedBeforeWord = (BoardHelper.isValidColumnPosition(columnIndex - 1)
            && BoardHelper.isValidRowPosition(beforeWordRowIndex)) ?
            this._board.squares[beforeWordRowIndex - LetterHelper.LETTER_A_KEY_CODE][columnIndex - 1]
                .isBusy : false;

        let touchedAfterWord = (BoardHelper.isValidColumnPosition(columnIndex - 1)
            && BoardHelper.isValidRowPosition(afterWordRowIndex)) ?
            this._board.squares[afterWordRowIndex - LetterHelper.LETTER_A_KEY_CODE][columnIndex - 1]
                .isBusy : false;

        touchedBeforeOrAfterWord = touchedBeforeWord || touchedAfterWord;
        return touchedBeforeOrAfterWord;
    }
}
