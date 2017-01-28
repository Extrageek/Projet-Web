import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import { Router } from '@angular/router';

import { RestApiProxyService } from '../services/rest-api-proxy.service';

import { UserSetting } from '../models/user-setting';

@Component({
    moduleId: module.id,
    selector: 'user',
    // TODO : template url 
    template: 
    `
        <form #f='ngForm'>
            <div id="alertUsername" class="alert alert-warning alert-dismissible fade show" role="alert">
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                <strong>Holy guacamole!</strong> You should check in on some of those fields below.
            </div>
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
            <button type='submit' (click)='goToLeaderBoard()'>Voir les scores</button>
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
        document.getElementById('alertUsername').hidden = true;
    }

    public async verifyUsername(){
        let isValid: boolean = true;
        //console.log('verifyUsername response - ' + await this.restApiProxyService.verifyUsername(this._userSetting));
        console.log('is username valid - ' + isValid);
        if(isValid.valueOf() === true){
            document.getElementById('username').hidden = true;
            document.getElementById('difficulty').hidden = false;
        }
        else{
            document.getElementById('alertUsername').hidden = false;
        }
    }

    public goToLeaderBoard(){
        this.router.navigate(['/dashboard']);
    }

    public launchGame(){
        this.router.navigate(['/game']);
        // creer une partie et sauvegarder dans la db
        this.restApiProxyService.launchGame();
    }
}