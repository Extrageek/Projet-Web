import { Component, OnInit } from '@angular/core';
import { RenderService } from '../services/render.service';
import { MdSnackBar } from '@angular/material';

@Component({
    selector: 'my-gl',
    templateUrl: "../../assets/templates/gl-component.html",
    styleUrls: ['../../assets/stylesheets/gl-component.css']
})

export class GlComponent implements OnInit{
    webgltext: string;
    xmodel: number;
    ymodel: number;
    zCamera: number;
    ngOnInit(): void{
        this.webgltext = "";
        this.xmodel = this.ymodel = 0;
        this.zCamera = 0;
        console.log(this.trigger());
    }
    constructor(private renderService : RenderService,
                private snackbar: MdSnackBar
                ){
    }
    /*
    private displaceX(): void{
        this.renderService.translateMesh(this.xmodel, 0);
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
