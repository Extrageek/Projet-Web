import { expect } from "chai";
import { RoomHandler, Player } from "./RoomsAndPlayers";
import * as io from "socket.io";
import * as ioClient from "socket.io-client";

describe("Room handler tester", () => {

    let connection: SocketIO.Server;
    let clientConnection1: SocketIOClient.Socket;
    let clientConnection2: SocketIOClient.Socket;
    let clientConnection3: SocketIOClient.Socket;
    let clientConnection4: SocketIOClient.Socket;
    let players: Player[] = new Array<Player>();
    let playerNames: String[] = ["player1", "player2", "player3", "player1"];
    let playerNumbers: number[] = [2, 2, 3, 1];
    let roomHandler: RoomHandler;

    beforeEach(done => {
        roomHandler = new RoomHandler();
        connection = io.listen(3000);
        let numberOfPlayerToCreate = 4;
        let playerCreated = 0;
        connection.on("connection", (socket: SocketIO.Socket) => {
            players[playerCreated] = new Player(playerNames[playerCreated], playerNumbers[playerCreated], socket);
            ++playerCreated;
            if (playerCreated >= numberOfPlayerToCreate) {
                playerCreated = 0;
                done();
            }
        });
        clientConnection1 = ioClient.connect("http://localhost:3000");
        clientConnection2 = ioClient.connect("http://localhost:3000");
        clientConnection3 = ioClient.connect("http://localhost:3000");
        clientConnection4 = ioClient.connect("http://localhost:3000");
    });

    afterEach(() => {
        clientConnection1.close();
        clientConnection2.close();
        clientConnection3.close();
        clientConnection4.close();
        connection.close();
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
/*
    it("should have left room", done => {
        roomHandler.addPlayertoARoom(players[0]);
        roomHandler.addPlayertoARoom(players[1]);
        let socket = players[0].socket;
        socket.on("playersMissing", (numberOfPlayers: number) => {
            console.log("passed here 1");
            expect(numberOfPlayers).to.equals(1);
            done();
        });
        clientConnection1.close();
    });

    it("should have destroyed the room", done => {
        roomHandler.addPlayertoARoom(players[0]);
        let socket = players[0].socket;
        socket.on("disconnect", () => {
            console.log("passed here 2");
            expect(roomHandler.roomCount).to.equals(0);
            done();
        });
        clientConnection1.close();
    });
    */
});

/*
describe("disconnection of players", () => {
    let connection: SocketIO.Server;
    let clientConnection1: SocketIOClient.Socket;
    let clientConnection2: SocketIOClient.Socket;
    let roomHandler: RoomHandler;
    let players: Player[] = new Array<Player>();
    let playerNames: String[] = ["player1", "player2"];
    let playerNumbers: number[] = [2, 2];

    let callDone: Function = null;

    let verificationOnDisconnect = () => {
        expect(roomHandler.roomCount).to.equals(0);
        callDone();
    };

    beforeEach(done => {
        roomHandler = new RoomHandler();
        connection = io.listen(3000);
        let numberOfPlayerToCreate = 2;
        let playerCreated = 0;
        connection.on("connection", (socket: SocketIO.Socket) => {
            socket.on("disconnect", verificationOnDisconnect);
            players[playerCreated] = new Player(playerNames[playerCreated], playerNumbers[playerCreated], socket);
            ++playerCreated;
            if (playerCreated >= numberOfPlayerToCreate) {
                playerCreated = 0;
                done();
            }
        });
        clientConnection1 = ioClient.connect("http://localhost:3000");
        clientConnection2 = ioClient.connect("http://localhost:3000");
    });

    it("should have destroyed the room", done => {
        callDone = () => { done(); };
        roomHandler.addPlayertoARoom(players[0]);
        clientConnection1.close();
    })
})
*/
