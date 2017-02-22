import { Component, OnInit, OnDestroy, Output, ViewChild, EventEmitter } from "@angular/core";
import { Route, ActivatedRoute } from '@angular/router';

import { SocketService } from "../services/socket-service";
import { CommandsService, EXCHANGE_COMMAND, PLACE_COMMAND } from "../services/gameRoom/commands.service";
import { EaselComponent } from './easel.component';
import { ChatroomComponent } from './chatroom.component';
import { GameRoomManagerService } from "../services/gameRoom/game-room-manager.service";
import { EaselManagerService } from '../services/easel/easel-manager.service';
import { SocketEventType } from '../commons/socket-eventType';
import { IRoomMessage } from '../models/room/room-message';
import { ScrabbleLetter } from "../models/letter/scrabble-letter";
import { EaselControl } from '../commons/easel-control';
import { InputCommand } from '../commons/input-commands';


declare var jQuery: any;

@Component({
    moduleId: module.id,
    providers: [SocketService, GameRoomManagerService, CommandsService, EaselManagerService],
    selector: "game-room-selector",
    templateUrl: "../../assets/templates/game-room.html",
    styleUrls: ["../../assets/stylesheets/game-room.css"],
})

export class GameComponent implements OnInit, OnDestroy {

    // Create an event emitter to interact with the Easel Component
    @Output() tabKeyEvent = new EventEmitter();

    @ViewChild(EaselComponent)
    private _childEasel: EaselComponent;
    private _chatRoom: ChatroomComponent;

    _username: string;
    _inputMessage: string;

    constructor(
        private route: ActivatedRoute,
        private socketService: SocketService,
        private gameRoomEventManagerService: GameRoomManagerService,
        private easelManagerService: EaselManagerService,
        private commandsService: CommandsService) {
        this._inputMessage = '';
        // Constructor
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this._username = params['id'];
        });

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
    public submitMessage() {
        let texte = this._inputMessage.trim();
        let commandAndRequest = this.commandsService.getInputCommand(this._inputMessage);

        if (commandAndRequest === InputCommand.MessageCmd) {
            if (this._inputMessage.trim() !== "" && this._inputMessage.trim().length) {
                this.socketService.emitMessage(
                    SocketEventType.message,
                    { username: this._username, message: this._inputMessage });
            }
        } else if (commandAndRequest === InputCommand.ExchangeCmd) {

            let request = texte.split(EXCHANGE_COMMAND)[1].trim();
            let listOfLettersToChange = this.easelManagerService.getStringListofChar(request);

            try {

                this.executeExchangeCommand(listOfLettersToChange);

            } catch (error) {
                let invalidCmd = listOfLettersToChange.toString();
                console.log('invalid command', invalidCmd, error);
            }

        } else if (commandAndRequest === InputCommand.PlaceCmd) {
            //placeCmd
            this._inputMessage = '';

        } else if (commandAndRequest === InputCommand.PassCmd) {
            // passCmd
            this._inputMessage = '';

        } else if (commandAndRequest === InputCommand.InvalidCmd) {
            //InvalidCmd
            this._inputMessage = 'Invalid command';
        }
    }

    private executeExchangeCommand(listOfLettersToChange: Array<string>) {
        if (listOfLettersToChange === null) {
            throw new Error("Null argument error: The parameter cannot be null");
        }

        let indexOfLettersToChange = this.easelManagerService
            .getIndexOfLettersToChangeIfValidRequest(this._childEasel.letters, listOfLettersToChange);

        if (indexOfLettersToChange !== null) {
            this._childEasel.indexOfLettersToChange = indexOfLettersToChange;
            this.socketService.emitMessage(SocketEventType.exchangeLettersRequest, listOfLettersToChange);
            this._inputMessage = '';

        } else {
            let invalidCmd = listOfLettersToChange.toString();
            console.log('invalid command', invalidCmd);
        }
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
