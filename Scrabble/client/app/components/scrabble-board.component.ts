import { Component } from "@angular/core";
import { ScrabbleBoardService } from "../services/scrabble-board.service";
import { Square } from '../models/board/square';
import { Board } from '../models/board/board';

@Component({
    moduleId: module.id,
    providers: [ScrabbleBoardService],
    selector: "scrabble-main-board-selector",
    templateUrl: "../../assets/templates/scrabble.html",
    styleUrls: ["../../assets/stylesheets/scrabble-board.css"]
})

export class ScrabbleBoardComponent {
    scrabbleGrid: Board;
    currentRows: number[];

    constructor(scrabbleBoardService: ScrabbleBoardService) {
        this.currentRows = Array(15).fill(0);
        this.scrabbleGrid = scrabbleBoardService.board;
    }
}
