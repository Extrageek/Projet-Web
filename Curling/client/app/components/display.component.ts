import { Component, OnInit, Input } from '@angular/core';

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
    @Input() _userSetting: UserSetting;
    @Input() _gameStatus: GameStatus;
    _computerName: string;

    constructor (private restApiProxyService : RestApiProxyService) {}

    ngOnInit() {
        this._gameStatus = new GameStatus();
        let hamburger = document.querySelector(".hamburger");
        let overlay = document.querySelector(".overlay");

        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("is-active");
            overlay.classList.toggle("is-open-menu");
        });

        window.addEventListener("launchGame", () => {
            this._gameStatus.launchGame();
        });

        window.addEventListener("beforeunload", () => {
            if (this._gameStatus._isLaunched === true){
                this.restApiProxyService.createGameRecord(this._userSetting, this._gameStatus);
            }
        });
    }

    public showComputerName(): void {
        if (this._userSetting._difficulty === Difficulty.NORMAL) {
            this._computerName = "CPU Normal";
        } else {
            this._computerName = "CPU Difficile";
        }
    }

    public gameOver(){
        this.restApiProxyService.createGameRecord(this._userSetting, this._gameStatus);
    }
}
