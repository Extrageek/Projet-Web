import { Component, OnInit } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'info-panel-selector',
    template: `
    <section style="width:180px;"   class="panel panel-info">
      <header class="panel-heading">
      <h5 class="panel-title">Information panel</h5>
      </header>
      <div class="panel-body">
       <p>Timer: 00:00 </p>
       <p>Users playing : </p>
       <p>Your score : </p>
       <p>Number of letters on easel:  </p>
       <p>Number of letters left in bank: </p>
      </div>
    </section>
   `,
})
export class InformationPanelComponent implements OnInit {
    constructor() {
        //TODO
    }

    ngOnInit() {
        //TODO
    }
}
