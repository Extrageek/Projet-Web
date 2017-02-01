import { Injectable } from '@angular/core';

import { ScrabbleLetter } from '../models/scrabble-letter';

@Injectable()
export class EaselGeneratorService {
    private lettersOnEasel : ScrabbleLetter[];

    generatedEasel() : ScrabbleLetter[] {

        this.lettersOnEasel = Array(7).fill(0);
        this.lettersOnEasel = this.lettersOnEasel.map(() => new ScrabbleLetter());
        return this.lettersOnEasel;
    }
}
