
import { ExceptionHelper } from "../commons/exception-helper";
import { WordDirection } from "../commons/word-direction";
import { CommandsHelper } from '../commons/command/command-helper';
import { Letter } from "../../models/letter";
import { LetterHelper } from "../../models/commons/letter-helper";
import { SquareType } from "../../models/square/square-type";
import { Player } from "../../models/player";
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

        let squaresAreAvailable = true;
        let easel = this._player.easel;
        let isWordFit = true;

        if (this._board.isEmpty
            && this.isFirstVerticalWordCrossedMiddle(
                request._firstRowNumber,
                request._columnIndex - 1,
                request._letters.length)) {
            console.log("board empty et mot pas au milieu");
            isWordFit = false;
        }

        for (let index = 0; index < request._letters.length && isWordFit; ++index) {

            // Calculate and find the next values for the placement
            let nextRowIndex = request._firstRowNumber + index;
            let nextLetterToBePlaced = request._letters[index];

            if (!BoardHelper.isValidRowPosition(nextRowIndex)) {
                isWordFit = false;
            }

            let nextRowLetter = BoardHelper.parseFromNumberToCharacter(nextRowIndex);
            let nextSquareRow = nextRowIndex - LetterHelper.LETTER_A_KEY_CODE;
            // get the next square object
            let nextSquare = this._board.squares[nextSquareRow][request._columnIndex - 1];

            console.log("is quare busy -- ", nextSquare.isBusy);
            // Check if the square already contains a letter or not
            if (!nextSquare.isBusy) {

                // If the letter to be placed is not in the player easel
                // we have an invalid word
                console.log("easel contient lettre -- ", easel.containsLetter(nextLetterToBePlaced));
                if (!easel.containsLetter(nextLetterToBePlaced)) {
                    isWordFit = false;
                }
                else {
                    easel.letters.splice(easel.letters.indexOf(nextLetterToBePlaced, 0), 1);
                }
            }
            // If we find an existing letter in the square that does not match the current one
            else if (nextSquare.letter.alphabetLetter !== nextLetterToBePlaced.alphabetLetter) {
                isWordFit = false;
            }

            console.log("isWordFit --- ", isWordFit);
        }

        // Check if we have touched at least one existing letter in the board
        let hasTouchedLetterInTheBoard = false;
        if (isWordFit && !this._board.isEmpty) {
            hasTouchedLetterInTheBoard = this.hasTouchedAletterVerticallyInTheBoard(
                request._firstRowNumber, request._columnIndex, request._letters);
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
            firstRowNumber, columnIndex, letters);

        return touchedLeftOrRightLetter || touchedBeforeOrAfterWord;
    }

    private hasTouchedLetterOnLeftOrRightVertically(
        firstRowNumber: number,
        columnIndex: number,
        letters: Array<Letter>): boolean {

        let touchedLeftOrRightSquare = false;
        let leftSquareOffset = 2;

        for (let index = 0; index < letters.length && !touchedLeftOrRightSquare; ++index) {
            // Calculate and find the next values for the placement
            let nextRowIndex = firstRowNumber + index;

            let nextRowLetter = BoardHelper.parseFromNumberToCharacter(nextRowIndex);
            let nextSquareRow = nextRowIndex - LetterHelper.LETTER_A_KEY_CODE;

            let touchedLeftSquare = (BoardHelper.isValidColumnPosition(columnIndex - leftSquareOffset)) ?
                this._board.squares[nextSquareRow][columnIndex - leftSquareOffset].isBusy : false;
            let touchedRightSquare = (BoardHelper.isValidColumnPosition(columnIndex)) ?
                this._board.squares[nextSquareRow][columnIndex].isBusy : false;

            touchedLeftOrRightSquare = touchedLeftSquare || touchedRightSquare;
        }

        return touchedLeftOrRightSquare;
    }

    private hasTouchedALetterBeforeOrAfterWord(
        firstRowNumber: number,
        columnIndex: number,
        letters: Array<Letter>): boolean {

        let touchedBeforeOrAfterWord = false;
        let firstSquareOffset = 1;
        let lastSquareOffset = letters.length;

        // Calculate and find the next values for the placement
        let beforeWordRowIndex = firstRowNumber - firstSquareOffset;

        let afterWordRowIndex = firstRowNumber + lastSquareOffset;

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
