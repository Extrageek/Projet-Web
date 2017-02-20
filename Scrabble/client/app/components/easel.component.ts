import { Component, OnInit, OnDestroy, EventEmitter, Input, Output } from "@angular/core";
import { Subscription } from 'rxjs/Subscription';

import { ScrabbleLetter } from "../models/letter/scrabble-letter";
import { EaselGeneratorService } from "../services/easel/easel-generator.service";
import { EaselManagerService } from '../services/easel/easel-manager.service';
import { EaselControl } from '../commons/easel-control';
import { SocketService } from "../services/socket-service";
import { SocketEventType } from "../commons/socket-eventType";

declare var jQuery: any;

import { Alphabet } from '../models/letter/alphabet';

@Component({
    moduleId: module.id,
    providers: [EaselGeneratorService, EaselManagerService, SocketService],
    selector: "easel-selector",
    templateUrl: "../../assets/templates/easel.html",
    styleUrls: ["../../assets/stylesheets/easel.css"],
})

export class EaselComponent implements OnInit, OnDestroy {

    // Create an event emitter to interact with the Game room Component
    @Output() easelTabKeyEvent = new EventEmitter<ScrabbleLetter>();
    @Input() keyEventValue: any;

    private _letters: Array<ScrabbleLetter>;
    private _keyEventKeyCode: string;
    private _connection: Subscription;

    public get letters(): Array<ScrabbleLetter> {
        return this._letters;
    }
    public set letters(letters: Array<ScrabbleLetter>) {
        this._letters = letters;
    }

    public get keyEvent(): string {
        return this._keyEventKeyCode;
    }

    @Input()
    public set keyEvent(v: string) {
        this._keyEventKeyCode = v;
    }

    private fakeLettersFromServer: Array<ScrabbleLetter>;

    constructor(
        private easelGenerator: EaselGeneratorService,
        private easelEventManagerService: EaselManagerService,
        private socketService: SocketService) {
    }

    ngOnInit() {
        this._connection = this.socketService.subscribeToChannelEvent(SocketEventType.exchangedLetter)
            .subscribe((response: Array<string>) => {
                this.letters = new Array<ScrabbleLetter>();

                response.forEach((letter) => {
                    this.letters.push(new ScrabbleLetter(letter));
                });
            });
    }

    ngOnDestroy() {
        this._connection.unsubscribe();
    }

    public onKeyDownEventHandler(
        event: KeyboardEvent,
        id: string,
        letter: ScrabbleLetter) {

        let easelMaxIndex = this.letters.length - 1;
        let keyCode = event.which;
        let currentInputIndex = Number(id.split('_')[1]);

        // We are checking here we are a TabKeyEvent to be able to emit an event
        // and send the selected Letter the game Component
        if (this.easelEventManagerService.isTabKey(keyCode)) {
            this.easelTabKeyEvent.emit(letter);
            this.easelEventManagerService.removeFocusFormatInEasel(this.letters.length);

        } else if (this.easelEventManagerService.isDirection(keyCode)) {

            let nextInputIndex = this.easelEventManagerService
                .onKeyEventUpdateCurrentCursor(this.letters.length, keyCode, currentInputIndex);

            this.moveCurrentLetterToTheNextPosition(keyCode, currentInputIndex, nextInputIndex);

        } else if (this.easelEventManagerService.isScrabbleLetter(keyCode)) {
            this.setFocusToNextMatchLetter(keyCode, event.key, currentInputIndex);
        }
    }

    private moveCurrentLetterToTheNextPosition(
        keyCode: number,
        currentInputIndex: number,
        nextInputIndex: number) {

        let easelMaxIndex = this.letters.length - 1;
        let currentLetter = this.letters[currentInputIndex].letter;
        let currentImageSource = this.letters[currentInputIndex].imageSource;

        if (keyCode === EaselControl.rightArrowKeyCode
            && nextInputIndex === 0) {
            for (let index = easelMaxIndex; index > 0; --index) {
                this.letters[index].letter = this.letters[index - 1].letter;
                this.letters[index].imageSource = this.letters[index - 1].imageSource;
            }

        } else if (keyCode === EaselControl.leftArrowKeyCode
            && nextInputIndex === easelMaxIndex) {
            for (let index = 0; index < easelMaxIndex; ++index) {
                this.letters[index].letter = this.letters[index + 1].letter;
                this.letters[index].imageSource = this.letters[index + 1].imageSource;
            }

        } else {
            this.letters[currentInputIndex].letter = this.letters[nextInputIndex].letter;
            this.letters[currentInputIndex].imageSource = this.letters[nextInputIndex].imageSource;

        }

        this.letters[nextInputIndex].letter = currentLetter;
        this.letters[nextInputIndex].imageSource = currentImageSource;
    }

    private setFocusToNextMatchLetter(
        keyCode: number,
        key: string,
        currentInputIndex: number) {

        if (keyCode === null || key === null || currentInputIndex === null) {
            throw new Error("Argument error: All the paramters are required.");
        }

        let foundIndex = -1;
        let isFound = false;
        let enteredLetter = key.toUpperCase();

        if (jQuery('#easelCell_' + currentInputIndex).is(":focus")) {
            for (let nextIndex = currentInputIndex + 1, index = 0;
                index < this.letters.length && !isFound;
                ++nextIndex, ++index) {

                nextIndex = (nextIndex < this.letters.length) ? nextIndex : 0;
                if (this.letters[nextIndex].letter === enteredLetter) {
                    foundIndex = nextIndex;
                    isFound = true;
                }
            }
        }
        else {
            foundIndex = this.letters.findIndex((element: ScrabbleLetter) => element.letter === enteredLetter);
        }

        if (foundIndex !== -1) {
            this.easelEventManagerService.setFocusToElementWithGivenIndex(this.letters.length, foundIndex);
        } else {
            this.easelEventManagerService.removeFocusFormatInEasel(this.letters.length);
        }
    }

    public getNotificationOnTabKeyPress(keyCode: any) {
        if (keyCode === null) {
            throw new Error("The key code cannot be null.");
        }

        let firstLetterIndex = 0;
        this.easelEventManagerService.setFocusToElementWithGivenIndex(this.letters.length, firstLetterIndex);
    }

    public changeLettersRequest() {
        let letters: Array<string>;
        let fakeLetters = ['A', 'E', 'M', 'N', 'U', 'T', 'A'];
        //this.socketService.emitMessage(SocketEventType.exchangeLettersRequest, fakeLetters);
    }
}
