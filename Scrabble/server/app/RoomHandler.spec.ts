import { expect } from "chai";
import { RoomHandler, Player } from "./RoomsAndPlayers";
import { SocketCanalNames } from "./SocketCanalNames";
import * as io from "socket.io";
import * as ioClient from "socket.io-client";

let connection: SocketIO.Server;
let clientConnection1: SocketIOClient.Socket;
let clientConnection2: SocketIOClient.Socket;
let clientConnection3: SocketIOClient.Socket;
let clientConnection4: SocketIOClient.Socket;
let players: Player[] = new Array<Player>();
let playerNames: string[] = ["player1", "player2", "player3", "player1"];
let playerNumbers: number[] = [2, 2, 3, 1];
let roomHandler: RoomHandler;
let portNumber = 3000;
let clientAdressConnection = "http://localhost:" + String(portNumber);

let createConnectionEvent = (numberOfPlayersToConnect: number, done: MochaDone) => {
    let playerCreated = 0;
    connection = io.listen(portNumber);
    connection.on(SocketCanalNames.CONNECTION, (socket: SocketIO.Socket) => {
        players[playerCreated] = new Player(playerNames[playerCreated], playerNumbers[playerCreated], socket);
        ++playerCreated;
        if (playerCreated >= numberOfPlayersToConnect) {
            playerCreated = 0;
            done();
        }
    });
};

describe("Room Handler constructor", () => {

    before(() => {
        connection = io.listen(portNumber);
    });

    after(() => {
        connection.close();
    });

    it("should construct new RoomHandler", () => {
        expect(() => { new RoomHandler(connection); }).to.not.throw(Error);
    });

    it("should throw error as constructing RoomHandler", () => {
        expect(() => { new RoomHandler(null); }).to.throw(Error);
    });
});

describe("Room Handler tester", () => {

    beforeEach(done => {
        createConnectionEvent(4, done);
        roomHandler = new RoomHandler(connection);
        clientConnection1 = ioClient.connect(clientAdressConnection);
        clientConnection2 = ioClient.connect(clientAdressConnection);
        clientConnection3 = ioClient.connect(clientAdressConnection);
        clientConnection4 = ioClient.connect(clientAdressConnection);
    });

    afterEach(() => {
        clientConnection1.close();
        clientConnection2.close();
        clientConnection3.close();
        clientConnection4.close();
        connection.close();
        connection = null;
    });

    it("should add new player to a room", () => {
        let room = roomHandler.addPlayertoARoom(players[0]);
        expect(room.hasPlayerWithNameOrSocket(players[0])).to.equals(true);
    });

    it("should not add new player to a room", () => {
        let invalidAdd = () => { roomHandler.addPlayertoARoom(null); };
        expect(invalidAdd).to.throw(Error);
    });

    it("should add two players to the same room", () => {
        roomHandler.addPlayertoARoom(players[0]);
        roomHandler.addPlayertoARoom(players[1]);
        expect(roomHandler.areInSameRoom(players[0], players[1])).to.equals(true);
    });

    it("should add two players in different rooms", () => {
        roomHandler.addPlayertoARoom(players[0]);
        roomHandler.addPlayertoARoom(players[2]);
        expect(roomHandler.areInSameRoom(players[0], players[2])).to.not.equals(true);
    });

    it("should contains the player after insertion", () => {
        roomHandler.addPlayertoARoom(players[0]);
        expect(roomHandler.hasPlayerWithNameOrSocket(players[0])).to.equals(true);
    });

    it("should not add two players with same name or same socket.", () => {
        let addFirstPlayer = () => { roomHandler.addPlayertoARoom(players[0]); };
        let addSecondPlayer = () => { roomHandler.addPlayertoARoom(players[3]); };
        expect(addFirstPlayer).to.not.throw(Error);
        expect(addSecondPlayer).to.throw(Error);
    });
});


//To make the next tests working, it must not have a beforeEach or afterEach statement. When there are
//this kind of statements, the disconnect event is only fired after the elapsed time for the test
//(after the afterEach function has been called). A setTimeout function is also used in the test to
//permit the disconnect event to be fired in the Player class.
describe("disconnection of players", () => {
    before(done => {
        createConnectionEvent(2, done);
        roomHandler = new RoomHandler(connection);
        clientConnection1 = ioClient.connect(clientAdressConnection);
        clientConnection2 = ioClient.connect(clientAdressConnection);
    });

    after(() => {
        clientConnection1.close();
        clientConnection2.close();
        connection.close();
        connection = null;
    });

    it("should have left room and other player should have been notified", done => {
        let numberOfMissingPlayersReceived = 0;
        clientConnection2.on(SocketCanalNames.PLAYERS_MISSING, (numberOfMissingPlayers: number) => {
            expect(numberOfMissingPlayers).to.equals(numberOfMissingPlayersReceived);
            ++numberOfMissingPlayersReceived;
            if (numberOfMissingPlayersReceived === 2) {
                done();
            }
        });
        roomHandler.addPlayertoARoom(players[0]);
        roomHandler.addPlayertoARoom(players[1]);
        clientConnection1.close();
    });
});

describe("destruction of rooms", () => {
    before(done => {
        createConnectionEvent(1, done);
        roomHandler = new RoomHandler(connection);
        clientConnection1 = ioClient.connect(clientAdressConnection);
    });

    after(() => {
        clientConnection1.close();
        connection.close();
        connection = null;
    });

    it("should have destroyed the room when it becomes empty", done => {
        roomHandler.addPlayertoARoom(players[0]);
        clientConnection1.close();
        setTimeout(() => {
            expect(roomHandler.roomCount).to.equals(0);
            done();
        }, 10);
    });
});
