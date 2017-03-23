import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { RestApiProxyService } from './../services/rest-api-proxy.service';
import { UserService } from './../services/user.service';

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

    @ViewChild("alertBox") alertBox: ElementRef;

    constructor(
        private router: Router,
        private restApiProxyService: RestApiProxyService,
        private userSettingService: UserService) {
    }

    public async verifyUsername(username: string) {
        let isValid: boolean;
        await this.restApiProxyService.verifyUsername(username)
        .then(result => {
            isValid = result;
        })
        .catch(error => {
            console.log(error);
            isValid = false;
        });
        if (isValid) {
            this.alertBox.nativeElement.classList.add("fade");
            this.userSettingService.name = username;
            this.router.navigate(["/difficulty"]);
        }
        else {
            this.alertBox.nativeElement.classList.remove("fade");
        }

    }

    public activateLoginNext(username: string) {
        this._isLoginNextActivated = this.userSettingService.activateButtonNextLogin(username);
    }

    public goToLeaderBoard() {
        this.router.navigate(['/leaderboard']);
    }

    public closeAlert() {
        this.alertBox.nativeElement.classList.add("fade");
    }
}
