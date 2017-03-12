import { EaselComponent } from "../../components/easel.component";
import { EaselManagerService } from "../easel/easel-manager.service";
import { ScrabbleLetter } from "../../models/letter/scrabble-letter";
import { BoardComponent } from "../../components/board.component";
import { EaselControl } from "../../commons/easel-control";
import { ICommand } from "./command.interface";
import { ICommandRequest } from "./commons/command-request";
import { CommandStatus } from './commons/command-status';
import { CommandType } from './commons/command-type';
import { CommandsHelper } from "./commons/commands-helper";

export class PlaceWordCommand implements ICommand {

    private _easelManagerService: EaselManagerService;
    private _commandRequest: ICommandRequest<Array<ScrabbleLetter>>;
    private _parameters: string;

    public get commandRequest(): ICommandRequest<Array<ScrabbleLetter>> {
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
            _response: new Array<ScrabbleLetter>()
        };

        this._easelManagerService = new EaselManagerService();
    }

    public execute() {
        let lettersInEasel = this.easelComponent.letters;
        let commandRequest = this.createPlaceWordRequest(lettersInEasel);
        this.boardComponent.placeWordInBoard(commandRequest);
    }

    public createPlaceWordRequest(lettersInEasel: Array<ScrabbleLetter>)
        : ICommandRequest<Array<ScrabbleLetter>> {

        this.throwsErrorIfParameterIsNull(lettersInEasel);

        // get the differents sections of the request
        let requestElement = this._parameters.split(' ');

        // Get the position of the word to be placed
        let wordPosition = requestElement[CommandsHelper.FIRST_INDEX].split('');
        let enteredWord = requestElement[CommandsHelper.SECOND_INDEX];
        let wordToBePlaced = this.getPlacedWordCommandParameters(enteredWord);

        if (this._parameters === null
            || this._parameters === ""
            || this.parameters === undefined
            || !this.isValidPosition(wordPosition)
            || !this.isScrabbleLetters(wordToBePlaced)) {
            this.commandRequest._commandStatus = CommandStatus.SynthaxeError;
            return this.commandRequest;
        }

        // Get the word to be placed from the easel;
        let wordFromEasel = new Array<ScrabbleLetter>();
        wordFromEasel = this._easelManagerService.getScrabbleWordFromTheEasel(lettersInEasel, wordToBePlaced);

        // Check if the word to be placed exist in the current state of the easel
        if (wordFromEasel === null) {
            this.commandRequest._commandStatus = CommandStatus.NotAllowed;

        } else {
            this.commandRequest._commandStatus = CommandStatus.Ok;
            this.commandRequest._response = wordFromEasel
        };

        return this.commandRequest;
    }

    private isValidPosition(wordPosition: Array<string>): boolean {
        // if (wordPosition.length < CommandsHelper.MIN_POSITION_VALUE
        //     || wordPosition.length > CommandsHelper.MAX_POSITION_VALUE) {
        //     return false;
        // }
        // Get the position of the word to be placed
        let rowIndex = wordPosition[CommandsHelper.FIRST_INDEX];
        let colIndex = Number(wordPosition[CommandsHelper.SECOND_INDEX]);

        console.log(rowIndex, colIndex);
        if (wordPosition.length === CommandsHelper.MAX_POSITION_VALUE) {
            colIndex = Number(
                [wordPosition[CommandsHelper.SECOND_INDEX], wordPosition[CommandsHelper.THIRD_INDEX]].join('')
            );
        }

        let wordOrientation = wordPosition[wordPosition.length - 1];

        return (this.isValidRowPosition(rowIndex)
            && this.isValidColumnPosition(colIndex)
            && this.isValidOrientation(wordOrientation));
    }

    private isValidRowPosition(letter: string): boolean {
        this.throwsErrorIfParameterIsNull(letter);
        let keyCode = letter.toUpperCase().charCodeAt(0);
        return keyCode >= EaselControl.letterAKeyCode
            && keyCode <= EaselControl.letterOKeyCode;
    }

    private isValidColumnPosition(index: number): boolean {
        this.throwsErrorIfParameterIsNull(index);
        return index !== 0 && !isNaN(Number(index))
            && index >= CommandsHelper.MIN_BOARD_POSITION_INDEX
            && index <= CommandsHelper.MAX_BOARD_POSITION_INDEX;
    }

    private isValidOrientation(orientation: string): boolean {
        //console.log("-", orientation);
        this.throwsErrorIfParameterIsNull(orientation);
        return orientation === CommandsHelper.VERTICAL_ORIENTATION
            || orientation === CommandsHelper.HORIZONTAL_ORIENTATION;
    }

    public isScrabbleLetters(enteredLetters: Array<string>): boolean {
        let notScrabbleLetters = new Array<string>();

        if (enteredLetters.length === 0) {
            return false;
        }

        notScrabbleLetters = enteredLetters.filter((value) => {
            return !(EaselControl.letterAKeyCode <= value.charCodeAt(0)
                && value.charCodeAt(0) <= EaselControl.letterZKeyCode)
                && value !== CommandsHelper.BLANK_VALUE;
        });
        return (notScrabbleLetters.length === 0);
    }

    private getPlacedWordCommandParameters(enteredWord: string): Array<string> {
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
