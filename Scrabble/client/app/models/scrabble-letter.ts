/**
 * Created by DavidThanhVo on 1/22/2017.
 */

export class ScrabbleLetter {
    private _letter : string;
    private _imageSource: string;

    constructor () {
        let max = 26;
        let min = 0;

        let offset = Math.random() * (max - min) + min;
        this._letter = String.fromCharCode(65 + offset );
        this._imageSource = this._letter + ".jpg";
    }

    get letter() {
        return this._letter;
    }
    get imageSource() {
        return this._imageSource;
    }
}
