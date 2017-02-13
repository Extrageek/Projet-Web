import { expect, assert } from "chai";
import { Player } from "./Player";

let username = "Martin";
let fakeSocketId = "fakeId@33md401";

describe("Player", () => {

    it("should create a new player", () => {
        let numberOfPlayer = 2;
        let player = new Player(username, numberOfPlayer, fakeSocketId);

        expect(player).not.to.be.undefined;
        expect(player.username).to.equals(username);
        expect(player.numberOfPlayers).to.equals(numberOfPlayer);
    });

    it("should throw a null argument error", () => {
        let validNumberOfPlayer = 2;
        let invalidNumberOfPlayerWithLowValue = -1;
        let invalidNumberOfPlayerWithHighValue = 5;

        assert.throw(() => new Player(null, 2, fakeSocketId), "Argument error: The username cannot be null");
        assert.throw(() => new Player(username, invalidNumberOfPlayerWithLowValue, fakeSocketId),
            "Argument error: The number of players should be between 1 and 4");

        assert.throw(() => new Player(username, invalidNumberOfPlayerWithHighValue, fakeSocketId),
            "Argument error: The number of players should be between 1 and 4");

        assert.throw(() => new Player(username, validNumberOfPlayer, null),
            "Argument error: The socket id of the player cannot be null");
    });
});
