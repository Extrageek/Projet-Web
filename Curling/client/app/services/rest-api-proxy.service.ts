import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { UserSetting } from '../models/user-setting';


@Injectable()
export class RestApiProxyService {
    private _urlAddUser = '/api/usersetting';
    private _headers = new Headers({'Content-Type': 'application/json'});

    constructor(private http : Http) {
     }

    public addUser(userSetting : UserSetting){
        this.http
        .post(this._urlAddUser, JSON.stringify({username : userSetting._name, difficulty: userSetting._difficulty}),
        {headers: this._headers})
        .toPromise()
        .then(response => response.json().data as string)
        .catch(this.handleError);
    }

    public verifyUsername(userSetting : UserSetting){
        this.http
        .post(this._urlAddUser, JSON.stringify({username : userSetting._name, difficulty: userSetting._difficulty}),
        {headers: this._headers})
        .toPromise()
        .then(response => response.json().data as string)
        .catch(this.handleError);
    }

    public launchGame(){
        this.http
        .get('/game')
        .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}
