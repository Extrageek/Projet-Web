import { Component, HostListener, OnInit } from '@angular/core';
import { MdSnackBar } from '@angular/material';

import { RenderService } from '../services/game-handler/render.service';

@Component({
    selector: 'my-gl',
    templateUrl: "../../assets/templates/gl-component.html",
    styleUrls: ['../../assets/stylesheets/gl-component.css', '../../assets/stylesheets/menu-hamburger.css']
})

export class GlComponent implements OnInit {
    webgltext: string;
    xmodel: number;
    ymodel: number;
    zCamera: number;

    ngOnInit(): void {
        this.webgltext = "";
        this.xmodel = this.ymodel = 0;
        this.zCamera = 0;
    }

    @HostListener("window:keydown.space", ["$event"])
    public disableScrollingWithSpace(event: KeyboardEvent) {
        event.preventDefault();
    }

    @HostListener("window:keyup.space", ["$event"])
    public spaceKeyPressed(event: KeyboardEvent) {
        this._renderService.switchCamera();
    }
    //TODO : Check if this is really needed.
    // @HostListener("window:visibilitychange", ["$event"])
    // public toggleClock(event: Event) {
    //     this._renderService.toogleFocus(document.hasFocus());
    // }

    constructor(
        private _renderService: RenderService,
        private snackbar: MdSnackBar
    ) { }

    public get renderService(): RenderService {
        return this._renderService;
    }

    public showNotImplemented(): void {
        this.snackbar.open('Sorry, this is not implemented yet. Would you do it for me? :)', 'Yes');
    }
}
