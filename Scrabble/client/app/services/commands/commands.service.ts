import { Injectable } from '@angular/core';

import { EaselManagerService } from '../easel/easel-manager.service';
import { ScrabbleLetter } from '../../models/letter/scrabble-letter';
import { CommandType } from './command-type';
import { CommandStatus } from './command-status';
import { ICommandRequest } from './command-request';

export const EXCHANGE_COMMAND = '!changer';
export const PLACE_COMMAND = '!placer';
export const PASS_COMMAND = '!passer';
export const GUIDE = '!aide';

@Injectable()
export class CommandsService {

    constructor(private easelManagerService: EaselManagerService) {
        // Default constructor
    }

    public getInputCommandType(enteredValue: string): CommandType {

        if (enteredValue === null) {
            throw new Error("Null argument error: the texte entered cannot be null");
        }

        let texte = enteredValue.trim();

        if (texte.startsWith(PLACE_COMMAND)) {
            return CommandType.PlaceCmd;

        } else if (texte.startsWith(EXCHANGE_COMMAND)) {
            return CommandType.ExchangeCmd;

        } else if (texte.startsWith(PASS_COMMAND)) {
            return CommandType.PassCmd;

        } else if (texte.startsWith(GUIDE)) {
            return CommandType.Guide;

        } else if (texte.startsWith('!')) {
            return CommandType.InvalidCmd;

        } else if (texte !== null && texte !== '') {
            return CommandType.MessageCmd;
        }
    }

    public createExchangeEaselLettersRequest(
        lettersInEasel: Array<ScrabbleLetter>,
        enteredletters: Array<string>): ICommandRequest<Array<number>> {

        let request: ICommandRequest<Array<number>> = { _commandStatus: null, _response: null };
        let indexOfLettersToChange = new Array<number>();

        if (lettersInEasel === null) {
            throw new Error("Null argument error: the parameters cannot be null");
        }

        if (enteredletters === null
            || enteredletters.length > lettersInEasel.length
            || enteredletters.length === 0) {
            return { _commandStatus: CommandStatus.SynthaxeError, _response: null }
        }

        for (let index = 0; index < enteredletters.length; ++index) {
            if (enteredletters[index] === '*') {
                enteredletters[index] = 'blank';
            }

            // TODO: Check, a bug is found when changing several occurance of a letters
            // Style get the first occurance
            let letterIndex = lettersInEasel.findIndex((letter: ScrabbleLetter) =>
                letter.letter.toUpperCase() === enteredletters[index].toUpperCase());

            if (letterIndex === -1 || letterIndex === undefined) {
                request._commandStatus = CommandStatus.NotAllowed;
                request._response = null;

                return request;
            }

            indexOfLettersToChange.push(letterIndex);
        }

        request._commandStatus = CommandStatus.Ok;
        request._response = indexOfLettersToChange;
        return request;
    }

    // public createPlaceWordRequest(
    //     lettersInEasel: Array<ScrabbleLetter>,
    //     commandValue: Array<string>): ICommandRequest<[Array<string>, string]> {
    //     let request: ICommandRequest<[Array<string>, string]> = { _commandStatus: null, _response: null };

    //     return request;
    // }
}
