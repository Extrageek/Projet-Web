import { Injectable } from '@angular/core';

import { ScrabbleLetter } from '../models/letter/scrabble-letter';
import { Alphabet } from '../models/letter/alphabet';

@Injectable()
export class EaselGeneratorService {
    private _lettersOnEasel: Array<ScrabbleLetter>;

    generatedEasel(): Array<ScrabbleLetter> {
        this._lettersOnEasel = Array<ScrabbleLetter>();
        this._lettersOnEasel = this._lettersOnEasel.map(() => new ScrabbleLetter(Alphabet.A.toString()));
        return this._lettersOnEasel;
    }

    get lettersOnEasel(): Array<ScrabbleLetter> {
        return this._lettersOnEasel;
    }
}
