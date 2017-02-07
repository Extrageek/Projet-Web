import { Injectable } from '@angular/core';

import { ScrabbleLetter } from '../models/scrabble-letter';

@Injectable()
export class EaselGeneratorService {
    private _lettersOnEasel : ScrabbleLetter[];

    generatedEasel() : ScrabbleLetter[] {
        this._lettersOnEasel = Array(7).fill(0);
        this._lettersOnEasel = this._lettersOnEasel.map(() => new ScrabbleLetter());
        return this._lettersOnEasel;
    }
    get lettersOnEasel(): ScrabbleLetter[] {
        return this._lettersOnEasel;
    }
}
