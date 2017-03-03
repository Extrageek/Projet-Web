import { Component, OnInit, OnDestroy, EventEmitter, Input, Output } from "@angular/core";
import { Subscription } from 'rxjs/Subscription';

import { ScrabbleLetter } from "../models/letter/scrabble-letter";
import { EaselManagerService } from '../services/easel/easel-manager.service';
import { EaselControl } from '../commons/easel-control';
import { SocketService } from "../services/socket-service";
import { CommandType } from "../services/commands/command-type";
import { SocketEventType } from "../commons/socket-eventType";
import { IGameMessage } from '../commons/messages/game-message-interface';
import { ICommandMessage } from '../commons/messages/command-message';

declare var jQuery: any;

import { Alphabet } from '../models/letter/alphabet';

@Component({
    moduleId: module.id,
    providers: [EaselManagerService, SocketService],
    selector: "easel-selector",
    templateUrl: "../../assets/templates/easel.html",
    styleUrls: ["../../assets/stylesheets/easel.css"],
})

export class EaselComponent implements OnInit, OnDestroy {

    // Create an event emitter to interact with the Game room Component
    @Output() easelTabKeyEvent = new EventEmitter<ScrabbleLetter>();
    @Input() keyEventValue: any;

    private _letters: Array<ScrabbleLetter>;
    private _indexOflettersToExchange: Array<number>;
    private _keyEventKeyCode: string;
    private _exchangeLetterSubmission: Subscription;
    private _initializeEaselSubmission: Subscription;

    public get indexOfLettersToChange(): Array<number> {
        return this._indexOflettersToExchange;
    }
    public set indexOfLettersToChange(v: Array<number>) {
        this._indexOflettersToExchange = v;
    }

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
        private easelEventManagerService: EaselManagerService,
        private socketService: SocketService) {
        this._indexOflettersToExchange = new Array<number>();
    }

    ngOnInit() {
        this._exchangeLetterSubmission = this.onExchangeLetterRequest();
        this._initializeEaselSubmission = this.initializeEaselOnConnection();
    }

    ngOnDestroy() {
        //this._exchangeLetterSubmission.unsubscribe();
    }

    private initializeEaselOnConnection(): Subscription {
        return this.socketService.subscribeToChannelEvent(SocketEventType.initializeEasel)
            .subscribe((initialsLetters: Array<string>) => {
                this._letters = new Array<ScrabbleLetter>();
                initialsLetters.forEach((letter) => {
                    this.letters.push(new ScrabbleLetter(letter));
                });
            });
    }

    private onExchangeLetterRequest(): Subscription {
        return this.socketService.subscribeToChannelEvent(SocketEventType.changeLettersRequest)
            .subscribe((response: any) => {

                for (let index = 0; index < this._indexOflettersToExchange.length; ++index) {
                    console.log("in easel", this._indexOflettersToExchange[index]);

                    this.letters[this._indexOflettersToExchange[index]] =
                        new ScrabbleLetter(response._data[index]);
                    console.log(this.letters);
                }
            });
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

        if (keyCode === EaselControl.rightArrowKeyCode
            && nextInputIndex === 0) {
            for (let index = easelMaxIndex; index > 0; --index) {
                this.letters[index].letter = this.letters[index - 1].letter;
            }

        } else if (keyCode === EaselControl.leftArrowKeyCode
            && nextInputIndex === easelMaxIndex) {
            for (let index = 0; index < easelMaxIndex; ++index) {
                this.letters[index].letter = this.letters[index + 1].letter;
            }

        } else {
            this.letters[currentInputIndex].letter = this.letters[nextInputIndex].letter;
        }

        this.letters[nextInputIndex].letter = currentLetter;
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

    // This method is used as an event listener, waiting for an emit from the the GameComponent
    public getNotificationOnTabKeyPress(keyCode: any) {
        if (keyCode === null) {
            throw new Error("The key code cannot be null.");
        }

        let firstLetterIndex = 0;
        this.easelEventManagerService.setFocusToElementWithGivenIndex(this.letters.length, firstLetterIndex);
    }
}
