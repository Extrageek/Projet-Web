import { Component } from "@angular/core";
import { ScrabbleLetter }	from "../models/scrabble-letter";
import { EaselGeneratorService } from "../services/easelGeneratorService";

@Component({
    moduleId: module.id,
    providers: [EaselGeneratorService],
    selector: "easel-selector",
    templateUrl: "../../app/views/easel.html",
    styleUrls: ["../../app/assets/easel.css"],
})

export class EaselComponent {
    letters : ScrabbleLetter[];

    constructor(private easelGenerator : EaselGeneratorService) {
    this.letters = easelGenerator.generatedEasel();
    }
}



