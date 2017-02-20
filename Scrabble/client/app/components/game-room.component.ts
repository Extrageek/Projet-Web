import { Component, OnInit, OnDestroy, Output, ViewChild, EventEmitter } from "@angular/core";
import { Route, ActivatedRoute } from '@angular/router';

import { SocketService } from "../services/socket-service";
import { EaselComponent } from './easel.component';
import { GameRoomEventManagerService } from "../services/gameRoom/game-room-event-manager.service";
import { SocketEventType } from '../commons/socket-eventType';
import { IRoomMessage } from '../models/room/room-message';
import { ScrabbleLetter } from "../models/letter/scrabble-letter";
import { EaselControl } from '../commons/easel-control';


declare var jQuery: any;

@Component({
    moduleId: module.id,
    providers: [SocketService, GameRoomEventManagerService],
    selector: "game-room-selector",
    templateUrl: "../../assets/templates/game-room.html",
    styleUrls: ["../../assets/stylesheets/game-room.css"],
})

export class GameComponent implements OnInit, OnDestroy {

    // Create an event emitter to interact with the Easel Component
    @Output() tabKeyEvent = new EventEmitter();

    @ViewChild(EaselComponent)
    private _childEasel: EaselComponent;
    private _username: string;

    constructor(
        private route: ActivatedRoute,
        private socketService: SocketService,
        private gameRoomEventManagerService: GameRoomEventManagerService) {
        // Constructor
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this._username = params['id'];
        });

        this.changeLettersRequest();

        // TODO: unsubscribe all the event in the ngOnDestroy
        this.socketService.subscribeToChannelEvent(SocketEventType.connectError)
            .subscribe(this.onConnectionError);

        this.socketService.subscribeToChannelEvent(SocketEventType.joinRoom)
            .subscribe(this.onJoinedRoom);

        this.socketService.subscribeToChannelEvent(SocketEventType.roomReady)
            .subscribe(this.onRoomReady);

        this.socketService.subscribeToChannelEvent(SocketEventType.exchangedLetter)
            .subscribe(this.onChangedLettersReceived);
    }

    ngOnDestroy() {
        // TODO: unsubscribe to all the event in the ngOnDestroy
    }

    // A callback function when the server is not reachable.
    public onConnectionError() {
        console.log("Connection Error: The server is not reachable");
    }

    // A callback when the player join a room
    public onJoinedRoom(roomMessage: IRoomMessage): void {

        // For debug
        console.log("In Room", roomMessage);
    }

    // A callback when the player leave a room
    public onLeaveRoom(roomMessage: IRoomMessage): void {

        // For debug
        console.log("In Room", roomMessage);
    }

    // A callback function when the room of the user is full and the game is ready to be started
    private onRoomReady(roomMessage: IRoomMessage): void {

        // For debug
        console.log("In Room", roomMessage);
    }

    private onChangedLettersReceived(changedLetters: Object) {
        console.log("In Room", "Hey! I received new letters from the server: ", changedLetters);
    }

    // A callback function when in case of invalid request.
    private onInvalidRequest() {
        console.log("In Room", "The request sent to the server is invalid");
    }

    // A callback fonction for the chat message submit button
    public submitMessage(message: HTMLInputElement) {
        if (message.value !== "") {
            this.socketService.emitMessage(
                SocketEventType.message,
                { username: this._username, message: message.value });
        }
        message.value = "";
    }

    public changeLettersRequest(/*lettersToBeChanged: Array<string>*/) {

        // TODO: Should be removed after a clean debug
        let fakeLetters = ['A', 'E', 'M', 'N', 'U', 'A', 'A'];
        console.log("Letter to change:", fakeLetters);
        this.socketService.emitMessage(SocketEventType.exchangeLettersRequest, fakeLetters);
    }

    public onTabKeyEventFromEasel(letter: any) {
        // Give the focus to the input box
        setTimeout(function () {
            jQuery("#inputMessage").focus();
        }, 0);
    }

    public onKeyPressEventHandler(event: KeyboardEvent) {
        let keyCode = event.which;

        if (this.gameRoomEventManagerService.isTabKey(keyCode)) {
            this._childEasel.getNotificationOnTabKeyPress(keyCode);
        }
    }
}
