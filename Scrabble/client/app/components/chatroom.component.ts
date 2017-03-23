import { Component, OnInit, OnDestroy, AfterViewChecked, ElementRef, ViewChild } from "@angular/core";
import { Subscription } from "rxjs/Subscription";

import { Route, ActivatedRoute } from "@angular/router";
import { SocketService } from "../services/socket-service";
import { SocketEventType } from "../commons/socket-eventType";
import { IGameMessage } from "../commons/messages/game-message.interface";
import { IRoomMessage } from "../commons/messages/room-message.interface";
import { ICommandMessage } from "../commons/messages/command-message.interface";
import { CommandType } from '../services/commons/command-type';

@Component({
    moduleId: module.id,
    selector: "scrabble-chatroom-selector",
    templateUrl: "../../assets/templates/chatroom.html",
    styleUrls: ["../../assets/stylesheets/chatroom.css"],
})

export class ChatroomComponent implements AfterViewChecked, OnInit, OnDestroy {
    _messageArray: Array<IGameMessage>;
    _username: string;

    private _onJoinedRoomSubscription: Subscription;
    private _onLeaveRoomSubscription: Subscription;
    private _onReceivedMessageSubscription: Subscription;

    private _onPlaceWordSubscription: Subscription;
    private _onChangedLetterCommandSubscription: Subscription;
    private _onPassCommandSubscription: Subscription;

    private _onCommandRequest: Subscription;
    private _onInvalidCommandSubscription: Subscription;
    private _onNotAllowedCommandSubscription: Subscription;

    private _hasNewMessages: boolean;

    @ViewChild("scroll") private myScrollContainer: ElementRef;

    constructor(private route: ActivatedRoute, private socketService: SocketService) {
        this._messageArray = new Array<IRoomMessage>();
        this._hasNewMessages = false;
    }

    ngOnInit(): void {
        this._messageArray = new Array<IRoomMessage>();
        this.route.params.subscribe(params => {
            this._username = params['id'];
        });

        // Subscribe to event by calling the related method and save them for unsubsciption OnDestroy
        this._onJoinedRoomSubscription = this.onJoinedRoom();
        this._onLeaveRoomSubscription = this.onLeaveRoom();
        this._onReceivedMessageSubscription = this.onReceivedMessage();
        this._onCommandRequest = this.onCommandRequest();
    }

    ngOnDestroy() {
        // Unsubscribe all the event listeners here
    }

    private onCommandRequest(): Subscription {
        return this.socketService.subscribeToChannelEvent(SocketEventType.COMMAND_REQUEST)
            .subscribe((response: ICommandMessage<any>) => {
                if (response !== undefined && response._message !== null) {
                    this._messageArray.push(response);
                    this._hasNewMessages = true;
                    console.log("CommandRequest Chatroom", response);
                }
            });
    }

    // A callback when the player join a room
    private onJoinedRoom(): Subscription {
        return this.socketService.subscribeToChannelEvent(SocketEventType.JOIN_ROOM)
            .subscribe((response: IRoomMessage) => {
                if (response !== undefined && response._message !== null) {
                    this._messageArray.push(response);
                    this._hasNewMessages = true;
                    console.log("Chat room:Joined ", response._message);
                }
            });
    }

    // A callback when the player leave a room
    private onLeaveRoom(): Subscription {
        return this.socketService.subscribeToChannelEvent(SocketEventType.LEAVE_ROOM)
            .subscribe((response: IRoomMessage) => {
                if (response !== undefined && response._message !== null) {
                    this._messageArray.push(response);
                    this._hasNewMessages = true;
                    console.log("Chat room: Leave ", response._message);
                }
            });
    }

    // A callback fonction when the player receive a message
    private onReceivedMessage(): Subscription {
        return this.socketService.subscribeToChannelEvent(SocketEventType.MESSAGE)
            .subscribe((response: any) => {
                if (response !== undefined && response._message !== null) {
                    this._messageArray.push(response as IRoomMessage);
                    this._hasNewMessages = true;
                    console.log("Chat room: ", response.message, response.date);
                }
            });
    }

    public sendMessage(request: {
        commandType: CommandType,
        message: string
    }) {

        if (request.commandType === null
            || request.message == null) {
            throw new Error("Null argument error: the parameters cannot be null");
        }
        this.socketService.emitMessage(SocketEventType.MESSAGE, request);
    }

    public print(message: IGameMessage) {
        if (message._commandType === CommandType.GuideCmd) {
            this._messageArray.push(message);
            this._hasNewMessages = true;
            console.log("sasa");
        }
    }

    // Use to add a scroller to the chatroom
    private scrollToBottom() {
        try {
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        } catch (err) {
            console.log(err);
        }
    }

    // Use to help the user when scrolling
    ngAfterViewChecked() {
        if (this._hasNewMessages) {
            this.scrollToBottom();
            this._hasNewMessages = false;
        }
    }
}
