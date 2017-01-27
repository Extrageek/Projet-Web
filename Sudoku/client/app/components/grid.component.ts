/**
 * grid.component.ts - Represents a component which display the grid of the Sudoku.
 *
 * @authors ...
 * @date 2017/01/22
 */

import { Component, OnInit, AfterContentInit } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

declare var jQuery:any;

import { RestApiProxyService } from '../services/rest-api-proxy.service';
import { PuzzleManagerService } from '../services/grid-manager.service';
import { PuzzleEventManagerService } from '../services/puzzle-event-manager.service';

import { PuzzleCommon } from '../commons/puzzle-common';
import { Puzzle } from '../models/puzzle';

@Component({
    moduleId: module.id,
    selector: 'sudoku-grid',
    templateUrl : '/app/views/grid.component.html',
    // TODO: Must be removed to an external css file
    // Do it after a clean debug, remove the reference in the index.html file
    styleUrls : ['/app/assets/grid.component.css'],
    providers : [PuzzleManagerService, PuzzleEventManagerService, RestApiProxyService ]
})

export class GridComponent implements OnInit {

    _newPuzzle : Puzzle;
    _puzzleSolution : Puzzle;

    constructor(private puzzleMangerService : PuzzleManagerService,
                private puzzleEventManager : PuzzleEventManagerService,
                private restApiProxyService: RestApiProxyService) {
                // Defaut constructor
                 }

    // Initialization
    async ngOnInit() {

        await this.restApiProxyService.getNewPuzzle()
            .then((puzzle) => {
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
    extractTheNewPuzzle(puzzle : Puzzle) {
       puzzle.puzzle.forEach(function(puzzleItems){
            puzzleItems.forEach(function(puzzleItem){
                puzzleItem.number = (puzzleItem.hidden) ? null : puzzleItem.number;
                });
        });

        return puzzle;
    }

    // Handle the directions key event by using the EventManager
    onKeyEventHandler(event : KeyboardEvent) {

        // TODO: Must be removed after a clean debug
        // Some instructions must not be here
        console.log("something has changed");
        
        this.puzzleEventManager.onKeyEventUpdateCurrentCursor(event);
    }

    // TODO : must be removed after a clean debug
    onValueChange(event: KeyboardEvent){

        let rowColIndex = event.srcElement.id.split('');
        let rowIndex = Number(rowColIndex[PuzzleCommon.yPosition]);
        let colIndex = Number(rowColIndex[PuzzleCommon.xPosition]);

        if(this.puzzleMangerService.isValidNumber(this._newPuzzle, rowIndex, colIndex)){
            
            console.log("is valid");

        }else{

            console.log("is not valid");
        }
    }
}
