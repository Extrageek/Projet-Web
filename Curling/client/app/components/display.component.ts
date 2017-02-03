import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { GameStatus } from '../models/game-status';
import { UserSetting } from '../models/user-setting';

import { RestApiProxyService } from '../services/rest-api-proxy.service';
import { UserSettingService } from '../services/user-setting.service';
import { GameStatusService } from '../services/game-status.service';

@Component({
    moduleId: module.id,
    providers: [RestApiProxyService],
    selector: 'display-component',
    templateUrl: '../../assets/templates/display-component.html',
    styleUrls: ['../../assets/stylesheets/display-component.css', '../../assets/stylesheets/menu-hamburger.css']
})
export class DisplayComponent implements OnInit {
    _userSetting: UserSetting;
    _gameStatus: GameStatus;
    _computerName: string;

    constructor(private router: Router,
        private restApiProxyService: RestApiProxyService,
        private userSettingService: UserSettingService,
        private gameStatusService: GameStatusService) { }

    ngOnInit() {
        this._userSetting = this.userSettingService.userSetting;
        console.log(this.userSettingService.userSetting);
        this._gameStatus = this.gameStatusService.gameStatus;
        let hamburger = document.querySelector(".hamburger");
        let overlay = document.querySelector(".overlay");
        // open or close the overlay and animate the hamburger.
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("is-active");
            overlay.classList.toggle("is-open-menu");
        });
        // Save the record before closing the game display window.
        window.addEventListener("beforeunload", () => {
            this.restApiProxyService.createGameRecord(this._userSetting, this._gameStatus);
        });
    }

    public getComputerName(): void {
        this._computerName = this.userSettingService.getComputerName();
    }

    public gameOver() {
        this.restApiProxyService.createGameRecord(this._userSetting, this._gameStatus);
        this.router.navigate(['/']);
    }
}
