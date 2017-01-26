import { Injectable } from '@angular/core';


import { PuzzleCommon} from '../commons/puzzle-common';
import { Puzzle, PuzzleItem } from '../models/puzzle';

@Injectable()
export class PuzzleManagerService {
    _puzzle: Puzzle;

    constructor() {
        // Default constructor
    }

    //  Check if the value is valid
    public isValidValue(puzzle: Puzzle, rowIndex: number, columnIndex: number): boolean {
        let grid = puzzle.puzzle;

        //console.log(grid);

        // TODO: Must be completed
        return (this.isValidRow(grid, rowIndex, columnIndex));
        //     && this.isValidColumn(grid, rowIndex, columnIndex)
        // && this.isValidSquare(grid, rowIndex, columnIndex))? true : false;
    }

    // Check if the row is valid.
    isValidRow(grid: PuzzleItem[][], rowIndex: number, columnIndex: number) {
        let item = grid[rowIndex][columnIndex];

        for (let column = 0; column <= PuzzleCommon.maxColumnIndex; ++column) {
            console.log(grid[rowIndex][column], item);
            if (Number(grid[rowIndex][column].value) === item.value
                && (column !== columnIndex)) {
                return false;
            }
        }
        return true;
    }

    // Check if the column is valid.
    isValidColumn(grid: PuzzleItem[][], rowIndex: number, columnIndex: number) {
        let item = grid[rowIndex][columnIndex];

        for (let row = 0; row <= PuzzleCommon.maxColumnIndex; ++row) {
            if (grid[row][columnIndex] === item) {
                return false;
            }
        }
        return true;
    }

    // Check if the square around the value is valid.
    isValidSquare(grid: PuzzleItem[][], rowIndex: number, columnIndex: number) {
        let item = grid[rowIndex][columnIndex];

        // for(let row = 0; row <= PuzzleCommon.maxColumnIndex; row++){
        //     if(this.puzzle[row][columnIndex]===item){
        //         return false;
        //     }
        // }
        return true;
    }
}
