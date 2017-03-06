import { Component, OnInit, OnDestroy, Output, ViewChild, EventEmitter } from "@angular/core";
import { Route, ActivatedRoute } from "@angular/router";

import { SocketService } from "../services/socket-service";
import { EaselManagerService } from "../services/easel/easel-manager.service";
import { GameRoomManagerService } from "../services/gameRoom/game-room-manager.service";
import { CommandsService } from "../services/commands/commands.service";
import { CommandsHelper } from "../services/commands/commons/commands-helper";
import { CommandStatus } from "../services/commands/commons/command-status";
import { CommandType } from "../services/commands/commons/command-type";

import { IRoomMessage } from "../commons/messages/room-message.interface";
import { EaselControl } from "../commons/easel-control";
import { SocketEventType } from "../commons/socket-eventType";

import { EaselComponent } from "./easel.component";
import { ChatroomComponent } from "./chatroom.component";
import { BoardComponent } from "./board.component";
import { ScrabbleLetter } from "../models/letter/scrabble-letter";


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

    @ViewChild(BoardComponent)
    private _childBoardComponent: BoardComponent;

    @ViewChild(EaselComponent)
    private _childEaselComponent: EaselComponent;

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
        let commandRequest = this._inputMessage.trim();
        let commandParameters = this.commandsService.extractCommandParameters(this._inputMessage);

        if (commandParameters.commandType === CommandType.InvalidCmd) {
            console.log("Custom message: Invalid");
            this.socketService.emitMessage(SocketEventType.invalidCommandRequest,
                { commandType: CommandType.InvalidCmd, commandStatus: CommandStatus.Invalid, data: this._inputMessage });

        } else {
            this.handleInputCommand(commandParameters);
        }
        this._inputMessage = '';
    }

    public handleInputCommand(commandParameters: { commandType: CommandType, parameters: string }) {

        switch (commandParameters.commandType) {
            case CommandType.MessageCmd:
                this.commandsService.invokeAndExecuteMessageCommand(this.socketService, commandParameters.parameters);
                break;
            case CommandType.ExchangeCmd:
                this.commandsService.invokeAndExecuteExchangeCommand(
                    this._childEaselComponent,
                    commandParameters.parameters);
                break;
            case CommandType.PlaceCmd:
                this.commandsService.invokeAndExecutePlaceCommand(
                    this._childEaselComponent,
                    this._childBoardComponent,
                    commandParameters.parameters);
                break;
            case CommandType.PassCmd:
                this.commandsService.invokeAndExecutePassCommand(
                    this.socketService,
                    commandParameters.parameters);
                break;
            case CommandType.Guide:
                // TODO: for the next sprint
                break;
            case CommandType.InvalidCmd:
                break;
            default:
                break;
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
            this._childEaselComponent.getNotificationOnTabKeyPress(keyCode);
        }
    }
}
