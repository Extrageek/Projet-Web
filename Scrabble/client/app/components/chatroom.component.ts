import { Component, OnInit, OnDestroy, AfterViewChecked, ElementRef, ViewChild } from "@angular/core";
import { Subscription } from "rxjs/Subscription";

import { Route, ActivatedRoute } from "@angular/router";
import { SocketService } from "../services/socket-service";
import { SocketEventType } from "../commons/socket-eventType";
import { IGameMessage } from "../commons/messages/game-message.interface";
import { IRoomMessage } from "../commons/messages/room-message.interface";
import { ICommandMessage } from "../commons/messages/command-message.interface";

@Component({
    moduleId: module.id,
    selector: "scrabble-chatroom-selector",
    templateUrl: "../../assets/templates/chatroom.html",
    styleUrls: ["../../assets/stylesheets/chatroom.css"],
    providers: [SocketService]
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

    @ViewChild("scroll") private myScrollContainer: ElementRef;

    constructor(private route: ActivatedRoute, private socketService: SocketService) {
        this._messageArray = new Array<IRoomMessage>();
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

        // this._onPlaceWordSubscription = this.onCommandRequest();
        this._onChangedLetterCommandSubscription = this.onChangedLetterCommand();
        // this._onPassCommandSubscription = this.onPassCommand();

        this._onCommandRequest = this.onCommandRequest();
        // this._onNotAllowedCommandSubscription = this.onNotAllowedCommand();
        // this._onInvalidCommandSubscription = this.onInvalidCommand();
    }

    ngOnDestroy() {
        // unsubscribe to all the listening events
        // this._onJoinedRoomSubscription.unsubscribe();
        // this._onLeaveRoomSubscription.unsubscribe();
        // this._onReceivedMessageSubscription.unsubscribe();
    }

    onCommandRequest(): Subscription {
        return this.socketService.subscribeToChannelEvent(SocketEventType.commandRequest)
            .subscribe((response: ICommandMessage<any>) => {
                if (response !== undefined && response._message !== null) {
                    this._messageArray.push(response);
                    console.log("CommandRequest Chatroom", response._message);
                }
            });
    }

    onChangedLetterCommand(): Subscription {
        return this.socketService.subscribeToChannelEvent(SocketEventType.changeLettersRequest)
            .subscribe((response: ICommandMessage<Array<string>>) => {
                if (response !== undefined && response._message !== null) {
                    this._messageArray.push(response);
                    console.log("Changed letters ", response._message);
                }
            });
    }

    // A callback when the player join a room
    private onJoinedRoom(): Subscription {
        return this.socketService.subscribeToChannelEvent(SocketEventType.joinRoom)
            .subscribe((response: IRoomMessage) => {
                if (response !== undefined && response._message !== null) {
                    this._messageArray.push(response);
                    console.log("Chat room:Joined ", response._message);
                }
            });
    }

    // A callback when the player leave a room
    public onLeaveRoom(): Subscription {
        return this.socketService.subscribeToChannelEvent(SocketEventType.leaveRoom)
            .subscribe((response: IRoomMessage) => {
                if (response !== undefined && response._message !== null) {
                    this._messageArray.push(response);
                    console.log("Chat room: Leave ", response._message);
                }
            });
    }

    // A callback fonction when the player receive a message
    private onReceivedMessage(): Subscription {
        return this.socketService.subscribeToChannelEvent(SocketEventType.message)
            .subscribe((response: any) => {
                if (response !== undefined && response._message !== null) {
                    this._messageArray.push(response as IRoomMessage);
                    console.log("Chat room: ", response.message, response.date);
                }
            });
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
        this.scrollToBottom();
    }
}
