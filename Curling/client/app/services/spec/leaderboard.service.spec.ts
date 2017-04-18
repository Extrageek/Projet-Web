import { LeaderboardService } from "./../leaderboard.service";
import { Record } from "./../../models/record";
import { Difficulty } from "./../../models/difficulty";

import { expect } from "chai";

let _leaderboard: LeaderboardService;
let _username = "bob";
let _scorePlayer = 5;
let _scoreComputer = 2;

describe("LeaderboardService should", () => {
    beforeEach(() => {
        _leaderboard = new LeaderboardService();
    });

    it("add a record correctly", () => {
        expect(_leaderboard.records.length).to.be.equal(0);
        let record = new Record(_username, Difficulty.HARD, _scorePlayer, _scoreComputer);
        _leaderboard.addRecord(record);
        expect(_leaderboard.records.length).to.be.equal(1);
    });
});
