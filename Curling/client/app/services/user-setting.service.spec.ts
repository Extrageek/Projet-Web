import { UserSettingService } from './user-setting.service';
import { UserSetting, Difficulty } from '../models/user-setting';
import { expect } from "chai";

let _userSettingService: UserSettingService;

describe("UserSettingService should", () => {
    beforeEach(() => {
        _userSettingService = new UserSettingService();
    });

    it("initialize the user setting service correctly", () => {
        expect(_userSettingService.userSetting.name).to.be.equal("");
        expect(_userSettingService.userSetting.difficulty).to.be.equal(Difficulty.NORMAL);
    });
    it("get userSetting correctly", () => {
        let _user = new UserSetting();
        _user.name = '';
        _user.difficulty = Difficulty.NORMAL;
        expect(_userSettingService.userSetting.name).to.be.equal(_user.name);
        expect(_userSettingService.userSetting.difficulty).to.be.equal(_user.difficulty);
    });
    it("set name correctly", () => {
        let _user = new UserSetting();
        _user.name = "Louis";
        _userSettingService.setName("Louis");
        expect(_userSettingService.userSetting.name).to.be.equal(_user.name);
    });
    it("set Difficulty correctly", () => {
        let _user = new UserSetting();
        _user.difficulty = Difficulty.HARD;
        _userSettingService.setDifficulty(Difficulty.HARD);
        expect(_userSettingService.userSetting.difficulty).to.be.equal(_user.difficulty);
    });
    it("get computerName correctly in case difficulty is Normal", () => {
        _userSettingService.setDifficulty(Difficulty.NORMAL);
        expect(_userSettingService.getComputerName()).to.contains("CPU Normal");
    });
    it("get computerName correctly in case difficulty is Hard", () => {
        _userSettingService.setDifficulty(Difficulty.HARD);
        expect(_userSettingService.getComputerName()).to.contains("CPU Difficile");
    });
});
