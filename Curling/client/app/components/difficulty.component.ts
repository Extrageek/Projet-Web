import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from './../services/user.service';
import { RestApiProxyService } from './../services/rest-api-proxy.service';
import { Difficulty } from '../models/user-setting';

@Component({
    moduleId: module.id,
    selector: 'difficulty-component',
    templateUrl: '/assets/templates/difficulty-component.html',
    styleUrls: ['../../assets/stylesheets/username-component.css']
})
export class DifficultyComponent implements OnInit {
    _username: string;
    _difficulty: string;

    constructor(private router: Router,
        private userSettingService: UserService,
        private api: RestApiProxyService) { }

    ngOnInit() {
        this._username = this.userSettingService.userSetting.name;
        if (this._username === "") {
            this.router.navigate(['/']);
        }
        this._difficulty = "0";
    }

    @HostListener('window:beforeunload')
    public async logout() {
        await this.api.removeUsername(this._username);
    }

    public launchGame() {
        let RADIX = 10;
        if(parseInt(this._difficulty, RADIX) == 0) {
            this.userSettingService.userSetting.difficulty = Difficulty.NORMAL;
        } else {
            this.userSettingService.userSetting.difficulty = Difficulty.HARD;
        }
        this.router.navigate(['/game']);
    }
}
