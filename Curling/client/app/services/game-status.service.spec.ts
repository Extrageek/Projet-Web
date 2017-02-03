import { GameStatusService } from './game-status.service';
import { GameStatus } from '../models/game-status';
import { expect, assert } from "chai";

let _gameStatusService: GameStatusService;

describe("GameStatusService should", () => {
    beforeEach(() => {
        _gameStatusService = new GameStatusService();
    });

    it("initialize the game stauts service correctly", () => {
        expect(_gameStatusService.gameStatus._currentSet).to.be.equal(1);
        expect(_gameStatusService.gameStatus._scorePlayer).to.be.equal(0);
        expect(_gameStatusService.gameStatus._scoreComputer).to.be.equal(0);
        expect(_gameStatusService.gameStatus._currentStonesPlayer).to.be.equal(8);
        expect(_gameStatusService.gameStatus._currentStonesComputer).to.be.equal(8);
        expect(_gameStatusService.gameStatus._isLaunched).to.be.equal(false);
    });
    it("set game status correctly", () => {
        let _gameStatus = new GameStatus();
        _gameStatus._currentSet = 2;
        _gameStatus._currentStonesComputer = 4;
        _gameStatus._currentStonesPlayer = 4;
        _gameStatus._scoreComputer = 3;
        _gameStatus._scorePlayer = 5;
        _gameStatus._isLaunched = true;
        _gameStatusService.gameStatus = _gameStatus;
        expect(_gameStatusService.gameStatus).to.be.equal(_gameStatus);
    });
    it("choose the first player to play randomly in case the player is first", () => {
        let bool: boolean;
        for (let i; i < 30; i = i + 1) {
            bool = _gameStatusService.randomFirstPlayer();
            assert.isBoolean(bool, "Checked");
        }
    });
});
