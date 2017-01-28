import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { UserSetting } from '../models/user-setting';
import { GameStatus } from '../models/game-status';


@Injectable()
export class RestApiProxyService {
<<<<<<< HEAD
    private _urlAddUser = 'http://localhost:3003/api/usersetting';
=======
    private _urlAddUser = '/api/usersetting';
    private _headers = new Headers({'Content-Type': 'application/json'});
>>>>>>> bf80269e4702264caf7977ead797d170951ddad2

    constructor(private http : Http) {
     }

<<<<<<< HEAD
     private _headers = new Headers({'Content-Type' : 'application/json'});

    public createGameRecord(userSetting: UserSetting, gameStatus: GameStatus){
        this.http
        .post(this._urlAddUser, JSON.stringify({
                username : userSetting._name,
                difficulty : userSetting._difficulty,
                scorePlayer : gameStatus._scorePlayer,
                scoreComputer : gameStatus._scoreComputer,
                set : gameStatus._currentSet,
                gameOver : gameStatus._isGameOver
            }), {headers: this._headers})
=======
    public addUser(userSetting : UserSetting){
        this.http
        .post(this._urlAddUser, JSON.stringify({username : userSetting._name, difficulty: userSetting._difficulty}),
        {headers: this._headers})
>>>>>>> bf80269e4702264caf7977ead797d170951ddad2
        .toPromise()
        .then(response => response.json().data as string)
        .catch(this.handleError);
    }

<<<<<<< HEAD
    public async verifyUsername(userSetting : UserSetting): Promise<any>{
        return await this.http
        .post(this._urlAddUser, JSON.stringify({username : userSetting._name}), {headers: this._headers})
=======
    public verifyUsername(userSetting : UserSetting){
        this.http
        .post(this._urlAddUser, JSON.stringify({username : userSetting._name, difficulty: userSetting._difficulty}),
        {headers: this._headers})
>>>>>>> bf80269e4702264caf7977ead797d170951ddad2
        .toPromise()
        .then(response => {
            console.log('response verifyUsername - ' + response + ' ---------- code ' + response.status);
            console.log(response.statusText);
            if(response.status === 200){
                console.log('response status 200 -- ' + response.status);
                return true;
            }
            else{
                
                console.log('response status pas 200 -- ' + response.status);
                return false;
            }
        })
        .catch(error => {
            console.error('Une erreur est survenue - ', error);
            return false;
        });
    }

    public launchGame(){
        this.http
        .get('/game')
        .catch(this.handleError);
    }
    
    public test(): Promise<any> {
        return this.http
        .get('http://localhost:3003/api/test')
        .toPromise()
        .then(response => {
            console.log(response);
        })
        .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}
