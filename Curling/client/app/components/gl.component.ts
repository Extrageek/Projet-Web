<<<<<<< HEAD
import {Component,OnInit} from '@angular/core';
import {MdDialog, MdDialogRef, MdSnackBar} from '@angular/material';
=======
import { Component, OnInit } from '@angular/core';
import { RenderService } from '../services/render.service';
import { MdSnackBar } from '@angular/material';
>>>>>>> bf80269e4702264caf7977ead797d170951ddad2

import { RenderService } from '../services/render.service';

@Component({
<<<<<<< HEAD
    selector: 'My-GL',
    template:`
        <modifier [container]="container"
                  [webgltext]="webgltext">
        </modifier>
        <div #container> 
        </div> 
    `,
=======
    selector: 'my-gl',
    templateUrl: "../../assets/templates/gl-component.html",
    styleUrls: ['../../assets/stylesheets/gl-component.css']
>>>>>>> bf80269e4702264caf7977ead797d170951ddad2
})

export class GlComponent implements OnInit{
    webgltext: string;
    xmodel: number;
    ymodel: number;
<<<<<<< HEAD
    zCamera:number;

    ngOnInit(): void {
=======
    zCamera: number;
    ngOnInit(): void{
>>>>>>> bf80269e4702264caf7977ead797d170951ddad2
        this.webgltext = "";
        this.xmodel = this.ymodel = 0;
        this.zCamera = 0;
        console.log(this.trigger());
    }
<<<<<<< HEAD
    constructor(
        private renderService : RenderService,
        private snackbar: MdSnackBar
                ){}

    private displaceX():void{
        this.renderService.translateMesh(this.xmodel,0);
=======
    constructor(private renderService : RenderService,
                private snackbar: MdSnackBar
                ){
    }
    /*
    private displaceX(): void{
        this.renderService.translateMesh(this.xmodel, 0);
>>>>>>> bf80269e4702264caf7977ead797d170951ddad2
    }

    private displaceY(): void{
        this.renderService.translateMesh(0, this.ymodel);
    }

    private displaceCameraZ(): void{
        console.log(this.zCamera);
        this.renderService.translateCamera(0, 0, this.zCamera);
    }

    private newTeapot(): void{
        for (let i = 0; i < 1; ++i) {
            this.renderService.newTeapot();
        }
        console.log('cyclomatic');
    }
    */

    private trigger(): string{
        /*
        let x;
        if (Math.random()) {
            x = function*(){ let a = yield Math.random(); };
        }
        if (x) {
            let _new = x();
            let r = _new.next();
            console.log(r);
        }
        else {
            x = function(){return 'À traduire'; };
            console.log(x());
        }
        for (let i = 0; i < 42; ++i){
            try {
                let y = 1 / Math.random();
            } catch (e) {
                console.log(e);
                return 'Catched';
            }
        }
        return 'Will I be returned?';
        */
    return null;
    }

   public showNotImplemented(): void{
       this.snackbar.open('Sorry, this is not implemented yet. Would you do it for me? :)', 'Yes');
   }
}
