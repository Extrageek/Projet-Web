import { ISquare } from "../square/square";
import { ISquarePosition } from "../square/square-position";

export class Board {
    private _squares: Array<Array<ISquare>>;
    public get squares(): Array<Array<ISquare>> {
        return this._squares;
    }

    constructor(response: Array<Array<any>>) {
        this._squares = new Array<Array<ISquare>>();
        response.forEach((row: any) => {
            let rowSquares = new Array<ISquare>();
            row.forEach((square: any) => {
                let squareModified = {
                    _letter: {
                        _alphabetLetter: square._letter._alphabetLetter,
                        _imageSource: square._letter._imageSource
                    },
                    _position: {
                        _row: square._position._row,
                        _column: square._position._column
                    },
                    _type: square._type,
                    _isBusy: square._isBusy
                };
                rowSquares.push(squareModified);
            });
            this._squares.push(rowSquares);
        });
    }
}
