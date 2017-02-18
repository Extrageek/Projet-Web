
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

import { UserSetting } from '../models/user-setting';
import { Record } from '../models/record';
import { Time } from '../models/time';
import { Puzzle } from '../models/puzzle';

import { RestApiProxyService } from '../services/rest-api-proxy.service';
import { FAKE_PUZZLE_FEED } from './mock-data';

let userSetting: UserSetting;
let time: Time;

describe('RestApiProxyService - getNewPuzzle', () => {

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
                    expect(connection.request.url).to.deep.equal('http://localhost:3002/api/puzzle?difficulty=0');

                    // Send the fake data to the caller
                    connection.mockRespond(new Response(new ResponseOptions({ body: fakePuzzle })));

                });

                // Make the fake call to the server
                restApiProxyService.getNewPuzzle(0).subscribe(data => {
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
                    expect(connection.request.url).to.deep.equal('http://localhost:3002/api/puzzle?difficulty=0');

                    // Send the fake data to the caller
                    connection.mockError(new Error(fakeHttpErrorFromTheServer));

                });

                let httpError = new TypeError(fakeHttpErrorFromTheServer);

                // Make the fake call to the server, we must get an error
                expect(() => {
                    restApiProxyService.getNewPuzzle(0);
                    tick();
                }).to.throw(Error, fakeHttpErrorFromTheServer);
            }))
    );
});

