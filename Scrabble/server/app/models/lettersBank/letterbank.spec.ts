import { Alphabet } from "./alphabet";
import { AlphabetPoint } from '../../commons/alphabet-point';
import { AlphabetQuantity } from '../../commons/alphabet-quantity';
import { Letter } from './letter';
import { LetterBank } from './letterbank';

import { expect } from "chai";

let _letterBank: LetterBank;

describe("LetterBank should", () => {
    beforeEach(() => {
        _letterBank = new LetterBank();
    });

    it("construct a bank of letters correctly", () => {
        expect(_letterBank.bank[4].alphabetLetter).to.be.equal(Alphabet.D.toString());
        expect(_letterBank.bank[4].point).to.be.equal(AlphabetPoint.letterD);
        expect(_letterBank.bank[4].quantity).to.be.equal(AlphabetQuantity.letterD);
    });

    it("get the bank of letters correctly", () => {
        let _fakeBank = new Array<Letter>();
        _fakeBank.push(new Letter(Alphabet.BLANK.toString(), AlphabetPoint.blank, AlphabetQuantity.blank));
        _fakeBank.push(new Letter(Alphabet.A.toString(), AlphabetPoint.letterA, AlphabetQuantity.letterA));
        _fakeBank.push(new Letter(Alphabet.B.toString(), AlphabetPoint.letterB, AlphabetQuantity.letterB));
        _fakeBank.push(new Letter(Alphabet.C.toString(), AlphabetPoint.letterC, AlphabetQuantity.letterC));
        _fakeBank.push(new Letter(Alphabet.D.toString(), AlphabetPoint.letterD, AlphabetQuantity.letterD));
        _fakeBank.push(new Letter(Alphabet.E.toString(), AlphabetPoint.letterE, AlphabetQuantity.letterE));
        _fakeBank.push(new Letter(Alphabet.F.toString(), AlphabetPoint.letterF, AlphabetQuantity.letterF));
        _fakeBank.push(new Letter(Alphabet.G.toString(), AlphabetPoint.letterG, AlphabetQuantity.letterG));
        _fakeBank.push(new Letter(Alphabet.H.toString(), AlphabetPoint.letterH, AlphabetQuantity.letterH));
        _fakeBank.push(new Letter(Alphabet.I.toString(), AlphabetPoint.letterI, AlphabetQuantity.letterI));
        _fakeBank.push(new Letter(Alphabet.J.toString(), AlphabetPoint.letterJ, AlphabetQuantity.letterJ));
        _fakeBank.push(new Letter(Alphabet.K.toString(), AlphabetPoint.letterK, AlphabetQuantity.letterK));
        _fakeBank.push(new Letter(Alphabet.L.toString(), AlphabetPoint.letterL, AlphabetQuantity.letterL));
        _fakeBank.push(new Letter(Alphabet.M.toString(), AlphabetPoint.letterM, AlphabetQuantity.letterM));
        _fakeBank.push(new Letter(Alphabet.N.toString(), AlphabetPoint.letterN, AlphabetQuantity.letterN));
        _fakeBank.push(new Letter(Alphabet.O.toString(), AlphabetPoint.letterO, AlphabetQuantity.letterO));
        _fakeBank.push(new Letter(Alphabet.P.toString(), AlphabetPoint.letterP, AlphabetQuantity.letterP));
        _fakeBank.push(new Letter(Alphabet.Q.toString(), AlphabetPoint.letterQ, AlphabetQuantity.letterQ));
        _fakeBank.push(new Letter(Alphabet.R.toString(), AlphabetPoint.letterR, AlphabetQuantity.letterR));
        _fakeBank.push(new Letter(Alphabet.S.toString(), AlphabetPoint.letterS, AlphabetQuantity.letterS));
        _fakeBank.push(new Letter(Alphabet.T.toString(), AlphabetPoint.letterT, AlphabetQuantity.letterT));
        _fakeBank.push(new Letter(Alphabet.U.toString(), AlphabetPoint.letterU, AlphabetQuantity.letterU));
        _fakeBank.push(new Letter(Alphabet.V.toString(), AlphabetPoint.letterV, AlphabetQuantity.letterV));
        _fakeBank.push(new Letter(Alphabet.W.toString(), AlphabetPoint.letterW, AlphabetQuantity.letterW));
        _fakeBank.push(new Letter(Alphabet.X.toString(), AlphabetPoint.letterX, AlphabetQuantity.letterX));
        _fakeBank.push(new Letter(Alphabet.Y.toString(), AlphabetPoint.letterY, AlphabetQuantity.letterY));
        _fakeBank.push(new Letter(Alphabet.Z.toString(), AlphabetPoint.letterZ, AlphabetQuantity.letterZ));
        expect(_letterBank.bank).to.be.deep.equals(_fakeBank);
    });
});
