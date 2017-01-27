/**
 * rest-api-proxy.service.ts - Manage and execute all requests From/To the server.
 *
 * @authors ...
 * @date 2017/01/22
 */

import { Injectable } from '@angular/core';
import { Response, Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';

import { Puzzle } from '../models/puzzle';

@Injectable()
export class RestApiProxyService {

    // API Url for new Puzzle request to the server
    private newPuzzleUrl = 'http://localhost:3002/api/puzzle';

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
    async getNewPuzzle() : Promise<Puzzle> {
        return await this.http.get(this.newPuzzleUrl)
            .toPromise()
            .then(this.retrieveDataFromHttpResponse)
            .catch(this.handleError);
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
        return body.data || { };
    }

    /**
     * Handle error by sending logs.
     *
     * @class RestApiProxyService
     * @method handleError
     * @return.
     */
    private handleError (error: Response | any) {

        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        }
        else
        {
            errMsg = error.message ? error.message : error.toString();
        }

        // Use an new service to handle as a Logger,but we can keep the console for now
        console.error(errMsg);

        return Promise.reject(errMsg);
  }
}
