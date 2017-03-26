import { Component, HostListener, OnInit } from "@angular/core";

import { RenderService } from "../services/game-handler/render.service";

@Component({
    selector: "my-gl",
    templateUrl: "../../assets/templates/gl-component.html",
    styleUrls: ["../../assets/stylesheets/gl-component.css", "../../assets/stylesheets/menu-hamburger.css"]
})

export class GlComponent {

    @HostListener("window:keydown.space", ["$event"])
    public disableScrollingWithSpace(event: KeyboardEvent) {
        event.preventDefault();
    }

    @HostListener("window:keyup.space", ["$event"])
    public spaceKeyPressed(event: KeyboardEvent) {
        this._renderService.switchCamera();
    }

    constructor(
        private _renderService: RenderService,
    ) { }

    public get renderService(): RenderService {
        return this._renderService;
    }

}
