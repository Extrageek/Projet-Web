/**
 * grid.component.ts - Represents a component which display the grid of the Sudoku.
 *
 * @authors ...
 * @date 2017/01/22
 */

import { Component, OnInit, HostListener } from '@angular/core';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/timer';

declare var jQuery: any;

import { RestApiProxyService } from '../services/rest-api-proxy.service';
import { GridManagerService } from '../services/grid-manager.service';
import { UserSettingService } from '../services/user-setting.service';
import { PuzzleEventManagerService } from '../services/puzzle-event-manager.service';
import { StopwatchService } from "../services/stopwatch.service";

import { PuzzleCommon } from '../commons/puzzle-common';
import { Puzzle } from '../models/puzzle';
import { UserSetting } from '../models/user-setting';

import { Observable } from 'rxjs/Observable';
import { Time } from "../models/time";


//noinspection TsLint
@Component({
    moduleId: module.id,
    selector: 'sudoku-grid',
    templateUrl: "/assets/templates/grid.component.html",
    styleUrls: ["../../assets/stylesheets/grid.component.css"],
    providers: [GridManagerService, PuzzleEventManagerService, RestApiProxyService, StopwatchService]
})

export class GridComponent implements OnInit {
    _newPuzzle: Puzzle;
    _userSetting: UserSetting;
    _time: Time;
    _hiddenClock: boolean;


    constructor(
        private gridManagerService: GridManagerService,
        private puzzleEventManager: PuzzleEventManagerService,
        private userSettingService: UserSettingService,
        private api: RestApiProxyService,
        private stopwatchService: StopwatchService) {
    }

    // Initialization
    ngOnInit() {
        this._userSetting = this.userSettingService.userSetting;
        this._time = new Time();
        this.api.getNewPuzzle()
            .subscribe((puzzle) => {
                this._newPuzzle = puzzle;
                this.gridManagerService.countFilledCell(puzzle);
            });
        Observable.timer(0, 1000).subscribe(() => {
            this.stopwatchService.updateClock();
            this._time.seconds = this.stopwatchService.seconds;
            this._time.minutes = this.stopwatchService.minutes;
            this._time.hours = this.stopwatchService.hours;
        });
    }

    @HostListener('window:beforeunload', ['$event'])
    saveAndLogout(event: Event) {
        this.api.createGameRecord(this._userSetting, this._time);
        this.api.removeUsername(this._userSetting.name);
        event.stopImmediatePropagation();
    }


    // Handle the directions key event by using the EventManager
    public onKeyDownEventHandler(event: KeyboardEvent, id: string) {
        this.puzzleEventManager.onKeyEventUpdateCurrentCursor(event, id);
    }

    // Handle the input value changed event from grid
    public onValueChange(event: KeyboardEvent, id: string) {

        let rowColIndex = id.split('');
        let rowIndex = Number(rowColIndex[PuzzleCommon.yPosition]);
        let colIndex = Number(rowColIndex[PuzzleCommon.xPosition]);

        if (event.keyCode === PuzzleCommon.backspaceKeyCode) {
            if (this._newPuzzle._puzzle[rowIndex][colIndex]._value !== null) {
                this.gridManagerService.deleteCurrentValue(this._newPuzzle, rowIndex, colIndex);
            }
        }

        else if (this.puzzleEventManager.isSudokuNumber(event.which)) {
            this.gridManagerService.validateEnteredNumber(this._newPuzzle, rowIndex, colIndex);
            if (this.gridManagerService.cellsToBeCompleted === 0) {
                console.log(this.api.verifyGrid(this._newPuzzle));
            }
        }
    }

    // Initialize the current grid
    public initializeCurrentGrid() {

        // TODO: disabled button during loading
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
        this._hiddenClock = !this._hiddenClock;
    }
}
