import { Injectable } from '@angular/core';

import { UserSetting, Difficulty } from '../models/user-setting';

@Injectable()
export class UserSettingService {
    private _userSetting: UserSetting;

    constructor() {
        this._userSetting = new UserSetting();
    }

    public get userSetting(): UserSetting {
        return this._userSetting;
    }

    public set userSetting(value: UserSetting) {
        this._userSetting = value;
    }

    public setName(username: string){
        this._userSetting.name = username;
    }

    public setDifficulty(difficulty: Difficulty){
        this._userSetting.difficulty = difficulty;
    }

    public getComputerName(): string {
        if (this._userSetting.difficulty === Difficulty.NORMAL) {
            return "CPU Normal";
        } else {
            return "CPU Difficile";
        }
    }
}