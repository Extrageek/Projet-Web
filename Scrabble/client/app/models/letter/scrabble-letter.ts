import { Alphabet } from './alphabet';

export class ScrabbleLetter {
    private _letter: string;
    get letter() {
        return this._letter;
    }

    private _imageSource: string;
    get imageSource(): string {
        return this._imageSource;
    }

    constructor(letter: string) {
        this._letter = letter;
        this._imageSource = this._letter + ".jpg";
    }
}