describe('RestApiProxyService - createGameRecord', () => {

    beforeEach(async () => {
        userSetting = new UserSetting();
        time = new Time();
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

    it("createGameRecord, Should return true since the request has been completed successfully.",
        inject([RestApiProxyService, MockBackend],
            fakeAsync((restApiProxyService: RestApiProxyService, mockBackend: MockBackend) => {

                mockBackend.connections.subscribe((connection: MockConnection) => {

                    //Check the expected Url to the server
                    expect(connection.request.url).to.deep.equal('http://localhost:3002/api/game-over');

                    // Send the fake data to the caller
                    connection.mockRespond(new Response(new ResponseOptions({
                        body: {},
                        status: 200
                    })));
                });

                let response: boolean;
                // Make the fake call to the server
                restApiProxyService.createGameRecord(userSetting, time).then(data => {
                    response = data;
                });

                tick();

                // Check for the expected response.
                expect(response).to.be.equal(true);
            }))
    );

    it("createGameRecord, Should return false because of a bad request (code 400).",
        inject([RestApiProxyService, MockBackend],
            fakeAsync((restApiProxyService: RestApiProxyService, mockBackend: MockBackend) => {
                mockBackend.connections.subscribe((connection: MockConnection) => {
                    //Check the expected Url to the server
                    expect(connection.request.url).to.deep.equal('http://localhost:3002/api/game-over');

                    // Send the fake data to the caller
                    connection.mockRespond(new Response(new ResponseOptions({
                        body: {},
                        status: 400
                    })));
                });

                let response: boolean;
                // Make the fake call to the server
                restApiProxyService.createGameRecord(userSetting, time).then(data => {
                    response = data;
                });

                tick();

                // Check for the expected response.
                expect(response).to.be.equal(false);
            }))
    );

    it("createGameRecord, Should return false because of an internal error",
        inject([RestApiProxyService, MockBackend],
            fakeAsync((restApiProxyService: RestApiProxyService, mockBackend: MockBackend) => {
                mockBackend.connections.subscribe((connection: MockConnection) => {
                    expect(connection.request.url).to.deep.equal('http://localhost:3002/api/game-over');
                    connection.mockError(new Error("erreur"));
                });
                expect(() => {
                    restApiProxyService.createGameRecord(userSetting, time);
                    tick();
                }).to.throw(Error, "erreur");
            }))
    );
});

describe('RestApiProxyService - verifyUsername', () => {

    beforeEach(async () => {
        userSetting = new UserSetting();
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

    it("verifyUsername, Should return true since the request has been completed successfully.",
        inject([RestApiProxyService, MockBackend],
            fakeAsync((restApiProxyService: RestApiProxyService, mockBackend: MockBackend) => {

                mockBackend.connections.subscribe((connection: MockConnection) => {

                    //Check the expected Url to the server
                    expect(connection.request.url).to.deep.equal('http://localhost:3002/api/login');

                    // Send the fake data to the caller
                    connection.mockRespond(new Response(new ResponseOptions({
                        body: {},
                        status: 200
                    })));
                });

                let response: boolean;
                // Make the fake call to the server
                restApiProxyService.verifyUsername(userSetting.name)
                    .then(data => {
                        response = data;
                    })
                    .catch(error => {
                        response = false;
                    });

                tick();

                // Check for the expected response.
                expect(response).to.be.equal(true);
            }))
    );

    it("verifyUsername, Should return false because of a bad request (code 400).",
        inject([RestApiProxyService, MockBackend],
            fakeAsync((restApiProxyService: RestApiProxyService, mockBackend: MockBackend) => {
                mockBackend.connections.subscribe((connection: MockConnection) => {
                    //Check the expected Url to the server
                    expect(connection.request.url).to.deep.equal('http://localhost:3002/api/login');

                    // Send the fake data to the caller
                    connection.mockRespond(new Response(new ResponseOptions({
                        body: {},
                        status: 504
                    })));
                });

                let response: boolean;
                // Make the fake call to the server
                restApiProxyService.verifyUsername(userSetting.name)
                    .then(data => {
                        response = data;
                    })
                    .catch(error => {
                        response = false;
                    });

                tick();

                // Check for the expected response.
                expect(response).to.be.equal(false);
            }))
    );

    it("verifyUsername, Should return false because of an internal error",
        inject([RestApiProxyService, MockBackend],
            fakeAsync((restApiProxyService: RestApiProxyService, mockBackend: MockBackend) => {
                mockBackend.connections.subscribe((connection: MockConnection) => {
                    //Check the expected Url to the server
                    expect(connection.request.url).to.deep.equal('http://localhost:3002/api/login');

                    connection.mockError();
                });

                let response: boolean;
                // Make the fake call to the server
                restApiProxyService.verifyUsername(userSetting.name)
                    .then(data => {
                        response = data;
                    })
                    .catch(error => {
                        response = false;
                    });

                tick();

                // Check for the expected response.
                expect(response).to.be.equal(false);
            }))
    );
});


describe('RestApiProxyService - removeUsername', () => {

    beforeEach(async () => {
        userSetting = new UserSetting();
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

    it("removeUsername, Should return true since the request has been completed successfully.",
        inject([RestApiProxyService, MockBackend],
            fakeAsync((restApiProxyService: RestApiProxyService, mockBackend: MockBackend) => {

                mockBackend.connections.subscribe((connection: MockConnection) => {

                    //Check the expected Url to the server
                    expect(connection.request.url).to.deep.equal('http://localhost:3002/api/logout');

                    // Send the fake data to the caller
                    connection.mockRespond(new Response(new ResponseOptions({
                        body: {},
                        status: 200
                    })));
                });

                let response: boolean;
                // Make the fake call to the server
                restApiProxyService.removeUsername(userSetting.name)
                    .then(data => {
                        response = data;
                    })
                    .catch(error => {
                        response = false;
                    });

                tick();

                // Check for the expected response.
                expect(response).to.be.equal(true);
            }))
    );

    it("removeUsername, Should return false because of a bad request (code 400).",
        inject([RestApiProxyService, MockBackend],
            fakeAsync((restApiProxyService: RestApiProxyService, mockBackend: MockBackend) => {
                mockBackend.connections.subscribe((connection: MockConnection) => {
                    //Check the expected Url to the server
                    expect(connection.request.url).to.deep.equal('http://localhost:3002/api/logout');

                    // Send the fake data to the caller
                    connection.mockRespond(new Response(new ResponseOptions({
                        body: {},
                        status: 504
                    })));
                });

                let response: boolean;
                // Make the fake call to the server
                restApiProxyService.removeUsername(userSetting.name)
                    .then(data => {
                        response = data;
                    })
                    .catch(error => {
                        response = false;
                    });

                tick();

                // Check for the expected response.
                expect(response).to.be.equal(false);
            }))
    );

    it("removeUsername, Should return false because of an internal error",
        inject([RestApiProxyService, MockBackend],
            fakeAsync((restApiProxyService: RestApiProxyService, mockBackend: MockBackend) => {
                mockBackend.connections.subscribe((connection: MockConnection) => {
                    //Check the expected Url to the server
                    expect(connection.request.url).to.deep.equal('http://localhost:3002/api/logout');

                    connection.mockError();
                });

                let response: boolean;
                // Make the fake call to the server
                restApiProxyService.removeUsername(userSetting.name)
                    .then(data => {
                        response = data;
                    })
                    .catch(error => {
                        response = false;
                    });

                tick();

                // Check for the expected response.
                expect(response).to.be.equal(false);
            }))
    );
});


describe('RestApiProxyService - getTopRecords', () => {

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

    it("getTopRecords, Should return a valid array of Record from the server",
        inject([RestApiProxyService, MockBackend],
            fakeAsync((restApiProxyService: RestApiProxyService, mockBackend: MockBackend) => {

                let records: Array<Array<Record>> = new Array<Array<Record>>();
                let easyRecords = new Array<Record>();
                easyRecords.push(new Record("julien", 0, time));
                let hardRecords = new Array<Record>();
                easyRecords.push(new Record("david", 1, time));
                records.push(easyRecords);
                records.push(hardRecords);

                mockBackend.connections.subscribe((connection: MockConnection) => {

                    //Check the expected Url to the server
                    expect(connection.request.url).to.deep.equal('http://localhost:3002/api/top-records');

                    // Send the fake data to the caller
                    connection.mockRespond(new Response(new ResponseOptions({
                        body: records,
                        status: 200
                    })));
                });

                let response: Record[][];
                // Make the fake call to the server
                restApiProxyService.getTopRecords().then(data => {
                    response = data;
                });

                tick();

                // Check for the expected response.
                for (let index = 0; index < response.length; ++index) {
                    let element = response[index];
                    for (let j = 0; j < element.length; ++j) {
                        expect(element[j].difficulty).to.deep.equal(records[index][j].difficulty);
                        expect(element[j].time).to.deep.equal(records[index][j].time);
                        expect(element[j].username).to.deep.equal(records[index][j].username);
                    }
                }
            }))
    );

    it("getTopRecords, Should return an empty array of Record from the server",
        inject([RestApiProxyService, MockBackend],
            fakeAsync((restApiProxyService: RestApiProxyService, mockBackend: MockBackend) => {

                let records: Array<Array<Record>> = new Array<Array<Record>>();
                let easyRecords = new Array<Record>();
                easyRecords.push(new Record("julien", 0, time));
                let hardRecords = new Array<Record>();
                easyRecords.push(new Record("david", 1, time));
                records.push(easyRecords);
                records.push(hardRecords);

                mockBackend.connections.subscribe((connection: MockConnection) => {

                    //Check the expected Url to the server
                    expect(connection.request.url).to.deep.equal('http://localhost:3002/api/top-records');

                    // Send the fake data to the caller
                    connection.mockRespond(new Response(new ResponseOptions({
                        body: records,
                        status: 400
                    })));
                });

                let response: Record[][];
                // Make the fake call to the server
                restApiProxyService.getTopRecords().then(data => {
                    response = data;
                });

                tick();

                // Check for the expected response.
                expect(response.length).to.deep.equal(0);
            }))
    );

    it("getTopRecords, Should throw an error because of an internal server error",
        inject([RestApiProxyService, MockBackend],
            fakeAsync((restApiProxyService: RestApiProxyService, mockBackend: MockBackend) => {

                let records: Array<Array<Record>> = new Array<Array<Record>>();
                let easyRecords = new Array<Record>();
                easyRecords.push(new Record("julien", 0, time));
                let hardRecords = new Array<Record>();
                easyRecords.push(new Record("david", 1, time));
                records.push(easyRecords);
                records.push(hardRecords);

                mockBackend.connections.subscribe((connection: MockConnection) => {

                    //Check the expected Url to the server
                    expect(connection.request.url).to.deep.equal('http://localhost:3002/api/top-records');
                    connection.mockError(new Error("erreur"));
                    // Send the fake data to the caller
                });

                expect(() => {
                    restApiProxyService.getTopRecords();
                    tick();
                }).to.throw("erreur");
            }))
    );
});

describe('RestApiProxyService - verifyGrid', () => {

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

    it("verifyGrid, Should return true for a valid sudoku grid.",
        inject([RestApiProxyService, MockBackend],
            fakeAsync((restApiProxyService: RestApiProxyService, mockBackend: MockBackend) => {
                let fakePuzzle = new Puzzle(FAKE_PUZZLE_FEED);
                mockBackend.connections.subscribe((connection: MockConnection) => {

                    //Check the expected Url to the server
                    expect(connection.request.url).to.deep.equal('http://localhost:3002/api/grid-validation');

                    // Send the fake data to the caller
                    connection.mockRespond(
                        new Response(new ResponseOptions({ body: { validity: "valid" }, status: 200 }))
                    );

                });
                let isValid: boolean;
                // Make the fake call to the server
                restApiProxyService.verifyGrid(fakePuzzle).then(result => {
                    isValid = result;
                });
                tick();

                // Check for the expected response.
                expect(isValid).to.be.true;
            }))
    );

    it("verifyGrid, Should return false for an invalid sudoku grid.",
        inject([RestApiProxyService, MockBackend],
            fakeAsync((restApiProxyService: RestApiProxyService, mockBackend: MockBackend) => {
                let fakePuzzle = new Puzzle(FAKE_PUZZLE_FEED);
                mockBackend.connections.subscribe((connection: MockConnection) => {

                    //Check the expected Url to the server
                    expect(connection.request.url).to.deep.equal('http://localhost:3002/api/grid-validation');

                    // Send the fake data to the caller
                    connection.mockRespond(
                        new Response(new ResponseOptions({ body: { validity: "invalid" }, status: 200 }))
                    );

                });
                let isValid: boolean;
                // Make the fake call to the server
                restApiProxyService.verifyGrid(fakePuzzle).then(result => {
                    isValid = result;
                });
                tick();

                // Check for the expected response.
                expect(isValid).to.be.false;
            }))
    );

    it("verifyGrid, Should return false when an error has been returned from the server",
        inject([RestApiProxyService, MockBackend],
            fakeAsync((restApiProxyService: RestApiProxyService, mockBackend: MockBackend) => {

                let fakeHttpErrorFromTheServer = "An error occured when trying to join the server";
                mockBackend.connections.subscribe((connection: MockConnection) => {

                    //Check the expected Url to the server
                    expect(connection.request.url).to.deep.equal('http://localhost:3002/api/grid-validation');

                    // Send the fake data to the caller
                    connection.mockError(new Error(fakeHttpErrorFromTheServer));

                });
                let response: Puzzle;
                let fakePuzzle = new Puzzle(FAKE_PUZZLE_FEED);
                let isValid: boolean;
                // Make the fake call to the server
                restApiProxyService.verifyGrid(fakePuzzle).then(result => {
                    isValid = result;
                });
                tick();

                // Check for the expected response.
                expect(isValid).to.be.false;
            }))
    );
});
