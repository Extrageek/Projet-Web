import { Component } from "@angular/core";
import { ScrabbleLetter } from "../models/letter/scrabble-letter";
import { EaselGeneratorService } from "../services/easelGeneratorService";
import { OnInit } from "../../node_modules/@angular/core/src/metadata/lifecycle_hooks";

@Component({
    moduleId: module.id,
    providers: [EaselGeneratorService],
    selector: "easel-selector",
    templateUrl: "../../assets/templates/easel.html",
    styleUrls: ["../../assets/stylesheets/easel.css"],
})

export class EaselComponent implements OnInit {
    letters: Array<ScrabbleLetter>;

    constructor(private easelGenerator: EaselGeneratorService) {
    }

    ngOnInit() {
        this.letters = this.easelGenerator.generatedEasel();
    }
}
