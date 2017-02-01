import { Component, AfterViewInit } from '@angular/core';
import { TimerService } from '../services/timerService';

@Component({
    moduleId: module.id,
    providers: [TimerService],
    selector: 'info-panel-selector',
    templateUrl: '../../app/views/information-panel.html',
})
export class InformationPanelComponent implements AfterViewInit {

    seconds: number;
    minute: number;
    hour: number;

    constructor(private timerService : TimerService) {
        this.seconds = 0; this.minute = 0; this.hour = 0;
    }
    ngAfterViewInit() {
        setInterval(() => {
            this.timerService.updateClock();
            this.seconds = this.timerService.seconds;
            this.minute = this.timerService.minute;
            this.hour = this.timerService.hour;
        }, 1000);
    }
}
