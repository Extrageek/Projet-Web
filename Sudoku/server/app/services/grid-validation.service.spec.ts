import { assert, expect } from 'chai';

import { GridValidationManager } from './grid-validation.service';
import { Puzzle, PuzzleItem } from './../models/puzzle';

let gridValidationManager = new GridValidationManager();

describe('Grid Validation Manager', () => {
    it("isRowValid, Should return false because of a null value",
        () => {
            let puzzle = new Puzzle();
            puzzle._puzzle[0][0]._value = null;
            expect(gridValidationManager.isRowValid(puzzle._puzzle, 0)).to.be.false;
        }
    );

    it("isRowValid, Should return false with a duplicated number error in the current row",
        () => {
            // let isRowValid = gridValidationManagerRewire.__get__('isRowValid');
            expect(gridValidationManager.isRowValid(GRID_NOT_VALID, 0)).to.be.false;
        }
    );

    it("isRowValid, Should return true for a valid row",
        () => {
            // let isRowValid = gridValidationManagerRewire.__get__('isRowValid');
            expect(gridValidationManager.isRowValid(GRID_VALID, 0)).to.be.true;
        }
    );

    it("validateRows, Should return true for a grid with valid rows",
        () => {
            // let validateRows = gridValidationManagerRewire.__get__('validateRows');
            expect(gridValidationManager.validateRows(GRID_VALID)).to.be.true;
        }
    );

    it("validateRows, Should return false for a grid with at least an invalid row",
        () => {
            // let validateRows = gridValidationManagerRewire.__get__('validateRows');
            expect(gridValidationManager.validateRows(GRID_NOT_VALID)).to.be.false;
        }
    );

    it("isColumnValid, Should return false because of a null value",
        () => {
            let puzzle = new Puzzle();
            puzzle._puzzle[0][0]._value = null;
            expect(gridValidationManager.isColumnValid(puzzle._puzzle, 0)).to.be.false;
        }
    );

    it("isColumnValid, Should return false with a duplicated number error in the current column",
        () => {
            // let isColumnValid = gridValidationManagerRewire.__get__('isColumnValid');
            expect(gridValidationManager.isColumnValid(GRID_NOT_VALID, 0)).to.be.false;
        }
    );

    it("isColumnValid, Should return true for a valid column",
        () => {
            // let isColumnValid = gridValidationManagerRewire.__get__('isColumnValid');
            expect(gridValidationManager.isColumnValid(GRID_VALID, 0)).to.be.true;
        }
    );

    it("validateColumns, Should return true for a grid with valid columns",
        () => {
            // let validateColumns = gridValidationManagerRewire.__get__('validateColumns');
            expect(gridValidationManager.validateColumns(GRID_VALID)).to.be.true;
        }
    );

    it("validateColumns, Should return false for a grid with at least an invalid column",
        () => {
            // let validateColumns = gridValidationManagerRewire.__get__('validateColumns');
            expect(gridValidationManager.validateColumns(GRID_NOT_VALID)).to.be.false;
        }
    );

    it("isSquareValid, Should return false because of a null value",
        () => {
            let puzzle = new Puzzle();
            puzzle._puzzle[0][0]._value = null;
            expect(gridValidationManager.isSquareValid(puzzle._puzzle, 0, 0)).to.be.false;
        }
    );

    it("isSquareValid, Should return false with a duplicated number error in the first square",
        () => {
            // let isSquareValid = gridValidationManagerRewire.__get__('isSquareValid');
            expect(gridValidationManager.isSquareValid(GRID_NOT_VALID, 0, 0)).to.be.false;
        }
    );

    it("isSquareValid, Should return true for a valid square",
        () => {
            // let isSquareValid = gridValidationManagerRewire.__get__('isSquareValid');
            expect(gridValidationManager.isSquareValid(GRID_VALID, 0, 0)).to.be.true;
        }
    );

    it("validateSquares, Should return true for a grid with valid squares",
        () => {
            // let validateSquares = gridValidationManagerRewire.__get__('validateSquares');
            expect(gridValidationManager.validateSquares(GRID_VALID)).to.be.true;
        }
    );

    it("validateSquares, Should return false for a grid with at least an invalid sqaure",
        () => {
            // let validateSquares = gridValidationManagerRewire.__get__('validateSquares');
            expect(gridValidationManager.validateSquares(GRID_NOT_VALID)).to.be.false;
        }
    );

    it("validateGrid, Should return true for a valid grid",
        () => {
            // let gridValidationManager = new GridValidationManager();
            expect(gridValidationManager.validateGrid(GRID_VALID)).to.be.true;
        }
    );

    it("validateGrid, Should return false for a grid with at least an invalid sqaure",
        () => {
            // let gridValidationManager = new GridValidationManager();
            expect(gridValidationManager.validateGrid(GRID_NOT_VALID)).to.be.false;
        }
    );
});


