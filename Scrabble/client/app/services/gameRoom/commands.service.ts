import { Injectable } from '@angular/core';

import { InputCommand } from '../../commons/input-commands';

export const EXCHANGE_COMMAND = '!changer';
export const PLACE_COMMAND = '!placer';


@Injectable()
export class CommandsService {

    constructor() {
        // Default constructor
    }

    public getInputCommand(enteredValue: string): InputCommand {

        if (enteredValue === null) {
            throw new Error("The texte entered cannot be null");
        }

        let texte = enteredValue.trim();

        if (texte.startsWith(PLACE_COMMAND)) {
            return InputCommand.PlaceCmd;
        } else if (texte.startsWith(EXCHANGE_COMMAND)) {
            return InputCommand.ExchangeCmd;

        } else if (texte !== null && texte !== '') {
            return InputCommand.MessageCmd;
        } else {
            return InputCommand.InvalidCmd;
        }
    }
}
