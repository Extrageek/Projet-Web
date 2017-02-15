import { Board } from './board';
import { Square } from './square';

import { expect } from 'chai';

describe("Board object should", () => {

    let _square: Square;
    let _board: Board;

    beforeEach(() => {
        _board = new Board();
    });

    it("be an instance of Board", () => {
        expect(_board).to.be.an.instanceof(Board);
    });

    it("get the board correctly", () => {
        let _fakeBoard = new Board();
        expect(_board).to.be.equal(_fakeBoard);
    });
});
