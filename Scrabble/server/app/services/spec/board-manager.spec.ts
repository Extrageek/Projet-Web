import { expect, assert } from "chai";

import { Player } from "../../models/player";
import { BoardManager } from "../board/board-manager";
import { Board } from '../../models/board/board';
import { IPlaceWordResponse } from "../commons/command/place-word-response.interface";

import { CommandStatus } from "../commons/command/command-status";
import { SquarePosition } from "../../models/square/square-position";

let uuid = require('node-uuid');

describe("BoardManager", () => {
    let boardManager: BoardManager;
    let board: Board;
    let fakePlayer: Player;
    let letterToPlace = ['A', 'B', 'C'];

    // place a letter in the center of the board
    let placeWordVerticallyResponse: IPlaceWordResponse = {
        _letters: letterToPlace,
        _squarePosition: { _row: 'h', _column: 8 },
        _wordOrientation: 'v'
    };

    // place a letter in the center of the board
    let placeWordHorizontallyResponse: IPlaceWordResponse = {
        _letters: letterToPlace,
        _squarePosition: { _row: 'h', _column: 8 },
        _wordOrientation: 'h'
    };

    let fakeSocketId = uuid.v1();
    fakePlayer = new Player("fakename", 1, fakeSocketId);

    beforeEach(() => {
        boardManager = new BoardManager();
        board = new Board();
    });

    it("should create a new MessageHandler", () => {
        boardManager = new BoardManager();
        expect(boardManager).not.to.be.undefined;
    });

    it("should place a first word vertically in the center of the board", () => {
        let isPlaced = boardManager.placeWordInBoard(placeWordVerticallyResponse, board, fakePlayer);
        assert(isPlaced === true);
        // expect()
    });

    it("should place a first word in the center of the board", () => {
        let isPlaced = boardManager.placeWordInBoard(placeWordVerticallyResponse, board, fakePlayer);
        assert(isPlaced === true);
    });

});
