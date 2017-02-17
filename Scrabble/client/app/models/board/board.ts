import { BoardRows } from './board-rows';
import { BoardColumn } from './board-column';
import { Square } from '../square/square';
import { SquarePosition } from '../square/square-position';
import { SquareType } from '../square/square-type';

const BOARD_SIZE = 15;

export class Board {
    private _board: Array<Array<Square>>;
    public get board(): Array<Array<Square>> {
        return this._board;
    }
    public set board(_board: Array<Array<Square>>) {
        this._board = _board;
    }

    constructor() {
        this._board = new Array<Array<Square>>();
        this.generateBoard();
        this.assignTypesToSquares();
    }

    private generateBoard(): void {
        let row: number;
        let colomn: number;
        let innerRow: Array<Square>;

        for (row = BoardRows.A; row <= BOARD_SIZE; row++) {
            innerRow = new Array<Square>();
            for (colomn = BoardColumn.FIRST_COLUMN; colomn <= BOARD_SIZE; colomn++) {
                innerRow.push(new Square(new SquarePosition(row, colomn), SquareType.normal));
            }
            this.board.push(innerRow);
        }
    }

    private assignTypesToSquares(): void {
        this.assignStarToSquare();
        this.assignTripleWordCountToSquare();
        this.assignDoubleWordCountToSquare();
        this.assignTripleLetterCountToSquare();
        this.assignDoubleLetterCountToSquare();
    }

    private assignStarToSquare(): void {
        this.board[7][7].type = SquareType.star;
    }

    private assignTripleWordCountToSquare(): void {
        this.board[0][0].type = SquareType.tripleWordCount;
        this.board[0][7].type = SquareType.tripleWordCount;
        this.board[0][14].type = SquareType.tripleWordCount;
        this.board[7][0].type = SquareType.tripleWordCount;
        this.board[7][14].type = SquareType.tripleWordCount;
        this.board[14][0].type = SquareType.tripleWordCount;
        this.board[14][7].type = SquareType.tripleWordCount;
        this.board[14][14].type = SquareType.tripleWordCount;
    }

    private assignDoubleWordCountToSquare(): void {
        this.board[1][1].type = SquareType.doubleWordCount;
        this.board[1][13].type = SquareType.doubleWordCount;
        this.board[2][2].type = SquareType.doubleWordCount;
        this.board[2][12].type = SquareType.doubleWordCount;
        this.board[3][3].type = SquareType.doubleWordCount;
        this.board[3][11].type = SquareType.doubleWordCount;
        this.board[4][4].type = SquareType.doubleWordCount;
        this.board[4][10].type = SquareType.doubleWordCount;
        this.board[10][4].type = SquareType.doubleWordCount;
        this.board[10][10].type = SquareType.doubleWordCount;
        this.board[11][11].type = SquareType.doubleWordCount;
        this.board[11][3].type = SquareType.doubleWordCount;
        this.board[12][2].type = SquareType.doubleWordCount;
        this.board[12][12].type = SquareType.doubleWordCount;
        this.board[13][1].type = SquareType.doubleWordCount;
        this.board[13][13].type = SquareType.doubleWordCount;
    }

    private assignTripleLetterCountToSquare(): void {
        this.board[1][5].type = SquareType.tripleLetterCount;
        this.board[1][9].type = SquareType.tripleLetterCount;
        this.board[5][1].type = SquareType.tripleLetterCount;
        this.board[5][5].type = SquareType.tripleLetterCount;
        this.board[5][9].type = SquareType.tripleLetterCount;
        this.board[5][13].type = SquareType.tripleLetterCount;
        this.board[9][1].type = SquareType.tripleLetterCount;
        this.board[9][5].type = SquareType.tripleLetterCount;
        this.board[9][9].type = SquareType.tripleLetterCount;
        this.board[9][13].type = SquareType.tripleLetterCount;
        this.board[13][5].type = SquareType.tripleLetterCount;
        this.board[13][9].type = SquareType.tripleLetterCount;
    }

    private assignDoubleLetterCountToSquare(): void {
        this.board[0][3].type = SquareType.doubleLetterCount;
        this.board[2][6].type = SquareType.doubleLetterCount;
        this.board[2][8].type = SquareType.doubleLetterCount;
        this.board[3][0].type = SquareType.doubleLetterCount;
        this.board[3][7].type = SquareType.doubleLetterCount;
        this.board[3][14].type = SquareType.doubleLetterCount;
        this.board[6][2].type = SquareType.doubleLetterCount;
        this.board[6][12].type = SquareType.doubleLetterCount;
        this.board[6][6].type = SquareType.doubleLetterCount;
        this.board[6][8].type = SquareType.doubleLetterCount;
        this.board[7][3].type = SquareType.doubleLetterCount;
        this.board[7][11].type = SquareType.doubleLetterCount;
        this.board[8][2].type = SquareType.doubleLetterCount;
        this.board[8][6].type = SquareType.doubleLetterCount;
        this.board[8][8].type = SquareType.doubleLetterCount;
        this.board[8][12].type = SquareType.doubleLetterCount;
        this.board[11][0].type = SquareType.doubleLetterCount;
        this.board[11][7].type = SquareType.doubleLetterCount;
        this.board[11][14].type = SquareType.doubleLetterCount;
        this.board[12][6].type = SquareType.doubleLetterCount;
        this.board[12][8].type = SquareType.doubleLetterCount;
        this.board[14][3].type = SquareType.doubleLetterCount;
        this.board[14][11].type = SquareType.doubleLetterCount;
    }
}
