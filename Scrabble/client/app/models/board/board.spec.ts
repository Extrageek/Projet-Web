import { Board } from './board';
import { Square } from '../square/square';

import { expect } from 'chai';

describe("Board object should", () => {

    let _board: Board;

    beforeEach(() => {
        _board = new Board();
    });

    it("construct a board correctly", () => {
        expect(_board.board).to.have.lengthOf(15);
        expect(_board.board[0]).to.have.lengthOf(15);
    });

    it("get the board correctly", () => {
        let _fakeBoard = new Board();
        expect(_board).to.be.deep.equals(_fakeBoard);
    });
});
