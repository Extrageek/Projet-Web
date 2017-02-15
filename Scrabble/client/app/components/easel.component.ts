import { Component } from "@angular/core";
import { ScrabbleLetter } from "../models/letter/scrabble-letter";
import { EaselGeneratorService } from "../services/easel/easel-generator.service";
import { OnInit } from "../../node_modules/@angular/core/src/metadata/lifecycle_hooks";

import { Alphabet } from '../models/letter/alphabet';

@Component({
    moduleId: module.id,
    providers: [EaselGeneratorService],
    selector: "easel-selector",
    templateUrl: "../../assets/templates/easel.html",
    styleUrls: ["../../assets/stylesheets/easel.css"],
})

export class EaselComponent implements OnInit {
    private _letters: Array<ScrabbleLetter>;
    public get letters(): Array<ScrabbleLetter> {
        return this._letters;
    }
    public set letters(letters: Array<ScrabbleLetter>) {
        this._letters = letters;
    }

    private fakeLettersFromServer: Array<ScrabbleLetter>;


    constructor(private easelGenerator: EaselGeneratorService) {
        // TODO : Get letters directly from server (In Progress)
        this.fakeLettersFromServer = new Array<ScrabbleLetter>();
        this.fakeLettersFromServer.push(new ScrabbleLetter(Alphabet.letterR));
        this.fakeLettersFromServer.push(new ScrabbleLetter(Alphabet.letterA));
        this.fakeLettersFromServer.push(new ScrabbleLetter(Alphabet.letterM));
        this.fakeLettersFromServer.push(new ScrabbleLetter(Alphabet.letterI));
        this.fakeLettersFromServer.push(new ScrabbleLetter(Alphabet.letterE));
        this.fakeLettersFromServer.push(new ScrabbleLetter(Alphabet.letterI));
        this.fakeLettersFromServer.push(new ScrabbleLetter(Alphabet.letterD));
    }

    ngOnInit() {
        this.letters = this.easelGenerator.generatedEasel(this.fakeLettersFromServer);
    }
}
