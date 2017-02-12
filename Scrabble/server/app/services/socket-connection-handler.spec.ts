import { expect } from "chai";
import * as http from "http";
import { SocketConnectionHandler } from "./socket-connection-handler";
//import { SocketEventType } from "../commons/socket-eventType";
//import * as ioClient from "socket.io-client";

const portNumber = 3000;
//const clientAddressConnection = "http://localhost:" + `${portNumber}`;
let httpServer: http.Server;

describe("Socket Connection Handler", () => {
    let socketHandler: SocketConnectionHandler;

    before(() => {
        httpServer = http.createServer();
        httpServer.listen(portNumber);
        socketHandler = new SocketConnectionHandler(httpServer);
    });

    after(() => {
        httpServer.close();
        httpServer = null;
    });

    it("SocketConnectionHandler, should create SocketHandler", () => {
        let socketHandler = new SocketConnectionHandler(httpServer);
        expect(socketHandler).to.be.instanceof(SocketConnectionHandler);
    });

    it("SocketConnectionHandler, should throw a null argument error", () => {
        let instance = () => new SocketConnectionHandler(null);
        expect(instance).throw(Error, "Invalid server parameter.");
    });

    it("onConnectionRequest, should throw a null argument error", () => {
        //
    });


    //onConnectionRequest
    //onNewGameRequest
    //onMessage
    //sendWelcomeMessageOnPlayerJoinedRoom

// describe("messages received by the client", () => {

//     const INVALID_NAME = "The server said that the name is not valid.";
//     const NAME_ALREADY_EXISTS = "The server said that the name alreadyExists.";
//     const INVALID_DEMAND = "The server said that the demand is not valid";
//     const NO_ERROR = "The server returned the number of missing players";
//     const doNothing = () => { /*Nothing to do*/ };
//     const throwError = (errorMessage: string): Function => { return () => { throw new Error(errorMessage); }; };
//     const makeTestDone = (done: MochaDone): Function => { return () => { done(); }; };
//     const playerName = "Marie";
//     const playerName2 = "Helene";
//     const invalidPlayerName = " [ <";

//     let socketHandler: IoConnection;
//     let clientConnection1: SocketIOClient.Socket;
//     let clientConnection2: SocketIOClient.Socket;

//     before(() => {
//         httpServer = http.createServer();
//         httpServer.listen(portNumber);
//         socketHandler = new IoConnection(httpServer);
//     });

//     after(() => {
//         httpServer.close();
//         httpServer = null;
//     });

//     beforeEach(() => {
//         clientConnection1 = ioClient(clientAddressConnection);
//         clientConnection2 = ioClient(clientAddressConnection);
//     });

//     afterEach(() => {
//         clientConnection1.close();
//         clientConnection2.close();
//     });

//     it("should accept new game demand", done => {
//         clientConnection1.on(SocketCanalNames.PLAYERS_MISSING, makeTestDone(done));
//         clientConnection1.on(SocketCanalNames.NAME_OR_SOCKET_ALREADY_EXISTS, throwError(NAME_ALREADY_EXISTS));
//         clientConnection1.on(SocketCanalNames.INVALID_NAME, throwError(INVALID_NAME));
//         clientConnection1.on(SocketCanalNames.INVALID_DEMAND, throwError(INVALID_DEMAND));
//         clientConnection1.emit(SocketCanalNames.NEW_GAME_DEMAND, {name: playerName, gameType: 2});
//     });

//     it("should send name already exists response", done => {
//         clientConnection1.on(SocketCanalNames.PLAYERS_MISSING, doNothing);
//         clientConnection1.on(SocketCanalNames.NAME_OR_SOCKET_ALREADY_EXISTS, throwError(NAME_ALREADY_EXISTS));
//         clientConnection1.on(SocketCanalNames.INVALID_NAME, throwError(INVALID_NAME));
//         clientConnection1.on(SocketCanalNames.INVALID_DEMAND, throwError(INVALID_DEMAND));
//         clientConnection1.emit(SocketCanalNames.NEW_GAME_DEMAND, {name: playerName, gameType: 2});

//         clientConnection2.on(SocketCanalNames.PLAYERS_MISSING, throwError(NO_ERROR));
//         clientConnection2.on(SocketCanalNames.NAME_OR_SOCKET_ALREADY_EXISTS, makeTestDone(done));
//         clientConnection2.on(SocketCanalNames.INVALID_NAME, throwError(INVALID_NAME));
//         clientConnection2.on(SocketCanalNames.INVALID_DEMAND, throwError(INVALID_DEMAND));
//         clientConnection2.emit(SocketCanalNames.NEW_GAME_DEMAND, {name: playerName, gameType: 3});
//     });

//     it("should send illegal name response", done => {
//         clientConnection1.on(SocketCanalNames.PLAYERS_MISSING, throwError(NO_ERROR));
//         clientConnection1.on(SocketCanalNames.NAME_OR_SOCKET_ALREADY_EXISTS, throwError(NAME_ALREADY_EXISTS));
//         clientConnection1.on(SocketCanalNames.INVALID_NAME, makeTestDone(done));
//         clientConnection1.on(SocketCanalNames.INVALID_DEMAND, throwError(INVALID_DEMAND));
//         clientConnection1.emit(SocketCanalNames.NEW_GAME_DEMAND, {name: invalidPlayerName, gameType: 2});
//     });

//     it("should send illegal game demand response", done => {
//         clientConnection1.on(SocketCanalNames.PLAYERS_MISSING, throwError(NO_ERROR));
//         clientConnection1.on(SocketCanalNames.NAME_OR_SOCKET_ALREADY_EXISTS, throwError(NAME_ALREADY_EXISTS));
//         clientConnection1.on(SocketCanalNames.INVALID_NAME, throwError(INVALID_NAME));
//         clientConnection1.on(SocketCanalNames.INVALID_DEMAND, makeTestDone(done));
//         clientConnection1.emit(SocketCanalNames.NEW_GAME_DEMAND, {gameType: 2});
//     });

//     it("should not accept two game demands from the same _socket connection", done => {
//         let demandNumber = 0;
//         clientConnection1.on(SocketCanalNames.PLAYERS_MISSING, () => {
//             if (demandNumber !== 0) {
//                 throw new Error("The server said that the second demand was correct.");
//             }
//             ++demandNumber;
//         });
//         clientConnection1.on(SocketCanalNames.NAME_OR_SOCKET_ALREADY_EXISTS, () => {
//             if (demandNumber !== 1) {
//                 throw new Error("The server said that the first demand was incorrect.");
//             }
//             done();
//         });
//         clientConnection1.on(SocketCanalNames.INVALID_NAME, throwError(INVALID_NAME));
//         clientConnection1.on(SocketCanalNames.INVALID_DEMAND, throwError(INVALID_DEMAND));
//         clientConnection1.emit(SocketCanalNames.NEW_GAME_DEMAND, {name: playerName, gameType: 2});
//         clientConnection1.emit(SocketCanalNames.NEW_GAME_DEMAND, {name: playerName2, gameType: 2});
//     });
});
