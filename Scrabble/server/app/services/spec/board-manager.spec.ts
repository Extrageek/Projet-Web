import { expect, assert } from "chai";

import { Player } from "../../models/player";
import { BoardManager } from "../board-manager";
import { IPlaceWordResponse } from "../commons/command/place-word-response.interface";

describe("BoardManager", () => {
    let boardManager: BoardManager;

    beforeEach(() => {
        boardManager = new BoardManager();
    });
    
      it("should create a new MessageHandler", () => {
        boardManager = new BoardManager();
        expect(boardManager).not.to.be.undefined;
    });
});