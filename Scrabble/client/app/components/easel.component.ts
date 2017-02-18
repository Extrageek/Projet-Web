import { Component, OnInit, OnDestroy } from "@angular/core";
import { ScrabbleLetter } from "../models/letter/scrabble-letter";
import { EaselGeneratorService } from "../services/easel/easel-generator.service";
import { SocketService } from "../services/socket-service";
import { SocketEventType } from "../commons/socket-eventType";

import { Alphabet } from '../models/letter/alphabet';

@Component({
    moduleId: module.id,
    providers: [EaselGeneratorService, SocketService],
    selector: "easel-selector",
    templateUrl: "../../assets/templates/easel.html",
    styleUrls: ["../../assets/stylesheets/easel.css"],
})

export class EaselComponent implements OnInit, OnDestroy {
    private _letters: Array<ScrabbleLetter>;
    public get letters(): Array<ScrabbleLetter> {
        return this._letters;
    }
    public set letters(letters: Array<ScrabbleLetter>) {
        this._letters = letters;
    }

    private fakeLettersFromServer: Array<ScrabbleLetter>;

    constructor(private easelGenerator: EaselGeneratorService, private socketService: SocketService) {
        this.letters = this.easelGenerator.generatedEasel(this.fakeLettersFromServer);
        this.changeLettersRequest();
    }

    ngOnInit() {
        this.socketService.subscribeToChannelEvent(SocketEventType.exchangedLetter)
            .subscribe((response: Array<string>) => {
                this.letters = new Array<ScrabbleLetter>();

                response.forEach((letter) => {
                    console.log("Letter", letter);
                    this.letters.push(new ScrabbleLetter(letter));
                })
            })
        // this.letters = this.easelGenerator.generatedEasel(this.fakeLettersFromServer);
    }

    ngOnDestroy() {
        // TODO: Unsubscribe all the socket observable here
    }

    public changeLettersRequest() {
        let letters: Array<string>;
        let fakeLetters = ['A', 'E', 'M', 'N', 'U', 'T', 'A'];

        this.socketService.emitMessage(SocketEventType.exchangeLettersRequest, fakeLetters);
    }
}