const GRID_VALID = [
    [
        new PuzzleItem(4, true), new PuzzleItem(1, true), new PuzzleItem(5, true),
        new PuzzleItem(6, true), new PuzzleItem(3, false), new PuzzleItem(8, true),
        new PuzzleItem(9, true), new PuzzleItem(7, true), new PuzzleItem(2, false)
    ],
    [
        new PuzzleItem(3, true), new PuzzleItem(6, false), new PuzzleItem(2, false),
        new PuzzleItem(4, false), new PuzzleItem(7, true), new PuzzleItem(9, true),
        new PuzzleItem(1, true), new PuzzleItem(8, false), new PuzzleItem(5, true)
    ],
    [
        new PuzzleItem(7, false), new PuzzleItem(8, true), new PuzzleItem(9, true),
        new PuzzleItem(2, false), new PuzzleItem(1, true), new PuzzleItem(5, false),
        new PuzzleItem(3, true), new PuzzleItem(6, true), new PuzzleItem(4, true)
    ],
    [
        new PuzzleItem(9, true), new PuzzleItem(2, true), new PuzzleItem(6, false),
        new PuzzleItem(3, true), new PuzzleItem(4, true), new PuzzleItem(1, true),
        new PuzzleItem(7, true), new PuzzleItem(5, true), new PuzzleItem(8, false)
    ],
    [
        new PuzzleItem(1, true), new PuzzleItem(3, true), new PuzzleItem(8, true),
        new PuzzleItem(7, true), new PuzzleItem(5, true), new PuzzleItem(6, true),
        new PuzzleItem(4, true), new PuzzleItem(2, true), new PuzzleItem(9, true)
    ],
    [
        new PuzzleItem(5, true), new PuzzleItem(7, false), new PuzzleItem(4, true),
        new PuzzleItem(9, true), new PuzzleItem(8, true), new PuzzleItem(2, true),
        new PuzzleItem(6, true), new PuzzleItem(3, false), new PuzzleItem(1, true)
    ],
    [
        new PuzzleItem(2, false), new PuzzleItem(5, true), new PuzzleItem(7, true),
        new PuzzleItem(1, false), new PuzzleItem(6, true), new PuzzleItem(4, false),
        new PuzzleItem(8, false), new PuzzleItem(9, true), new PuzzleItem(3, true)
    ],
    [
        new PuzzleItem(8, true), new PuzzleItem(4, true), new PuzzleItem(3, true),
        new PuzzleItem(5, false), new PuzzleItem(9, true), new PuzzleItem(7, true),
        new PuzzleItem(2, true), new PuzzleItem(1, true), new PuzzleItem(6, true)
    ],
    [
        new PuzzleItem(6, true), new PuzzleItem(9, true), new PuzzleItem(1, true),
        new PuzzleItem(8, false), new PuzzleItem(2, false), new PuzzleItem(3, true),
        new PuzzleItem(5, true), new PuzzleItem(4, true), new PuzzleItem(7, false)
    ]
];

// ERROR on the first row (two 4 : column 0 and 1)
// ERROR on the first column (two 4 : row 0 and 3)
// ERROR on the first square (two 4 : pos 00 and 01)
const GRID_NOT_VALID = [
    [
        new PuzzleItem(4, true), new PuzzleItem(4, true), new PuzzleItem(5, true),
        new PuzzleItem(6, true), new PuzzleItem(3, false), new PuzzleItem(8, true),
        new PuzzleItem(9, true), new PuzzleItem(7, true), new PuzzleItem(2, false)
    ],
    [
        new PuzzleItem(3, true), new PuzzleItem(6, false), new PuzzleItem(2, false),
        new PuzzleItem(4, false), new PuzzleItem(7, true), new PuzzleItem(9, true),
        new PuzzleItem(1, true), new PuzzleItem(8, false), new PuzzleItem(5, true)
    ],
    [
        new PuzzleItem(7, false), new PuzzleItem(8, true), new PuzzleItem(9, true),
        new PuzzleItem(2, false), new PuzzleItem(1, true), new PuzzleItem(5, false),
        new PuzzleItem(3, true), new PuzzleItem(6, true), new PuzzleItem(4, true)
    ],
    [
        new PuzzleItem(4, true), new PuzzleItem(2, true), new PuzzleItem(6, false),
        new PuzzleItem(3, true), new PuzzleItem(4, true), new PuzzleItem(1, true),
        new PuzzleItem(7, true), new PuzzleItem(5, true), new PuzzleItem(8, false)
    ],
    [
        new PuzzleItem(1, true), new PuzzleItem(3, true), new PuzzleItem(8, true),
        new PuzzleItem(7, true), new PuzzleItem(5, true), new PuzzleItem(6, true),
        new PuzzleItem(4, true), new PuzzleItem(2, true), new PuzzleItem(9, true)
    ],
    [
        new PuzzleItem(5, true), new PuzzleItem(7, false), new PuzzleItem(4, true),
        new PuzzleItem(9, true), new PuzzleItem(8, true), new PuzzleItem(2, true),
        new PuzzleItem(6, true), new PuzzleItem(3, false), new PuzzleItem(1, true)
    ],
    [
        new PuzzleItem(2, false), new PuzzleItem(5, true), new PuzzleItem(7, true),
        new PuzzleItem(1, false), new PuzzleItem(6, true), new PuzzleItem(4, false),
        new PuzzleItem(8, false), new PuzzleItem(9, true), new PuzzleItem(3, true)
    ],
    [
        new PuzzleItem(8, true), new PuzzleItem(4, true), new PuzzleItem(3, true),
        new PuzzleItem(5, false), new PuzzleItem(9, true), new PuzzleItem(7, true),
        new PuzzleItem(2, true), new PuzzleItem(1, true), new PuzzleItem(6, true)
    ],
    [
        new PuzzleItem(6, true), new PuzzleItem(9, true), new PuzzleItem(1, true),
        new PuzzleItem(8, false), new PuzzleItem(2, false), new PuzzleItem(3, true),
        new PuzzleItem(5, true), new PuzzleItem(4, true), new PuzzleItem(7, false)
    ]
];