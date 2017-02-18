import { Component, AfterViewInit } from "@angular/core";
import { TimerService } from "../services/timer-service";

const MAX_NUMBER_OF_LETTERS = 7;
const ONE_SECOND = 1000;

@Component({
    moduleId: module.id,
    providers: [TimerService],
    selector: "info-panel-selector",
    templateUrl: "../../assets/templates/information-panel.html",
})
export class InformationPanelComponent implements AfterViewInit {
    player = "default";
    score : number;
    lettersOnEasel : number;
    seconds: number;
    minute: number;
    hour: number;

    constructor(private timerService : TimerService) {
        this.seconds = 0; this.minute = 0; this.hour = 0;
        this.score = 0;
        this.lettersOnEasel = MAX_NUMBER_OF_LETTERS;
    }

    ngAfterViewInit() {
        setInterval(() => {
            this.timerService.updateClock();
            this.seconds = this.timerService.seconds;
            this.minute = this.timerService.minute;
            this.hour = this.timerService.hour;
        }, ONE_SECOND);
    }
}
