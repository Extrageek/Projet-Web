import { BoardRows } from './board-rows';
import { BoardColumn } from './board-column';

export class SquarePosition {
    private _row: BoardRows;
    public get row(): BoardRows {
        return this._row;
    }
    public set row(row: BoardRows) {
        this._row = row;
    }

    private _column: BoardColumn;
    public get column(): BoardColumn {
        return this._column;
    }
    public set column(column: BoardColumn) {
        this._column = column;
    }

    constructor(row: BoardRows, column: BoardColumn) {
        this.row = row;
        this.column = column;
    }
}
