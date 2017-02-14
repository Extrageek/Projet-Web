import { CasePosition } from './case-position';
import { ScrabbleLetter } from './../letter/scrabble-letter';

export class BoardCase {
    private _letter: ScrabbleLetter;
    public get letter(): ScrabbleLetter {
        return this._letter;
    }
    public set letter(letter: ScrabbleLetter) {
        this._letter = letter;
    }

    private _position: CasePosition;
    public get position(): CasePosition {
        return this._position;
    }
    public set position(position: CasePosition) {
        this._position = position;
    }

    constructor(letter: ScrabbleLetter, position: CasePosition) {
        this._letter = letter;
        this._position = position;
    }
}
