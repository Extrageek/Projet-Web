import { Component } from "@angular/core";
import { ScrabbleLetter }	from "../models/scrabble-letter";
import { EaselGeneratorService } from "../services/easelGeneratorService";
import { OnInit } from "../../node_modules/@angular/core/src/metadata/lifecycle_hooks";

@Component({
    moduleId: module.id,
    providers: [EaselGeneratorService],
    selector: "easel-selector",
    // templateUrl: "../../app/views/easel.html",
    // styleUrls: ["../../app/assets/easel.css"],
    template: ``
})

export class EaselComponent implements OnInit {
    letters : ScrabbleLetter[];

    constructor(private easelGenerator : EaselGeneratorService) {
    }

    ngOnInit() {
        this.letters = this.easelGenerator.generatedEasel();
    }
}



