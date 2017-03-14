import { Alphabet } from "./alphabet";
import { AlphabetPoint } from "./commons/alphabet-point";
import { AlphabetQuantity } from "./commons/alphabet-quantity";
import { Letter } from "./letter";
import { LetterBank } from "./letterbank";

import { expect, assert } from "chai";

let _letterBank: LetterBank;

describe("LetterBank should", () => {
    beforeEach(() => {
        _letterBank = new LetterBank();
    });

    it("construct a bank of letters correctly", () => {
        expect(_letterBank.bank[4].alphabetLetter).to.be.equal(Alphabet.letterD);
        expect(_letterBank.bank[4].point).to.be.equal(AlphabetPoint.letterD);
        expect(_letterBank.bank[4].quantity).to.be.equal(AlphabetQuantity.letterD);
    });

    it("get the bank of letters correctly", () => {
        let _fakeBank = new Array<Letter>();
        _fakeBank.push(new Letter(Alphabet.blank, AlphabetPoint.blank, AlphabetQuantity.blank));
        _fakeBank.push(new Letter(Alphabet.letterA, AlphabetPoint.letterA, AlphabetQuantity.letterA));
        _fakeBank.push(new Letter(Alphabet.letterB, AlphabetPoint.letterB, AlphabetQuantity.letterB));
        _fakeBank.push(new Letter(Alphabet.letterC, AlphabetPoint.letterC, AlphabetQuantity.letterC));
        _fakeBank.push(new Letter(Alphabet.letterD, AlphabetPoint.letterD, AlphabetQuantity.letterD));
        _fakeBank.push(new Letter(Alphabet.letterE, AlphabetPoint.letterE, AlphabetQuantity.letterE));
        _fakeBank.push(new Letter(Alphabet.letterF, AlphabetPoint.letterF, AlphabetQuantity.letterF));
        _fakeBank.push(new Letter(Alphabet.letterG, AlphabetPoint.letterG, AlphabetQuantity.letterG));
        _fakeBank.push(new Letter(Alphabet.letterH, AlphabetPoint.letterH, AlphabetQuantity.letterH));
        _fakeBank.push(new Letter(Alphabet.letterI, AlphabetPoint.letterI, AlphabetQuantity.letterI));
        _fakeBank.push(new Letter(Alphabet.letterJ, AlphabetPoint.letterJ, AlphabetQuantity.letterJ));
        _fakeBank.push(new Letter(Alphabet.letterK, AlphabetPoint.letterK, AlphabetQuantity.letterK));
        _fakeBank.push(new Letter(Alphabet.letterL, AlphabetPoint.letterL, AlphabetQuantity.letterL));
        _fakeBank.push(new Letter(Alphabet.letterM, AlphabetPoint.letterM, AlphabetQuantity.letterM));
        _fakeBank.push(new Letter(Alphabet.letterN, AlphabetPoint.letterN, AlphabetQuantity.letterN));
        _fakeBank.push(new Letter(Alphabet.letterO, AlphabetPoint.letterO, AlphabetQuantity.letterO));
        _fakeBank.push(new Letter(Alphabet.letterP, AlphabetPoint.letterP, AlphabetQuantity.letterP));
        _fakeBank.push(new Letter(Alphabet.letterQ, AlphabetPoint.letterQ, AlphabetQuantity.letterQ));
        _fakeBank.push(new Letter(Alphabet.letterR, AlphabetPoint.letterR, AlphabetQuantity.letterR));
        _fakeBank.push(new Letter(Alphabet.letterS, AlphabetPoint.letterS, AlphabetQuantity.letterS));
        _fakeBank.push(new Letter(Alphabet.letterT, AlphabetPoint.letterT, AlphabetQuantity.letterT));
        _fakeBank.push(new Letter(Alphabet.letterU, AlphabetPoint.letterU, AlphabetQuantity.letterU));
        _fakeBank.push(new Letter(Alphabet.letterV, AlphabetPoint.letterV, AlphabetQuantity.letterV));
        _fakeBank.push(new Letter(Alphabet.letterW, AlphabetPoint.letterW, AlphabetQuantity.letterW));
        _fakeBank.push(new Letter(Alphabet.letterX, AlphabetPoint.letterX, AlphabetQuantity.letterX));
        _fakeBank.push(new Letter(Alphabet.letterY, AlphabetPoint.letterY, AlphabetQuantity.letterY));
        _fakeBank.push(new Letter(Alphabet.letterZ, AlphabetPoint.letterZ, AlphabetQuantity.letterZ));
        expect(_letterBank.bank).to.be.deep.equals(_fakeBank);
    });

    it("should not find a letter from the bank", () => {
        // Since the letter Y has 1 as a quantity, we cannot find 2 instances of a Letter in the bank
        // I found a bug 
        // The Letterbank try to exchange and send null letters, and decrement even if the quantity is 0.
        // This must be fixed to return the same letter in this case
        let letterY = new Letter(Alphabet.letterY, AlphabetPoint.letterY, AlphabetQuantity.letterY);

        let letterYFromBank1 = _letterBank.getLetterFromBank(letterY);
        assert(_letterBank.letterIsAvailable(null) === false);
    });
});
