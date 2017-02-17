import { Injectable } from '@angular/core';
import { Board } from '../models/board/board';
import { Square } from '../models/square/square';

@Injectable()
export class BoardService {

    private _board: Board;
    public get board(): Board {
        return this._board;
    }
    public set board(board: Board) {
        this._board = board;
    }

    constructor() {
        this.board = new Board();
    }
}
