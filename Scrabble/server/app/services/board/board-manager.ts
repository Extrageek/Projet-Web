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
import { HorizontalWordValidator } from './horizontal-word-validator';

import { IValidationRequest } from './validation-request.interface';

export class BoardManager {
    private _letterBankHandler: LetterBankHandler;
    private _verticalWordValidator: VerticalWordValidator;
    private _horizontalWordValidator: HorizontalWordValidator;

    private _player: Player;
    private _board: Board;

    constructor() {
        this._letterBankHandler = new LetterBankHandler();
        this._verticalWordValidator = new VerticalWordValidator();
        this._horizontalWordValidator = new HorizontalWordValidator();
    }

    public get player(): Player {
        return this._player;
    }
    public set player(v: Player) {
        this._player = v;
    }

    public placeWordInBoard(
        response: IPlaceWordResponse,
        board: Board,
        player: Player): boolean {

        this._board = board;
        this._player = player;

        let firstRowIndex = BoardHelper.convertCharToIndex(response._squarePosition._row);
        let firstColumnIndex = response._squarePosition._column - 1;
        let letters = response._letters;
        let scrabbleLetters = this._letterBankHandler.parseFromListOfStringToListOfLetter(letters);

        ExceptionHelper.throwNullArgumentException(firstRowIndex);
        ExceptionHelper.throwNullArgumentException(firstColumnIndex);
        ExceptionHelper.throwNullArgumentException(scrabbleLetters);

        let isPlaced = false;
        if (response._wordOrientation === CommandsHelper.HORIZONTAL_ORIENTATION) {
            isPlaced = this.placeWordInHorizontalOrientation(
                firstRowIndex, firstColumnIndex, scrabbleLetters);

        } else if (response._wordOrientation === CommandsHelper.VERTICAL_ORIENTATION) {
            isPlaced = this.placeWordInVerticalOrientation(
                firstRowIndex, firstColumnIndex, scrabbleLetters);
        }

        if (isPlaced) {
            this._board.isEmpty = false;
        }

        return isPlaced;
    }

    private placeWordInHorizontalOrientation(
        firstRowIndex: number,
        columnIndex: number,
        letters: Array<Letter>): boolean {

        let request: IValidationRequest = {
            _firstRowNumber: firstRowIndex,
            _columnIndex: columnIndex,
            _letters: letters,
            _player: this._player
        };

        if (!this._horizontalWordValidator.matchHorizontalPlacementRules(request, this._board)) {
            return false;
        }

        for (let index = 0; index < letters.length; index++) {
            let nextColumnIndex = columnIndex + index;
            console.log(nextColumnIndex);

            // Get the row number from the given letter
            let currentSquare = this._board.squares[firstRowIndex][nextColumnIndex];

            if (!currentSquare.isBusy) {
                this._board.squares[firstRowIndex][nextColumnIndex].squareValue =
                    letters[index].alphabetLetter;
                this._board.squares[firstRowIndex][nextColumnIndex].isBusy = true;
                this._player.easel.removeLetter(letters[index].alphabetLetter);
            }
        }

        return true;
    }

    private placeWordInVerticalOrientation(
        firstRowIndex: number,
        columnIndex: number,
        letters: Array<Letter>): boolean {

        let request: IValidationRequest = {
            _firstRowNumber: firstRowIndex,
            _columnIndex: columnIndex,
            _letters: letters,
            _player: this._player
        };

        if (!this._verticalWordValidator.matchVerticalPlacementRules(request, this._board)) {
            return false;
        }

        for (let index = 0; index < letters.length; index++) {
            let nextRowIndex = firstRowIndex + index;
            let nextSquare = this._board.squares[nextRowIndex][columnIndex];

            if (!nextSquare.isBusy) {
                this._board.squares[nextRowIndex][columnIndex].squareValue =
                    letters[index].alphabetLetter;
                this._board.squares[nextRowIndex][columnIndex].isBusy = true;
                this._player.easel.removeLetter(letters[index].alphabetLetter);
            }
        }
        return true;
    }
}
