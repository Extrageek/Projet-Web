import { Component, OnInit, HostListener, ViewChild, ElementRef } from "@angular/core";
import { Router } from "@angular/router";

import { RestApiProxyService } from "./../services/rest-api-proxy.service";
import { UserService } from "./../services/user.service";
import { GameStatusService } from "./../services/game-status.service";
import { RenderService } from "../services/game-handler/render.service";

@Component({
    moduleId: module.id,
    providers: [RestApiProxyService],
    selector: "display-component",
    templateUrl: "../../assets/templates/display-component.html",
    styleUrls: ["../../assets/stylesheets/display-component.css",
                "../../assets/stylesheets/menu-hamburger.css",
                "../../assets/stylesheets/gl-component.css"]
})
export class DisplayComponent implements OnInit {
    _userSetting: UserService;
    _computerName: string;

    @ViewChild("hamburger") hamburger: ElementRef;
    @ViewChild("overlay") overlay: ElementRef;

    @HostListener("window:beforeunload")
    public async saveAndLogout() {
        await this.api.removeUsername(this._userSetting.name);
        await this.api.createGameRecord(this._userSetting.name, this._userSetting.difficulty, this.gameStatusService);
    }
    
    @HostListener("window:keydown.space", ["$event"])
    public disableScrollingWithSpace(event: KeyboardEvent) {
        event.preventDefault();
    }

    @HostListener("window:keyup.space", ["$event"])
    public spaceKeyPressed(event: KeyboardEvent) {
        this.renderService.switchCamera();
    }

    constructor(
        private router: Router,
        private api: RestApiProxyService,
        private userService: UserService,
        private gameStatusService: GameStatusService,
        private renderService: RenderService) { }

    ngOnInit() {
        console.log("ngOnInit called");
        this._userSetting = this.userService;
        if (this._userSetting.name === "") {
            this.router.navigate(["/"]);
        } else {
            this.getComputerName();
            console.log("starting game");
            this.renderService.init();
        }
    }

    public toggleOverlay(event: MouseEvent) {
        event.stopImmediatePropagation();
        this.hamburger.nativeElement.classList.toggle("is-active");
        this.overlay.nativeElement.classList.toggle("is-open-menu");
    }

    public getComputerName(): void {
        this._computerName = this.userService.getComputerName();
    }

    public gameOver() {
        this.api.createGameRecord(this._userSetting.name, this._userSetting.difficulty, this.gameStatusService);
        this.api.removeUsername(this._userSetting.name);
        this.router.navigate(["/"]);
    }
}
