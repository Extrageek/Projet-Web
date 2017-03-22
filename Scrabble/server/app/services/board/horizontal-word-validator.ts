
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

export class HorizontalWordValidator {
    private _player: Player;
    private _board: Board;

    constructor() {
        // Constructor
    }

    public matchHorizontalPlacementRules(request: IValidationRequest): boolean {

        let squaresAreAvailable = true;
        let centralSquareStartExist = false;
        this._board = request._board;
        this._player = request._player;

        for (let index = 0; index < request._letters.length && squaresAreAvailable; ++index) {

            // Calculate and find the next values for the placement
            let nextRowIndex = (request._wordDirection === WordDirection.UP) ?
                request._firstRowNumber - index :
                request._firstRowNumber + index;

            if (!BoardHelper.isValidRowPosition(nextRowIndex)) {
                return false;
            }

            let nextRowLetter = BoardHelper.parseFromNumberToCharacter(nextRowIndex);
            let nextSquareRow = nextRowIndex - LetterHelper.LETTER_A_KEY_CODE;
            // get the next square object
            let nextSquare = this._board.squares[nextSquareRow][request._columnIndex - 1];

            // Check if the square already contains a letter or not
            if (!nextSquare.isBusy) {

                // Check if it's a Star square (the middle of the board)
                if (nextSquare.type === SquareType.STAR) {
                    centralSquareStartExist = true;
                }

                // If the letter to be placed is not in the player easel
                // we have an invalid word
                // let isLetterInTheEasel = this._player.easelHasLetter(nextSquare.letter);
                let isLetterInTheEasel = true;
                if (isLetterInTheEasel) {
                    squaresAreAvailable = true;
                } else {
                    squaresAreAvailable = false;
                }
                // If we find an existing letter in the square that does not match the current one
            } else if (nextSquare.letter.alphabetLetter !== request._letters[index].alphabetLetter) {
                squaresAreAvailable = false;
            }
        }
        // Check if we have touched at least one existing letter in the board
        let hasTouchedLetterInTheBoard = this.hasTouchedAletterHorizontallyInTheBoard(
            request._firstRowNumber, request._columnIndex,
            request._letters, request._wordDirection);

        return (this._board.isEmpty) ?
            (squaresAreAvailable && centralSquareStartExist)
            : (squaresAreAvailable && hasTouchedLetterInTheBoard);
    }

    private hasTouchedAletterHorizontallyInTheBoard(
        firstRowNumber: number,
        columnIndex: number,
        letters: Array<Letter>,
        wordDirection: WordDirection): boolean {

        let touchedLeftOrRightSquare = this.hasTouchedLeftOrRightLetterHorizontalWord(
            firstRowNumber, columnIndex,
            letters, wordDirection);

        let touchedBeforeOrAfterWord = this.hasTouchedBeforeOrAfterWord(
            firstRowNumber, columnIndex,
            letters, wordDirection);

        return touchedLeftOrRightSquare || touchedBeforeOrAfterWord;
    }

    private hasTouchedLeftOrRightLetterHorizontalWord(
        firstRowNumber: number,
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

            if (!BoardHelper.isValidRowPosition(nextRowIndex)) {
                return false;
            }

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

    private hasTouchedBeforeOrAfterWord(
        firstRowNumber: number,
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

        let touchedBeforeWord = (BoardHelper.isValidColumnPosition(columnIndex - 1)) ?
            (BoardHelper.isValidRowPosition(beforeWordRowIndex) ?
                this._board.squares[beforeWordRowIndex - LetterHelper.LETTER_A_KEY_CODE][columnIndex - 1]
                    .isBusy : false)
            : false;

        let touchedAfterWord = (BoardHelper.isValidColumnPosition(columnIndex - 1)) ?
            (BoardHelper.isValidRowPosition(afterWordRowIndex) ?
                this._board.squares[afterWordRowIndex - LetterHelper.LETTER_A_KEY_CODE][columnIndex - 1]
                    .isBusy : false)
            : false;

        touchedBeforeOrAfterWord = touchedBeforeWord || touchedAfterWord;
        return touchedBeforeOrAfterWord;
    }
}