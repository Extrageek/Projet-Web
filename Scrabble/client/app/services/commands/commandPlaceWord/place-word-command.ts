import { EaselComponent } from "../../../components/easel.component";
import { EaselManagerService } from "../../easel/easel-manager.service";
import { ScrabbleLetter } from "../../../models/letter/scrabble-letter";
import { SquarePosition } from "../../../models/square/square-position";
import { BoardColumn } from "../../../models/board/board-column";
import { BoardComponent } from "../../../components/board.component";
import { LetterHelper } from "../../../commons/letter-helper";
import { ICommand } from "../commandInterface/command.interface";
import { ICommandRequest } from "./../commons/command-request";
import { CommandStatus } from './../commons/command-status';
import { CommandType } from './../commons/command-type';
import { CommandsHelper } from "./../commons/commands-helper";
import { IPlaceWordResponse } from "./place-command-response.interface";
import { WordOrientation } from "./word-orientation";

export class PlaceWordCommand implements ICommand {

    private _easelManagerService: EaselManagerService;
    private _commandRequest: ICommandRequest<IPlaceWordResponse>;
    private _parameters: string;

    public get commandRequest(): ICommandRequest<IPlaceWordResponse> {
        return this._commandRequest;
    }
    public get parameters(): string {
        return this._parameters;
    }

    constructor(
        private easelComponent: EaselComponent,
        private boardComponent: BoardComponent,
        params: string) {

        this.throwsErrorIfParameterIsNull(easelComponent);
        this.throwsErrorIfParameterIsNull(boardComponent);
        this.throwsErrorIfParameterIsNull(params);

        this._parameters = params;
        this._commandRequest = {
            _commandType: CommandType.PlaceCmd,
            _commandStatus: CommandStatus.Unknown,
            _response: {
                _squarePosition: new SquarePosition("", BoardColumn.INIT_COLUMN),
                _wordOrientation: "",
                _letters: new Array<string>()
            }
        };

        this._easelManagerService = new EaselManagerService();
    }

    public execute() {

        let lettersInEasel = this.easelComponent.letters;
        let commandRequest = this.createPlaceWordRequest(lettersInEasel);
        this.boardComponent.placeWordInBoard(commandRequest);
    }

    public createPlaceWordRequest(lettersInEasel: Array<ScrabbleLetter>)
        : ICommandRequest<IPlaceWordResponse> {

        this.throwsErrorIfParameterIsNull(lettersInEasel);

        // get the differents sections of the request
        let requestElement = this._parameters.split(' ');

        // Get the position of the word to be placed
        let position = requestElement[CommandsHelper.FIRST_INDEX].split('');
        let enteredWord = requestElement[CommandsHelper.SECOND_INDEX];
        let wordToBePlaced = this.extractWordLettersFromEnteredString(enteredWord);

        let wordPosition = this.extractWordPosition(position);

        if (this._parameters === null
            || this._parameters === ""
            || this.parameters === undefined
            || wordPosition === null
            || !this.isScrabbleLetters(wordToBePlaced)) {
            this.commandRequest._commandStatus = CommandStatus.SynthaxeError;
            return this.commandRequest;
        }

        // wordFromEasel = this._easelManagerService.getScrabbleWordFromTheEasel(lettersInEasel, wordToBePlaced);

        this.commandRequest._commandStatus = CommandStatus.Ok;
        this.commandRequest._response = {
            _squarePosition: wordPosition.squarePosition,
            _wordOrientation: wordPosition.orientation,
            _letters: wordToBePlaced
        };

        return this.commandRequest;
    }

    private extractWordPosition(wordPosition: Array<string>):
        { squarePosition: SquarePosition, orientation: string } {
        // if (wordPosition.length < CommandsHelper.MIN_POSITION_VALUE
        //     || wordPosition.length > CommandsHelper.MAX_POSITION_VALUE) {
        //     return false;
        // }
        // Get the position of the word to be placed
        let rowIndex = wordPosition[CommandsHelper.FIRST_INDEX];
        let colIndex = Number(wordPosition[CommandsHelper.SECOND_INDEX]);

        // console.log(rowIndex, colIndex);
        if (wordPosition.length === CommandsHelper.MAX_POSITION_VALUE) {
            colIndex = Number(
                [wordPosition[CommandsHelper.SECOND_INDEX],
                wordPosition[CommandsHelper.THIRD_INDEX]].join('')
            );
        }

        let wordOrientation = wordPosition[wordPosition.length - 1];

        if (!(this.isValidRowPosition(rowIndex)
            && this.isValidColumnPosition(colIndex)
            && this.isValidOrientation(wordOrientation))) {
            return null;
        } else {
            let squarePosition = new SquarePosition(rowIndex, colIndex);
            return { squarePosition: squarePosition, orientation: wordOrientation };
        }
    }

    public isScrabbleLetters(enteredLetters: Array<string>): boolean {
        let notScrabbleLetters = new Array<string>();

        if (enteredLetters.length === 0) {
            return false;
        }

        notScrabbleLetters = enteredLetters.filter((value) => {
            return !(LetterHelper.LETTER_A_KEY_CODE <= value.charCodeAt(0)
                && value.charCodeAt(0) <= LetterHelper.LETTER_Z_KEY_CODE)
                && value !== CommandsHelper.BLANK_VALUE;
        });
        return (notScrabbleLetters.length === 0);
    }

    private extractWordLettersFromEnteredString(enteredWord: string): Array<string> {
        let wordToBePlaced: Array<string>;
        if (enteredWord !== undefined) {
            wordToBePlaced = this._easelManagerService.parseStringToListofChar(enteredWord);
            wordToBePlaced.forEach((letter) => {
                if (letter === CommandsHelper.BLANK_VALUE) {
                    letter = CommandsHelper.BLANK_WORD;
                }
            });
            return wordToBePlaced;
        }
    }

    public isValidRowPosition(letter: string): boolean {
        this.throwsErrorIfParameterIsEmpty(letter);
        let keyCode = letter.toUpperCase().charCodeAt(0);
        return keyCode >= LetterHelper.LETTER_A_KEY_CODE
            && keyCode <= LetterHelper.LETTER_O_KEY_CODE;
    }

    public isValidColumnPosition(index: number): boolean {
        this.throwsErrorIfParameterIsEmpty(index);
        return index !== 0 && !isNaN(Number(index))
            && index >= CommandsHelper.MIN_BOARD_POSITION_INDEX
            && index <= CommandsHelper.MAX_BOARD_POSITION_INDEX;
    }

    public isValidOrientation(orientation: string): boolean {
        this.throwsErrorIfParameterIsEmpty(orientation);
        return orientation === CommandsHelper.VERTICAL_ORIENTATION
            || orientation === CommandsHelper.HORIZONTAL_ORIENTATION;
    }

    private throwsErrorIfParameterIsNull(parameter: any) {
        if (parameter === null) {
            throw new Error("Null argument error: the parameters cannot be null");
        }
    }

    private throwsErrorIfParameterIsEmpty(parameter: any) {
        if (parameter === "") {
            throw new Error("Null argument error: the parameters cannot be empty");
        }
    }
}
