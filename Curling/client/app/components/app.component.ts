import { Component, OnInit } from '@angular/core';

import { GameStatus } from '../models/game-status';
import { UserSetting } from '../models/user-setting';

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

/**
 *
 */
constructor() {
   // TODO
}
    ngOnInit() {
        this._userSetting = new UserSetting();
        document.querySelector("display-component").classList.add("hidden");
    }
}
