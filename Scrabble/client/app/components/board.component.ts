import { Component } from "@angular/core";
import { Square } from '../models/square/square';
import { Board } from '../models/board/board';

@Component({
    moduleId: module.id,
    selector: "scrabble-main-board-selector",
    templateUrl: "../../assets/templates/scrabble.html",
    styleUrls: ["../../assets/stylesheets/scrabble-board.css"]
})

export class ScrabbleBoardComponent {
    private _scrabbleGrid : Board;
    public get scrabbleGrid() : Board {
        return this._scrabbleGrid;
    }

    constructor() {
        this._scrabbleGrid = new Board();
    }
}
