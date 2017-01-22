/**
 * grid.component.ts - Represents a component which display the grid of the Sudoku.
 *
 * @authors ...
 * @date 2017/01/22
 */

import { Component, OnInit } from '@angular/core';

import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { RestApiProxyService } from '../services/rest-api-proxy.service';
import { PuzzleEventManagerService } from '../services/puzzle-event-manager.service';
import { PuzzleCommon } from '../commons/puzzle-common';
import { Puzzle, PuzzleItem } from '../models/puzzle';

@Component({
    moduleId: module.id,
    selector: 'sudoku-grid',
    template: `
        <div  class="form-control" class="grid-box">
            <div  class="grid" *ngFor = "let row of _puzzle?.puzzle , let i = index">
                <ng-container *ngFor ="let cell of row, let j = index">
                    <input *ngIf ="!cell.hide" readonly class="generatedValue" type="text" name=""
                    [attr.id]="i +''+ j" [ngModel]="cell.value" (keydown)="onKeyEventHandler($event)">

                    <input *ngIf ="cell.hide" type="text" name="" 
                    [attr.id]="i +''+ j"  [ngModel]="" (keydown)="onKeyEventHandler($event)">
                </ng-container>
            </div>
        </div>

    `,
    styles:[`
        .generatedValue {
            color:#fff;
            background-color:#78909c;
        }
    `],
    providers : [ 
        PuzzleEventManagerService,
        RestApiProxyService ]
})

export class GridComponent implements OnInit {

    _puzzle : Puzzle;

    // Defaut constructor
    constructor(private puzzleEventManager : PuzzleEventManagerService,
                private restApiProxyService: RestApiProxyService) { }

    // Initialization
    ngOnInit() { 
        this.restApiProxyService.getNewPuzzle()
            .subscribe(puzzle => this._puzzle = puzzle );
    }

    // Handle the directions key event by using the EventManager
    onKeyEventHandler(event:KeyboardEvent) {
       this.puzzleEventManager.onKeyEventUpdateCurrentCursor(event);  
    }
}