
import { ExceptionHelper } from "../commons/exception-helper";
import { WordDirection } from "../commons/word-direction";
import { Letter } from "../../models/letter";

import { Player } from "../../models/player";
import { Board } from '../../models/board/board';

export interface IValidationRequest {
    _firstRowNumber: number,
    _columnIndex: number,
    _letters: Array<Letter>,
    _player: Player
}