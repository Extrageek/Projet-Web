import { expect, assert } from "chai";
import { Room } from "./room";
import { Player } from "../players/player";
import { QueueCollection } from "../queue-collection";
import { LetterBankHandler } from "../../services/lettersBank/letterbank-handler";

let fakeSocketId = "fakeId@33md401";

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

        let player1 = new Player(fakeName1, numberOfPlayers, fakeSocketId);
        let player2 = new Player(fakeName2, numberOfPlayers, fakeSocketId);

        room.addPlayer(player1);
        room.addPlayer(player2);

        assert(room.roomCapacity === numberOfPlayers);

        let roomFirstPlayer = room.players.dequeue();
        assert(roomFirstPlayer.username === fakeName1);
        assert(roomFirstPlayer.numberOfPlayers === numberOfPlayers);

        let roomSecondPlayer = room.players.dequeue();
        assert(roomSecondPlayer.username === fakeName2);
        assert(roomSecondPlayer.numberOfPlayers === numberOfPlayers);
    });

    it("addPlayer, should not accept a new player", () => {
        let roomCapacity = 1;
        let room = new Room(roomCapacity);

        let fakeName1 = "testname1";
        let fakeName2 = "testname2";
        let numberOfPlayers = 1;

        let player1 = new Player(fakeName1, numberOfPlayers, fakeSocketId);
        let player2 = new Player(fakeName2, numberOfPlayers, fakeSocketId);

        room.addPlayer(player1);
        assert(room.isFull() === true, "The room must be full at this state");

        let failToAddPlayer = () => room.addPlayer(player2);
        expect(failToAddPlayer).to.throw(Error, "The room is full, cannot add a new player");
    });

    it("addPlayer, should throw a null argument error", () => {
        let roomCapacity = 1;
        let room = new Room(roomCapacity);
        let addNullArgumentPlayer = () => room.addPlayer(null);
        let addUndefinedPlayer = () => room.addPlayer(undefined);

        expect(addNullArgumentPlayer).to.throw(Error, "The player cannot be null");
        expect(addUndefinedPlayer).to.throw(Error, "The player cannot be null");
    });

    it("playerWithDuplicatedUsername, should display a duplicated username error", () => {
        let roomCapacity = 2;
        let room = new Room(roomCapacity);

        let fakeName = "fakename";
        let numberOfPlayers = 2;
        let player1 = new Player(fakeName, numberOfPlayers, fakeSocketId);
        let player2 = new Player(fakeName, numberOfPlayers, fakeSocketId);

        room.addPlayer(player1);
        let playerWithDuplicatedUsername = () => room.addPlayer(player2);

        expect(playerWithDuplicatedUsername).to.throw(Error, "The username already exist in this room");
    });

    it("usernameAlreadyExist, should display a duplicated username error", () => {
        let roomCapacity = 2;
        let room = new Room(roomCapacity);

        let fakeName = "fakename";
        let numberOfPlayers = 2;
        let player1 = new Player(fakeName, numberOfPlayers, fakeSocketId);
        let player2 = new Player(fakeName, numberOfPlayers, fakeSocketId);

        room.addPlayer(player1);

        assert(room.isUsernameAlreadyExist(player2.username) === true);
    });

    it("usernameAlreadyExist, should throw a null argument error", () => {
        let roomCapacity = 2;
        let room = new Room(roomCapacity);

        let fakeName = "fakename";
        let numberOfPlayers = 2;
        let player1 = new Player(fakeName, numberOfPlayers, fakeSocketId);

        room.addPlayer(player1);

        expect(() => room.isUsernameAlreadyExist(null)).to.throw(Error, "Argument error: the username cannot be null");
    });

    it("isFull, should be true", () => {

        let fakeName = "fakename";
        let numberOfPlayers = 2;
        let player1 = new Player(fakeName, numberOfPlayers, fakeSocketId);

        let roomCapacity = 2;
        let room = new Room(roomCapacity);
        room.addPlayer(player1);

        expect(room.isFull()).to.equals(false);
    });

    it("removePlayer, should remove with success", () => {

        let fakeName1 = "testname1";
        let fakeName2 = "testname2";
        let numberOfPlayers = 2;
        let player1 = new Player(fakeName1, numberOfPlayers, fakeSocketId);
        let player2 = new Player(fakeName2, numberOfPlayers, fakeSocketId);

        let roomCapacity = 2;
        let room = new Room(roomCapacity);
        room.addPlayer(player1);
        room.addPlayer(player2);

        let removedPlayer = room.removePlayer(player1);
        assert(removedPlayer.username === player1.username);
        assert(removedPlayer.numberOfPlayers === player1.numberOfPlayers);
        assert(room.players.count === 1, "The list of player should be empty");

        let secondPlayer = room.players.dequeue();
        assert(secondPlayer.username === player2.username);
        assert(secondPlayer.numberOfPlayers === player2.numberOfPlayers);

    });

    it("removePlayer, should throw a null argument error", () => {

        let fakeName = "testname1";
        let numberOfPlayers = 1;
        let player = new Player(fakeName, numberOfPlayers, fakeSocketId);

        let roomCapacity = 1;
        let room = new Room(roomCapacity);
        room.addPlayer(player);

        let mustFailFunction = () => room.removePlayer(null);
        expect(mustFailFunction).to.throw(Error, "Argument error: the player cannot be null");
    });
    it("set a new list of players in room", () => {
        let roomCapacity = 2;
        let fakeRoom = new Room(roomCapacity);
        let newPlayers = new QueueCollection<Player>();
        newPlayers.enqueue(new Player("rami", 2, "1234"));
        newPlayers.enqueue(new Player("mathieu", 2, "12345"));
        fakeRoom.players = newPlayers;
        expect(fakeRoom.players).to.be.equal(newPlayers);
    });
    it("get the letterbank handler correctly", () => {
        let roomCapacity = 2;
        let fakeRoom = new Room(roomCapacity);
        let fakeLetterBankHandler = new LetterBankHandler();
        expect(fakeRoom.letterBankHandler).to.be.deep.equals(fakeLetterBankHandler);
    });

    it("handle the letter bank to change a player's letters", () => {
        let roomCapacity = 2;
        let fakeRoom = new Room(roomCapacity);
        let fakeLettersToChange: Array<string>;
        let fakeLettersReceived: Array<string>;
        fakeLettersToChange = ['A', 'B', 'C'];
        fakeLettersReceived = fakeRoom.exchangeThePlayerLetters(fakeLettersToChange);
        expect(fakeLettersReceived).to.be.an.instanceOf(Array);
        expect(fakeLettersToChange.length).to.be.equal(fakeLettersReceived.length);
    });

    it("should return initial 7 letters to initialize the player easel", () => {
        let roomCapacity = 2;
        let room = new Room(roomCapacity);
        let initialLetters = room.getInitialsLetters();

        expect(initialLetters).to.be.an.instanceOf(Array);
        expect(initialLetters.length).to.be.equal(7);
    });
});
