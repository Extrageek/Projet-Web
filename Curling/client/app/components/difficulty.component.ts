import { Component, OnInit, HostListener } from "@angular/core";
import { Router } from "@angular/router";

import { UserService } from "./../services/user.service";
import { Difficulty } from "./../models/difficulty";
import { RestApiProxyService } from "./../services/rest-api-proxy.service";

@Component({
    moduleId: module.id,
    selector: "difficulty-component",
    templateUrl: "/assets/templates/difficulty-component.html",
    styleUrls: ["../../assets/stylesheets/difficulty-component.css"]
})
export class DifficultyComponent implements OnInit {
    public _username: string;
    public _difficulty: string;

    constructor(
        private router: Router,
        private api: RestApiProxyService) { }

    ngOnInit() {
        this._username = UserService._username;

        console.log("diff username", UserService._username);

        if (this._username === "") {
            this.router.navigate(["/"]);
        }
        this._difficulty = "0";
    }

    @HostListener("window:beforeunload")
    public async logout() {
        await this.api.removeUsername(this._username);
    }

    public launchGame() {
        const RADIX = 10;
        if (parseInt(this._difficulty, RADIX) === 0) {
            UserService._difficulty = Difficulty.NORMAL;
        } else {
            UserService._difficulty = Difficulty.HARD;
        }
        this.router.navigate(["/game"]);
    }
}
