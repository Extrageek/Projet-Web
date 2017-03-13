import { BoardRows } from "../board/board-rows";
import { BoardColumn } from "../board/board-column";

export class SquarePosition {
    private _row: string;
    public get row(): string {
        return this._row;
    }
    public set row(row: string) {
        this._row = row;
    }

    private _column: BoardColumn;
    public get column(): BoardColumn {
        return this._column;
    }
    public set column(column: BoardColumn) {
        this._column = column;
    }

    constructor(row: string, column: BoardColumn) {
        this.row = row;
        this.column = column;
    }
}
