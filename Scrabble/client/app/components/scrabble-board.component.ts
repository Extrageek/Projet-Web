import { Component } from '@angular/core';
import { ScrabbleBoardService } from '../services/scrabbleBoardService';
    @Component({
    moduleId: module.id,
    providers: [ScrabbleBoardService],
    selector: 'scrabble-main-board-selector',
    templateUrl: '../../app/views/scrabble.html',
    styleUrls: ['../../app/assets/scrabble-board.css']
})

export class ScrabbleBoardComponent {
    scrabbleGrid: string[][];
    currentRows: number[];

    constructor(scrabbleBoardService : ScrabbleBoardService) {
        this.currentRows = Array(15).fill(0);
        this.scrabbleGrid = scrabbleBoardService.getScrabbleGrid();
    }
}
