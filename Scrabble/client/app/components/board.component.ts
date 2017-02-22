import { Component } from "@angular/core";
import { Square } from '../models/square/square';
import { Board } from '../models/board/board';

@Component({
    moduleId: module.id,
    providers: [Board],
    selector: "scrabble-main-board-selector",
    templateUrl: "../../assets/templates/scrabble.html",
    styleUrls: ["../../assets/stylesheets/scrabble-board.css"]
})

export class ScrabbleBoardComponent {
    scrabbleGrid: Board;

    constructor(scrabbleBoard: Board) {
        this.scrabbleGrid = new Board();
    }
}
