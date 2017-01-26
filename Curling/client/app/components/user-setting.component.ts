import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import { Router } from '@angular/router';

import { UserSetting } from '../models/user-setting';
import { RestApiProxyService } from '../services/rest-api-proxy.service';

@Component({
    moduleId: module.id,
    selector: 'user',
    // TODO : template url 
    template: 
    `
        <form #f='ngForm'>
            <div id="username" class="form-group">
                <label for="username"> Pseudonyme </label>
                <input type='text' placeholder='Entrer votre pseudo...' name='username' [(ngModel)]="_userSetting._name">
                <button type='submit' (click)='verifyUsername()'>Verifier Pseudo</button>
            </div>

            <div id="difficulty" class="form-group">
                Bonjour {{_userSetting._name}}, veuillez choisir le niveau de difficulte :
                <div class="radio">
                    <label><input type='radio' value='NORMAL' name='normal' [(ngModel)]='_userSetting._difficulty'> Normal </label>
                </div>
                <div class="radio">
                    <label><input type='radio' value='HARD' name='hard' [(ngModel)]='_userSetting._difficulty'> Difficile</label>
                </div>
                
                <button type='submit' (click)='launchGame()'>Commencer la partie !</button>
            </div>
        </form>
    `,
    styles: [ `

    `]

})
export class UserSettingComponent implements OnInit{
    _userSetting : UserSetting;
    /**
     *
     */
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
}