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

    @ViewChild(ChatroomComponent)
    private _childChatroomComponent: ChatroomComponent;

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
    }

    ngOnDestroy() {
        // TODO: unsubscribe to all the event in the ngOnDestroy
    }

    // A callback function when the server is not reachable.
    public onConnectionError() {
        console.log("Connection Error: The server is not reachable");
    }

    // A callback when the player leave a room
    public onLeaveRoom(roomMessage: IRoomMessage): void {

        // For debug
        console.log("In Room", roomMessage);
    }

    // A callback function when in case of invalid request.
    private onInvalidRequest() {
        console.log("In Room", "The request sent to the server is invalid");
    }

    // A callback fonction for the chat message submit button
    public submitMessage() {
        let commandRequest = this._inputMessage.trim();
        let commandParameters = this.commandsService.extractCommandParameters(this._inputMessage);
        let currentPlayerName = this.socketService.getCurrentPlayer();

        // If the player try a command and it's not his turn to play, let him know
        if (currentPlayerName !== this._username
            && commandParameters.commandType !== CommandType.MessageCmd) {
            let message = `Veuillez attendre votre tour après ${currentPlayerName} pour pouvoir jouer`;

            // Ask if it's necessary to send this to the server, I'm not sure we can just push it to the chatroom
            this.socketService.emitMessage(SocketEventType.invalidCommandRequest,
                {
                    commandType: CommandType.InvalidCmd,
                    commandStatus: CommandStatus.NotAllowed,
                    data: message
                });
        }
        else {
            this.handleInputCommand(commandParameters);
        }

        this._inputMessage = '';
    }

    public handleInputCommand(commandParameters: { commandType: CommandType, parameters: string }) {

        switch (commandParameters.commandType) {
            case CommandType.MessageCmd:
                this.commandsService
                    .invokeAndExecuteMessageCommand(
                    this._childChatroomComponent,
                    commandParameters.parameters);
                break;
            case CommandType.ExchangeCmd:
                this.commandsService
                    .invokeAndExecuteExchangeCommand(
                    this._childEaselComponent,
                    commandParameters.parameters);
                break;
            case CommandType.PlaceCmd:
                this.commandsService
                    .invokeAndExecutePlaceCommand(
                    this._childEaselComponent,
                    this._childBoardComponent,
                    commandParameters.parameters);
                break;
            case CommandType.PassCmd:
                this.commandsService
                    .invokeAndExecutePassCommand(
                    this);
                break;
            case CommandType.Guide:
                // TODO:
                break;
            case CommandType.InvalidCmd:
                this.executeInvalidCommand();
                break;
            default:
                break;
        }
    }

    public passCurrentPlayerTurn(request: {
        commandType: CommandType,
        commandStatus: CommandStatus,
        data: string
    }) {
        this.socketService.emitMessage(SocketEventType.passCommandRequest, request);
    }

    public executeInvalidCommand() {
        console.log("Custom message: Invalid");
        this.socketService.emitMessage(SocketEventType.invalidCommandRequest,
            {
                commandType: CommandType.InvalidCmd,
                commandStatus: CommandStatus.Invalid,
                data: this._inputMessage
            });
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
