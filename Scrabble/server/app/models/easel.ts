import { Letter } from "./letter";

/**
 * Easel
 */
export class Easel {
    private _letters: Array<Letter>;

    constructor() {
        this._letters = new Array<Letter>();
    }

    public get letters(): Array<Letter> {
        return this._letters;
    }
    public set letters(v: Array<Letter>) {
        this._letters = v;
    }

    public containsLetter(letter: Letter): boolean {
        let contains = this._letters.some((letterEasel: Letter) => {
            return letterEasel.alphabetLetter === letter.alphabetLetter;
        });
        console.log("--------- ", contains);
        return true;
    }
}
