import { Component, AfterViewInit } from '@angular/core';
import { Timer } from '../models/timer';

@Component({
    moduleId: module.id,
    selector: 'info-panel-selector',
    templateUrl: '../../app/views/information-panel.html',
})
export class InformationPanelComponent implements AfterViewInit {
    timer : Timer;
    constructor() {
        this.timer = new Timer();
    }
    ngAfterViewInit() {
        setInterval(() => {
            this.timer.updateClock();
        }, 1000);
    }
}
