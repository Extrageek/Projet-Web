/**
 * grid.component.ts - Represents a component which display the grid of the Sudoku.
 *
 * @authors ...
 * @date 2017/01/22
 */

import { Component, OnInit } from '@angular/core';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/timer';

declare var jQuery: any;

import { RestApiProxyService } from '../services/rest-api-proxy.service';
import { GridManagerService } from '../services/grid-manager.service';
import { PuzzleEventManagerService } from '../services/puzzle-event-manager.service';
import { StopwatchService } from "../services/stopwatch.service";

import { PuzzleCommon } from '../commons/puzzle-common';
import { Puzzle } from '../models/puzzle';

import { Observable } from 'rxjs/Observable';


//noinspection TsLint
@Component({
    moduleId: module.id,
    selector: 'sudoku-grid',

    // TODO: Must be removed to an external html file
    // Do it after a clean debug, remove all the reference
    template: `
        <div class="col-md-12">
            <div class="col-md-7 grid-panel">
                <div class="form-control" class="grid-box">
                    <div class="table-responsive">
                        <table class="table">
                            <tbody>
                                <tr class="grid" *ngFor="let row of _newPuzzle?._puzzle , let i = index" 
                                [attr.id]="'gridRowId' + i">
                                    <td *ngFor="let cell of row, let j = index" [attr.id]="'cellId' + i + '' + j">
                                        <input class="readOnlyCell" *ngIf="!cell._hide" readonly 
                                        [attr.maxlength]="1" type="text" name="inputCell"
                                        [attr.id]="i +''+ j" [ngModel]="cell._value"
                                        (keydown)="onKeyDownEventHandler($event)">

                                        <input class="readWriteCell" *ngIf="cell._hide" [attr.maxlength]="1" 
                                        type="text" name="inputCell" 
                                        [attr.id]="i +''+ j" [(ngModel)]="cell._value"
                                        (keydown)="onKeyDownEventHandler($event)"
                                        (keyup)="onValueChange($event)" 
                                        (keypress)="validateInputValue($event)">
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div class="col-md-5 menu-panel">
                <button type="button" class="btn btn-primary" (click)="initializeCurrentGrid()">Initialize Game</button>
                <h2 *ngIf="!hiddenClock">                
                    {{time.hour}} : {{time.minute}} : {{time.seconds}}
                    <span (click)="hideClock()"  class="glyphicon glyphicon-ban-circle" aria-hidden="true"> </span>                     
                </h2>
                <h2 *ngIf="hiddenClock"> 
                    <span (click)="hideClock()" class="glyphicon glyphicon-time" aria-hidden="true"> </span>
                </h2>
            </div>
        </div>
    `,
    styleUrls: ['/app/assets/grid.component.css'],
    providers: [GridManagerService, PuzzleEventManagerService, RestApiProxyService, StopwatchService ]
})

export class GridComponent implements OnInit {
    _newPuzzle: Puzzle;

    time : {
        seconds : number;
        minute : number;
        hour : number;
    };

    hiddenClock : boolean;

    constructor(private gridMangerService: GridManagerService,
        private puzzleEventManager: PuzzleEventManagerService,
        private restApiProxyService: RestApiProxyService,
        private stopwatchService : StopwatchService) {
            this.time = { 'seconds':0, 'minute':0, 'hour':0 };
            this.hiddenClock = false;
    }

    // Initialization
    ngOnInit() {
        this.restApiProxyService.getNewPuzzle()
            .subscribe((puzzle) => {
                // The puzzle to display when binding the model to the input box,
                // must not contains the solution. We need to extract the new puzzle
                // for the user.
                this._newPuzzle = this.extractTheNewPuzzle(puzzle);
            });

        // Observable.timer(5000,1000).subscribe(() =>{
        //     this.stopwatchService.updateClock();
        //     this.time.seconds = this.stopwatchService.seconds;
        //     this.time.minute = this.stopwatchService.minutes;
        //     this.time.hour = this.stopwatchService.hours;
        // });
    }

    /**
     * The extractNewPuzzle function, extract the new puzzle without the solution.
     *
     * @class GridComponent
     * @method extractTheNewPuzzle
     * @return Puzzle
     */
    extractTheNewPuzzle(puzzle: Puzzle) {

        if (puzzle === null) {
            throw new Error("The parameter cannot be null");
        }
        puzzle._puzzle.forEach(function (puzzleItems) {
            puzzleItems.forEach(function (puzzleItem) {
                puzzleItem._value = (puzzleItem._hide) ? null : puzzleItem._value;
            });
        });
        return puzzle;
    }

    // Handle the directions key event by using the EventManager
    onKeyDownEventHandler(event: KeyboardEvent) {
        this.puzzleEventManager.onKeyEventUpdateCurrentCursor(event);
    }

    // Handle the input value changed event from grid
    onValueChange(event: KeyboardEvent) {

        let rowColIndex = event.srcElement.id.split('');
        let rowIndex = Number(rowColIndex[PuzzleCommon.yPosition]);
        let colIndex = Number(rowColIndex[PuzzleCommon.xPosition]);

        if (event.keyCode === PuzzleCommon.backspaceKeyCode) {
            this.gridMangerService.deleteCurrentValue(rowIndex, colIndex);
        }
        else {
            this.gridMangerService.validateEnteredNumber(this._newPuzzle, rowIndex, colIndex);
        }
    }

    // Initialize the current grid
    initializeCurrentGrid() {

        if (this._newPuzzle === null
            || this._newPuzzle._puzzle == null) {
            throw new Error("The initial grid cannot be null.");
        }

        this.gridMangerService.initializeGrid(this._newPuzzle);
    }

    // Use to check if a value is a Sudoku number
    validateInputValue(event: KeyboardEvent) {
        if (event === null) {
            throw new Error("No event source is provided.");
        }

        if (!this.puzzleEventManager.isSudokuNumber(event.which)) {
            return false;
        }
    }

    hideClock() {
        this.hiddenClock = !this.hiddenClock;
    }
}
