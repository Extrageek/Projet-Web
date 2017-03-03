import { Alphabet } from "./alphabet";

export class ScrabbleLetter {
    private _letter: string;
    private _imageSource: string;

    public get letter(): string {
        return this._letter;
    }
    public set letter(v: string) {
        this._letter = v;
    }

    constructor(letter: string) {
        this._letter = letter;
    }
}
