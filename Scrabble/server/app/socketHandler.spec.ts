import { expect } from "chai";
import * as http from "http";
import { IoConnection } from "./socketHandler";
import { SocketCanalNames } from "./SocketCanalNames";
import * as ioClient from "socket.io-client";

const portNumber = 3000;
const clientAdressConnection = "http://localhost:" + String(portNumber);
let httpServer: http.Server;

describe("create socket handler", () => {

    before(() => {
        httpServer = http.createServer();
        httpServer.listen(portNumber);
    });

    it("should create socketHandler", () => {
        let socketHandler = new IoConnection(httpServer);
        expect(socketHandler).to.be.instanceof(IoConnection);
    });

    it("should not create socketHandler", () => {
        expect(IoConnection.bind(null)).to.throw(Error);
    });

    after(() => {
        httpServer.close();
        httpServer = null;
    });
});

describe("messages received by the client", () => {

    const INVALID_NAME = "The server said that the name is not valid.";
    const NAME_ALREADY_EXISTS = "The server said that the name alreadyExists.";
    const INVALID_DEMAND = "The server said that the demand is not valid";
    const NO_ERROR = "The server returned the number of missing players";
    const doNothing = () => { /*Nothing to do*/ };
    const throwError = (errorMessage: string): Function => { return () => { throw new Error(errorMessage); }; };
    const makeTestDone = (done: MochaDone): Function => { return () => { done(); }; };
    const playerName = "Marie";
    const playerName2 = "Helene";
    const invalidPlayerName = " [ <";

    let socketHandler: IoConnection;
    let clientConnection1: SocketIOClient.Socket;
    let clientConnection2: SocketIOClient.Socket;

    before(() => {
        httpServer = http.createServer();
        httpServer.listen(portNumber);
        socketHandler = new IoConnection(httpServer);
    });

    after(() => {
        httpServer.close();
        httpServer = null;
    });

    beforeEach(() => {
        clientConnection1 = ioClient(clientAdressConnection);
        clientConnection2 = ioClient(clientAdressConnection);
    });

    afterEach(() => {
        clientConnection1.close();
        clientConnection2.close();
    });

    it("should accept new game demand", done => {
        clientConnection1.on(SocketCanalNames.PLAYERS_MISSING, makeTestDone(done));
        clientConnection1.on(SocketCanalNames.NAME_OR_SOCKET_ALREADY_EXISTS, throwError(NAME_ALREADY_EXISTS));
        clientConnection1.on(SocketCanalNames.INVALID_NAME, throwError(INVALID_NAME));
        clientConnection1.on(SocketCanalNames.INVALID_DEMAND, throwError(INVALID_DEMAND));
        clientConnection1.emit(SocketCanalNames.NEW_GAME_DEMAND, {name: playerName, numberOfPlayers: 2});
    });

    it("should send name already exists response", done => {
        clientConnection1.on(SocketCanalNames.PLAYERS_MISSING, doNothing);
        clientConnection1.on(SocketCanalNames.NAME_OR_SOCKET_ALREADY_EXISTS, throwError(NAME_ALREADY_EXISTS));
        clientConnection1.on(SocketCanalNames.INVALID_NAME, throwError(INVALID_NAME));
        clientConnection1.on(SocketCanalNames.INVALID_DEMAND, throwError(INVALID_DEMAND));
        clientConnection1.emit(SocketCanalNames.NEW_GAME_DEMAND, {name: playerName, numberOfPlayers: 2});

        clientConnection2.on(SocketCanalNames.PLAYERS_MISSING, throwError(NO_ERROR));
        clientConnection2.on(SocketCanalNames.NAME_OR_SOCKET_ALREADY_EXISTS, makeTestDone(done));
        clientConnection2.on(SocketCanalNames.INVALID_NAME, throwError(INVALID_NAME));
        clientConnection2.on(SocketCanalNames.INVALID_DEMAND, throwError(INVALID_DEMAND));
        clientConnection2.emit(SocketCanalNames.NEW_GAME_DEMAND, {name: playerName, numberOfPlayers: 3});
    });

    it("should send illegal name response", done => {
        clientConnection1.on(SocketCanalNames.PLAYERS_MISSING, throwError(NO_ERROR));
        clientConnection1.on(SocketCanalNames.NAME_OR_SOCKET_ALREADY_EXISTS, throwError(NAME_ALREADY_EXISTS));
        clientConnection1.on(SocketCanalNames.INVALID_NAME, makeTestDone(done));
        clientConnection1.on(SocketCanalNames.INVALID_DEMAND, throwError(INVALID_DEMAND));
        clientConnection1.emit(SocketCanalNames.NEW_GAME_DEMAND, {name: invalidPlayerName, numberOfPlayers: 2});
    });

    it("should send illegal game demand response", done => {
        clientConnection1.on(SocketCanalNames.PLAYERS_MISSING, throwError(NO_ERROR));
        clientConnection1.on(SocketCanalNames.NAME_OR_SOCKET_ALREADY_EXISTS, throwError(NAME_ALREADY_EXISTS));
        clientConnection1.on(SocketCanalNames.INVALID_NAME, throwError(INVALID_NAME));
        clientConnection1.on(SocketCanalNames.INVALID_DEMAND, makeTestDone(done));
        clientConnection1.emit(SocketCanalNames.NEW_GAME_DEMAND, {numberOfPlayers: 2});
    });

    it("should not accept two game demands from the same socket connection", done => {
        let demandNumber = 0;
        clientConnection1.on(SocketCanalNames.PLAYERS_MISSING, () => {
            if (demandNumber !== 0) {
                throw new Error("The server said that the second demand was correct.");
            }
            ++demandNumber;
        });
        clientConnection1.on(SocketCanalNames.NAME_OR_SOCKET_ALREADY_EXISTS, () => {
            if (demandNumber !== 1) {
                throw new Error("The server said that the first demand was incorrect.");
            }
            done();
        });
        clientConnection1.on(SocketCanalNames.INVALID_NAME, throwError(INVALID_NAME));
        clientConnection1.on(SocketCanalNames.INVALID_DEMAND, throwError(INVALID_DEMAND));
        clientConnection1.emit(SocketCanalNames.NEW_GAME_DEMAND, {name: playerName, numberOfPlayers: 2});
        clientConnection1.emit(SocketCanalNames.NEW_GAME_DEMAND, {name: playerName2, numberOfPlayers: 2});
    });
});
