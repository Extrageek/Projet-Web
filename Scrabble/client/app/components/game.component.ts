import { Component, OnInit } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'game-room-selector',
    template: `
    <div class="col-sm-6">
    <scrabble-main-board-selector>Loading Scrabble board 2 here...</scrabble-main-board-selector>
    </div>
    <div class = "col-sm-6">
    
    <div class = "col-sm-4">
        <info-panel-selector>...Loading information panel</info-panel-selector>
    </div>
    <div class = "col-sm-8">
        <scrabble-chatroom-selector class="pull-right"> Loading chatroom...</scrabble-chatroom-selector>
    </div>
    
    <div class = "col-sm-12">
        <easel-selector>Loading easel...</easel-selector>
    </div>
    </div>`
})

export class GameComponent implements OnInit {
    constructor() {
        //TODO
    }

    ngOnInit() {
        //TODO
    }
}
