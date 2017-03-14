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

    private _column: number;
    public get column(): number {
        return this._column;
    }
    public set column(column: number) {
        this._column = column;
    }

    constructor(row: string, column: number) {
        this.row = row;
        this.column = column;
    }
}
