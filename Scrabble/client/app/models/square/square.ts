import { ISquarePosition } from "./square-position";
import { IScrabbleLetter } from "./../letter/scrabble-letter";
import { SquareType } from "./square-type";

export interface ISquare {
    _letter: IScrabbleLetter;
    _position: ISquarePosition;
    _type: SquareType;
    _isBusy: boolean;
}
