// import { GameStatus } from './game-status';
// import { expect } from "chai";

// let _gameStatus: GameStatus;

// describe("GamesStatus should", () => {
//     beforeEach(() => {
//         _gameStatus = new GameStatus();
//     });

//     it("initialize the game correctly", () => {
//         expect(_gameStatus._currentSet).to.be.equal(1);
//         expect(_gameStatus._scorePlayer).to.be.equal(0);
//         expect(_gameStatus._scoreComputer).to.be.equal(0);
//         expect(_gameStatus._currentStonesPlayer).to.be.equal(8);
//         expect(_gameStatus._currentStonesComputer).to.be.equal(8);
//         expect(_gameStatus._isLaunched).to.be.equal(false);
//     });
//     it("decrement number of stones left for player when used", () => {
//         _gameStatus.usedStonePlayer();
//         expect(_gameStatus._currentStonesPlayer).to.be.equal(7);
//     });
//     it("decrement number of stones left for player when used", () => {
//         _gameStatus.usedStoneComputer();
//         expect(_gameStatus._currentStonesComputer).to.be.equal(7);
//     });
//     it("add score for the player when he wins a set", () => {
//         _gameStatus.incrementScorePlayer(2);
//         expect(_gameStatus._scorePlayer).to.be.equal(2);
//     });
//     it("add score for the _scoreComputer when he wins a set", () => {
//         _gameStatus.incrementScoreComputer(2);
//         expect(_gameStatus._scoreComputer).to.be.equal(2);
//     });
//     it("change the status of the game when it's lunched", () => {
//         _gameStatus.launchGame();
//         expect(_gameStatus._isLaunched).to.be.equal(true);
//     });
//     it("reset the number of stones when you finish a set", () => {
//         _gameStatus.resetStones();
//         expect(_gameStatus._currentStonesComputer).to.be.equal(8);
//         expect(_gameStatus._currentStonesPlayer).to.be.equal(8);
//     });
//     it("reset all status", () => {
//         _gameStatus.resetGameStatus();
//         expect(_gameStatus._currentSet).to.be.equal(1);
//         expect(_gameStatus._scorePlayer).to.be.equal(0);
//         expect(_gameStatus._scoreComputer).to.be.equal(0);
//         expect(_gameStatus._currentStonesPlayer).to.be.equal(8);
//         expect(_gameStatus._currentStonesComputer).to.be.equal(8);
//         expect(_gameStatus._isLaunched).to.be.equal(true);
//     });
// });
