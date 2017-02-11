
// import {
//     fakeAsync,
//     tick, inject,
//     TestBed
// } from '@angular/core/testing';

// import {
//     Http, ResponseOptions,
//     Response,
//     BaseRequestOptions,
//     ConnectionBackend
// } from '@angular/http';

// import { MockBackend, MockConnection } from '@angular/http/testing';
// import { expect, assert } from 'chai';

// import { UserSetting } from '../models/user-setting';
// import { GameStatus } from '../models/game-status';
// import { Record } from '../models/record';
// import { Puzzle } from '../models/puzzle';

// import { RestApiProxyService } from '../services/rest-api-proxy.service';
// import { FAKE_PUZZLE_FEED } from './mock-data';

// let userSetting: UserSetting;
// let gameStatus: GameStatus;

// describe('RestApiProxyService', () => {

//     beforeEach(async () => {
//         TestBed.configureTestingModule({
//             providers: [
//                 {   // Import the necessary providers
//                     provide: Http,

//                     // Add a factory for the backend
//                     useFactory: (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) => {
//                         return new Http(backend, defaultOptions);
//                     },
//                     deps: [MockBackend, BaseRequestOptions]
//                 },
//                 RestApiProxyService,
//                 MockBackend,
//                 BaseRequestOptions
//             ]
//         });
//     });

//     // Test the REST API Service for getting a valid grid
//     it("getNewPuzzle, Should return a valid sudoku grid from the server",
//         inject([RestApiProxyService, MockBackend],
//             fakeAsync((restApiProxyService: RestApiProxyService, mockBackend: MockBackend) => {

//                 let response: Puzzle;
//                 let fakePuzzle = new Puzzle(FAKE_PUZZLE_FEED);

//                 mockBackend.connections.subscribe((connection: MockConnection) => {

//                     //Check the expected Url to the server
//                     expect(connection.request.url).to.deep.equal('http://localhost:3002/api/puzzle');

//                     // Send the fake data to the caller
//                     connection.mockRespond(new Response(new ResponseOptions({ body: fakePuzzle })));

//                 });

//                 // Make the fake call to the server
//                 restApiProxyService.getNewPuzzle().subscribe(data => {
//                     response = data;
//                 });

//                 tick();

//                 // Check for the expected response.
//                 expect(response).to.deep.equal(fakePuzzle);
//             }))
//     );

//     // Test the REST API Service for getting a valid grid
//     it("getNewPuzzle, Should return an error from the server",
//         inject([RestApiProxyService, MockBackend],
//             fakeAsync((restApiProxyService: RestApiProxyService, mockBackend: MockBackend) => {

//                 let fakeHttpErrorFromTheServer = "An error occured when trying to join the server";
//                 mockBackend.connections.subscribe((connection: MockConnection) => {

//                     //Check the expected Url to the server
//                     expect(connection.request.url).to.deep.equal('http://localhost:3002/api/puzzle');

//                     // Send the fake data to the caller
//                     connection.mockError(new Error(fakeHttpErrorFromTheServer));

//                 });

//                 let httpError = new TypeError(fakeHttpErrorFromTheServer);

//                 // Make the fake call to the server, we must get an error
//                 restApiProxyService.getNewPuzzle().subscribe((data) => {}, (error) => {
//                     httpError = error;
//                 });

//                 // Check the expected result
//                 assert.instanceOf(httpError, TypeError, fakeHttpErrorFromTheServer);

//                 tick();

//             }))
//     );

//     // Test the REST API Service for getting a valid grid
//     it("getNewPuzzle, Should throw a null reference error for the URL",
//         inject([RestApiProxyService, MockBackend],
//             fakeAsync((restApiProxyService: RestApiProxyService, mockBackend: MockBackend) => {

//                 // let errorMessage = "An error occured when trying to join the server";
//                 // let fakeHttpErrorFromTheServer = new Error(errorMessage);
//                 // let resultError = null;

//                 // Make the fake call to the server
//                 // restApiProxyService.handleError(new Error(errorMessage)).subscribe((data) => {
//                 // }, (error) => {
//                 //     console.log(error);
//                 //    // resultError = error
//                 // });

//                 //console.log(restApiProxyService.handleError);

//                 //console.log(resultError);
//                 // Check the expected result
//                 //assert.instanceOf(resultError, TypeError, errorMessage);
//             }))
//     );
// });

// describe('RestApiProxyService - createGameRecord', () => {

//     beforeEach(async () => {
//         userSetting = new UserSetting();
//         gameStatus = new GameStatus();
//         TestBed.configureTestingModule({
//             providers: [
//                 {   // Import the necessary providers
//                     provide: Http,

//                     // Add a factory for the backend
//                     useFactory: (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) => {
//                         return new Http(backend, defaultOptions);
//                     },
//                     deps: [MockBackend, BaseRequestOptions]
//                 },
//                 RestApiProxyService,
//                 MockBackend,
//                 BaseRequestOptions
//             ]
//         });
//     });

