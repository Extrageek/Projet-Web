import { expect } from "chai";
import { GridSolver } from "./grid-solver.service";
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

    it("say there is only one possible number for a puzzle with one hole", () => {
        puzzleUsed._puzzle[2][1].isHidden = true;
        expect(gridSolver.getNumberOfSolutionsAfterRemovingNumber(2, 1)).to.equal(1);
    });

    it("say there is only one possible number because of the numbers in a row", () => {
        puzzleUsed.hideAllItemsInRange(1, Puzzle.MAX_ROW_SIZE - 1
            , Puzzle.MIN_COLUMN_SIZE - 1, Puzzle.MAX_COLUMN_SIZE - 1);
        puzzleUsed._puzzle[0][3].isHidden = true;
        expect(gridSolver.getNumberOfSolutionsAfterRemovingNumber(0, 3)).to.equal(1);
    });

    it("say there is only one possible number because of the numbers in a column", () => {
        puzzleUsed.hideAllItemsInRange(Puzzle.MIN_ROW_SIZE - 1, Puzzle.MAX_ROW_SIZE - 1
            , 1, Puzzle.MAX_COLUMN_SIZE - 1);
        puzzleUsed._puzzle[3][0].isHidden = true;
        expect(gridSolver.getNumberOfSolutionsAfterRemovingNumber(3, 0)).to.equal(1);
    });

    it("say there is only one possible number because of the numbers in a square", () => {
        puzzleUsed.hideAllItemsInRange(Puzzle.MIN_ROW_SIZE - 1, Puzzle.MAX_ROW_SIZE - 1
            , Puzzle.MIN_COLUMN_SIZE - 1, Puzzle.MAX_COLUMN_SIZE - 1);
        puzzleUsed._puzzle[0][0].isHidden = false;
        puzzleUsed._puzzle[0][1].isHidden = false;
        puzzleUsed._puzzle[0][2].isHidden = false;
        puzzleUsed._puzzle[1][0].isHidden = false;
        puzzleUsed._puzzle[1][1].isHidden = false;
        puzzleUsed._puzzle[2][0].isHidden = false;
        puzzleUsed._puzzle[2][1].isHidden = false;
        puzzleUsed._puzzle[2][2].isHidden = false;
        expect(gridSolver.getNumberOfSolutionsAfterRemovingNumber(1, 2)).to.equal(1);
    });

    it("say there is no possible number to put", () => {
        puzzleUsed.hideAllItemsInRange(Puzzle.MIN_ROW_SIZE - 1, Puzzle.MAX_ROW_SIZE - 1
            , Puzzle.MIN_COLUMN_SIZE - 1, Puzzle.MAX_COLUMN_SIZE - 1);
        puzzleUsed._puzzle[3][2].isHidden = false;
        puzzleUsed._puzzle[3][2].value = 3;
        puzzleUsed._puzzle[0][0].isHidden = false;
        puzzleUsed._puzzle[0][0].value = 1;
        puzzleUsed._puzzle[0][1].isHidden = false;
        puzzleUsed._puzzle[0][1].value = 2;
        puzzleUsed._puzzle[1][0].isHidden = false;
        puzzleUsed._puzzle[1][0].value = 4;
        puzzleUsed._puzzle[1][1].isHidden = false;
        puzzleUsed._puzzle[1][1].value = 5;
        puzzleUsed._puzzle[1][2].isHidden = false;
        puzzleUsed._puzzle[1][2].value = 6;
        puzzleUsed._puzzle[2][0].isHidden = false;
        puzzleUsed._puzzle[2][0].value = 7;
        puzzleUsed._puzzle[2][1].isHidden = false;
        puzzleUsed._puzzle[2][1].value = 8;
        puzzleUsed._puzzle[2][2].isHidden = false;
        puzzleUsed._puzzle[2][2].value = 9;
        expect(gridSolver.getNumberOfSolutionsAfterRemovingNumber(0, 2)).to.equal(0);
    });

    it("say there is three possible numbers to put", () => {
        puzzleUsed.hideAllItemsInRange(Puzzle.MIN_ROW_SIZE - 1, Puzzle.MAX_ROW_SIZE - 1
            , Puzzle.MIN_COLUMN_SIZE - 1, Puzzle.MAX_COLUMN_SIZE - 1);
        puzzleUsed._puzzle[1][0].isHidden = false;
        puzzleUsed._puzzle[1][1].isHidden = false;
        puzzleUsed._puzzle[1][2].isHidden = false;
        puzzleUsed._puzzle[2][0].isHidden = false;
        puzzleUsed._puzzle[2][1].isHidden = false;
        puzzleUsed._puzzle[2][2].isHidden = false;
        expect(gridSolver.getNumberOfSolutionsAfterRemovingNumber(0, 2)).to.equal(3);
    });

});
