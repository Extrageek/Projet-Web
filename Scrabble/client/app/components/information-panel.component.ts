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
    playingUser: string;
    nextPlayer: string;
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
        this.onUpdatePlayersQueueEvent();
    }

    ngAfterViewInit() {
        setInterval(() => {
            if (this.timerService.timerIsRunning()) {
                this.timerService.updateClock();
                this.seconds = this.timerService.seconds;
                this.minutes = this.timerService.minutes;
            } else {
                // Player's turn is over
            }
        }, ONE_SECOND);
    }

    private onUpdatePlayersQueueEvent(): Subscription {
        return this.socketService.subscribeToChannelEvent(SocketEventType.updatePlayersQueue)
            .subscribe((response: Array<string>) => {
                if (response !== undefined && response !== null) {
                    // console.log("playingUser", this.socketService.getCurrentPlayer());
                    // console.log("NextPlayer in Queue", this.socketService.getCurrentPlayer());


                    console.log("d", response);

                    // Temporary settings, we can use a manager to
                    this.socketService.playersPriorityQueue = response;
                    this.playingUser = response[0];
                    this.nextPlayer = response[1];

                    // this.playingUser = this.socketService.getCurrentPlayer();
                    // this.nextPlayer = this.socketService.getNextPlayer();
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
