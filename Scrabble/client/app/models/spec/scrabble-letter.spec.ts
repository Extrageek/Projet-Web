import { expect } from "chai";

import { IScrabbleLetter } from "../scrabble-letter";
import { Alphabet } from "../commons//alphabet";

let _letter: IScrabbleLetter;

describe("ScrabbleLetter letter validation - ", () => {

    beforeEach(() => {
        _letter = {_alphabetLetter: Alphabet.LETTER_C, _imageSource: ""};
    });

    it("should be an instance of ScrabbleLetter", () => {
        expect(_letter).to.have.lengthOf(2);
        expect(_letter).to.have.property("_alphabetLetter").with.lengthOf(1);
        expect(_letter).to.have.property("_imageSource").with.lengthOf(1);
    });

    it("_alphabetLetter should be a string", () => {
        expect(_letter._alphabetLetter).to.be.a('string');
    });

    it("_alphabetLetter should be a letter between A and Z", () => {
        expect(_letter._alphabetLetter.charCodeAt(0)).to.be.above(64).and.to.be.below(91);
    });

    it("_alphabetLetter should set letter correctly", () => {
        let fakeLeter: string;
        fakeLeter = Alphabet.LETTER_K;
        _letter._alphabetLetter = fakeLeter;
        expect(_letter._alphabetLetter).to.be.equal(fakeLeter);
    });

    it("_imageSource should be a string", () => {
        expect(_letter._imageSource).to.be.a('string');
    });

    it("_imageSource should set path to image correctly", () => {
        let path = "imageA.jpeg";
        _letter._imageSource = path;
        expect(_letter._imageSource).to.be.equal(path);
    });
});
