import { UserSetting, Difficulty } from './user-setting';
import { expect } from "chai";

let _userSetting: UserSetting;
// let _username = "Michel";
// let _difficulty = Difficulty.HARD;

describe("UserSetting should", () => {
    beforeEach(() => {
        _userSetting = new UserSetting();
    });

    it("construct the settings chosen by the player correctly", () => {
        expect(_userSetting.name).to.be.equal('');
        expect(_userSetting.difficulty).to.be.equal(Difficulty.NORMAL);
    });

    it("get the name correctly", () => {
        expect(_userSetting.name).to.be.equal('');
    });
    it("correctly", () => {
        _userSetting.name = "Michel";
        let _username = "Michel";
        expect(_userSetting.name).to.be.equal(_username);
    });
    it("get the difficulty correctly", () => {
        expect(_userSetting.difficulty).to.be.equal(Difficulty.NORMAL);
    });
    it("set the difficulty correctly", () => {
        _userSetting.difficulty = Difficulty.HARD;
        let _difficulty = Difficulty.HARD;
        expect(_userSetting.difficulty).to.be.equal(_difficulty);
    });
});
