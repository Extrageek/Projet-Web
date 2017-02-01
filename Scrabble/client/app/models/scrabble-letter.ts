const MAXIMUM_LETTERS = 26;
const MINIMUM_LETTERS = 0;

export class ScrabbleLetter {
    private _letter : string;
    private _imageSource: string;

    constructor () {
        let offset = Math.random() * (MAXIMUM_LETTERS - MINIMUM_LETTERS) + MINIMUM_LETTERS;
        this._letter = String.fromCharCode(65 + offset );
        this._imageSource = this._letter + ".jpg";
    }
    get letter() {
        return this._letter;
    }
}
