import { Injectable } from '@angular/core';

import { ScrabbleLetter } from '../../models/letter/scrabble-letter';
import { Alphabet } from '../../models/letter/alphabet';

@Injectable()
export class EaselGeneratorService {
    private _lettersOnEasel: Array<ScrabbleLetter>;

    public get lettersOnEasel(): Array<ScrabbleLetter> {
        return this._lettersOnEasel;
    }

    // TODO: ???????????????
    public generatedEasel(lettersReceived: Array<ScrabbleLetter>): Array<ScrabbleLetter> {
        this._lettersOnEasel = lettersReceived;
        return this._lettersOnEasel;
    }
}
