import { expect } from "chai";
import { BoardService } from "./board.service";

let service : BoardService;

describe("Scrabble grid generation test", () => {

    beforeEach(() => {
        service = new BoardService();
    });

    it("should correctly validate grid", () => {
        expect(service.board.board).to.be.not.be.undefined;
    });
});


