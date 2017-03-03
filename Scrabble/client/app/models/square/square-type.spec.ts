import { SquareType } from "./square-type";

import { expect } from "chai";

describe("SquareType", () => {
    it("should always return strings", () => {
        expect(SquareType.star).to.be.a('string');
        expect(SquareType.normal).to.be.a('string');
        expect(SquareType.doubleLetterCount).to.be.a('string');
        expect(SquareType.tripleLetterCount).to.be.a('string');
        expect(SquareType.doubleWordCount).to.be.a('string');
        expect(SquareType.tripleWordCount).to.be.a('string');
    });
});
