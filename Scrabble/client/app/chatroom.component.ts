import {Component, OnInit, AfterViewChecked, ElementRef, ViewChild} from '@angular/core';

@Component({
    selector: 'scrabble-chatroom',
    templateUrl: './app/chatroom.html',
    styleUrls: ['./app/chatroom.css'],
})
export class ChatroomComponent implements OnInit, AfterViewChecked {
    messageArray:string[];
    @ViewChild('scroll') private myScrollContainer: ElementRef;

    submitMessage(message:HTMLInputElement) {
        if(message.value != "") {
            this.messageArray.push(message.value);
        }
        message.value = "";
    }

    constructor() {
        this.messageArray = [];
    }

    scrollToBottom(): void {
        try {
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        } catch(err) { }
    }

    ngAfterViewChecked() {
        this.scrollToBottom();
    }
    ngOnInit() {
    }
}