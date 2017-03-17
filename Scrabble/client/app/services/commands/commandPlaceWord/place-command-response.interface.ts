import { IScrabbleLetter } from "../../../models/letter/scrabble-letter";
import { ISquarePosition } from "../../../models/square/square-position";
import { WordOrientation } from "./word-orientation";

export interface IPlaceWordResponse {
    _squarePosition: ISquarePosition;
    _wordOrientation: string;
    _letters: Array<string>;
};
