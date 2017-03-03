import { Injectable } from "@angular/core";

import { EaselManagerService } from "../easel/easel-manager.service";
import { EaselControl } from "../../commons/easel-control";
import { ScrabbleLetter } from "../../models/letter/scrabble-letter";

import { CommandType } from "./command-type";
import { CommandStatus } from "./command-status";
import { ICommandRequest } from "./command-request";
import { CommandsHelper } from "./commands-helper";


@Injectable()
export class CommandsService {

    constructor(private easelManagerService: EaselManagerService) {
        // Default constructor
    }

    public getCommandType(enteredValue: string): CommandType {
        this.throwsErrorIfParameterIsNull(enteredValue);
        let texte = enteredValue.trim();

        if (texte.startsWith(CommandsHelper.PLACE_COMMAND)) {
            return CommandType.PlaceCmd;

        } else if (texte.startsWith(CommandsHelper.EXCHANGE_COMMAND)) {
            return CommandType.ExchangeCmd;

        } else if (texte.startsWith(CommandsHelper.PASS_COMMAND)) {
            return CommandType.PassCmd;

        } else if (texte.startsWith(CommandsHelper.GUIDE)) {
            return CommandType.Guide;

        } else if (texte.startsWith('!') && !texte.startsWith(CommandsHelper.PLACE_COMMAND)) {
            return CommandType.InvalidCmd;

        } else if (texte !== null && texte !== '') {
            return CommandType.MessageCmd;
        }
    }

    public createExchangeEaselLettersRequest(
        lettersInEasel: Array<ScrabbleLetter>,
        enteredletters: Array<string>): ICommandRequest<Array<number>> {

        let commandRequest: ICommandRequest<Array<number>> = { _commandStatus: null, _response: null };
        let indexOfLettersToChange = new Array<number>();

        this.throwsErrorIfParameterIsNull(lettersInEasel);

        if (enteredletters === null || enteredletters.length > lettersInEasel.length) {
            return { _commandStatus: CommandStatus.SynthaxeError, _response: null };

        } else if (enteredletters.length === 0) {
            return { _commandStatus: CommandStatus.NotAllowed, _response: null };

        } else {
            let tempEaselLetters = new Array<string>();
            lettersInEasel.forEach((letter) => {
                tempEaselLetters.push(letter.letter);
            });

            for (let index = 0; index < enteredletters.length; ++index) {
                if (enteredletters[index] === CommandsHelper.BLANK_VALUE) {
                    enteredletters[index] = CommandsHelper.BLANK_WORD;
                }

                let letterIndex = tempEaselLetters.findIndex((letter: string) =>
                    letter.toUpperCase() === enteredletters[index].toUpperCase());

                if (letterIndex === -1 || letterIndex === undefined) {
                    commandRequest = { _commandStatus: CommandStatus.NotAllowed, _response: null };
                    return commandRequest;
                }

                tempEaselLetters[letterIndex] = '-1';
                indexOfLettersToChange.push(letterIndex);
            }
        }

        commandRequest = { _commandStatus: CommandStatus.Ok, _response: indexOfLettersToChange };
        return commandRequest;
    }

    public createPlaceWordRequest(lettersInEasel: Array<ScrabbleLetter>, request: string):
        ICommandRequest<Array<ScrabbleLetter>> {
        let commandRequest: ICommandRequest<Array<ScrabbleLetter>> =
            { _commandStatus: null, _response: null };

        this.throwsErrorIfParameterIsNull(lettersInEasel);

        // get the differents sections of the request
        let requestElement = request.split(' ');

        // Get the position of the word to be placed
        let wordPosition = requestElement[CommandsHelper.FIRST_INDEX].split('');
        let enteredWord = requestElement[CommandsHelper.SECOND_INDEX];
        let wordToBePlaced = this.getPlacedWordCommandParameters(enteredWord);

        if (!this.isValidPosition(wordPosition)
            || !this.isScrabbleLetters(wordToBePlaced)) {
            commandRequest = { _commandStatus: CommandStatus.SynthaxeError, _response: null };
            return commandRequest;
        }

        // Get the word to be placed from the easel;
        let wordFromEasel = this.easelManagerService.getScrabbleWordFromTheEasel(lettersInEasel, wordToBePlaced);

        // Check if the word to be placed exist in the current state of the easel
        if (wordFromEasel === null
            || wordFromEasel === undefined
            || wordFromEasel.length === 0) {
            commandRequest = { _commandStatus: CommandStatus.NotAllowed, _response: null };
            return commandRequest;
        }

        commandRequest = { _commandStatus: CommandStatus.Ok, _response: wordFromEasel };
        return commandRequest;
    }

    private getPlacedWordCommandParameters(enteredWord: string): Array<string> {
        let wordToBePlaced: Array<string>;
        if (enteredWord !== undefined) {
            wordToBePlaced = this.easelManagerService.parseStringToListofChar(enteredWord);
            wordToBePlaced.forEach((letter) => {
                if (letter === CommandsHelper.BLANK_VALUE) {
                    letter = CommandsHelper.BLANK_WORD;
                }
            });
            return wordToBePlaced;
        }
    }

    private isValidPosition(wordPosition: Array<string>): boolean {
        if (wordPosition.length < CommandsHelper.MIN_POSITION_VALUE
            || wordPosition.length > CommandsHelper.MAX_POSITION_VALUE) {
                return false;
        }
        // Get the position of the word to be placed
        let rowIndex = wordPosition[CommandsHelper.FIRST_INDEX];
        let colIndex = Number(wordPosition[CommandsHelper.SECOND_INDEX]);

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
        return index !== 0
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
            return !this.easelManagerService.isScrabbleLetter(value.charCodeAt(0))
                && value !== CommandsHelper.BLANK_VALUE;
        });
        return (notScrabbleLetters.length === 0);
    }

    private throwsErrorIfParameterIsNull(parameter: any) {
        if (parameter === null) {
            throw new Error("Null argument error: the letter entered cannot be null");
        }
    }
}
