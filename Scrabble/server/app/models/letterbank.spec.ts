import { Alphabet } from "./alphabet";
import { AlphabetPoint } from './../commons/alphabet-point';
import { AlphabetQuantity } from './../commons/alphabet-quantity';
import { Letter } from './letter';
import { LetterBank } from './letterbank';

import { expect } from "chai";

let _letterBank: LetterBank;

describe("LetterBank should", () => {
    beforeEach(() => {
        _letterBank = new LetterBank();
    });

    it("construct a bank of letters correctly", () => {
        expect(_letterBank.bank[3].alphabetLetter).to.be.equal(Alphabet.D);
        expect(_letterBank.bank[3].point).to.be.equal(AlphabetPoint.letterD);
        expect(_letterBank.bank[3].quantity).to.be.equal(AlphabetQuantity.letterD);
    });

    it("get the bank of letters correctly", () => {
        let _fakeBank = new Array<Letter>();
        _fakeBank.push(new Letter(Alphabet.A, AlphabetPoint.letterA, AlphabetQuantity.letterA));
        _fakeBank.push(new Letter(Alphabet.B, AlphabetPoint.letterB, AlphabetQuantity.letterB));
        _fakeBank.push(new Letter(Alphabet.C, AlphabetPoint.letterC, AlphabetQuantity.letterC));
        _fakeBank.push(new Letter(Alphabet.D, AlphabetPoint.letterD, AlphabetQuantity.letterD));
        _fakeBank.push(new Letter(Alphabet.E, AlphabetPoint.letterE, AlphabetQuantity.letterE));
        _fakeBank.push(new Letter(Alphabet.F, AlphabetPoint.letterF, AlphabetQuantity.letterF));
        _fakeBank.push(new Letter(Alphabet.G, AlphabetPoint.letterG, AlphabetQuantity.letterG));
        _fakeBank.push(new Letter(Alphabet.H, AlphabetPoint.letterH, AlphabetQuantity.letterH));
        _fakeBank.push(new Letter(Alphabet.I, AlphabetPoint.letterI, AlphabetQuantity.letterI));
        _fakeBank.push(new Letter(Alphabet.J, AlphabetPoint.letterJ, AlphabetQuantity.letterJ));
        _fakeBank.push(new Letter(Alphabet.K, AlphabetPoint.letterK, AlphabetQuantity.letterK));
        _fakeBank.push(new Letter(Alphabet.L, AlphabetPoint.letterL, AlphabetQuantity.letterL));
        _fakeBank.push(new Letter(Alphabet.M, AlphabetPoint.letterM, AlphabetQuantity.letterM));
        _fakeBank.push(new Letter(Alphabet.N, AlphabetPoint.letterN, AlphabetQuantity.letterN));
        _fakeBank.push(new Letter(Alphabet.O, AlphabetPoint.letterO, AlphabetQuantity.letterO));
        _fakeBank.push(new Letter(Alphabet.P, AlphabetPoint.letterP, AlphabetQuantity.letterP));
        _fakeBank.push(new Letter(Alphabet.Q, AlphabetPoint.letterQ, AlphabetQuantity.letterQ));
        _fakeBank.push(new Letter(Alphabet.R, AlphabetPoint.letterR, AlphabetQuantity.letterR));
        _fakeBank.push(new Letter(Alphabet.S, AlphabetPoint.letterS, AlphabetQuantity.letterS));
        _fakeBank.push(new Letter(Alphabet.T, AlphabetPoint.letterT, AlphabetQuantity.letterT));
        _fakeBank.push(new Letter(Alphabet.U, AlphabetPoint.letterU, AlphabetQuantity.letterU));
        _fakeBank.push(new Letter(Alphabet.V, AlphabetPoint.letterV, AlphabetQuantity.letterV));
        _fakeBank.push(new Letter(Alphabet.W, AlphabetPoint.letterW, AlphabetQuantity.letterW));
        _fakeBank.push(new Letter(Alphabet.X, AlphabetPoint.letterX, AlphabetQuantity.letterX));
        _fakeBank.push(new Letter(Alphabet.Y, AlphabetPoint.letterY, AlphabetQuantity.letterY));
        _fakeBank.push(new Letter(Alphabet.Z, AlphabetPoint.letterZ, AlphabetQuantity.letterZ));
        _fakeBank.push(new Letter(Alphabet.BLANK, AlphabetPoint.blank, AlphabetQuantity.blank));
        expect(_letterBank.bank).to.be.deep.equals(_fakeBank);
    });
});
