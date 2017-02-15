import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild } from "@angular/core";
import { Route, ActivatedRoute } from '@angular/router';
import { SocketService } from "../services/socket-service";
import { SocketEventType } from '../commons/socket-eventType';

@Component({
    moduleId: module.id,
    selector: "scrabble-chatroom-selector",
    templateUrl: "../../assets/templates/chatroom.html",
    styleUrls: ["../../assets/stylesheets/chatroom.css"],
    providers: [SocketService]
})

export class ChatroomComponent implements AfterViewChecked, OnInit {
    messageArray: string[];
    username: string;

    @ViewChild("scroll") private myScrollContainer: ElementRef;

    constructor(private route: ActivatedRoute, private socketService: SocketService) {

    }


    ngOnInit(): void {
        this.messageArray = new Array<string>();

        this.route.params.subscribe(params => {
            this.username = params['id'];
        });

        SocketService.getInstance().removeAllListeners();
        SocketService.getInstance().suscribeToEvent(SocketEventType.connectError, this.onConnectionError);
        SocketService.getInstance().suscribeToEvent(SocketEventType.joinRoom, this.onJoinedRoom);
        SocketService.getInstance().suscribeToEvent(SocketEventType.leaveRoom, this.onLeaveRoom);
        SocketService.getInstance().suscribeToEvent(SocketEventType.roomReady, this.onRoomReady);
        SocketService.getInstance().suscribeToEvent(SocketEventType.message, this.onReceivedMessage);
    }

    // A callback fonction for the chat message submit button
    submitMessage(message: HTMLInputElement) {
        if (message.value !== "") {
            SocketService.getInstance().sendMessage(this.username, message.value);
            //this.messageArray.push(message.value);
        }
        message.value = "";
    }

    // A callback fonction when the player receive a message
    onReceivedMessage(roomMessage: { username: string, message: string }) {
        console.log(roomMessage.username, " send a message: ", roomMessage.message);

        // TODO: Find a good way to set the component property
        // MessageArray inside this event callback

        // this.messageArray.push(roomMessage.message);
    }

    scrollToBottom() {
        try {
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        } catch (err) {
            console.log(err);
        }
    }

    ngAfterViewChecked() {
        this.scrollToBottom();
    }


    // A callback function when the server is not reachable.
    public onConnectionError() {
        console.log("Connection Error: The server is not reachable");
    }

    // A callback when the player join a room
    public onJoinedRoom(roomMessage: {
        username: string,
        roomId: string,
        numberOfMissingPlayers: number,
        roomIsReady: boolean,
        message: string
    }): void {

        // For debug
        console.log(roomMessage);
        console.log(roomMessage.message, roomMessage.roomId,
            " RoomReadyState", roomMessage.roomIsReady,
            " missing players", roomMessage.numberOfMissingPlayers);
    }

    // A callback when the player leave a room
    public onLeaveRoom(roomMessage: {
        username: string,
        roomId: string,
        numberOfMissingPlayers: number,
        roomIsReady: boolean,
        message: string
    }): void {

        // For debug
        console.log("On leaving room", roomMessage);
        console.log(roomMessage.message, roomMessage.roomId,
            " RoomReadyState", roomMessage.roomIsReady,
            " missing players", roomMessage.numberOfMissingPlayers);

        //this.messageArray.push(roomMessage.message);
    }

    // A callback function when the room of the user is full and the game is ready to be started
    public onRoomReady(roomMessage: {
        username: string,
        roomId: string,
        numberOfMissingPlayers: number,
        roomIsReady: boolean,
        message: string
    }): void {

        // For debug
        console.log(roomMessage);
        // console.log(roomMessage.message, roomMessage.roomId,
        //     " RoomReadyState", roomMessage.roomIsReady,
        //     " missing players", roomMessage.numberOfMissingPlayers);

        //this.router.navigate(["/game-room", { id: roomMessage.username }]);
        //console.log("router must be called",this.router);
    }

    // A callback function when in case of invalid request.
    public onInvalidRequest() {
        console.log("The request sent to the server is invalid");
    }
}
