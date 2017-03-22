import { IScrabbleLetter } from "../../models/scrabble-letter";
import { ISquarePosition } from "../../models/square-position";
import { WordOrientation } from "../commons/word-orientation";

export interface IPlaceWordResponse {
    _squarePosition: ISquarePosition;
    _wordOrientation: string;
    _letters: Array<string>;
}
