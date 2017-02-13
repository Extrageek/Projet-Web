import { expect, assert } from "chai";
import * as http from "http";
import * as ioClient from "socket.io-client";

import { SocketConnectionHandler } from "./socket-connection-handler";
import { SocketEventType } from "../../commons/socket-eventType";

const fakePortNumber = 5000;
const fakeServerUrl = "http://0.0.0.0:" + `${fakePortNumber}`;
let httpServer: http.Server;

describe("SocketConnectionHandler, should create a socket connection handler", () => {
    before(() => {
        httpServer = http.createServer();
        httpServer.listen(fakePortNumber);
    });
    it("should create socketHandler", () => {
        let socketHandler = new SocketConnectionHandler(httpServer);
        expect(socketHandler).to.be.instanceof(SocketConnectionHandler);
    });
    it("should not create socketHandler", () => {
        expect(SocketConnectionHandler.bind(null)).to.throw(Error);
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

    const playerName1 = "Marie";
    const playerName2 = "Helene";

    let socketHandler: SocketConnectionHandler;
    let clientConnection1: SocketIOClient.Socket;
    let clientConnection2: SocketIOClient.Socket;

    before(() => {
        httpServer = http.createServer();
        httpServer.listen(fakePortNumber);
        socketHandler = new SocketConnectionHandler(httpServer);
    });
    after(() => {
        httpServer.close();
        httpServer = null;
    });
    beforeEach((done) => {
        clientConnection1 = ioClient(fakeServerUrl);
        done();
    });
    afterEach(() => {
        clientConnection1.close();
    });

    // TODO: To be completed
    it("should accept new game demand and respond", done => {
        let roomJoinedMessage = `${playerName1}` + ` join the room`;
        let missingMembers = 1;

        it("should accept new game demand", done => {
            clientConnection1.emit(SocketEventType.newGameRequest, { name: playerName1, gameType: 2 });
        });

        done();
    });
});