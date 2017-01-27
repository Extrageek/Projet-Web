import { Component, OnInit } from '@angular/core';
import { GameStatus } from '../models/game-status';
import { UserSetting, Difficulty } from '../models/user-setting';

@Component({
    moduleId: module.id,
    selector: 'display-component',
    templateUrl: '../../assets/templates/display-component.html'
})

export class DisplayComponent implements OnInit {
    _gameStatus: GameStatus;
    _userSetting: UserSetting;
    _computerName: string;

    //constructor() { }

    ngOnInit (){
        this._gameStatus = new GameStatus();
    }

    public showComputerName(): void{
        if (this._userSetting._difficulty === Difficulty.NORMAL){
            this._computerName = "CPU Normal";
        } else{
            this._computerName = "CPU Difficile";
        }
    }
}
