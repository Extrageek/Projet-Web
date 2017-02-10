import { expect, assert } from "chai";
import { Room } from "../models/room";
import { RoomHandler } from "./room-handler";
import { Player } from "../models/player";

describe("Room Handler", () => {

    let fakeRoomHandler: RoomHandler;
    let player1: Player;
    let player2: Player;
    const fakeName1 = "testname1";
    const fakeName2 = "testname2";
    const numberOfPlayers = 2;

    beforeEach(() => {
        fakeRoomHandler = new RoomHandler();
        player1 = new Player(fakeName1, numberOfPlayers);
        player2 = new Player(fakeName2, numberOfPlayers);
    });

    it("RoomHandler, should create a new room handler", () => {
        expect(fakeRoomHandler).not.to.be.undefined;
    });

    it("addPlayer, should add a new player in a room", () => {
        // Add the player and get his room
        let playerRoom = fakeRoomHandler.addPlayer(player1);

        // Check if the room contains the player
        assert(playerRoom.players[0].username === fakeName1);
        assert(playerRoom.players[0].numberOfPlayers === numberOfPlayers);
    });

    it("addPlayer, should throw a null argument error", () => {
        let addNullArgumentPlayer = () => fakeRoomHandler.addPlayer(null);
        let addUndefinedPlayer = () => fakeRoomHandler.addPlayer(undefined);

        expect(addNullArgumentPlayer).to.throw(Error, "The player cannot be null");
        expect(addUndefinedPlayer).to.throw(Error, "The player cannot be null");
    });

    it("addPlayer, should add two players to the same room", () => {
        let roomPlayer1 = fakeRoomHandler.addPlayer(player1);
        let roomPlayer2 = fakeRoomHandler.addPlayer(player2);

        expect(roomPlayer1).to.deep.equals(roomPlayer2);
    });

    it("addPlayer, should add two players in different rooms", () => {
        player1.numberOfPlayers = 1;
        player2.numberOfPlayers = 3;

        let roomPlayer1 = fakeRoomHandler.addPlayer(player1);
        let roomPlayer2 = fakeRoomHandler.addPlayer(player2);

        expect(roomPlayer1).not.to.deep.equals(roomPlayer2);
        assert(roomPlayer1.roomCapacity === player1.numberOfPlayers);
        assert(roomPlayer2.roomCapacity === player2.numberOfPlayers);
    });

    it("addPlayer, should not add two players with same name", () => {
        player1.username = "fakeSamename";
        player2.username = "fakeSamename";

        let roomPlayer1 = fakeRoomHandler.addPlayer(player1);
        let roomPlayer2 = fakeRoomHandler.addPlayer(player2);

        expect(roomPlayer1).to.not.be.null;
        expect(roomPlayer2).to.be.null;
    });

    it("getPlayerByUsername, should return a null value", () => {
        player1.username = "fakename1";
        let unexistingName = "nameNotExit";
        fakeRoomHandler.addPlayer(player1);

        expect(fakeRoomHandler.getPlayerByUsername(unexistingName)).to.be.null;
    });

    it("getPlayerByUsername, should return the player1", () => {
        player1.username = "fakename1";
        player2.username = "fakename2";

        fakeRoomHandler.addPlayer(player1);
        fakeRoomHandler.addPlayer(player2);

        expect(fakeRoomHandler.getPlayerByUsername(player1.username)).to.be.deep.equals(player1);
    });

    it("getPlayerByUsername, should return the player2", () => {
        player1.username = "fakename1";
        player2.username = "fakename2";

        fakeRoomHandler.addPlayer(player1);
        fakeRoomHandler.addPlayer(player2);

        expect(fakeRoomHandler.getPlayerByUsername(player2.username)).to.be.deep.equals(player2);
    });

    it("getAvailableRoom, should return a new room with the capacity of the player", () => {
        player1.numberOfPlayers = 1;
        fakeRoomHandler._rooms = new Array<Room>();
        fakeRoomHandler._rooms.push(new Room(1));
        let newRoom = fakeRoomHandler.getAvailableRoom(player1.numberOfPlayers);

        expect(newRoom).not.to.be.undefined;
        assert(newRoom.isFull() === false, "The room should be full");
        assert(newRoom.roomCapacity === player1.numberOfPlayers, "The room should be full");
        assert(newRoom.numberOfMissingPlayers() === player1.numberOfPlayers);
    });

    it("getAvailableRoom, should not find a room with 2 capacity", () => {
        player1.numberOfPlayers = 2;
        fakeRoomHandler._rooms = new Array<Room>();
        fakeRoomHandler._rooms.push(new Room(1));
        let newRoom = fakeRoomHandler.getAvailableRoom(player1.numberOfPlayers);

        expect(newRoom).not.to.be.undefined;
        expect(newRoom).to.be.null;
    });

    it("getAvailableRoom, should throw an out of range error, (Room capacity between 1 and 4)", () => {
        let invalidRoomCapacityWithLowValue = -1;
        let invalidRoomCapacityWithHighValue = 5;

        let fakeRoom1 = () => fakeRoomHandler.getAvailableRoom(invalidRoomCapacityWithLowValue);
        let fakeRoom2 = () => fakeRoomHandler.getAvailableRoom(invalidRoomCapacityWithHighValue);

        expect(fakeRoom1).to.throw(RangeError,
            "Out of range error: The capacity of the room should be between 1 and 4");

        expect(fakeRoom2).to.throw(RangeError,
            "Out of range error: The capacity of the room should be between 1 and 4");
    });

    it("getRoomByUsername, should return a null value", () => {
        fakeRoomHandler._rooms = new Array<Room>();
        player1.username = "fakename1";
        let unexistingName = "nameNotExit";
        fakeRoomHandler.addPlayer(player1);

        expect(fakeRoomHandler.getRoomByUsername(unexistingName)).to.be.null;
    });

    it("getRoomByUsername, should return a room", () => {
        player1.username = "fakename1";
        player2.username = "fakename2";

        let room1 = fakeRoomHandler.addPlayer(player1);
        fakeRoomHandler.addPlayer(player2);

        expect(fakeRoomHandler.getRoomByUsername(player1.username)).to.be.deep.equals(room1);
    });

    it("getRoomByUsername, should return a room", () => {
        player1.username = "fakename1";
        player2.username = "fakename2";

        fakeRoomHandler.addPlayer(player1);
        let room2 = fakeRoomHandler.addPlayer(player2);

        expect(fakeRoomHandler.getRoomByUsername(player2.username)).to.be.deep.equals(room2);
    });

    it("removeRoom, should throw a null argument error ", () => {
        let throwNullArgumentException = () => fakeRoomHandler.removeRoom(null);
        expect(throwNullArgumentException).throw(Error, "Argument error: The room cannot be null");

    });

    it("removeRoom, should remove the first room", () => {
        player1.username = "fakename1";
        player2.username = "fakename2";

        let roomCapacity = 1;
        let room1 = new Room(roomCapacity);

        // Initialize the the handler with a room
        fakeRoomHandler._rooms = [room1];

        // Add a second room to the liste
        let room2 = fakeRoomHandler.addPlayer(player2);

        fakeRoomHandler.removeRoom(room1);

        // Expect 1 room in the list if the first one is deleted.
        assert(fakeRoomHandler._rooms.length === 1);

        // Make sure that the second room created by the player 2 is not affected
        expect(fakeRoomHandler.getRoomByUsername(player2.username)).to.deep.equals(room2);
    });

    it("removeRoom, should remove the second room", () => {
        player1.username = "fakename1";
        player2.username = "fakename2";

        let roomCapacity = 1;
        let room1 = new Room(roomCapacity);

        // Initialize the the handler with a room
        fakeRoomHandler._rooms = [room1];

        // Add a second room to the liste
        let room2 = fakeRoomHandler.addPlayer(player2);

        fakeRoomHandler.removeRoom(room2);

        // Expect 1 room in the list if the second one is deleted.
        assert(fakeRoomHandler._rooms.length === 1);
    });

});
