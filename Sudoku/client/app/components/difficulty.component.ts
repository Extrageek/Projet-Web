import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';

import { Difficulty } from '../models/user-setting';

import { UserSettingService } from '../services/user-setting.service';
import { RestApiProxyService } from '../services/rest-api-proxy.service';

@Component({
    moduleId: module.id,
    selector: 'difficulty-component',
    templateUrl: '/assets/templates/difficulty.component.html',
    styleUrls: ['../../assets/stylesheets/username.component.css'],
    providers: [RestApiProxyService]
})
export class DifficultyComponent implements OnInit {
    _username: string;
    _difficulty: Difficulty;

    constructor(private router: Router,
        private userSettingService: UserSettingService,
        private api: RestApiProxyService) { }

    ngOnInit() {
        this._username = this.userSettingService.userSetting.name;
    }

    @HostListener('window:beforeunload')
    public async logout() {
        let str: string;
        await this.api.removeUsername(this._username)
            .then(result => {
                if (result) {
                    str = "done";
                }
                else {
                    str = "not done";
                }
            })
            .catch(error => {
                console.log("error: ", error);
                str = "error";
            });
        return str;
    }

    public launchGame() {
        this.userSettingService.userSetting.difficulty = this._difficulty;
        this.router.navigate(['/game']);
    }
}
