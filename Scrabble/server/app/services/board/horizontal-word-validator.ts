
import { ExceptionHelper } from "../commons/exception-helper";
import { WordDirection } from "../commons/word-direction";
import { CommandsHelper } from '../commons/command/command-helper';
import { Letter } from "../../models/letter";
import { LetterHelper } from "../../models/commons/letter-helper";
import { SquareType } from "../../models/square/square-type";
import { Player } from "../../models/player";
import { Board } from '../../models/board/board';
import { BoardHelper } from './board-helper';
import { IValidationRequest } from './validation-request.interface';

export class HorizontalWordValidator {
    private _player: Player;
    private _board: Board;

    constructor() {
        // Constructor
    }

    public matchHorizontalPlacementRules(request: IValidationRequest, board: Board): boolean {

        // TODO:
        return true;
    }
}