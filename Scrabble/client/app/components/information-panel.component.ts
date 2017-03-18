import { Component, OnInit, AfterViewInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs/Subscription";

import { SocketService } from "../services/socket-service";
import { CommandType } from "../services/commons/command-type";
import { CommandStatus } from "../services/commons/command-status";
import { SocketEventType } from "../commons/socket-eventType";
import { IGameMessage } from "../commons/messages/game-message.interface";
import { IRoomMessage } from "../commons/messages/room-message.interface";
import { ICommandMessage } from "../commons/messages/command-message.interface";

//const MAX_NUMBER_OF_LETTERS = 7;

@Component({
    moduleId: module.id,
    providers: [SocketService],
    selector: "info-panel-selector",
    templateUrl: "../../assets/templates/information-panel.html",
    styleUrls: ["../../assets/stylesheets/information-panel.css"]
})

export class InformationPanelComponent implements OnInit, AfterViewInit {
    private _username: string;
    playingUser: string;
    nextPlayer: string;
    score: number;
    lettersOnEasel: number;
    lettersInBank: number;
    seconds: number;
    minutes: number;

    constructor(
        private socketService: SocketService,
        private activatedRoute: ActivatedRoute) {
            this.score = 0;
            this.lettersOnEasel = 7;
            // TODO : get it from letterbank service
            this.lettersInBank = 102;
    }

    ngOnInit() {
        this.onUpdatePlayersQueueEvent();
    }

    ngAfterViewInit() {
        this.activatedRoute.params.subscribe(params => {
            this._username = params['id'];
        });
        this.onTimerEvent();
    }

    private onTimerEvent(): Subscription {
        return this.socketService.subscribeToChannelEvent(SocketEventType.TIMER_EVENT)
            .subscribe((counter: { minutes: number, seconds: number }) => {
                this.minutes = counter.minutes;
                this.seconds = counter.seconds;

                //console.log(this.minutes, this.seconds);

                if (this.minutes === 0
                    && this.seconds === 0
                    && this.socketService.getCurrentPlayer() === this._username) {
                    let request = {
                        commandType: CommandType.PassCmd,
                        commandStatus: CommandStatus.Ok,
                        data: ""
                    };

                    this.socketService.emitMessage(SocketEventType.PASS_COMMAND_REQUEST, request);
                }
            });
    }

    private onUpdatePlayersQueueEvent(): Subscription {
        return this.socketService.subscribeToChannelEvent(SocketEventType.UPDATE_PLAYERS_QUEUE)
            .subscribe((response: Array<string>) => {
                if (response !== undefined && response !== null) {
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
