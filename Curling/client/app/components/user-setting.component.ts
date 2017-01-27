import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserSetting } from '../models/user-setting';
import { RestApiProxyService } from '../services/rest-api-proxy.service';

@Component({
    moduleId: module.id,
    selector: 'user-component',
    templateUrl: "../../assets/templates/user-setting-component.html",
})

export class UserSettingComponent implements OnInit{
    //TODO : Change for private - Problem with binding
   public _userSetting : UserSetting;

    constructor(
        private router: Router,
        private restApiProxyService : RestApiProxyService) {
    }

    ngOnInit (){
        this._userSetting = new UserSetting();
        document.getElementById('difficulty').hidden = true;
    }

    verifyUsername(){
        //this.restApiProxyService.verifyUsername(this._userSetting);
        document.getElementById('username').hidden = true;
        document.getElementById('difficulty').hidden = false;
    }

    launchGame(){
        //this.addUser();
        this.router.navigate(['/game']);
        //this.restApiProxyService.launchGame();
    }

    addUser(){
        this.restApiProxyService.addUser(this._userSetting);
    }

    public get(): UserSetting {
        return this._userSetting;
    }

    public set(userSetting: UserSetting) {
        this._userSetting = userSetting;
    }
}
