import { Letter } from './letter';
import { Alphabet } from './alphabet';
import { AlphabetPoint } from './../commons/alphabet-point';
import { AlphabetQuantity } from './../commons/alphabet-quantity';

export class LetterBank {
    private _bank: Array<Letter>;

    public get bank(): Array<Letter> {
        return this._bank;
    }

    constructor() {
        this._bank = new Array<Letter>();
        this.initializeLetterBank();
    }

    private initializeLetterBank() {
        this._bank.push(new Letter(Alphabet.A, AlphabetPoint.letterA, AlphabetQuantity.letterA));
        this._bank.push(new Letter(Alphabet.B, AlphabetPoint.letterB, AlphabetQuantity.letterB));
        this._bank.push(new Letter(Alphabet.C, AlphabetPoint.letterC, AlphabetQuantity.letterC));
        this._bank.push(new Letter(Alphabet.D, AlphabetPoint.letterD, AlphabetQuantity.letterD));
        this._bank.push(new Letter(Alphabet.E, AlphabetPoint.letterE, AlphabetQuantity.letterE));
        this._bank.push(new Letter(Alphabet.F, AlphabetPoint.letterF, AlphabetQuantity.letterF));
        this._bank.push(new Letter(Alphabet.G, AlphabetPoint.letterG, AlphabetQuantity.letterG));
        this._bank.push(new Letter(Alphabet.H, AlphabetPoint.letterH, AlphabetQuantity.letterH));
        this._bank.push(new Letter(Alphabet.I, AlphabetPoint.letterI, AlphabetQuantity.letterI));
        this._bank.push(new Letter(Alphabet.J, AlphabetPoint.letterJ, AlphabetQuantity.letterJ));
        this._bank.push(new Letter(Alphabet.K, AlphabetPoint.letterK, AlphabetQuantity.letterK));
        this._bank.push(new Letter(Alphabet.L, AlphabetPoint.letterL, AlphabetQuantity.letterL));
        this._bank.push(new Letter(Alphabet.M, AlphabetPoint.letterM, AlphabetQuantity.letterM));
        this._bank.push(new Letter(Alphabet.N, AlphabetPoint.letterN, AlphabetQuantity.letterN));
        this._bank.push(new Letter(Alphabet.O, AlphabetPoint.letterO, AlphabetQuantity.letterO));
        this._bank.push(new Letter(Alphabet.P, AlphabetPoint.letterP, AlphabetQuantity.letterP));
        this._bank.push(new Letter(Alphabet.Q, AlphabetPoint.letterQ, AlphabetQuantity.letterQ));
        this._bank.push(new Letter(Alphabet.R, AlphabetPoint.letterR, AlphabetQuantity.letterR));
        this._bank.push(new Letter(Alphabet.S, AlphabetPoint.letterS, AlphabetQuantity.letterS));
        this._bank.push(new Letter(Alphabet.T, AlphabetPoint.letterT, AlphabetQuantity.letterT));
        this._bank.push(new Letter(Alphabet.U, AlphabetPoint.letterU, AlphabetQuantity.letterU));
        this._bank.push(new Letter(Alphabet.V, AlphabetPoint.letterV, AlphabetQuantity.letterV));
        this._bank.push(new Letter(Alphabet.W, AlphabetPoint.letterW, AlphabetQuantity.letterW));
        this._bank.push(new Letter(Alphabet.X, AlphabetPoint.letterX, AlphabetQuantity.letterX));
        this._bank.push(new Letter(Alphabet.Y, AlphabetPoint.letterY, AlphabetQuantity.letterY));
        this._bank.push(new Letter(Alphabet.Z, AlphabetPoint.letterZ, AlphabetQuantity.letterZ));
        this._bank.push(new Letter(Alphabet.BLANK, AlphabetPoint.blank, AlphabetQuantity.blank));
    }
}
