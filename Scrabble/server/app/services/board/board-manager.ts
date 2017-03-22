import { CommandsHelper } from "../commons/command/command-helper";
import { ExceptionHelper } from "../commons/exception-helper";
import { BoardHelper } from "./board-helper";
import { WordDirection } from "../commons/word-direction";
import { LetterHelper } from "../../models/commons/letter-helper";

import { Player } from "../../models/player";
import { Board } from '../../models/board/board';
import { Letter } from "../../models/letter";
import { SquareType } from "../../models/square/square-type";
import { IPlaceWordResponse } from "../commons/command/place-word-response.interface";
import { LetterBankHandler } from '../letterbank-handler';
import { VerticalWordValidator } from './vertical-word-validator';
// import { HorizontalWordValidator } from './horizontal-word-validator';

import { IValidationRequest } from './validation-request.interface';

export class BoardManager {
    private _letterBankHandler: LetterBankHandler;
    private _verticalWordValidator: VerticalWordValidator;
    // private _horizontalWordValidator: HorizontalWordValidator;
    private _player: Player;
    private _board: Board;

    constructor() {
        this._letterBankHandler = new LetterBankHandler();
        this._verticalWordValidator = new VerticalWordValidator();
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

        ExceptionHelper.throwNullArgumentException(firstRowIndex);
        ExceptionHelper.throwNullArgumentException(firstColumnIndex);
        ExceptionHelper.throwNullArgumentException(scrabbleLetters);

        let isPlaced = false;
        if (orientation === CommandsHelper.HORIZONTAL_ORIENTATION) {
            // let placedRight = this.placeLetterInHorizontalOrientation(
            //     firstRowIndex, firstColumnIndex, scrabbleLetters, WordDirection.RIGHT);

            // isPlaced = (placedRight) ? placedRight : this.placeLetterInHorizontalOrientation(
            //     firstRowIndex, firstColumnIndex, scrabbleLetters, WordDirection.LEFT);

        } else if (orientation === CommandsHelper.VERTICAL_ORIENTATION) {

            let placedDown = this.placeLetterInVerticalOrientation(
                firstRowIndex, firstColumnIndex, scrabbleLetters, WordDirection.DOWN);

            isPlaced = (placedDown) ? placedDown : this.placeLetterInVerticalOrientation(
                firstRowIndex, firstColumnIndex, scrabbleLetters, WordDirection.UP);
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
        if (!BoardHelper.isValidColumnPosition(lastLetterColumnPosition)) {
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
        let request: IValidationRequest = {
            _firstRowNumber: firstRowNumber,
            _columnIndex: columnIndex,
            _letters: letters,
            _player: this._player,
            _wordDirection: wordDirection
        }

        if (!this._verticalWordValidator.matchVerticalPlacementRules(request, this._board)) {
            return false;
        }

        for (let index = 0; index < letters.length; ++index) {

            let nextRowIndex = (wordDirection === WordDirection.UP) ?
                firstRowNumber - index :
                firstRowNumber + index;

            // Get the row number from the given letter
            let nextRowLetter = BoardHelper.parseFromNumberToCharacter(nextRowIndex);
            let nextSquareRow = nextRowIndex - LetterHelper.LETTER_A_KEY_CODE;
            let nextSquare = this._board.squares[nextSquareRow][columnIndex - 1];

            if (!nextSquare.isBusy) {
                this._board.squares[nextSquareRow][columnIndex - 1].isBusy = true;
                this._board.squares[nextSquareRow][columnIndex - 1].squareValue =
                    letters[index].alphabetLetter;
            }
        }

        return true;
    }
}
