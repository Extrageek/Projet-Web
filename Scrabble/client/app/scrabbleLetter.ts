/**
 * Created by DavidThanhVo on 1/22/2017.
 */

export class ScrabbleLetter {
    private _letter : string;
    private _imageSource: string;

    constructor(letter:string,imageSource:string) {
        this._letter = letter;
        this._imageSource = imageSource;
    }
    get letter() {
        return this._letter;
    }
    get imageSource() {
        return this._imageSource;
    }

}
