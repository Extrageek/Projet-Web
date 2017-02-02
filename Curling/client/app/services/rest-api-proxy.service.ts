import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { UserSetting } from '../models/user-setting';
import { GameStatus } from '../models/game-status';
import { Record } from '../models/record';


@Injectable()
export class RestApiProxyService {
    private _urlAddUser = "http://localhost:3003/api/";
    private _headers = new Headers({'Content-Type' : "application/json"});

    constructor(private http : Http) {}

    public async createGameRecord(userSetting: UserSetting, gameStatus: GameStatus): Promise<any>{
        console.log("-- API createGameRecord --");
        return await this.http
        .post(this._urlAddUser + "game-over", JSON.stringify({
                username : userSetting._name,
                difficulty : userSetting._difficulty,
                scorePlayer : gameStatus._scorePlayer,
                scoreComputer : gameStatus._scoreComputer,
                set : gameStatus._currentSet,
                date: new Date()
            }), {headers: this._headers})
        .toPromise()
        .then(response => {
            if (response.status === 200){
                return true;
            }
            else{
                return false;
            }
        })
        .catch(error => {
            return false;
        });
    }

    public async verifyUsername(userSetting : UserSetting): Promise<boolean>{
        return await this.http
        .post(this._urlAddUser + "login", JSON.stringify({username : userSetting._name}), {headers: this._headers})
        .toPromise()
        .then(response => {
            if (response.status === 200){
                console.log(response.status);
                return true;
            }
            else{
                console.log(response.status);
                return false;
            }
        })
        .catch(error => {
            return false;
        });
    }

    public async getAllRecords(): Promise<Array<Record>> {
        let records: Array<Record> = new Array<Record>();
        await this.http.get(this._urlAddUser + "records-all").toPromise()
        .then(response => {
            console.log(response);
            if (response.status === 200){
                let arrObj: Array<any> = response.json();
                arrObj.forEach(element => {
                    records.push(new Record(element.username,
                                            element.difficulty,
                                            element.scorePlayer,
                                            element.scoreComputer,
                                            element.date));
                });
            }
        })
        .catch(error => {
            console.error("ERROR - Rest api getAllRecords - Une erreur est survenue - ", error);
        });
        console.log(records);
        return records;
    }

    private handleError(error: any): Promise<any> {
        console.error("An error occurred", error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}
