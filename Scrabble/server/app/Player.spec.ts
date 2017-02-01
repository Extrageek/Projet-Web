import { expect } from "chai";
import { Player } from "./RoomsAndPlayers";
import { SocketCanalNames } from "./SocketCanalNames";
import * as io from "socket.io";
import * as ioClient from "socket.io-client";

const portNumber = 3000;
const clientAdressConnection = "http://localhost:" + String(portNumber);
const playerName = "Martin";

describe("test player class", () => {

    let socketServer: SocketIO.Server = null;

    beforeEach(() => {
        socketServer = io.listen(portNumber);
    });

    afterEach(() => {
        socketServer.close();
    });

    it("should create a new player", done => {
        socketServer.on(SocketCanalNames.CONNECTION, (socket: SocketIO.Socket) => {
            let playerCreated = new Player(playerName, 3, socket);
            expect(playerCreated).to.be.instanceof(Player);
            done();
        });
        let socketListener = ioClient(clientAdressConnection);
        socketListener.close();
    });
    it("should not create a new player", done => {
        socketServer.on(SocketCanalNames.CONNECTION, (socket: SocketIO.Socket) => {
            let creation1 = function() {
                new Player(null, 1, socket);
            };
            let creation2 = function() {
                new Player(playerName, 0, socket);
            };
            let creation3 = function() {
                new Player(playerName, 5, socket);
            };
            let creation4 = function() {
                new Player(playerName, null, socket);
            };
            let creation5 = function() {
                new Player(playerName, 2, null);
            };
            expect(creation1).to.throw(Error);
            expect(creation2).to.throw(Error);
            expect(creation3).to.throw(Error);
            expect(creation4).to.throw(Error);
            expect(creation5).to.throw(Error);
            done();
        });
        let socketListener = ioClient(clientAdressConnection);
        socketListener.close();
    });
    it("should return right values", done => {
        socketServer.on(SocketCanalNames.CONNECTION, (socket: SocketIO.Socket) => {
            let playerCreated = new Player(playerName, 3, socket);
            expect(playerCreated.name).to.equals(playerName);
            expect(playerCreated.numberOfPlayers).to.equals(3);
            done();
        });
        let socketListener = ioClient(clientAdressConnection);
        socketListener.close();
    });
});
