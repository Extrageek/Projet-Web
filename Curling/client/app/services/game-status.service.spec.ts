import { GameStatusService } from './game-status.service';
import { GameStatus } from '../models/game-status';
import { expect } from "chai";

let _gameStatusService: GameStatusService;

describe("GameStatusService should", () => {
    beforeEach(() => {
        _gameStatusService = new GameStatusService();
    });

    it("initialize the game stauts service correctly", () => {
        expect(_gameStatusService.gameStatus.currentSet).to.be.equal(1);
        expect(_gameStatusService.gameStatus.scorePlayer).to.be.equal(0);
        expect(_gameStatusService.gameStatus.scoreComputer).to.be.equal(0);
        expect(_gameStatusService.gameStatus.currentStonesPlayer).to.be.equal(8);
        expect(_gameStatusService.gameStatus.currentStonesComputer).to.be.equal(8);
        expect(_gameStatusService.gameStatus.isLaunched).to.be.equal(false);
    });

    it("set game status correctly", () => {
        let _gameStatus = new GameStatus();
        _gameStatus.currentSet = 2;
        _gameStatus.currentStonesComputer = 4;
        _gameStatus.currentStonesPlayer = 4;
        _gameStatus.scoreComputer = 3;
        _gameStatus.scorePlayer = 5;
        _gameStatus.isLaunched = true;
        _gameStatusService.gameStatus = _gameStatus;
        expect(_gameStatusService.gameStatus).to.be.equal(_gameStatus);
    });

    it("choose the first player to play randomly in case the player is first", () => {
        let nTrue = 0;
        let nFalse = 0;
        const N_GENERATION = 100;
        for (let i = 0; i < N_GENERATION; i++) {
            let alea = _gameStatusService.randomFirstPlayer();
            alea ? nTrue++ : nFalse++;
        }
        expect(nTrue).to.be.greaterThan(30).and.lessThan(70);
    });
});
