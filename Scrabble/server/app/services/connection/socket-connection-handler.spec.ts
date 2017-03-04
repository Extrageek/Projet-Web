import { expect, assert } from "chai";
import * as http from "http";
let ioClient = require('socket.io-client');

import { SocketConnectionHandler } from "./socket-connection-handler";
import { SocketEventType } from "../../commons/socket-eventType";
import { CommandType } from "../../commons/command-type";
import { CommandStatus } from "../../commons/command-status";
import { IRoomMessage } from "../../commons/messages/room-message.interface";
import { ICommandMessage } from "../../commons/messages/command-message.interface";

const fakePortNumber = 5000;
const fakeServerUrl = "http://0.0.0.0:" + `${fakePortNumber}`;
let httpServer: http.Server;

let chai = require('chai'),
    mocha = require('mocha'),
    sinon = require('sinon'),
    should = chai.should();

let socketHandler: SocketConnectionHandler;
//  let clientConnection1: SocketIOClient.Socket;
//  let clientConnection2: SocketIOClient.Socket;
let options = {
    transports: ['websocket'],
    forceNew: true
};


let userCounter = 0;
const playerName1 = "Marie";
const playerName2 = "Helene";
class RoomMessage {
    username: string;
    roomId: string;
    numberOfMissingPlayers: number;
    roomIsReady: boolean;
    message: string;
}

describe("SocketConnectionHandler, should create a socket connection handler", () => {
    before(() => {
        httpServer = http.createServer();
        httpServer.listen(fakePortNumber);
        //new SocketConnectionHandler(httpServer);
        socketHandler = new SocketConnectionHandler(httpServer);
    });

    after(() => {
        httpServer.close();
        httpServer = null;
    });

    it("should create socketHandler", () => {
        socketHandler = new SocketConnectionHandler(httpServer);
        expect(socketHandler).to.be.instanceof(SocketConnectionHandler);
    });

    it("should not create socketHandler", () => {
        expect(SocketConnectionHandler.bind(null)).to.throw(Error);
    });

    it("should create a room message response", () => {
        // var createResponse = sinon.stub(SocketConnectionHandler, 'createRoomMessageResponse');
        // let roomMessage = { commandType: CommandType.MessageCmd, username: "Mathieu", message: "Hey, great staff with sinon" }
        // // let response = createRoomMessageResponse.createRoomMessageResponse(roomMessage);

        // sinon.assert.calledWith(createResponse, expectedUser);
        // console.log(createResponse);
    });

    // it("SocketConnectionHandler, should add a player and emit a message to player", (done) => {
    //     clientConnection1 = ioClient(fakeServerUrl, options);

    //     clientConnection1.once(SocketEventType.connect, function () {
    //         clientConnection1.emit(SocketEventType.newGameRequest, { username: playerName1, gameType: 2 });
    //     });

    //     clientConnection1.once(SocketEventType.joinRoom, function (roomMessage: RoomMessage) {
    //         //console.log("test 1 join", roomMessage);
    //         roomMessage.message.should.equal(`${playerName1}` + ` joined the room`);
    //         // clientConnection1.disconnect();
    //         // clientConnection1.close();
    //     });

    //     done();

    // });

    // describe("test", () => {

    //     it("SocketConnectionHandler, should add 2 players in the same room", () => {

    //         //clientConnection1.removeAllListeners();
    //         //clientConnection1.disconnect();
    //         clientConnection1 = ioClient(fakeServerUrl, options);

    //         // When the user 1 is connected
    //         clientConnection1.once(SocketEventType.connect, function () {

    //             // Create a second user
    //             clientConnection2 = ioClient(fakeServerUrl, options);

    //             // When the user 2 is connected
    //             clientConnection2.once(SocketEventType.connect, function () {
    //                 clientConnection2.emit(SocketEventType.newGameRequest, { username: playerName2, gameType: 2 });
    //                 //clientConnection1.emit(SocketEventType.newGameRequest, {
    //                 //username: playerName1 + "2", gameType: 2 });

    //             });
    //             // Add a listener for the second user when he joined the room
    //             clientConnection2.once(SocketEventType.joinRoom, function (roomMessage: RoomMessage) {
    //                 // console.log("test 1 join", roomMessage);
    //                 roomMessage.message.should.equal(`${playerName1}` + `2 joined the room`);
    //             });

    //             // Add a listener for the second user when he joined the room
    //             clientConnection2.once(SocketEventType.joinRoom, function (roomMessage: RoomMessage) {
    //                 //console.log("test 2 join", roomMessage);
    //                 roomMessage.message.should.equal(`${playerName2}` + ` joined the room`);
    //             });

    //             assert(socketHandler._roomHandler._rooms.length === 1, "Expect 1 Room");
    //             // assert(socketHandler._roomHandler._rooms[0].players.length == 2, "Expect 2 players");
    //         });
    //     });
    // });
});


// describe("messages received by the client", () => {
//     const INVALID_NAME = "The server said that the name is not valid.";
//     const NAME_ALREADY_EXISTS = "The server said that the name alreadyExists.";
//     const INVALID_DEMAND = "The server said that the demand is not valid";
//     const NO_ERROR = "The server returned the number of missing players";

//     const doNothing = () => { /*Nothing to do*/ };
//     const throwError = (errorMessage: string): Function => { return () => { throw new Error(errorMessage); }; };
//     const makeTestDone = (done: MochaDone): Function => { return () => { done(); }; };

//     const playerName1 = "Marie";
//     const playerName2 = "Helene";

//     let socketHandler: SocketConnectionHandler;
//     let clientConnection1: SocketIOClient.Socket;
//     let clientConnection2: SocketIOClient.Socket;

//     before(() => {
//         httpServer = http.createServer();
//         httpServer.listen(fakePortNumber);
//         socketHandler = new SocketConnectionHandler(httpServer);
//     });
//     after(() => {
//         httpServer.close();
//         httpServer = null;
//     });
//     beforeEach((done) => {
//         clientConnection1 = ioClient(fakeServerUrl);
//         done();
//     });
//     afterEach(() => {
//         clientConnection1.close();
//     });

//     // TODO: To be completed
//     it("should accept new game demand and respond", done => {
//         let roomJoinedMessage = `${playerName1}` + ` join the room`;
//         let missingMembers = 1;

//         it("should accept new game demand", done => {
//             clientConnection1.emit(SocketEventType.newGameRequest, { name: playerName1, gameType: 2 });
//         });

//         done();
//     });
// });
