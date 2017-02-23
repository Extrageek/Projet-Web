import { Injectable } from '@angular/core';

import { EaselManagerService } from '../easel/easel-manager.service';
import { ScrabbleLetter } from '../../models/letter/scrabble-letter';
import { InputCommandType } from './command-type';
import { CommandStatus } from './command-status';
import { IExchangeCommandRequest } from './command-request';

export const EXCHANGE_COMMAND = '!changer';
export const PLACE_COMMAND = '!placer';
export const PASS_COMMAND = '!passer';

@Injectable()
export class CommandsService {

    constructor(private easelManagerService: EaselManagerService) {
        // Default constructor
    }

    public getInputCommand(enteredValue: string): InputCommandType {

        if (enteredValue === null) {
            throw new Error("The texte entered cannot be null");
        }

        let texte = enteredValue.trim();

        if (texte.startsWith(PLACE_COMMAND)) {
            return InputCommandType.PlaceCmd;

        } else if (texte.startsWith(EXCHANGE_COMMAND)) {
            return InputCommandType.ExchangeCmd;

        } else if (texte.startsWith(PASS_COMMAND)) {
            return InputCommandType.PassCmd;

        } else if (texte.startsWith('!')) {
            return InputCommandType.InvalidCmd;

        } else if (texte !== null && texte !== '') {
            return InputCommandType.MessageCmd;
        }
    }

    public createExchangeEaselLettersRequest(
        lettersInEasel: Array<ScrabbleLetter>,
        enteredletters: Array<string>): IExchangeCommandRequest {

        let request: IExchangeCommandRequest = { _commandStatus: null, _indexOfLettersToExchange: null };
        let indexOfLettersToChange = new Array<number>();

        if (lettersInEasel === null) {
            throw new Error("Null argument error: the parameters cannot be null");
        }

        if (enteredletters === null
            || enteredletters.length > lettersInEasel.length
            || enteredletters.length === 0) {
            return { _commandStatus: CommandStatus.SynthaxeError, _indexOfLettersToExchange: null }
        }

        for (let index = 0; index < enteredletters.length; ++index) {
            if (enteredletters[index] === '*') {
                enteredletters[index] = 'blank';
            }

            let letterIndex = lettersInEasel.findIndex((letter: ScrabbleLetter) =>
                letter.letter.toUpperCase() === enteredletters[index].toUpperCase());

            if (letterIndex === -1 || letterIndex === undefined) {
                request._commandStatus = CommandStatus.NotAllowed;
                request._indexOfLettersToExchange = null;

                return request;
            }

            indexOfLettersToChange.push(letterIndex);
        }

        request._commandStatus = CommandStatus.Ok;
        request._indexOfLettersToExchange = indexOfLettersToChange;

        return request;
    }
}
