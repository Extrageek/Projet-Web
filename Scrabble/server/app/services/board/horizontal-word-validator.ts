
import { ExceptionHelper } from "../commons/exception-helper";
import { WordDirection } from "../commons/word-direction";
import { CommandsHelper } from '../commons/command/command-helper';
import { Letter } from "../../models/letter";
import { Easel } from "../../models/easel";
import { LetterHelper } from "../../models/commons/letter-helper";
import { SquareType } from "../../models/square/square-type";
import { Player } from "../../models/player";
import { Board } from '../../models/board/board';
import { BoardHelper } from './board-helper';
import { IValidationRequest } from './validation-request.interface';

export class HorizontalWordValidator {
    private _player: Player;
    private _board: Board;
    readonly CENTER_ROW = 7;
    readonly CENTER_COLUMN = 7;

    constructor() {
        // Constructor
    }

    public matchHorizontalPlacementRules(request: IValidationRequest, board: Board): boolean {
        this._board = board;
        this._player = request._player;
        console.log(this._player.username);

        let easel = new Easel(this._player.easel.letters);
        let isWordFit = true;
        let rowIndex = request._firstRowNumber - LetterHelper.LETTER_A_KEY_CODE;
        let columnIndex = request._columnIndex - 1;
        let wordLength = request._letters.length;

        if (this._board.isEmpty
            && !this.isFirstHorizontalWordCrossedMiddle(rowIndex, columnIndex, wordLength)) {
            console.log("board empty et mot pas au milieu");
            isWordFit = false;
        }

        for (let index = 0; index < wordLength && isWordFit; index++) {

            // Calculate and find the next values for the placement
            columnIndex = request._columnIndex - 1 + index;

            let letterToBePlaced = request._letters[index];

            if (!BoardHelper.isValidColumnPosition(columnIndex)) {
                isWordFit = false;
            }

            // get the next square object
            let nextSquare = this._board.squares[rowIndex][columnIndex];

            console.log("is square busy -- ", nextSquare.isBusy);
            // Check if the square already contains a letter or not
            if (!nextSquare.isBusy) {

                // If the letter to be placed is not in the player easel
                // we have an invalid word
                console.log("easel contient lettre -- ", easel.containsLetter(letterToBePlaced));
                if (!easel.containsLetter(letterToBePlaced)) {
                    isWordFit = false;
                }
                else {
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
            hasTouchedLetterInTheBoard = this.hasTouchedAletterInTheBoard(
                rowIndex, request._columnIndex - 1, request._letters);
        }

        return (isWordFit && (this._board.isEmpty || hasTouchedLetterInTheBoard));
    }

    private hasTouchedAletterInTheBoard(rowIndex: number, columnIndex: number, letters: Array<Letter>): boolean {
        let touchedAboveOrBelowLetter = this.hasTouchedLetterAboveBelow(rowIndex, columnIndex, letters);
        let touchedBeforeOrAfterWord = this.hasTouchedALetterBeforeOrAfterWord(rowIndex, columnIndex, letters.length);

        return touchedAboveOrBelowLetter || touchedBeforeOrAfterWord;
    }

    private hasTouchedLetterAboveBelow(rowIndex: number, firstColumnIndex: number, letters: Array<Letter>): boolean {
        let touchedAboveOrBelowSquare = false;
        let aboveSquareRowIndex = rowIndex - 1;
        let belowSquareRowIndex = rowIndex + 1;

        for (let index = 0; index < letters.length && !touchedAboveOrBelowSquare; index++) {
            // Calculate and find the next values for the placement
            let columnIndex = firstColumnIndex + index;

            let touchedAboveSquare = (BoardHelper.isValidRowPosition(aboveSquareRowIndex)) ?
                this._board.squares[aboveSquareRowIndex][columnIndex].isBusy : false;
            let touchedBelowSquare = (BoardHelper.isValidRowPosition(belowSquareRowIndex)) ?
                this._board.squares[belowSquareRowIndex][columnIndex].isBusy : false;

            touchedAboveOrBelowSquare = touchedAboveSquare || touchedBelowSquare;
        }

        return touchedAboveOrBelowSquare;
    }

    private hasTouchedALetterBeforeOrAfterWord(rowIndex: number, columnIndex: number, wordLength: number): boolean {
        // Calculate and find the next values for the placement
        let beforeWordColumnIndex = columnIndex - 1;
        console.log("beforeWordColumnIndex ", beforeWordColumnIndex);

        let afterWordColumnIndex = columnIndex + wordLength;
        console.log("afterWordColumnIndex ", afterWordColumnIndex);

        console.log("row ", rowIndex);

        if (BoardHelper.isValidRowPosition(rowIndex)) {
            return false;
        }

        let touchedBeforeWord = BoardHelper.isValidColumnPosition(beforeWordColumnIndex) ?
            this._board.squares[rowIndex][beforeWordColumnIndex].isBusy : false;
        console.log(touchedBeforeWord);

        let touchedAfterWord = BoardHelper.isValidColumnPosition(afterWordColumnIndex) ?
            this._board.squares[rowIndex][afterWordColumnIndex].isBusy : false;
        console.log(touchedAfterWord);
        return touchedBeforeWord || touchedAfterWord;
    }

    private isFirstHorizontalWordCrossedMiddle(row: number, firstColumn: number, wordLength: number): boolean {
        if (row === this.CENTER_ROW
            && (firstColumn === this.CENTER_COLUMN
                || (firstColumn < this.CENTER_COLUMN && firstColumn + wordLength >= this.CENTER_COLUMN))) {
            return true;
        }
        else {
            return false;
        }
    }
}
