import { SquarePosition } from './square-position';
import { ScrabbleLetter } from './../letter/scrabble-letter';
import { SquareType } from './square-type';

export class Square {
    private _letter: ScrabbleLetter;
    public get letter(): ScrabbleLetter {
        return this._letter;
    }
    public set letter(letter: ScrabbleLetter) {
        this._letter = letter;
    }

    private _position: SquarePosition;
    public get position(): SquarePosition {
        return this._position;
    }
    public set position(position: SquarePosition) {
        this._position = position;
    }

    private _type : SquareType;
    public get type() : SquareType {
        return this._type;
    }
    public set type(type : SquareType) {
        this._type = type;
    }

    constructor(position: SquarePosition, type: SquareType) {
        this.letter = null;
        this.position = position;
        this.type = type;
    }
}