//     it("createGameRecord, Should return true since the request has been completed successfully.",
//         inject([RestApiProxyService, MockBackend],
//             fakeAsync((restApiProxyService: RestApiProxyService, mockBackend: MockBackend) => {

//                 mockBackend.connections.subscribe((connection: MockConnection) => {

//                     //Check the expected Url to the server
//                     expect(connection.request.url).to.deep.equal('http://localhost:3002/api/game-over');

//                     // Send the fake data to the caller
//                     connection.mockRespond(new Response(new ResponseOptions({
//                         body: {},
//                         status: 200
//                     })));
//                 });

//                 let response: boolean;
//                 // Make the fake call to the server
//                 restApiProxyService.createGameRecord(userSetting, gameStatus).then(data => {
//                     response = data;
//                 });

//                 tick();

//                 // Check for the expected response.
//                 expect(response).to.be.equal(true);
//             }))
//     );

//     it("getAllRecords, Should return false because of a bad request (code 400).",
//         inject([RestApiProxyService, MockBackend],
//             fakeAsync((restApiProxyService: RestApiProxyService, mockBackend: MockBackend) => {
//                 mockBackend.connections.subscribe((connection: MockConnection) => {
//                     //Check the expected Url to the server
//                     expect(connection.request.url).to.deep.equal('http://localhost:3002/api/game-over');

//                     // Send the fake data to the caller
//                     connection.mockRespond(new Response(new ResponseOptions({
//                         body: {},
//                         status: 400
//                     })));
//                 });

//                 let response: boolean;
//                 // Make the fake call to the server
//                 restApiProxyService.createGameRecord(userSetting, gameStatus).then(data => {
//                     response = data;
//                 });

//                 tick();

//                 // Check for the expected response.
//                 expect(response).to.be.equal(false);
//             }))
//     );

//     it("getAllRecords, Should return false because of an internal error",
//         inject([RestApiProxyService, MockBackend],
//             fakeAsync((restApiProxyService: RestApiProxyService, mockBackend: MockBackend) => {
//                 mockBackend.connections.subscribe((connection: MockConnection) => {
//                     //Check the expected Url to the server
//                     expect(connection.request.url).to.deep.equal('http://localhost:3002/api/game-over');

//                     connection.mockError();
//                 });

//                 let response: boolean;
//                 // Make the fake call to the server
//                 restApiProxyService.createGameRecord(userSetting, gameStatus)
//                     .then(data => {
//                         response = data;
//                     })
//                     .catch(error => {
//                         response = false;
//                     });

//                 tick();

//                 // Check for the expected response.
//                 expect(response).to.be.equal(false);
//             }))
//     );
// });

// describe('RestApiProxyService - verifyUsername', () => {

//     beforeEach(async () => {
//         userSetting = new UserSetting();
//         gameStatus = new GameStatus();
//         TestBed.configureTestingModule({
//             providers: [
//                 {   // Import the necessary providers
//                     provide: Http,

//                     // Add a factory for the backend
//                     useFactory: (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) => {
//                         return new Http(backend, defaultOptions);
//                     },
//                     deps: [MockBackend, BaseRequestOptions]
//                 },
//                 RestApiProxyService,
//                 MockBackend,
//                 BaseRequestOptions
//             ]
//         });
//     });

//     it("verifyUsername, Should return true since the request has been completed successfully.",
//         inject([RestApiProxyService, MockBackend],
//             fakeAsync((restApiProxyService: RestApiProxyService, mockBackend: MockBackend) => {

//                 mockBackend.connections.subscribe((connection: MockConnection) => {

//                     //Check the expected Url to the server
//                     expect(connection.request.url).to.deep.equal('http://localhost:3002/api/login');

//                     // Send the fake data to the caller
//                     connection.mockRespond(new Response(new ResponseOptions({
//                         body: {},
//                         status: 200
//                     })));
//                 });

//                 let response: boolean;
//                 // Make the fake call to the server
//                 restApiProxyService.verifyUsername(userSetting.name)
//                     .then(data => {
//                         response = data;
//                     })
//                     .catch(error => {
//                         response = false;
//                     });

//                 tick();

//                 // Check for the expected response.
//                 expect(response).to.be.equal(true);
//             }))
//     );

//     it("verifyUsername, Should return false because of a bad request (code 400).",
//         inject([RestApiProxyService, MockBackend],
//             fakeAsync((restApiProxyService: RestApiProxyService, mockBackend: MockBackend) => {
//                 mockBackend.connections.subscribe((connection: MockConnection) => {
//                     //Check the expected Url to the server
//                     expect(connection.request.url).to.deep.equal('http://localhost:3002/api/login');

//                     // Send the fake data to the caller
//                     connection.mockRespond(new Response(new ResponseOptions({
//                         body: {},
//                         status: 504
//                     })));
//                 });

//                 let response: boolean;
//                 // Make the fake call to the server
//                 restApiProxyService.verifyUsername(userSetting.name)
//                     .then(data => {
//                         response = data;
//                     })
//                     .catch(error => {
//                         response = false;
//                     });

