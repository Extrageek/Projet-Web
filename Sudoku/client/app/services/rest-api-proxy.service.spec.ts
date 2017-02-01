
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
import { expect } from 'chai';

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
});
