/**
 * grid.component.ts - Represents a component which display the grid of the Sudoku.
 *
 * @authors ...
 * @date 2017/01/22
 */

<<<<<<< HEAD
import { Component, OnInit, AfterContentInit } from '@angular/core';
=======
import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';
>>>>>>> e17a7717774b617085902d4ee3d5330aa144eac4
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
    templateUrl: '/app/views/grid.component.html',
    // TODO: Must be removed to an external css file
<<<<<<< HEAD
    // Do it after a clean debug, remove the reference in the index.html file
    styleUrls : ['/app/assets/grid.component.css'],
    providers : [PuzzleManagerService, PuzzleEventManagerService, RestApiProxyService ]
=======
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
>>>>>>> e17a7717774b617085902d4ee3d5330aa144eac4
})

export class GridComponent implements OnInit {

    _newPuzzle: Puzzle;
    _puzzleSolution: Puzzle;

<<<<<<< HEAD
    constructor(private puzzleMangerService : PuzzleManagerService,
                private puzzleEventManager : PuzzleEventManagerService,
                private restApiProxyService: RestApiProxyService) {
                // Defaut constructor
                 }

    // Initialization
    async ngOnInit() {

        await this.restApiProxyService.getNewPuzzle()
            .then((puzzle) => {
=======
    // Defaut constructor
    constructor(private puzzleMangerService: PuzzleManagerService,
                private puzzleEventManager: PuzzleEventManagerService,
                private restApiProxyService: RestApiProxyService) {

    }

    // Initialization
    ngOnInit() {
        this.restApiProxyService.getNewPuzzle()
            .subscribe(puzzle => {

>>>>>>> e17a7717774b617085902d4ee3d5330aa144eac4
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
<<<<<<< HEAD
    extractTheNewPuzzle(puzzle : Puzzle) {
       puzzle.puzzle.forEach(function(puzzleItems){
            puzzleItems.forEach(function(puzzleItem){
                puzzleItem.number = (puzzleItem.hidden) ? null : puzzleItem.number;
=======
    extractTheNewPuzzle(puzzle: Puzzle) {
       puzzle.puzzle.forEach(function(puzzleItems) {
            puzzleItems.forEach(function(puzzleItem) {
                puzzleItem.value = (puzzleItem.hide) ? null : puzzleItem.value;
>>>>>>> e17a7717774b617085902d4ee3d5330aa144eac4
                });
        });
        return puzzle;
    }

    // Handle the directions key event by using the EventManager
<<<<<<< HEAD
    onKeyEventHandler(event : KeyboardEvent) {
=======
    onKeyEventHandler(event: KeyboardEvent) {
>>>>>>> e17a7717774b617085902d4ee3d5330aa144eac4

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
<<<<<<< HEAD

        if(this.puzzleMangerService.isValidNumber(this._newPuzzle, rowIndex, colIndex)){
            
            console.log("is valid");

        }else{

            console.log("is not valid");
        }
=======


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
>>>>>>> e17a7717774b617085902d4ee3d5330aa144eac4
    }
}
