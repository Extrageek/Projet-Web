import { Component, HostListener, OnInit } from '@angular/core';
import { MdSnackBar } from '@angular/material';

import { RenderService } from '../services/render.service';

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
        //console.log(this.trigger());
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
        private renderService: RenderService,
        private snackbar: MdSnackBar
    ) { }

    // private displaceX(): void{
    //     this.renderService.translateMesh(this.xmodel, 0);
    // }

    // private displaceY(): void{
    //     this.renderService.translateMesh(0, this.ymodel);
    // }

    // private displaceCameraZ(): void{
    //     this.renderService.translateCamera(0, 0, this.zCamera);
    // }

    public showNotImplemented(): void {
        this.snackbar.open('Sorry, this is not implemented yet. Would you do it for me? :)', 'Yes');
    }
}
