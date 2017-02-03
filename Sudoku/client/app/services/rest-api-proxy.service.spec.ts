
import {
    fakeAsync,
    tick, inject,
    TestBed
} from '@angular/core/testing';

import {
    Http, ResponseOptions,
    Response,
    BaseRequestOptions,
    ConnectionBackend
} from '@angular/http';

import { MockBackend, MockConnection } from '@angular/http/testing';
import { expect, assert } from 'chai';

import { Puzzle } from '../models/puzzle';
import { RestApiProxyService } from '../services/rest-api-proxy.service';
import { FAKE_PUZZLE_FEED } from './mock-data';

describe('RestApiProxyService', () => {

    beforeEach(async () => {
        TestBed.configureTestingModule({
            providers: [
                {   // Import the necessary providers
                    provide: Http,

                    // Add a factory for the backend
                    useFactory: (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) => {
                        return new Http(backend, defaultOptions);
                    },
                    deps: [MockBackend, BaseRequestOptions]
                },
                RestApiProxyService,
                MockBackend,
                BaseRequestOptions
            ]
        });
    });

    // Test the REST API Service for getting a valid grid
    it("getNewPuzzle, Should return a valid sudoku grid from the server",
        inject([RestApiProxyService, MockBackend],
            fakeAsync((restApiProxyService: RestApiProxyService, mockBackend: MockBackend) => {

                let response: Puzzle;
                let fakePuzzle = new Puzzle(FAKE_PUZZLE_FEED);

                mockBackend.connections.subscribe((connection: MockConnection) => {

                    //Check the expected Url to the server
                    expect(connection.request.url).to.deep.equal('http://localhost:3002/api/puzzle');

                    // Send the fake data to the caller
                    connection.mockRespond(new Response(new ResponseOptions({ body: fakePuzzle })));

                });

                // Make the fake call to the server
                restApiProxyService.getNewPuzzle().subscribe(data => {
                    response = data;
                });

                tick();

                // Check for the expected response.
                expect(response).to.deep.equal(fakePuzzle);
            }))
    );

    // Test the REST API Service for getting a valid grid
    it("getNewPuzzle, Should return an error from the server",
        inject([RestApiProxyService, MockBackend],
            fakeAsync((restApiProxyService: RestApiProxyService, mockBackend: MockBackend) => {

                let fakeHttpErrorFromTheServer = "An error occured when trying to join the server";
                mockBackend.connections.subscribe((connection: MockConnection) => {

                    //Check the expected Url to the server
                    expect(connection.request.url).to.deep.equal('http://localhost:3002/api/puzzle');

                    // Send the fake data to the caller
                    connection.mockError(new Error(fakeHttpErrorFromTheServer));

                });

                let httpError = new TypeError(fakeHttpErrorFromTheServer);

                // Make the fake call to the server, we must get an error
                restApiProxyService.getNewPuzzle().subscribe((data) => {
                }, (error) => {
                    httpError = error;
                });

                // Check the expected result
                assert.instanceOf(httpError, TypeError, fakeHttpErrorFromTheServer);

                tick();

            }))
    );

    // Test the REST API Service for getting a valid grid
    it("getNewPuzzle, Should throw a null reference error for the URL",
        inject([RestApiProxyService, MockBackend],
            fakeAsync((restApiProxyService: RestApiProxyService, mockBackend: MockBackend) => {

                // let errorMessage = "An error occured when trying to join the server";
                // let fakeHttpErrorFromTheServer = new Error(errorMessage);
                // let resultError = null;

                // Make the fake call to the server
                // restApiProxyService.handleError(new Error(errorMessage)).subscribe((data) => {
                // }, (error) => {
                //     console.log(error);
                //    // resultError = error
                // });

                //console.log(restApiProxyService.handleError);

                //console.log(resultError);
                // Check the expected result
                //assert.instanceOf(resultError, TypeError, errorMessage);
            }))
    );
});
