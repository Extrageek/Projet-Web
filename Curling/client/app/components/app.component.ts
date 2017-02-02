import { Component, OnInit } from '@angular/core';

import { GameStatus } from '../models/game-status';
import { UserSetting } from '../models/user-setting';

import { RestApiProxyService } from '../services/rest-api-proxy.service';

@Component({
    moduleId: module.id,
    selector: 'mon-app',
    templateUrl: "/assets/templates/app-component-template.html",
    styleUrls: ['../../assets/stylesheets/display.css']
})
export class AppComponent implements OnInit {
    title = "Curling";
    _gameStatus: GameStatus;
    _userSetting: UserSetting;

    constructor (private restApiProxyService : RestApiProxyService) {}

    ngOnInit() {
        this._gameStatus = new GameStatus();
        this._userSetting = new UserSetting();
        document.querySelector("display-component").classList.add("hidden");
        window.addEventListener("beforeunload", () => {
            this.restApiProxyService.createGameRecord(this._userSetting, this._gameStatus);
        });
    }
}
