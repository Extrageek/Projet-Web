import { Component, OnInit, OnDestroy, Output, ViewChild, EventEmitter } from "@angular/core";
import { Route, ActivatedRoute } from "@angular/router";

import { SocketService } from "../services/socket-service";
import { EaselManagerService } from "../services/easel/easel-manager.service";
import { GameRoomManagerService } from "../services/gameRoom/game-room-manager.service";
import { CommandsService } from "../services/commands/commands.service";
import { CommandsHelper } from "../services/commands/commands-helper";

import { IExchangeCommandRequest } from "../services/commands/command-request";
import { CommandStatus } from "../services/commands/command-status";
import { CommandType } from "../services/commands/command-type";

import { EaselComponent } from "./easel.component";
import { ChatroomComponent } from "./chatroom.component";
import { SocketEventType } from "../commons/socket-eventType";
import { IRoomMessage } from "../commons/messages/room-message.interface";
import { ScrabbleLetter } from "../models/letter/scrabble-letter";
import { EaselControl } from "../commons/easel-control";


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
        private activatedRoute: ActivatedRoute,
        private socketService: SocketService,
        private gameRoomEventManagerService: GameRoomManagerService,
        private easelManagerService: EaselManagerService,
        private commandsService: CommandsService) {
        this._inputMessage = '';
        // Constructor
    }

    ngOnInit() {
        this.activatedRoute.params.subscribe(params => {
            this._username = params['id'];
        });

        // TODO: unsubscribe all the event in the ngOnDestroy
        this.socketService.subscribeToChannelEvent(SocketEventType.connectError)
            .subscribe(this.onConnectionError);

        this.socketService.subscribeToChannelEvent(SocketEventType.joinRoom)
            .subscribe(this.onJoinedRoom);

        this.socketService.subscribeToChannelEvent(SocketEventType.roomReady)
            .subscribe(this.onRoomReady);
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
        let request = this._inputMessage.trim();
        let commandType = this.commandsService.getCommandType(this._inputMessage);

        if (commandType === CommandType.InvalidCmd) {
            console.log("Custom message: Invalid");

            this.socketService.emitMessage(SocketEventType.commandRequest,
                { commandStatus: CommandStatus.Invalid, data: this._inputMessage });

            this._inputMessage = '';

        } else {
            this.executeCommand(commandType, request);
        }

    }

    // Use to execute a custom event according to the command entered by the player
    private executeCommand(commandType: CommandType, parameters: string) {
        try {
            switch (commandType) {
                case CommandType.MessageCmd:
                    this.executeSendMessageCommand(commandType);
                    break;
                case CommandType.ExchangeCmd:
                    this.executeExchangeLettersCommand(commandType, parameters);
                    this._inputMessage = '';
                    break;
                case CommandType.PlaceCmd:
                    this.executePlaceWordCommand(commandType, parameters);
                    this._inputMessage = '';
                    break;
                case CommandType.PassCmd:
                    // TODO: for the next sprint
                    this._inputMessage = '';
                    break;
                case CommandType.Guide:
                    // TODO: for the next sprint
                    this._inputMessage = '';
                    break;
                case CommandType.InvalidCmd:
                    this._inputMessage = '';
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.log("invalid request", error);
        }
    }

    private executeSendMessageCommand(commandType: CommandType) {
        if (this._inputMessage.trim() !== "" && this._inputMessage.trim().length) {
            this.socketService.emitMessage(
                SocketEventType.message,
                { commandType: commandType, username: this._username, message: this._inputMessage });
            this._inputMessage = '';
        }
    }

    private executeExchangeLettersCommand(commandType: CommandType, requestValue: string) {
        if (requestValue === null) {
            throw new Error("Null argument error: The parameter cannot be null");
        }

        let request = requestValue.split(CommandsHelper.EXCHANGE_COMMAND)[1].trim();
        let listOfLettersToChange = this.easelManagerService.parseStringToListofChar(request);

        console.log(request, listOfLettersToChange);

        let exchangeRequest = this.commandsService
            .createExchangeEaselLettersRequest(this._childEasel.letters, listOfLettersToChange);

        if (exchangeRequest._commandStatus === CommandStatus.Ok) {
            this._childEasel.indexOfLettersToChange = exchangeRequest._response;
            this.socketService.emitMessage(SocketEventType.changeLettersRequest,
                { commandType: commandType, listOfLettersToChange: listOfLettersToChange });

            this._inputMessage = '';
            console.log("Ok");

        } else if (exchangeRequest._commandStatus === CommandStatus.NotAllowed) {
            this.socketService.emitMessage(
                SocketEventType.commandRequest,
                { commandType: commandType, commandStatus: CommandStatus.NotAllowed, data: requestValue });

            this._inputMessage = '';
            console.log("Custom message: NotAllowed");

        } else if (exchangeRequest._commandStatus === CommandStatus.SynthaxeError) {
            this.socketService.emitMessage(SocketEventType.commandRequest,
                { commandType: commandType, commandStatus: CommandStatus.SynthaxeError, data: requestValue });

            this._inputMessage = '';
            console.log("Custom message: SyntaxError");
        }
    }

    private executePlaceWordCommand(commandType: CommandType, parameters: string) {
        if (parameters === null) {
            throw new Error("Null argument error: The parameter cannot be null");
        }

        let parameter = parameters.split(CommandsHelper.PLACE_COMMAND)[1].trim();

        //console.log("Command request:", request);
        let placeWordRequest = this.commandsService
            .createPlaceWordRequest(this._childEasel.letters, parameter);

        //console.log("place word request:", placeWordRequest);
        if (placeWordRequest._commandStatus === CommandStatus.Ok) {
            let listOfLettersToPlace = this.easelManagerService
                .parseScrabbleLettersToListofChar(placeWordRequest._response);

            //console.log("list of letters to place", listOfLettersToPlace);
            this.socketService.emitMessage(SocketEventType.commandRequest,
                { commandType: commandType, commandStatus: CommandStatus.Ok, data: parameter });
            this._inputMessage = '';
            // console.log("Ok");

        } else if (placeWordRequest._commandStatus === CommandStatus.NotAllowed) {
            this.socketService.emitMessage(
                SocketEventType.commandRequest,
                { commandType: commandType, commandStatus: CommandStatus.NotAllowed, data: parameters });
            this._inputMessage = '';
            // console.log("Custom message: NotAllowed");

        } else if (placeWordRequest._commandStatus === CommandStatus.SynthaxeError) {
            this.socketService.emitMessage(SocketEventType.commandRequest,
                { commandType: commandType, commandStatus: CommandStatus.SynthaxeError, data: parameters });
            this._inputMessage = '';
            // console.log("Custom message: SyntaxError");
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
