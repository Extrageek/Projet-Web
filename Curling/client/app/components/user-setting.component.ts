import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { RestApiProxyService } from '../services/rest-api-proxy.service';

import { UserSetting } from '../models/user-setting';

@Component({
    moduleId: module.id,
    selector: 'user-component',
    templateUrl: "../../assets/templates/user-setting-component.html",
})

export class UserSettingComponent implements OnInit {
    //TODO : Change for private - Problem with binding
    public _userSetting: UserSetting;

    constructor(
        private router: Router,
        private restApiProxyService: RestApiProxyService) {
    }

    ngOnInit() {
        this._userSetting = new UserSetting();
        document.getElementById('difficulty').hidden = true;
        //document.getElementById('alertUsername').hidden = true;
    }

    public async verifyUsername() {
        console.log("1 appel verifyUsername");
        let isValid = true; //await this.restApiProxyService.verifyUsername(this._userSetting);
        console.log('is username valid - ' + isValid);
        if (isValid.valueOf() === true) {
            document.getElementById('username').hidden = true;
            document.getElementById('difficulty').hidden = false;
        } else {
            document.getElementById('username').style.backgroundColor = 'red';
        }
    }

    public goToLeaderBoard() {
        this.router.navigate(['/dashboard']);
    }

    public launchGame() {
        this.router.navigate(['/game']);
        // creer une partie et sauvegarder dans la db
        //this.restApiProxyService.launchGame();
    }

    public get(): UserSetting {
        return this._userSetting;
    }

    public set(userSetting: UserSetting) {
        this._userSetting = userSetting;
    }
}
