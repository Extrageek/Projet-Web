import { expect, assert } from "chai";
import { BoardHelper } from '../board/board-helper';
import { LetterHelper } from '../../models/commons/letter-helper';
import { CommandsHelper } from '../commons/command/command-helper';

describe("BoardHelper", () => {
    let boardHelper: BoardHelper;

    it("should detect values between A and O as a valid row position", () => {
        for (let row = LetterHelper.LETTER_A_KEY_CODE; row <= LetterHelper.LETTER_O_KEY_CODE; ++row) {
            assert(BoardHelper.isValidRowPosition(row) === true);
        }
    });

    it("should detect the CharCode below 65 (A) as an invalid row position", () => {
        for (let row = 0; row < LetterHelper.LETTER_A_KEY_CODE; ++row) {
            assert(BoardHelper.isValidRowPosition(row) === false);
        }
    });

    it("should detect the CharCode greater than 79 (O) as an invalid row position", () => {
        assert(BoardHelper.isValidRowPosition(80) === false);
    });

    it("should detect values between A and O as a valid column position", () => {
        for (let column = CommandsHelper.MIN_BOARD_POSITION_INDEX; column <= CommandsHelper.MAX_BOARD_POSITION_INDEX; ++column) {
            assert(BoardHelper.isValidColumnPosition(column) === true);
        }
    });

    it("should detect values O  or greater than 15 as an valid column position", () => {
        assert(BoardHelper.isValidColumnPosition(0) === false);
        assert(BoardHelper.isValidColumnPosition(16) === false);
    });

    it("should detect 'v' as a valid vertical orientation", () => {
        assert(BoardHelper.isValidOrientation('v') === true);
    });

    it("should detect 'h' as a valid horizontal orientation", () => {
        assert(BoardHelper.isValidOrientation('h') === true);
    });

    it("should detect 'd' as an invalid orientation", () => {
        assert(BoardHelper.isValidOrientation('d') === false);
    });

    it("should detect '2' as an invalid orientation", () => {
        assert(BoardHelper.isValidOrientation('2') === false);
    });

});