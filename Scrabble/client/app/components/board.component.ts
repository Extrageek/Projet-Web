import { Component } from "@angular/core";
import { BoardService } from "../services/board.service";
import { Square } from '../models/square/square';
import { Board } from '../models/board/board';

@Component({
    moduleId: module.id,
    providers: [BoardService],
    selector: "scrabble-main-board-selector",
    templateUrl: "../../assets/templates/scrabble.html",
    styleUrls: ["../../assets/stylesheets/scrabble-board.css"]
})

export class ScrabbleBoardComponent {
    scrabbleGrid: Board;

    constructor(scrabbleBoardService: BoardService) {
        this.scrabbleGrid = scrabbleBoardService.board;
    }
}
