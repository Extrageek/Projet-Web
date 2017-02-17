import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
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

    @ViewChild("hamburger") hamburger: ElementRef;
    @ViewChild("overlay") overlay: ElementRef;

    @HostListener('window:beforeunload', ['$event'])
    saveAndLogout(event: Event) {
        this.api.createGameRecord(this._userSetting, this._gameStatus);
        this.api.removeUsername(this._userSetting.name);
        event.stopImmediatePropagation();
    }

    constructor(
        private router: Router,
        private api: RestApiProxyService,
        private userSettingService: UserSettingService,
        private gameStatusService: GameStatusService) { }

    ngOnInit() {
        this._userSetting = this.userSettingService.userSetting;
        console.log(this.userSettingService.userSetting);
        this._gameStatus = this.gameStatusService.gameStatus;
    }


    public toggleOverlay() {
        this.hamburger.nativeElement.classList.toggle("is-active");
        this.overlay.nativeElement.classList.toggle("is-open-menu");
    }

    public getComputerName(): void {
        this._computerName = this.userSettingService.getComputerName();
    }

    public gameOver() {
        this.api.createGameRecord(this._userSetting, this._gameStatus);
        this.api.removeUsername(this._userSetting.name);
        this.router.navigate(['/']);
    }
}
