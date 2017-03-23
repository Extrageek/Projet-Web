import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';

import { UserService, Difficulty } from './../services/user.service';
import { RestApiProxyService } from './../services/rest-api-proxy.service';

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
        this._username = this.userSettingService.name;
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
        if (parseInt(this._difficulty, RADIX) === 0) {
            this.userSettingService.difficulty = Difficulty.NORMAL;
        } else {
            this.userSettingService.difficulty = Difficulty.HARD;
        }
        this.router.navigate(['/game']);
    }
}
