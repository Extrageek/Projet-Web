import { Component, AfterViewInit } from "@angular/core";
import { TimerService } from "../services/timer-service";

const MAX_NUMBER_OF_LETTERS = 7;
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
    seconds: number;
    minutes: number;

    constructor(private timerService: TimerService) {
        this.seconds = 0;
        this.minutes = 0;
        this.score = 0;
        this.lettersOnEasel = MAX_NUMBER_OF_LETTERS;
    }

    ngAfterViewInit() {
        setInterval(() => {
            this.timerService.updateClock();
            this.seconds = this.timerService.seconds;
            this.minutes = this.timerService.minutes;
        }, ONE_SECOND);

    }
    public printMinutes(): string {
        return ("0" + this.minutes).slice(-2);
    }

    public printSeconds(): string {
        return ("0" + this.seconds).slice(-2);
    }
}
