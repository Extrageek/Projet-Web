import { ScrabbleLetter } from "../../../models/letter/scrabble-letter";
import { SquarePosition } from "../../../models/square/square-position";
import { WordOrientation } from "./word-orientation";

export interface IPlaceWordResponse {
    _squarePosition: SquarePosition;
    _wordOrientation: string;
    _letters: Array<string>;
};
