import { expect, assert } from "chai";
import { Player } from "./Player";

const username = "Martin";

describe("Player", () => {

    it("should create a new player", () => {
        let numberOfPlayer = 2;
        let player = new Player(username, numberOfPlayer);

        expect(player).not.to.be.undefined;
        expect(player.username).to.equals(username);
        expect(player.numberOfPlayers).to.equals(numberOfPlayer);
    });

    it("should throw a null argument error", () => {
        let invalidNumberOfPlayerWithLowValue = -1;
        let invalidNumberOfPlayerWithHighValue = 5;

        assert.throw(() => new Player(null, 2), "Argument error: the username cannot be null");
        assert.throw(() => new Player(username, invalidNumberOfPlayerWithLowValue),
            "Argument error: the number of players must be between 1 and 4");

        assert.throw(() => new Player(username, invalidNumberOfPlayerWithHighValue),
            "Argument error: the number of players must be between 1 and 4");
    });
});
