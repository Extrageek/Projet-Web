import { SquarePosition } from "./square-position";
import { ScrabbleLetter } from "./../letter/scrabble-letter";
import { SquareType } from "./square-type";

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

    private _type: SquareType;
    public get type(): SquareType {
        return this._type;
    }
    public set type(type: SquareType) {
        this._type = type;
    }

    private _isBusy: boolean;
    public get isBusy(): boolean {
        return this._isBusy;
    }
    public set isBusy(v: boolean) {
        this._isBusy = v;
    }

    constructor(position: SquarePosition, type: SquareType) {
        this.letter = new ScrabbleLetter("");
        this.position = position;
        this.type = type;
        this.isBusy = false;
    }
}
