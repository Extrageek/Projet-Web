import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { RestApiProxyService } from '../services/rest-api-proxy.service';

import { UserSetting } from '../models/user-setting';

@Component({
    moduleId: module.id,
    selector: 'user-component',
    templateUrl: '../../assets/templates/user-setting-component.html',
    styleUrls: ['../../assets/stylesheets/user-setting-component.css']
})

export class UserSettingComponent implements OnInit {
    @Input() _userSetting: UserSetting;
    _isLoginNextActivated = false;

    constructor(
        private router: Router,
        private restApiProxyService: RestApiProxyService) {
    }

    ngOnInit() {
        document.getElementById('difficulty').hidden = true;
    }

    public async verifyUsername() {
        if ((<HTMLInputElement>document.getElementById("loginInput")).value !== ""){
            let isValid = await this.restApiProxyService.verifyUsername(this._userSetting);
            console.log(isValid);
            if (isValid.valueOf() === true) {
                document.getElementById('username').hidden = true;
                document.getElementById('difficulty').hidden = false;
            } else {
                document.querySelector('.alert').classList.remove("fade");
            }
        }
    }

    public activateLoginNext(){
        if ((<HTMLInputElement>document.getElementById("loginInput")).value !== ""){
            this._isLoginNextActivated = true;
        }
        else{
            this._isLoginNextActivated = false;
        }
    }

    public goToLeaderBoard() {
        this.router.navigate(['/leaderboard']);
    }

    public launchGame() {
        document.querySelector("user-component").classList.add("hidden");
        document.querySelector("display-component").classList.remove("hidden");
        dispatchEvent(new Event("launchGame"));
    }

    public closeAlert(){
         document.querySelector('.alert').classList.add("fade");
    }
}
