import { CasePosition } from './case-position';
import { BoardRows } from './board-rows';
import { BoardColumn } from './board-column';
import { ScrabbleLetter } from './../letter/scrabble-letter';
import { BoardCase } from './board-case';
import { expect } from 'chai';

let _boardCase: BoardCase;
let _letter: ScrabbleLetter;
let _casePosition: CasePosition;

describe("BoardCase component should", () => {
    beforeEach(() => {
        //_boardCase = new BoardCase()
    });

    it("should be an instance of BoardCase", () => {
        expect(_boardCase).to.be.an.instanceof(BoardCase);
    });

    it("construct a board case correctly", () => {
        //
    });
    it("get the alphabet letter correctly", () => {
        //
    });
    it("set the alphabet letter corectly", () => {
        //
    });
    it("get the point value of a letter corectly", () => {
        //
    });
    it("set the point value of a letter corectly", () => {
        //
    });
    it("get the quantity for a letter corectly", () => {
        //
    });
    it("set the score of the player corectly", () => {
        //
    });
});