//                 tick();

//                 // Check for the expected response.
//                 expect(response).to.be.equal(false);
//             }))
//     );

//     it("verifyUsername, Should return false because of an internal error",
//         inject([RestApiProxyService, MockBackend],
//             fakeAsync((restApiProxyService: RestApiProxyService, mockBackend: MockBackend) => {
//                 mockBackend.connections.subscribe((connection: MockConnection) => {
//                     //Check the expected Url to the server
//                     expect(connection.request.url).to.deep.equal('http://localhost:3002/api/login');

//                     connection.mockError();
//                 });

//                 let response: boolean;
//                 // Make the fake call to the server
//                 restApiProxyService.verifyUsername(userSetting.name)
//                     .then(data => {
//                         response = data;
//                     })
//                     .catch(error => {
//                         response = false;
//                     });

//                 tick();

//                 // Check for the expected response.
//                 expect(response).to.be.equal(false);
//             }))
//     );
// });

// describe('RestApiProxyService - getAllRecords', () => {

//     beforeEach(async () => {
//         TestBed.configureTestingModule({
//             providers: [
//                 {   // Import the necessary providers
//                     provide: Http,

//                     // Add a factory for the backend
//                     useFactory: (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) => {
//                         return new Http(backend, defaultOptions);
//                     },
//                     deps: [MockBackend, BaseRequestOptions]
//                 },
//                 RestApiProxyService,
//                 MockBackend,
//                 BaseRequestOptions
//             ]
//         });
//     });

//     it("getAllRecords, Should return a valid array of Record from the server",
//         inject([RestApiProxyService, MockBackend],
//             fakeAsync((restApiProxyService: RestApiProxyService, mockBackend: MockBackend) => {

//                 let records: Array<Record> = new Array<Record>();
//                 records.push(new Record('julien', 0, 1, 2));

//                 mockBackend.connections.subscribe((connection: MockConnection) => {

//                     //Check the expected Url to the server
//                     expect(connection.request.url).to.deep.equal('http://localhost:3002/api/records-all');

//                     // Send the fake data to the caller
//                     connection.mockRespond(new Response(new ResponseOptions({
//                         body: records,
//                         status: 200
//                     })));
//                 });

//                 let response: Record[];
//                 // Make the fake call to the server
//                 restApiProxyService.getAllRecords().then(data => {
//                     response = data;
//                 });

//                 tick();

//                 // Check for the expected response.
//                 for (let index = 0; index < response.length; index++) {
//                     let element = response[index];
//                     expect(element.difficulty).to.deep.equal(records[index].difficulty);
//                     expect(element.scoreComputer).to.deep.equal(records[index].scoreComputer);
//                     expect(element.scorePlayer).to.deep.equal(records[index].scorePlayer);
//                     expect(element.username).to.deep.equal(records[index].username);
//                 }
//             }))
//     );

//     it("getAllRecords, Should return an empty array of Record from the server",
//         inject([RestApiProxyService, MockBackend],
//             fakeAsync((restApiProxyService: RestApiProxyService, mockBackend: MockBackend) => {

//                 let records: Array<Record> = new Array<Record>();
//                 records.push(new Record('julien', 0, 1, 2));

//                 mockBackend.connections.subscribe((connection: MockConnection) => {

//                     //Check the expected Url to the server
//                     expect(connection.request.url).to.deep.equal('http://localhost:3002/api/records-all');

//                     // Send the fake data to the caller
//                     connection.mockRespond(new Response(new ResponseOptions({
//                         body: records,
//                         status: 400
//                     })));
//                 });

//                 let response: Record[];
//                 // Make the fake call to the server
//                 restApiProxyService.getAllRecords().then(data => {
//                     response = data;
//                 });

//                 tick();

//                 // Check for the expected response.
//                 expect(response.length).to.deep.equal(0);
//             }))
//     );

//     it("getAllRecords, Should return an empty array of Record from the server because of an internal error",
//         inject([RestApiProxyService, MockBackend],
//             fakeAsync((restApiProxyService: RestApiProxyService, mockBackend: MockBackend) => {

//                 let records: Array<Record> = new Array<Record>();
//                 records.push(new Record('julien', 0, 1, 2));

//                 mockBackend.connections.subscribe((connection: MockConnection) => {

//                     //Check the expected Url to the server
//                     expect(connection.request.url).to.deep.equal('http://localhost:3002/api/records-all');
//                     connection.mockError();
//                     // Send the fake data to the caller
//                 });

//                 let response: Record[];
//                 // Make the fake call to the server
//                 restApiProxyService.getAllRecords()
//                     .then(data => {
//                         response = data;
//                     })
//                     .catch(error => {
//                         response = new Array<Record>();
//                     });

//                 tick();

//                 // Check for the expected response.
//                 expect(response.length).to.deep.equal(0);
//             }))
//     );
// });
