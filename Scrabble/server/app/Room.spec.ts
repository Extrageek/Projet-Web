import { expect } from "chai";
import { Room } from "./Room";
import { Player } from "./Player";
import * as io from "socket.io";
import * as ioClient from "socket.io-client";

describe("Room constructor tester", () => {

    it("should throw error as constructing a room", done => {
        let func = () => { new Room(0); };
        expect(func).to.throw(RangeError);
        func = () => { new Room(5); };
        expect(func).to.throw(RangeError);
        done();
    });

    it("should not throw error as constructing a room", done => {
        let room: Room = null;
        let func = () => { room = new Room(3); };
        expect(func).to.not.throw(RangeError);
        expect(room.roomCapacity).to.equals(3);
        done();
    });
});

describe("Room capacity tester", () => {
    let socketServer: SocketIO.Server;
    let player: Player;
    let connection: SocketIOClient.Socket;
    before(() => {
        socketServer = io.listen(3000);
        socketServer.on("connection", (socket: SocketIO.Socket) => {
            player = new Player("playerName", 3, socket);
        });
        connection = ioClient.connect("http://localhost:3000");
    });

    after(() => {
        socketServer.close();
        connection.close();
    });

    it("dummy test", done => {
        done();
    });

    it("should contain the player after insertion of a player", done => {
        let room = new Room(2);
        room.addPlayer(player);
        expect(room.hasPlayerWithName(player.name)).to.equals(true);
        done();
    });

    it("should be able to remove player", done => {
        let room = new Room(1);
        room.addPlayer(player);
        room.removePlayer(player);
        expect(room.hasPlayerWithName(player.name)).to.equals(false);
        done();
    });

    it("should not be a full room", done => {
        let room = new Room(2);
        room.addPlayer(player);
        expect(room.roomIsFull()).to.equals(false);
        done();
    });

    it("should be a full room", done => {
        let room = new Room(1);
        room.addPlayer(player);
        expect(room.roomIsFull()).to.equals(true);
        done();
    });
});

describe("Room with multiple players tester", () => {

    let socketServer: SocketIO.Server;
    let players = Array<Player>();
    let connection1: SocketIOClient.Socket;
    let connection2: SocketIOClient.Socket;

    before(() => {
        socketServer = io.listen(3000);
    });

    after(() => {
        socketServer.close();
    });

    beforeEach(() => {
         socketServer.on("connection", (socket: SocketIO.Socket) => {
            players.push(new Player("playerName", 3, socket));
        });
        connection1 = ioClient.connect("http://localhost:3000");
        connection2 = ioClient.connect("http://localhost:3000");
    });

    afterEach(() => {
        connection1.close();
        connection2.close();
    });

    it("dummy test", done => {
        done();
    });

    it("should refuse new player", done => {
        let room = new Room(1);
        let addPlayer1 = () => { room.addPlayer(players[0]); };
        let addPlayer2 = () => { room.addPlayer(players[1]); };
        expect(addPlayer1).to.not.throw(Error);
        expect(addPlayer2).to.throw(Error);
        done();
    });
});
