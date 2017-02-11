import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild } from "@angular/core";
import { Route, ActivatedRoute } from '@angular/router';
import { SocketService } from "../services/socket-service";
import { SocketEventType } from '../commons/socket-eventType';

@Component({
    moduleId: module.id,
    selector: "scrabble-chatroom-selector",
    templateUrl: "../../app/views/chatroom.html",
    styleUrls: ["../../app/assets/chatroom.css"],

    /*FOR TESTING PURPOSES ONLY*/
    //         template: `
    //     <div class = "chatContainer">
    //         <div class = "chatTitle">Chat Room</div>
    //         <div #scroll class = "chatMessageBox">
    //             <div class= "individualMessages" *ngFor="let message of messageArray">{{message}}</div>
    //         </div>
    //             <div class = "chatTextBox">
    //             <form autocomplete="off">
    //                 <input #message (keyup.enter) = "submitMessage(message)"
    //                 id="inputMessage" type="text" placeholder="Enter your message" />
    //                 <input (mousedown) = "submitMessage(message)" id="submitMessage" type="submit" value="Send"/>
    //             </form>
    //         </div>
    //     </div>`

    providers: [SocketService]
})

export class ChatroomComponent implements AfterViewChecked, OnInit {
    messageArray: string[];
    username: string;

    @ViewChild("scroll") private myScrollContainer: ElementRef;

    constructor(private route: ActivatedRoute, private socketService: SocketService) {

    }

    ngOnInit(): void {
        this.messageArray = [];

        this.route.params.subscribe(params => {
            this.username = params['id'];
        });

        this.socketService.removeAllListeners();
        // this.socketService.suscribeToEvent(SocketEventType.connectError, this.onReceivedMessage);
        this.socketService.suscribeToEvent(SocketEventType.message, this.onReceivedMessage);
    }

    submitMessage(message: HTMLInputElement) {

        if (message.value !== "") {
            this.socketService.sendMessage(this.username, message.value);
        }
        message.value = "";
    }

    onReceivedMessage(chatMessage: { username: string, message: string }) {
        console.log(chatMessage.username, " send a message: ", chatMessage.message);
        this.messageArray.push(chatMessage.message);
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
}
