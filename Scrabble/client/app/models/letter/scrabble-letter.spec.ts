import { expect } from "chai";
import { ScrabbleLetter } from "./scrabble-letter";
import { Alphabet } from "./alphabet";

let _letter: ScrabbleLetter;

describe("ScrabbleLetter letter validation", () => {

    beforeEach(() => {
        _letter = new ScrabbleLetter(Alphabet.letterC);
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

    it("should contain the .jpg extension", () => {
        expect(_letter.imageSource).to.contain(".jpg");
    });

    it("should set letter correctly", () => {
        let fakeLeter: string;
        fakeLeter = Alphabet.letterK;
        _letter.letter = fakeLeter;
        expect(_letter.letter).to.be.equal(fakeLeter);
    });

    it("should set imageSource correctly with the chosen letter", () => {
        let fakeImageSource: string;
        fakeImageSource = Alphabet.letterD;
        _letter.imageSource = fakeImageSource;
        expect(_letter.imageSource).to.contains(fakeImageSource);
    });
});
