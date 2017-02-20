import { Alphabet } from './alphabet';

export class ScrabbleLetter {
    private _letter: string;
    private _imageSource: string;

    public get letter(): string {
        return this._letter;
    }
    public set letter(v: string) {
        this._letter = v;
    }

    public get imageSource(): string {
        return this._imageSource;
    }
    public set imageSource(v: string) {
        this._imageSource = v;
    }

    constructor(letter: string) {
        this._letter = letter;
        this._imageSource = this._letter + ".jpg";
    }
}
