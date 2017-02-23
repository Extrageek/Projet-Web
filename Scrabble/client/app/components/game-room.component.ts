import { Component, OnInit, OnDestroy, Output, ViewChild, EventEmitter } from "@angular/core";
import { Route, ActivatedRoute } from '@angular/router';

import { SocketService } from "../services/socket-service";
import { EaselManagerService } from '../services/easel/easel-manager.service';
import { GameRoomManagerService } from "../services/gameRoom/game-room-manager.service";
import { CommandsService, EXCHANGE_COMMAND, PLACE_COMMAND } from "../services/commandes/commands.service";

import { IExchangeCommandRequest } from "../services/commandes/command-request";
import { CommandStatus } from "../services/commandes/command-status";
import { InputCommandType } from '../services/commandes/command-type';

import { EaselComponent } from './easel.component';
import { ChatroomComponent } from './chatroom.component';
import { SocketEventType } from '../commons/socket-eventType';
import { IRoomMessage } from '../models/room/room-message';
import { ScrabbleLetter } from "../models/letter/scrabble-letter";
import { EaselControl } from '../commons/easel-control';


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

        if (commandAndRequest === InputCommandType.MessageCmd) {
            this.executeSendMessageCommand();

        } else if (commandAndRequest === InputCommandType.ExchangeCmd) {

            try {
                this.executeExchangeLettersCommand(texte);
                this._inputMessage = '';
            } catch (error) {
                console.log('invalid request', error);
            }

        } else if (commandAndRequest === InputCommandType.PlaceCmd) {
            //placeCmd
            this._inputMessage = '';

        } else if (commandAndRequest === InputCommandType.PassCmd) {
            // passCmd
            this._inputMessage = '';

        } else if (commandAndRequest === InputCommandType.InvalidCmd) {
            //InvalidCmd
            this._inputMessage = 'Invalid command';
        }
    }

    private executeSendMessageCommand() {
        if (this._inputMessage.trim() !== "" && this._inputMessage.trim().length) {
            this.socketService.emitMessage(
                SocketEventType.message,
                { username: this._username, message: this._inputMessage });
            this._inputMessage = '';
        }
    }

    private executeExchangeLettersCommand(requestValue: string) {
        if (requestValue === null) {
            throw new Error("Null argument error: The parameter cannot be null");
        }

        let request = requestValue.split(EXCHANGE_COMMAND)[1].trim();
        let listOfLettersToChange = this.easelManagerService.getStringListofChar(request);

        let exchangeRequest = this.commandsService
            .createExchangeEaselLettersRequest(this._childEasel.letters, listOfLettersToChange);

        if (exchangeRequest._commandStatus === CommandStatus.Ok) {
            this._childEasel.indexOfLettersToChange = exchangeRequest._indexOfLettersToExchange;
            this.socketService.emitMessage(SocketEventType.exchangeLettersRequest, listOfLettersToChange);
            this._inputMessage = '';

            console.log("Ok");

        } else if (exchangeRequest._commandStatus === CommandStatus.NotAllowed) {
            console.log("NotAllowed");

        } else if (exchangeRequest._commandStatus === CommandStatus.SynthaxeError) {
            console.log("SynthaxeError");

        } else if (exchangeRequest._commandStatus === CommandStatus.Invalid) {
            console.log("Invalid");
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
