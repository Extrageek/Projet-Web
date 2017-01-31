import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'info-panel-selector',
    template: `
    <section style="width:180px;"   class="panel panel-info">
      <header class="panel-heading">
      <h5 class="panel-title">Information panel</h5>
      </header>
      <div class="panel-body">
       <p (click)="updateClock()"> Timer: {{hour}}:{{minute}}:{{seconds}} </p>
       <p>Users playing : </p>
       <p>Your score : </p>
       <p>Number of letters on easel:  </p>
       <p>Number of letters left in bank: </p>
      </div>
    </section>
   `,
})
export class InformationPanelComponent implements OnInit, AfterViewInit {
    seconds : number;
    minute: number;
    hour: number;

    constructor() {
        this.seconds = 0;
        this.minute = 0;
        this.hour = 0;
    }
    updateClock() {
        ++this.seconds;
        if (this.seconds === 60) {
            ++this.minute;
            this.seconds = 0;
        }
        else if (this.minute === 60) {
            ++this.hour;
            this.minute = 0;
        }
    }

    ngOnInit() {
        //TODO
    }
    ngAfterViewInit() {
        setInterval(() => {
            this.updateClock();
        }, 1000);
    }
}
