import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { RestApiProxyService } from '../services/rest-api-proxy.service';
import { UserSettingService } from '../services/user-setting.service';

@Component({
    moduleId: module.id,
    providers: [RestApiProxyService],
    selector: 'username-component',
    templateUrl: '../../assets/templates/username-component.html',
    styleUrls: ['../../assets/stylesheets/username-component.css']
})
export class UsernameComponent {
    _isLoginNextActivated = false;
    username: string;

    constructor(
        private router: Router,
        private restApiProxyService: RestApiProxyService,
        private userSettingService: UserSettingService) {
    }

    public async verifyUsername(username: string) {
        if (username !== '') {
            let isValid = await this.restApiProxyService.verifyUsername(username);
            if (isValid.valueOf() === true) {
                document.querySelector('.alert').classList.add("fade");
                this.userSettingService.setName(username);
                this.router.navigate(['/difficulty']);
            } else {
                document.querySelector('.alert').classList.remove("fade");
            }
        }
    }

    public activateLoginNext(username: string) {
        if (username !== "") {
            this._isLoginNextActivated = true;
        }
        else {
            this._isLoginNextActivated = false;
        }
    }

    public goToLeaderBoard() {
        this.router.navigate(['/leaderboard']);
    }

    public closeAlert() {
        document.querySelector('.alert').classList.add("fade");
    }
}
