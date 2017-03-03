/**
 * puzzle-event-manager.service.ts - Manage all the events associated to the puzzle grids
 *
 * @authors ...
 * @date 2017/01/22
 */

import { Injectable } from "@angular/core";
import { ScrabbleLetter } from "../../models/letter/scrabble-letter";
import { EaselControl } from "../../commons/easel-control";

declare var jQuery: any;

export const INPUT_ID_PREFIX = '#';

@Injectable()
export class GameRoomManagerService {

    constructor() {
        // Default constructor
    }

    /**
     * @class GameRoomEventManagerService
     * @method isTabKey
     * @return true for a tab key press
     */
    isTabKey(keyCode: number): boolean {
        let response: boolean;
        if (keyCode === null) {
            throw new Error("Argument error: the keyCode cannot be null");
        }
        response = (keyCode === EaselControl.tabKeyCode);
        return response;
    }
}
