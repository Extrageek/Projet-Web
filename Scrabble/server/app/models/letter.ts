import { Alphabet } from './alphabet';
import { AlphabetPoint } from './../commons/alphabet-point';

export class Letter {
    private _alphabetLetter: Alphabet;
    private _point: AlphabetPoint;
    private _quantity: number;

    public get alphabetLetter(): Alphabet {
        return this._alphabetLetter;
    }

    public set alphabetLetter(letter: Alphabet) {
        this._alphabetLetter = letter;
    }

    public get point(): AlphabetPoint {
        return this._point;
    }

    public set point(value: AlphabetPoint) {
        this._point = value;
    }

    public get quantity(): number {
        return this._quantity;
    }

    public set quantity(quantity: number) {
        this._quantity = quantity;
    }

    constructor(letter: Alphabet, point: AlphabetPoint, quantity: number) {
        this._alphabetLetter = letter;
        this._point = point;
        this._quantity = quantity;
    }
}
