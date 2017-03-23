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
    selector: "info-panel-selector",
    templateUrl: "../../assets/templates/information-panel.html",
    styleUrls: ["../../assets/stylesheets/information-panel.css"]
})

export class InformationPanelComponent implements OnInit, AfterViewInit {
    public _lettersOnEasel: number;
    public _lettersInBank: number;
    public _seconds: number;
    public _minutes: number;

    constructor(
        private socketService: SocketService,
        private activatedRoute: ActivatedRoute) {
        this._lettersOnEasel = 7;
        // TODO : get it from letterbank service
        this._lettersInBank = 102;
    }

    ngOnInit() {
        this.onUpdatePlayersQueueEvent();
        this.onUpdateScore();
        this.onUpdateEasel();
        this.initializeEaselOnConnection();
    }

    ngAfterViewInit() {
        // this.activatedRoute.params.subscribe(params => {
        //     this._username = params['id'];
        // });
        this.onTimerEvent();
    }

    private onUpdateScore(): Subscription {
        return this.socketService.subscribeToChannelEvent(SocketEventType.UPDATE_SCORE)
            .subscribe((score: number) => {
                this.socketService.player.score = score;
            });
    }

    private initializeEaselOnConnection(): Subscription {
        return this.socketService.subscribeToChannelEvent(SocketEventType.INITIALIZE_EASEL)
            .subscribe((response: Array<string>) => {
                this._lettersOnEasel = response.length;
            });
    }

    private onUpdateEasel(): Subscription {
        return this.socketService.subscribeToChannelEvent(SocketEventType.UPDATE_EASEL)
            .subscribe((response: Array<string>) => {
                this._lettersOnEasel = response.length;
            });
    }

    private onTimerEvent(): Subscription {
        return this.socketService.subscribeToChannelEvent(SocketEventType.TIMER_EVENT)
            .subscribe((counter: { minutes: number, seconds: number }) => {
                this._minutes = counter.minutes;
                this._seconds = counter.seconds;

                //console.log(this.minutes, this.seconds);

                if (this._minutes === 0 && this._seconds === 0 && this.socketService.isCurrentPlayer()) {
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
        return ("0" + this._minutes).slice(-2);
    }

    public printSeconds(): string {
        return ("0" + this._seconds).slice(-2);
    }

    public getScore(): number {
        return this.socketService.player.score;
    }

    public getCurrentPlayer() {
        return this.socketService.getCurrentPlayer();
    }

    public getNextPlayer() {
        return this.socketService.getNextPlayer();
    }
}
