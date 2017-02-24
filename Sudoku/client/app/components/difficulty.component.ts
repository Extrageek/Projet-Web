import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';

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
    _difficulty: string;

    constructor(private router: Router,
        private userSettingService: UserSettingService,
        private api: RestApiProxyService) { }

    ngOnInit() {
        this._username = this.userSettingService.userSetting.name;
        this._difficulty = "0";
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
        let RADIX = 10;
        this.userSettingService.userSetting.difficulty = parseInt(this._difficulty, RADIX);
        this.router.navigate(['/game']);
    }
}
