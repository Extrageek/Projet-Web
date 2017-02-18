/**
 * rest-api-proxy.service.ts - Manage and execute all requests From/To the server.
 *
 * @authors ...
 * @date 2017/01/22
 */

import { Injectable } from '@angular/core';
import { Response, Http, Headers } from '@angular/http';

import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { Puzzle } from '../models/puzzle';
import { UserSetting, Difficulty } from '../models/user-setting';
import { Time } from '../models/time';
import { Record } from '../models/record';

@Injectable()
export class RestApiProxyService {

    // API Url for new Puzzle request to the server
    // Check how to manage cookies after
    protected _urlApi = "http://localhost:3002/api/";
    protected _headers = new Headers({ 'Content-Type': "application/json" });


    /**
     * constructor.
     *
     * @class RestApiProxyService
     */
    constructor(private http: Http) { }

    /**
     * Ask a request for a new Puzzle from the server.
     *
     * @class RestApiProxyService
     * @method getNewSudokuPuzzle
     * @returns an Observable with a newPuzzle json data
     * TODO: Must be checked if we need to convert to an object.
     */
    public getNewPuzzle(difficulty: Difficulty): Observable<Puzzle> {
        return this.http.get(this._urlApi + "puzzle?difficulty=" + difficulty)
            .map(this.retrieveDataFromHttpResponse)
            .catch((error: Error) => {
                throw error;
            });
    }

    /**
     * Retrieve the data from the HttpResponse body.
     *
     * @class RestApiProxyService
     * @method retrieveDataFromHttpResponse
     * @return Json data.
     */
    private retrieveDataFromHttpResponse(res: Response) {
        let body = res.json();
        return body;
    }

    public async createGameRecord(userSetting: UserSetting, time: Time): Promise<boolean> {
        return await this.http
            .post(this._urlApi + "game-over", JSON.stringify({
                username: userSetting.name,
                difficulty: userSetting.difficulty,
                time: time
            }), { headers: this._headers })
            .toPromise()
            .then(response => {
                if (response.status === 200) {
                    return true;
                }
                else {
                    return false;
                }
            })
            .catch(error => {
                throw error;
            });
    }

    public async verifyUsername(username: string): Promise<boolean> {
        return await this.http
            .post(this._urlApi + "login", JSON.stringify({ username: username }), { headers: this._headers })
            .toPromise()
            .then(response => {
                if (response.status === 200) {
                    return true;
                }
                else {
                    return false;
                }
            })
            .catch(error => {
                throw new Error("RestApiProxyService - An error occured during the verification of the username.");
            });
    }

    public async removeUsername(username: string): Promise<boolean> {
        return await this.http
            .post(this._urlApi + "logout", JSON.stringify({ username: username }), { headers: this._headers })
            .toPromise()
            .then(response => {
                if (response.status === 200) {
                    return true;
                }
                else {
                    return false;
                }
            })
            .catch(error => {
                throw new Error("RestApiProxyService - An error occured when the logout was processed.");
            });
    }

    public async getTopRecords(): Promise<Array<Array<Record>>> {
        let records = new Array<Array<Record>>();
        await this.http.get(this._urlApi + "top-records").toPromise()
            .then(response => {
               if (response.status === 200) {
                    let arrObj: Array<Array<any>> = response.json();
                    for (let i = 0; i < arrObj.length; ++i) {
                        let tempRecords = new Array<Record>();
                        arrObj[i].forEach(record => {
                            tempRecords.push(new Record(record.username,
                                record.difficulty,
                                record.time
                            ));
                        });
                        records.push(tempRecords);
                    }
                }
            })
            .catch(error => {
                console.error("ERROR - Rest api getAllRecords - Une erreur est survenue - ", error);
                throw error;
            });
        return records;
    }

    public async verifyGrid(puzzle: Puzzle): Promise<boolean> {
        return await this.http
            .post(this._urlApi + "grid-validation", JSON.stringify({ puzzle: puzzle._puzzle }),
            { headers: this._headers })
            .toPromise()
            .then(response => {
                let body = response.json();
                if (body.validity === "valid") {
                    return true;
                }
                else {
                    return false;
                }
            })
            .catch(error => {
                console.log("RestApiProxyService - An error occured during the grid validation.");
                return false;
            });
    }

    // /**
    //  * Handle error by sending logs.
    //  *
    //  * @class RestApiProxyService
    //  * @method handleError
    //  * @return.
    //  */
    // handleError(error: Response | any) {

    //     let errMsg: string;
    //     if (error instanceof Response) {
    //         const body = error.json() || '';
    //         const err = body.error || JSON.stringify(body);
    //         errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    //     } else {
    //         errMsg = error.message ? error.message : error.toString();
    //     }

    //     //TODO: Use an new service to handle as a Logger,but we can keep the console for now
    //     //console.error(errMsg);

    //     return Observable.throw(errMsg);
    //}
}
