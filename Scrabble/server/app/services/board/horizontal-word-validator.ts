
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
        let rowIndex = request._firstRowNumber;
        let columnIndex = request._columnIndex;
        let wordLength = request._letters.length;

        if (this._board.isEmpty
            && !this.isFirstHorizontalWordCrossedMiddle(rowIndex, columnIndex, wordLength)) {
            console.log("board empty et mot pas au milieu");
            isWordFit = false;
        }

        for (let index = 0; index < wordLength && isWordFit; index++) {

            // Calculate and find the next values for the placement
            let nextColumnIndex = columnIndex + index;

            let letterToBePlaced = request._letters[index];

            if (!BoardHelper.isValidColumnPosition(nextColumnIndex)) {
                isWordFit = false;
            }

            // get the next square object
            let nextSquare = this._board.squares[rowIndex][nextColumnIndex];

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
        console.log("BOARD EMPTY ------------------------- ", this._board.isEmpty);

        if (isWordFit && !this._board.isEmpty) {
            hasTouchedLetterInTheBoard = this.hasTouchedLetterOnBoard(
                rowIndex, columnIndex, request._letters.length);
        }
        console.log("HAS TOUCHED LETTERS ---", hasTouchedLetterInTheBoard);
        return (isWordFit && (this._board.isEmpty || hasTouchedLetterInTheBoard));
    }

    private hasTouchedLetterOnBoard(rowIndex: number, firstColumnIndex: number, wordLength: number): boolean {
        let aboveSquareRowIndex = rowIndex - 1;
        let belowSquareRowIndex = rowIndex + 1;
        let hasTouchedFirstSquareOnLeft = (BoardHelper.isValidColumnPosition(firstColumnIndex - 1)) ?
            this._board.squares[rowIndex][firstColumnIndex - 1].isBusy : false;
        if (hasTouchedFirstSquareOnLeft) {
            return true;
        }

        for (let index = 0; index < wordLength; index++) {
            // Calculate and find the next values for the placement
            let columnIndex = firstColumnIndex + index;

            let touchedAboveSquare = (BoardHelper.isValidRowPosition(aboveSquareRowIndex)) ?
                this._board.squares[aboveSquareRowIndex][columnIndex].isBusy : false;
            let touchedBelowSquare = (BoardHelper.isValidRowPosition(belowSquareRowIndex)) ?
                this._board.squares[belowSquareRowIndex][columnIndex].isBusy : false;
            let touchedNextSquareOnRight = (BoardHelper.isValidColumnPosition(columnIndex + 1)) ?
                this._board.squares[rowIndex][columnIndex + 1].isBusy : false;
            console.log("touched above ", touchedAboveSquare);
            console.log("touched below ", touchedBelowSquare);
            console.log("touched right ", touchedNextSquareOnRight);
            if (touchedAboveSquare || touchedBelowSquare || touchedNextSquareOnRight) {
                return true;
            }
        }

        return false;
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