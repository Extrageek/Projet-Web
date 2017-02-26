import { expect } from "chai";

import { GridGenerationManager, Difficulty } from "./grid-generation.service";
import { Puzzle, PuzzleItem } from "./../models/puzzle";

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
