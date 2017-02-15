import { BoardRows } from './board-rows';
import { BoardColumn } from './board-column';
import { BoardCase } from './board-case';
import { CasePosition } from './case-position';


const BOARD_SIZE = 15;

export class Board {
    private _boardCase: BoardCase;
    public get boardCase(): BoardCase {
        return this._boardCase;
    }
    public set boardCase(v: BoardCase) {
        this._boardCase = v;
    }

    constructor() {
        this.generateBoard();
    }

    private generateBoard(): void {
        let row: number;
        let colomn: number;
        let board: Array<Array<BoardCase>>;

        for (row = BoardRows.A; row < BOARD_SIZE; row++) {
            let innerRow: Array<BoardCase>;
            for (colomn = BoardColumn.FIRST_COLUMN; colomn < BOARD_SIZE; colomn++) {
                innerRow.push(new BoardCase(new CasePosition(row, colomn)));
            }
            board.push(innerRow);
        }
    }
}
