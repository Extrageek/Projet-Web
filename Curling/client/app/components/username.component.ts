import { Component, ViewChild, ElementRef, OnInit, Input } from "@angular/core";
import { Router } from "@angular/router";

import { RestApiProxyService } from "./../services/rest-api-proxy.service";
import { UserService } from "./../services/user.service";

@Component({
    moduleId: module.id,
    selector: "username-component",
    templateUrl: "../../assets/templates/username-component.html",
    styleUrls: ["../../assets/stylesheets/username-component.css"]
})
export class UsernameComponent implements OnInit {

    public _isLoginNextActivated = false;
    public _username: string;

    @ViewChild("alertBox") alertBox: ElementRef;

    constructor(
        private router: Router,
        private restApiProxyService: RestApiProxyService,
        private userSettingService: UserService) {
    }

    ngOnInit() {
        this.alertBox.nativeElement.classList.add("fade");
    }

    public async verifyUsername(username: string) {
        await this.restApiProxyService.verifyUsername(username)
            .then(result => {
                this.alertBox.nativeElement.classList.add("fade");
                this.userSettingService.name = username;
                this.router.navigate(["/difficulty"]);
            })
            .catch(error => {
                console.log(error);
                this.alertBox.nativeElement.classList.remove("fade");
            });
    }

    public activateLoginNext(username: string) {
        this._isLoginNextActivated = this.userSettingService.activateButtonNextLogin(username);
    }

    public goToLeaderBoard() {
        this.router.navigate(["/leaderboard"]);
    }

    public closeAlert() {
        this.alertBox.nativeElement.classList.add("fade");
    }
}
