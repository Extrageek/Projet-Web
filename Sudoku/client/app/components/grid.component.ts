/**
 * grid.component.ts - Represents a component which display the grid of the Sudoku.
 *
 * @authors ...
 * @date 2017/01/22
 */

import { Component, OnInit } from '@angular/core';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/interval';

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
    templateUrl: "../../assets/html/grid.component.html",
    styleUrls: ["../../assets/css/grid.component.css"],
    providers: [GridManagerService, PuzzleEventManagerService, RestApiProxyService, StopwatchService]
})

export class GridComponent implements OnInit {
    _newPuzzle: Puzzle;
    _userSetting: UserSetting;
    _time: Time;
    hiddenClock : boolean;

    constructor(
        private gridMangerService: GridManagerService,
        private puzzleEventManager: PuzzleEventManagerService,
        private userSettingService: UserSettingService,
        private api: RestApiProxyService,
        private stopwatchService: StopwatchService)
        {
    }

    // Initialization
    ngOnInit() {
        this._userSetting = this.userSettingService.userSetting;
        this._time = new Time();
        this.api.getNewPuzzle()
            .subscribe((puzzle) => {
                // The puzzle to display when binding the model to the input box,
                // must not contains the solution. We need to extract the new puzzle
                // for the user.
                this._newPuzzle = this.extractTheNewPuzzle(puzzle);
            });

        Observable.timer(5000,1000).subscribe(() =>{
            this.stopwatchService.updateClock();
            this._time.seconds = this.stopwatchService.seconds;
            this._time.minutes = this.stopwatchService.minute;
            this._time.hours = this.stopwatchService.hour;
        });
    }

    @HostListener('window:beforeunload', ['$event'])
    saveAndLogout(event: Event) {
        this.api.createGameRecord(this._userSetting, this._time);
        this.api.removeUsername(this._userSetting.name);
        event.stopImmediatePropagation();
    }

    /**
     * The extractNewPuzzle function, extract the new puzzle without the solution.
     *
     * @class GridComponent
     * @method extractTheNewPuzzle
     * @return Puzzle
     */
    public extractTheNewPuzzle(puzzle: Puzzle) {

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
    public onKeyDownEventHandler(event: KeyboardEvent) {
        this.puzzleEventManager.onKeyEventUpdateCurrentCursor(event);
    }

    // Handle the input value changed event from grid
    public onValueChange(event: KeyboardEvent) {

        let rowColIndex = event.srcElement.id.split('');
        let rowIndex = Number(rowColIndex[PuzzleCommon.yPosition]);
        let colIndex = Number(rowColIndex[PuzzleCommon.xPosition]);

        if (event.keyCode === PuzzleCommon.backspaceKeyCode) {
            this.gridManagerService.deleteCurrentValue(this._newPuzzle, rowIndex, colIndex);
        }

        else if (this.puzzleEventManager.isSudokuNumber(event.which)){
            this.gridManagerService.validateEnteredNumber(this._newPuzzle, rowIndex, colIndex);
        }
    }

    // Initialize the current grid
    public initializeCurrentGrid() {

        if (this._newPuzzle === null
            || this._newPuzzle._puzzle == null) {
            throw new Error("The initial grid cannot be null.");
        }

        this.gridManagerService.initializeGrid(this._newPuzzle);
    }

    // Use to check if a value is a Sudoku number
    public validateInputValue(event: KeyboardEvent) {
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
