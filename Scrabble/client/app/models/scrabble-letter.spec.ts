import { expect } from "chai";
import { ScrabbleLetter } from "./scrabble-letter";
let letter : ScrabbleLetter;

describe("ScrabbleLetter letter validation", () => {

    beforeEach(() => {
        letter = new ScrabbleLetter();
    });

    it("should be an instance of ScrabbleLetter", () => {
        expect(letter).to.be.an.instanceof(ScrabbleLetter);
    });

    it("should be a string", () => {
        expect(letter.letter).to.be.a('string');
    });

    it("should should be a letter between A and Z", () => {
        expect(letter.letter.charCodeAt(0)).to.be.above(64).and.to.be.below(91);
    });

    it("should contain the .jpg extension", () => {
        expect(letter.imageSource).to.contain(".jpg");
    });


});


