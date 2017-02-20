/**
 * puzzle-event-manager.service.ts - Manage all the events associated to the puzzle grids
 *
 * @authors ...
 * @date 2017/01/22
 */

import { Injectable } from '@angular/core';
import { ScrabbleLetter } from "../../models/letter/scrabble-letter";
import { EaselControl } from "../../commons/easel-control";

declare var jQuery: any;

export const INPUT_ID_PREFIX = '#';

@Injectable()
export class GameRoomEventManagerService {

    _newPositionX = 0;

    constructor() {
        // Default constructor
    }

    /**
     * @class GameRoomEventManagerService
     * @method isTabKey
     * @return true for a tab key press
     */
    isTabKey(keyCode: number): boolean {
        return (keyCode === EaselControl.tabKeyCode);
    }

    /**
    * @class GameRoomEventManagerService
    * @method isScrabbleLetter
    * @return true for a valid scrabble letter key press
    */
    isScrabbleLetter(keyCode: string): boolean {
        let letterKeyCode = Number(keyCode);
        return (letterKeyCode >= EaselControl.letterAKeyCode
            && letterKeyCode <= EaselControl.letterZKeyCode);
    }
}
