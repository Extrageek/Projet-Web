import { expect } from "chai";
import { IScrabbleLetter } from "./scrabble-letter";
import { Alphabet } from "./alphabet";

let _letter: IScrabbleLetter;

describe("ScrabbleLetter letter validation", () => {

    beforeEach(() => {
        _letter = new ScrabbleLetter(Alphabet.LETTER_C);
    });

    it("should be an instance of ScrabbleLetter", () => {
        expect(_letter).to.be.an.instanceof(ScrabbleLetter);
    });

    it("should be a string", () => {
        expect(_letter.letter).to.be.a('string');
    });

    it("should be a letter between A and Z", () => {
        expect(_letter.letter.charCodeAt(0)).to.be.above(64).and.to.be.below(91);
    });

    it("should set letter correctly", () => {
        let fakeLeter: string;
        fakeLeter = Alphabet.LETTER_K;
        _letter.letter = fakeLeter;
        expect(_letter.letter).to.be.equal(fakeLeter);
    });
});
