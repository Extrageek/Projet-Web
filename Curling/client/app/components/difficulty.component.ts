import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Difficulty } from '../models/user-setting';

import { RestApiProxyService } from '../services/rest-api-proxy.service';
import { UserSettingService } from '../services/user-setting.service';

@Component({
    moduleId: module.id,
    providers: [RestApiProxyService],
    selector: 'difficulty-component',
    templateUrl: '../../assets/templates/difficulty-component.html',
    styleUrls: ['../../assets/stylesheets/username-component.css']
})
export class DifficultyComponent implements OnInit {
    _username: string;
    _difficulty: Difficulty;

    constructor( private router: Router,
                private restApiProxyService: RestApiProxyService,
                private userSettingService: UserSettingService) { }

    ngOnInit(){
        this._username = this.userSettingService.userSetting.name;
    }

    public launchGame() {
        this.userSettingService.userSetting.difficulty = this._difficulty;
        this.router.navigate(['/game']);
    }
}