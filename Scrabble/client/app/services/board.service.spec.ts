import { expect } from "chai";
import { BoardService } from "./board.service";
import { Board } from '../models/board/board';

let service : BoardService;

describe("Scrabble grid generation test", () => {

    beforeEach(() => {
        service = new BoardService();
    });

    it("should correctly validate grid", () => {
        expect(service.board.board).to.be.not.be.undefined;
    });

    it("should allow to get a valid scrabble board", () => {
        let fakeBoard = new Board();
        expect(service.board).to.be.deep.equals(fakeBoard);
    });

    it("should allow to set a new board", () => {
        let fakeBoard = new Board();
        service.board = fakeBoard;
        expect(service.board).to.be.deep.equals(fakeBoard);
    });
});


