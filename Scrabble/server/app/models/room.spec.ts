import { expect, assert } from "chai";
import { Room } from "./room";
import { Player } from "./player";

describe("Room", () => {

    it("should create a new room", () => {
        let roomCapacity = 2;
        let fakeRoom = new Room(roomCapacity);

        expect(fakeRoom).not.to.be.undefined;
        expect(fakeRoom.roomCapacity).to.equals(roomCapacity);
        expect(fakeRoom.roomId).not.to.be.null;
        expect(fakeRoom.players).not.to.be.null;
    });

    it("should throw an out of range error", () => {
        let invalidRoomCapacityLowValue = -1;
        let invalidRoomCapacityWithHighValue = 5;

        let fakeRoom1 = () => new Room(invalidRoomCapacityLowValue);
        let fakeRoom2 = () => new Room(invalidRoomCapacityWithHighValue);

        expect(fakeRoom1).to.throw(RangeError, "Argument error: the number of players must be between 1 and 4");
        expect(fakeRoom2).to.throw(RangeError, "Argument error: the number of players must be between 1 and 4");
    });

    it("addPlayer, should accept 2 players in the room", () => {
        let roomCapacity = 2;
        let room = new Room(roomCapacity);

        let fakeName1 = "testname1";
        let fakeName2 = "testname2";
        let numberOfPlayers = 2;

        let player1 = new Player(fakeName1, numberOfPlayers);
        let player2 = new Player(fakeName2, numberOfPlayers);

        room.addPlayer(player1);
        room.addPlayer(player2);

        assert(room.players[0].username === fakeName1);
        assert(room.players[0].numberOfPlayers === numberOfPlayers);
        assert(room.players[1].username === fakeName2);
        assert(room.players[1].numberOfPlayers === numberOfPlayers);
    });

    it("addPlayer, should not accept a new player", () => {
        let roomCapacity = 1;
        let room = new Room(roomCapacity);
        let fakeName1 = "testname1";
        let fakeName2 = "testname2";

        let player1 = new Player(fakeName1, 1);
        let player2 = new Player(fakeName2, 1);

        room.addPlayer(player1);
        assert(room.isFull() === true, "The room must be full at this state");

        let failToAddPlayer = () => room.addPlayer(player2);
        expect(failToAddPlayer).to.throw(Error, "The room is full, cannot add a new player");
    });

    it("playerWithDuplicatedUsername, should display a duplicated username error", () => {
        let roomCapacity = 2;
        let room = new Room(roomCapacity);

        let fakeName = "fakename";
        let numberOfPlayers = 2;
        let player1 = new Player(fakeName, numberOfPlayers);
        let player2 = new Player(fakeName, numberOfPlayers);

        room.addPlayer(player1);
        let playerWithDuplicatedUsername = () => room.addPlayer(player2);

        expect(playerWithDuplicatedUsername).to.throw(Error, "The username already exist in this room");
    });

    it("usernameAlreadyExist, should display a duplicated username error", () => {
        let roomCapacity = 2;
        let room = new Room(roomCapacity);

        let fakeName = "fakename";
        let numberOfPlayers = 2;
        let player1 = new Player(fakeName, numberOfPlayers);
        let player2 = new Player(fakeName, numberOfPlayers);

        room.addPlayer(player1);

        assert(room.usernameAlreadyExist(player2.username) === true);
    });

    it("usernameAlreadyExist, should throw a null argument error", () => {
        let roomCapacity = 2;
        let room = new Room(roomCapacity);

        let fakeName = "fakename";
        let numberOfPlayers = 2;
        let player1 = new Player(fakeName, numberOfPlayers);

        room.addPlayer(player1);

        expect(() => room.usernameAlreadyExist(null)).to.throw(Error, "Argument error: the username cannot be null");
    });

    it("isFull, should be true", () => {

        let fakeName = "fakename";
        let numberOfPlayers = 2;
        let player1 = new Player(fakeName, numberOfPlayers);

        let roomCapacity = 2;
        let room = new Room(roomCapacity);
        room.addPlayer(player1);

        expect(room.isFull()).to.equals(false);
    });

    it("removePlayer, should remove with success", () => {

        let fakeName1 = "testname1";
        let fakeName2 = "testname2";
        let numberOfPlayers = 2;
        let player1 = new Player(fakeName1, numberOfPlayers);
        let player2 = new Player(fakeName2, numberOfPlayers);

        let roomCapacity = 2;
        let room = new Room(roomCapacity);
        room.addPlayer(player1);
        room.addPlayer(player2);

        let removedPlayer = room.removePlayer(player1);

        assert(removedPlayer.username === player1.username);
        assert(removedPlayer.numberOfPlayers === player1.numberOfPlayers);

        assert(room.players[0].username === player2.username);
        assert(room.players[0].numberOfPlayers === player2.numberOfPlayers);

        assert(room.players.length === 1, "The list of player should be empty");
    });

    it("removePlayer, should throw a null argument error", () => {

        let fakeName = "testname1";
        let numberOfPlayers = 1;
        let player = new Player(fakeName, numberOfPlayers);

        let roomCapacity = 1;
        let room = new Room(roomCapacity);
        room.addPlayer(player);

        let mustFailFunction = () => room.removePlayer(null);
        expect(mustFailFunction).to.throw(Error, "Argument error: the player cannot be null");
    });
});
