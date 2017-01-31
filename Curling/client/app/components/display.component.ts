import { Component, OnInit } from '@angular/core';

import { GameStatus } from '../models/game-status';
import { UserSetting, Difficulty } from '../models/user-setting';

import { RestApiProxyService } from '../services/rest-api-proxy.service';

@Component({
    moduleId: module.id,
    selector: 'display-component',
    templateUrl: '../../assets/templates/display-component.html',
    styleUrls: ['../../assets/stylesheets/display.css', '../../assets/stylesheets/menu-hamburger.css']
})
export class DisplayComponent implements OnInit {
    _gameStatus: GameStatus;
    _userSetting: UserSetting;
    _computerName: string;

    constructor (private restApiProxyService : RestApiProxyService) {}

    ngOnInit() {
        this._gameStatus = new GameStatus();
        this._userSetting = new UserSetting();
    }

    public showComputerName(): void {
        if (this._userSetting._difficulty === Difficulty.NORMAL) {
            this._computerName = "CPU Normal";
        } else {
            this._computerName = "CPU Difficile";
        }
    }

    public gameOver(){
        console.log("abandon ok");
        this.restApiProxyService.createGameRecord(this._userSetting, this._gameStatus);
    }
}
