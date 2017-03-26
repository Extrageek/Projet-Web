import { expect } from "chai";

import { GridGenerationManager } from "./../grid-generation.service";
import { Puzzle, PuzzleItem, Difficulty } from "./../../models/puzzle";

let gridGenerationManager = new GridGenerationManager();

describe("Puzzle Manager Service", () => {
    it("getNewPuzzle should get a new puzzle", function (done) {
        this.timeout(6000);
        gridGenerationManager.getNewPuzzle(Difficulty.HARD)
            .then((puzzle: Puzzle) => {
                expect(puzzle).to.be.instanceof(Puzzle);
                expect(puzzle._puzzle.length).to.be.equal(9);
                done();
            });
    });
});
