import { expect } from "chai";
import { GridSolver, FittingNumbers } from "./grid-solver.service";
import { Puzzle } from "../models/Puzzle";

describe("GridSolver should", () => {

    let gridSolver: GridSolver;
    let puzzleUsed: Puzzle;

    beforeEach(() => {
        puzzleUsed = new Puzzle();
        gridSolver = new GridSolver(puzzleUsed);
    });

    it("throw an exception because the row index is not valid.", () => {
        expect(gridSolver.getNumberOfSolutionsAfterRemovingNumber.bind(gridSolver, -1, 0)).to.throw(Error);
    });

    it("throw an exception because the column index is not valid.", () => {
        expect(gridSolver.getNumberOfSolutionsAfterRemovingNumber.bind(gridSolver, 0, -1)).to.throw(Error);
    });

    it("throw an exception because the number is not hidden.", () => {
        expect(gridSolver.getNumberOfSolutionsAfterRemovingNumber.bind(gridSolver, 0, 0)).to.throw(Error);
    });

    it("say there is one possible value at a tile when everything else is filled.", () => {
        puzzleUsed.setPuzzleTileVisibility(2, 2, true);
        expect(gridSolver.findPossibleValuesAtAPosition(2, 2)).to.be.deep.equal([9]);
    });

    it("say there is only one possible number because of the numbers in a row", () => {
        puzzleUsed.hideAllItemsInRange(1, Puzzle.MAX_ROW_INDEX
            , Puzzle.MIN_COLUMN_INDEX, Puzzle.MAX_COLUMN_INDEX);
        puzzleUsed.setPuzzleTileVisibility(0, 2, true);
        expect(gridSolver.findPossibleValuesAtAPosition(0, 2)).to.deep.equal([3]);
    });

    it("say there is only one possible number because of the numbers in a column", () => {
        puzzleUsed.hideAllItemsInRange(Puzzle.MIN_ROW_INDEX, Puzzle.MAX_ROW_INDEX
            , 1, Puzzle.MAX_COLUMN_INDEX);
        puzzleUsed.setPuzzleTileVisibility(2, 0, true);
        expect(gridSolver.findPossibleValuesAtAPosition(2, 0)).to.deep.equal([7]);
    });

    it("say there is only one possible number because of the numbers in a square", () => {
        puzzleUsed.hideAllItemsInRange(Puzzle.MIN_ROW_INDEX, Puzzle.MAX_ROW_INDEX
            , Puzzle.MIN_COLUMN_INDEX, Puzzle.MAX_COLUMN_INDEX);
        puzzleUsed.setPuzzleTileVisibility(0, 0, false);
        puzzleUsed.setPuzzleTileVisibility(0, 1, false);
        puzzleUsed.setPuzzleTileVisibility(0, 2, false);
        puzzleUsed.setPuzzleTileVisibility(1, 0, false);
        puzzleUsed.setPuzzleTileVisibility(1, 1, false);
        puzzleUsed.setPuzzleTileVisibility(2, 0, false);
        puzzleUsed.setPuzzleTileVisibility(2, 1, false);
        puzzleUsed.setPuzzleTileVisibility(2, 2, false);
        expect(gridSolver.findPossibleValuesAtAPosition(1, 2)).to.deep.equal([6]);
    });

    it("say there is no possible number to put", () => {
        puzzleUsed.hideAllItemsInRange(Puzzle.MIN_ROW_INDEX, Puzzle.MAX_ROW_INDEX
            , Puzzle.MIN_COLUMN_INDEX, Puzzle.MAX_COLUMN_INDEX);
        puzzleUsed.setPuzzleTileVisibility(3, 2, false);
        puzzleUsed.setPuzzleTileValue(3, 2, 3);
        puzzleUsed.setPuzzleTileVisibility(0, 0, false);
        puzzleUsed.setPuzzleTileValue(0, 0, 1);
        puzzleUsed.setPuzzleTileVisibility(0, 1, false);
        puzzleUsed.setPuzzleTileValue(0, 1, 2);
        puzzleUsed.setPuzzleTileVisibility(1, 0, false);
        puzzleUsed.setPuzzleTileValue(1, 0, 4);
        puzzleUsed.setPuzzleTileVisibility(1, 1, false);
        puzzleUsed.setPuzzleTileValue(1, 1, 5);
        puzzleUsed.setPuzzleTileVisibility(1, 2, false);
        puzzleUsed.setPuzzleTileValue(1, 2, 6);
        puzzleUsed.setPuzzleTileVisibility(2, 0, false);
        puzzleUsed.setPuzzleTileValue(2, 0, 7);
        puzzleUsed.setPuzzleTileVisibility(2, 1, false);
        puzzleUsed.setPuzzleTileValue(2, 1, 8);
        puzzleUsed.setPuzzleTileVisibility(2, 2, false);
        puzzleUsed.setPuzzleTileValue(2, 2, 9);
        expect(gridSolver.findPossibleValuesAtAPosition(0, 2)).to.deep.equal([]);
    });

    it("say there is three possible numbers to put", () => {
        puzzleUsed.hideAllItemsInRange(Puzzle.MIN_ROW_INDEX, Puzzle.MAX_ROW_INDEX
            , Puzzle.MIN_COLUMN_INDEX, Puzzle.MAX_COLUMN_INDEX);
        puzzleUsed.setPuzzleTileVisibility(0, 0, false);
        puzzleUsed.setPuzzleTileVisibility(0, 1, false);
        puzzleUsed.setPuzzleTileVisibility(1, 2, false);
        puzzleUsed.setPuzzleTileVisibility(2, 0, false);
        puzzleUsed.setPuzzleTileVisibility(2, 1, false);
        puzzleUsed.setPuzzleTileVisibility(2, 2, false);
        expect(gridSolver.findPossibleValuesAtAPosition(0, 2)).to.be.deep.equal([3, 4, 5]);
    });

    it("verify the mapping for a single tile.", () => {
        puzzleUsed.setPuzzleTileVisibility(2, 2, true);
        let numberFitting : Array<FittingNumbers> = [{row: 2, column: 2, numbersThatFit: [9]}];
        expect(gridSolver.getMappingOfAllPossibilities()).to.be.deep.equal(numberFitting);
    });

    it("verify the mapping for multiple tiles.", () => {
        puzzleUsed.setPuzzleTileVisibility(0, 0, true);
        puzzleUsed.setPuzzleTileVisibility(0, 1, true);
        puzzleUsed.setPuzzleTileVisibility(3, 0, true);
        puzzleUsed.setPuzzleTileVisibility(8, 1, true);
        let numberFitting : Array<FittingNumbers> = [
            {row: 0, column: 0, numbersThatFit: [1, 2]},
            {row: 0, column: 1, numbersThatFit: [1, 2]},
            {row: 3, column: 0, numbersThatFit: [2]},
            {row: 8, column: 1, numbersThatFit: [1]}
        ];
        expect(gridSolver.getMappingOfAllPossibilities()).to.be.deep.equal(numberFitting);
    });

    it("say that the number of solutions is one when only one tile is hidden.", () => {
        puzzleUsed.setPuzzleTileVisibility(2, 2, true);
        expect(gridSolver.fillSudoku(0)).to.be.equal(1);
    });

    it("say that the number of solutions is zero.", function() {
        puzzleUsed.hideAllItemsInRange(Puzzle.MIN_ROW_INDEX, Puzzle.MAX_ROW_INDEX
            , Puzzle.MIN_COLUMN_INDEX, Puzzle.MAX_COLUMN_INDEX);
        puzzleUsed.setPuzzleTileVisibility(3, 2, false);
        puzzleUsed.setPuzzleTileValue(3, 2, 3);
        puzzleUsed.setPuzzleTileVisibility(0, 0, false);
        puzzleUsed.setPuzzleTileValue(0, 0, 1);
        puzzleUsed.setPuzzleTileVisibility(0, 1, false);
        puzzleUsed.setPuzzleTileValue(0, 1, 2);
        puzzleUsed.setPuzzleTileVisibility(1, 0, false);
        puzzleUsed.setPuzzleTileValue(1, 0, 4);
        puzzleUsed.setPuzzleTileVisibility(1, 1, false);
        puzzleUsed.setPuzzleTileValue(1, 1, 5);
        puzzleUsed.setPuzzleTileVisibility(1, 2, false);
        puzzleUsed.setPuzzleTileValue(1, 2, 6);
        puzzleUsed.setPuzzleTileVisibility(2, 0, false);
        puzzleUsed.setPuzzleTileValue(2, 0, 7);
        puzzleUsed.setPuzzleTileVisibility(2, 1, false);
        puzzleUsed.setPuzzleTileValue(2, 1, 8);
        puzzleUsed.setPuzzleTileVisibility(2, 2, false);
        puzzleUsed.setPuzzleTileValue(2, 2, 9);
        expect(gridSolver.fillSudoku(0)).to.be.equal(0);
    });

    it("say that there is only one solution even if there is tiles with multiple possibilities.", () => {
        /*
        Generate and resolve that sudoku.
        8     |   9 1 | 2
              | 7     | 9 5
              |   3   |   7 8
        ------+-------+------
          2   |       |   7
        3   6 |   4   | 5   2
        5     |       |   6
        ------+-------+------
        4 9   |   7   |
          8 3 |     2 |
            2 | 4 8   |     9
        */
        puzzleUsed.hideAllItemsInRange(Puzzle.MIN_ROW_INDEX, Puzzle.MAX_ROW_INDEX
            , Puzzle.MIN_COLUMN_INDEX, Puzzle.MAX_COLUMN_INDEX);
        puzzleUsed.setPuzzleTileVisibility(0, 0, false);
        puzzleUsed.setPuzzleTileValue(0, 0, 8);
        puzzleUsed.setPuzzleTileVisibility(0, 4, false);
        puzzleUsed.setPuzzleTileValue(0, 4, 9);
        puzzleUsed.setPuzzleTileVisibility(0, 5, false);
        puzzleUsed.setPuzzleTileValue(0, 5, 1);
        puzzleUsed.setPuzzleTileVisibility(0, 6, false);
        puzzleUsed.setPuzzleTileValue(0, 6, 2);

        puzzleUsed.setPuzzleTileVisibility(1, 3, false);
        puzzleUsed.setPuzzleTileValue(1, 3, 7);
        puzzleUsed.setPuzzleTileVisibility(1, 6, false);
        puzzleUsed.setPuzzleTileValue(1, 6, 9);
        puzzleUsed.setPuzzleTileVisibility(1, 7, false);
        puzzleUsed.setPuzzleTileValue(1, 7, 5);

        puzzleUsed.setPuzzleTileVisibility(2, 4, false);
        puzzleUsed.setPuzzleTileValue(2, 4, 3);
        puzzleUsed.setPuzzleTileVisibility(2, 7, false);
        puzzleUsed.setPuzzleTileValue(2, 7, 7);
        puzzleUsed.setPuzzleTileVisibility(2, 8, false);
        puzzleUsed.setPuzzleTileValue(2, 8, 8);

        puzzleUsed.setPuzzleTileVisibility(3, 1, false);
        puzzleUsed.setPuzzleTileValue(3, 1, 2);
        puzzleUsed.setPuzzleTileVisibility(3, 8, false);
        puzzleUsed.setPuzzleTileValue(3, 8, 7);

        puzzleUsed.setPuzzleTileVisibility(4, 0, false);
        puzzleUsed.setPuzzleTileValue(4, 0, 3);
        puzzleUsed.setPuzzleTileVisibility(4, 2, false);
        puzzleUsed.setPuzzleTileValue(4, 2, 6);
        puzzleUsed.setPuzzleTileVisibility(4, 4, false);
        puzzleUsed.setPuzzleTileValue(4, 4, 4);
        puzzleUsed.setPuzzleTileVisibility(4, 6, false);
        puzzleUsed.setPuzzleTileValue(4, 6, 5);

        puzzleUsed.setPuzzleTileVisibility(4, 8, false);
        puzzleUsed.setPuzzleTileValue(4, 8, 2);

        puzzleUsed.setPuzzleTileVisibility(5, 0, false);
        puzzleUsed.setPuzzleTileValue(5, 0, 5);
        puzzleUsed.setPuzzleTileVisibility(5, 7, false);
        puzzleUsed.setPuzzleTileValue(5, 7, 6);

        puzzleUsed.setPuzzleTileVisibility(6, 0, false);
        puzzleUsed.setPuzzleTileValue(6, 0, 4);
        puzzleUsed.setPuzzleTileVisibility(6, 1, false);
        puzzleUsed.setPuzzleTileValue(6, 1, 9);
        puzzleUsed.setPuzzleTileVisibility(6, 4, false);
        puzzleUsed.setPuzzleTileValue(6, 4, 7);

        puzzleUsed.setPuzzleTileVisibility(7, 1, false);
        puzzleUsed.setPuzzleTileValue(7, 1, 8);
        puzzleUsed.setPuzzleTileVisibility(7, 2, false);
        puzzleUsed.setPuzzleTileValue(7, 2, 3);
        puzzleUsed.setPuzzleTileVisibility(7, 5, false);
        puzzleUsed.setPuzzleTileValue(7, 5, 2);

        puzzleUsed.setPuzzleTileVisibility(8, 2, false);
        puzzleUsed.setPuzzleTileValue(8, 2, 2);
        puzzleUsed.setPuzzleTileVisibility(8, 3, false);
        puzzleUsed.setPuzzleTileValue(8, 3, 4);
        puzzleUsed.setPuzzleTileVisibility(8, 4, false);
        puzzleUsed.setPuzzleTileValue(8, 4, 8);
        puzzleUsed.setPuzzleTileVisibility(8, 8, false);
        puzzleUsed.setPuzzleTileValue(8, 8, 9);
        puzzleUsed.printToConsole();
        expect(gridSolver.fillSudoku(0)).to.be.equal(1);
    });

    it("say that there is many solutions to the sudoku.", () => {
        puzzleUsed.hideAllItemsInRange(1, Puzzle.MAX_ROW_INDEX
            , 6, Puzzle.MAX_COLUMN_INDEX);
        puzzleUsed.setPuzzleTileVisibility(5, 6, false);
        puzzleUsed.setPuzzleTileVisibility(5, 8, false);
        puzzleUsed.setPuzzleTileVisibility(7, 6, false);
        puzzleUsed.setPuzzleTileVisibility(7, 8, false);
        expect(gridSolver.fillSudoku(0)).to.be.equal(2);
    });
});
