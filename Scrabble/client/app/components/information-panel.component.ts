import { Component, OnInit, AfterViewInit } from "@angular/core";
import { Subscription } from "rxjs/Subscription";

import { SocketService } from "../services/socket-service";
import { CommandType } from "../services/commons/command-type";
import { CommandStatus } from "../services/commons/command-status";
import { SocketEventType } from "../commons/socket-eventType";

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
    public _winner: string;
    public _isWinner: boolean;

    constructor(private socketService: SocketService) {
        this._lettersOnEasel = 7;
        // TODO : get it from letterbank service
        this._lettersInBank = 102;
    }

    ngOnInit() {
        this.onUpdatePlayersQueueEvent();
        this.onUpdateScore();
        this.onUpdateLetterInBank();
        this.onUpdateLetterInEasel();
        this.onGameOver();
        this._isWinner = false;
        this._winner = "";
    }

    ngAfterViewInit() {
        this.onTimerEvent();
    }

    private onUpdateScore(): Subscription {
        return this.socketService.subscribeToChannelEvent(SocketEventType.UPDATE_SCORE)
            .subscribe((score: number) => {
                this.socketService.player.score = score;
            });
    }

    private onUpdateLetterInEasel(): Subscription {
        return this.socketService.subscribeToChannelEvent(SocketEventType.UPDATE_LETTER_IN_EASEL)
            .subscribe((response: number) => {
                this._lettersOnEasel = response;
            });
    }

    private onUpdateLetterInBank(): Subscription {
        return this.socketService.subscribeToChannelEvent(SocketEventType.UPDATE_LETTER_IN_BANK)
            .subscribe((response: number) => {
                this._lettersInBank = response;
            });
    }

    private onGameOver(): Subscription {
        return this.socketService.subscribeToChannelEvent(SocketEventType.GAME_OVER)
            .subscribe((winner: string) => {
                this._winner = winner;
                this._isWinner = (winner === this.socketService.player.username);
            });
    }

    private onTimerEvent(): Subscription {
        return this.socketService.subscribeToChannelEvent(SocketEventType.TIMER_EVENT)
            .subscribe((counter: { minutes: number, seconds: number }) => {
                this._minutes = counter.minutes;
                this._seconds = counter.seconds;

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
