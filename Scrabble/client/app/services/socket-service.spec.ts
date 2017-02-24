// import { Injectable } from "@angular/core";
// import { Subject } from 'rxjs/Subject';
// import { Observable } from 'rxjs/Observable';
// import { SocketService } from "./socket-service";
// import { SocketEventType } from '../commons/socket-eventType';

// import * as http from "https";
// import * as ioServer from "socket.io-client";

// import { expect, assert } from "chai";

// const fakePortNumber = 3005;
// const fakeServerUrl = "http://localhost:" + `${fakePortNumber}`;
// let httpServer: http.Server;

// let chai = require('chai'),
//     mocha = require('mocha'),
//     should = chai.should();

// let options = {
//     transports: ['websocket'],
//     forceNew: true
// };

// let io = require('socket.io-client');
// const SERVER_PORT_NUMBER = 3005;
// let socketService: SocketService;

// describe("Socket service testing properties", () => {

//     beforeEach(() => {
//         httpServer.listen(SERVER_PORT_NUMBER, 'http://localhost:');
//         socketService = new SocketService();
//     });

//     it("should correctly connect to the server", () => {
//         socketService.subscribeToChannelEvent();


//         expect(SocketService._socket).to.not.be.undefined;
//     });

//     it("should correctly return a valid _socket id", () => {
//         assert.isString(SocketService._socket.id);
//     });

//     after(() => {
//         httpServer.close();
//         httpServer = null;
//     });
// });


