import { Component, OnInit, AfterViewInit } from "@angular/core";
import { Subscription } from "rxjs/Subscription";

import { TimerService } from "../services/timer-service";
import { SocketService } from "../services/socket-service";
import { SocketEventType } from "../commons/socket-eventType";
import { IGameMessage } from "../commons/messages/game-message.interface";
import { IRoomMessage } from "../commons/messages/room-message.interface";
import { ICommandMessage } from "../commons/messages/command-message.interface";

//const MAX_NUMBER_OF_LETTERS = 7;
const ONE_SECOND = 1000;

@Component({
    moduleId: module.id,
    providers: [TimerService],
    selector: "info-panel-selector",
    templateUrl: "../../assets/templates/information-panel.html",
    styleUrls: ["../../assets/stylesheets/information-panel.css"]
})

export class InformationPanelComponent implements OnInit, AfterViewInit {
    player = "default";
    score: number;
    lettersOnEasel: number;
    lettersInBank: number;
    seconds: number;
    minutes: number;

    constructor(private timerService: TimerService,
        private socketService: SocketService) {
        this.seconds = timerService.seconds;
        this.minutes = timerService.minutes;
        this.score = 0;
        this.lettersOnEasel = 7;
        // TODO : get it from letterbank service
        this.lettersInBank = 102;
    }

    ngOnInit() {
        this.onCommandRequest();
        //this.onExchangeLetterResponse();
    }

    ngAfterViewInit() {
        setInterval(() => {
            // TODO Should only start when room is full and game ready to begin
            if (this.timerService.timerIsRunning()) {
                this.timerService.updateClock();
                this.seconds = this.timerService.seconds;
                this.minutes = this.timerService.minutes;
            } else {
                // Player's turn is over
            }
        }, ONE_SECOND);
    }

    private onCommandRequest(): Subscription {
        return this.socketService.subscribeToChannelEvent(SocketEventType.commandRequest)
            .subscribe((response: ICommandMessage<any>) => {
                if (response !== undefined && response._message !== null) {
                    this.player = response._data[1][0];
                }
            });
    }

    // TODO: Should be handle with the command service in a upcomming refactoring
    // private onExchangeLetterResponse(): Subscription {
    //     return this.socketService.subscribeToChannelEvent(SocketEventType.changeLettersRequest)
    //         .subscribe((response: ICommandMessage<any>) => {
    //             if (response !== undefined && response._message !== null) {
    //                 this.player = response._data[1][0];
    //             }
    //         });
    // }

    public printMinutes(): string {
        return ("0" + this.minutes).slice(-2);
    }

    public printSeconds(): string {
        return ("0" + this.seconds).slice(-2);
    }
}
