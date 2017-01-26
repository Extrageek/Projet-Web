/**
 * grid.component.ts - Represents a component which display the grid of the Sudoku.
 *
 * @authors ...
 * @date 2017/01/22
 */

import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { RestApiProxyService } from '../services/rest-api-proxy.service';
import { PuzzleManagerService } from '../services/puzzle-manager.service';
import { PuzzleEventManagerService } from '../services/puzzle-event-manager.service';

import { PuzzleCommon } from '../commons/puzzle-common';
import { Puzzle, PuzzleItem } from '../models/puzzle';

@Component({
    moduleId: module.id,
    selector: 'sudoku-grid',
    templateUrl: '/app/views/grid.component.html',
    // TODO: Must be removed to an external css file
    // Do it after a clean debug
    styles: [`
        .grid {
            width: 465px;
            padding: 1px 2px 0px 2px;
            background-color: #fff;
        }
        .grid-box {
            padding: 16px;
            border: 4px solid #ddd;
            width: 442px;
            background-color: #ddd;
        }

        input[type=number]::-webkit-inner-spin-button, 
        input[type=number]::-webkit-outer-spin-button { 
            -webkit-appearance: none; 
            margin: 0; 
            padding: 0;
        }

        input {
            font-size: 37px;
            padding: 0;
            width: 38.5px;
            height: 38.5px;
            text-align: center;
            border: 2px solid #ddd;
        }

        input:focus {
            border: 1px solid;
            background-color: #fff;
        }

        .readOnlyCell {
            color:#fff;
            background-color:#90A4AE;
        }

        .readWriteCell{
            background-color: darkgoldenrod;
        }
        .table {
            width: 100%;
            max-width: 100%;
            margin-bottom: 0;
        }

        .table>tbody>tr>td {
            border-right: 2px solid #616161;
            border-bottom: 2px solid #616161;
            padding: 2px 1px 2px 2px;
            vertical-align: top;
        }
        tr {
            border-left: 3px solid #212121;
            border-right: 3px solid #212121;
        }

        #gridRow2, 
        #gridRow5 {
            border-bottom: 3px solid #212121;
        }

        tr#gridRow0 {
            border-top: 3px solid #212121;
        }

         tr#gridRow8 {
            border-bottom: 3px solid #212121;
        }

        td#cell2, td#cell5, td#cell8 {
            border-right: 3px solid #212121;
        }
        `],
    providers: [
        PuzzleManagerService,
        PuzzleEventManagerService,
        RestApiProxyService ]
})

export class GridComponent implements OnInit {

    _newPuzzle: Puzzle;
    _puzzleSolution: Puzzle;

    // Defaut constructor
    constructor(private puzzleMangerService: PuzzleManagerService,
                private puzzleEventManager: PuzzleEventManagerService,
                private restApiProxyService: RestApiProxyService) {

    }

    // Initialization
    ngOnInit() {
        this.restApiProxyService.getNewPuzzle()
            .subscribe(puzzle => {

                // The puzzle to display when binding the model to the input box,
                // must not contains the solution. We need to extract the new puzzle 
                // for the user.
                this._newPuzzle = this.extractTheNewPuzzle(puzzle);

                // Keep the puzzle with the solution.
                this._puzzleSolution = puzzle;
            });
    }

    /**
     * The extractNewPuzzle function, extract the new puzzle without the solution.
     *
     * @class GridComponent
     * @method extractTheNewPuzzle
     * @return Puzzle
     */
    extractTheNewPuzzle(puzzle: Puzzle) {
       puzzle.puzzle.forEach(function(puzzleItems) {
            puzzleItems.forEach(function(puzzleItem) {
                puzzleItem.value = (puzzleItem.hide) ? null : puzzleItem.value;
                });
        });
        return puzzle;
    }

    // Handle the directions key event by using the EventManager
    onKeyEventHandler(event: KeyboardEvent) {

        // TODO: Must be removed after a clean debug
        // Some instructions must not be here
        console.log("something has changed");

        let eventSourceId = event.srcElement.id;

        let eventSource = <HTMLInputElement>document.getElementById(eventSourceId);

        let rowColIndex = eventSourceId.split('');
        let rowIndex = Number(rowColIndex[PuzzleCommon.yPosition]);
        let colIndex = Number(rowColIndex[PuzzleCommon.xPosition]);


        if (this.puzzleMangerService.isValidValue(this._newPuzzle, rowIndex, colIndex)) {
            //TODO: To remove after a clean debug
            //this.puzzleEventManager.onKeyEventUpdateCurrentCursor(event); 
            console.log("true");
            this.puzzleEventManager.onKeyEventUpdateCurrentCursor(event);
        } else {
            eventSource.innerHTML = "";
            eventSource.focus();
            //TODO: To remove after a clean debug
            console.log("false");
        }
    }

    // TODO : must be removed after a clean debug
    onValueChange(event: KeyboardEvent) {
        console.log("change");
    }
}
