import { Component, OnInit, OnDestroy, Output, ViewChild, EventEmitter } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { SocketService } from "../services/socket-service";
import { EaselManagerService } from "../services/easel-manager.service";
import { GameRoomManagerService } from "../services/game-room-manager.service";
import { CommandsService } from "../services/commands.service";
import { CommandStatus } from "../services/commons/command-status";
import { CommandType } from "../services/commons/command-type";

import { IRoomMessage } from "../commons/messages/room-message.interface";
import { SocketEventType } from "../commons/socket-eventType";
import { Player } from "../models/player";

import { EaselComponent } from "./easel.component";
import { ChatroomComponent } from "./chatroom.component";
import { BoardComponent } from "./board.component";


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

    _inputMessage: string;

    constructor(
        private activatedRoute: ActivatedRoute,
        private socketService: SocketService,
        private gameRoomEventManagerService: GameRoomManagerService,
        private commandsService: CommandsService) {

        this._inputMessage = '';
        // Constructor
    }

    ngOnInit() {
        this.activatedRoute.params.subscribe(params => {
            this.socketService.player = new Player(params['id']);
            console.log(this.socketService.player);
        });

        // TODO: unsubscribe all the event in the ngOnDestroy
        this.socketService.subscribeToChannelEvent(SocketEventType.CONNECT_ERROR)
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
        let commandParameters = this.commandsService.extractCommandParameters(this._inputMessage);

        // If the player try a command and it's not his turn to play, let him know
        if (!this.socketService.isCurrentPlayer()
            && commandParameters.commandType !== CommandType.MessageCmd) {
            let message = "Veuillez attendre votre tour après " + this.socketService.getCurrentPlayer() +
                + "pour pouvoir jouer";

            // Ask if it's necessary to send this to the server, I'm not sure we can just push it to the chatroom
            this.socketService.emitMessage(SocketEventType.INVALID_COMMAND_REQUEST,
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
            case CommandType.GuideCmd:
                this.commandsService
                    .invokeAndExecuteGuideCommand(this._childChatroomComponent);
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
        this.socketService.emitMessage(SocketEventType.PASS_COMMAND_REQUEST, request);
    }

    public executeInvalidCommand() {
        console.log("Custom message: Invalid");
        this.socketService.emitMessage(SocketEventType.INVALID_COMMAND_REQUEST,
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
