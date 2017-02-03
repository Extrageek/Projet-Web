import { Component, AfterViewInit } from "@angular/core";
import { TimerService } from "../services/timerService";
import { UserSettingsService } from "../services/userSettingService";

const MAX_NUMBER_OF_LETTERS = 7;
const ONE_SECOND = 1000;

@Component({
    moduleId: module.id,
    providers: [TimerService],
    selector: "info-panel-selector",
    templateUrl: "../../app/views/information-panel.html",
})
export class InformationPanelComponent implements AfterViewInit {
    player : string;
    score : number;
    lettersOnEasel : number;
    seconds: number;
    minute: number;
    hour: number;

    constructor(private timerService : TimerService, private userService : UserSettingsService) {
        this.seconds = 0; this.minute = 0; this.hour = 0;
        this.player = this.userService.userName;
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
