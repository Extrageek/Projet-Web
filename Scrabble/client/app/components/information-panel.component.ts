import { Component, AfterViewInit } from "@angular/core";
import { TimerService } from "../services/timer-service";
import { SocketService } from "../services/socket-service";

//const MAX_NUMBER_OF_LETTERS = 7;
const ONE_SECOND = 1000;

@Component({
    moduleId: module.id,
    providers: [TimerService],
    selector: "info-panel-selector",
    templateUrl: "../../assets/templates/information-panel.html",
    styleUrls: ['../../assets/stylesheets/information-panel.css']
})

export class InformationPanelComponent implements AfterViewInit {
    player = "default";
    score: number;
    lettersOnEasel: number;
    lettersInBank: number;
    seconds: number;
    minutes: number;

    constructor(private timerService: TimerService) {
        this.seconds = timerService.seconds;
        this.minutes = timerService.minutes;
        this.score = 0;
        // TODO : get it from socket Service
        this.lettersOnEasel = 7;
        // TODO : get it from letterbank service
        this.lettersInBank = 102;
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
    public printMinutes(): string {
        return ("0" + this.minutes).slice(-2);
    }

    public printSeconds(): string {
        return ("0" + this.seconds).slice(-2);
    }
}
