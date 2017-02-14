import { Letter } from './letter';
import { Alphabet } from './alphabet';
import { AlphabetPoint } from '../../commons/alphabet-point';
import { AlphabetQuantity } from '../../commons/alphabet-quantity';

const INCREMENT_QUANTITY = 1;
const DECREMENT_QUANTITY = -1;

export class LetterBank {
    private _bank: Array<Letter>;
    private _numberOfLettersInBank: number;

    public get bank(): Array<Letter> {
        return this._bank;
    }

    public get numberOfLettersInBank(): number {
        return this._numberOfLettersInBank;
    }

    public set numberOfLettersInBank(numberOfLettersInBank: number) {
        this._numberOfLettersInBank = numberOfLettersInBank;
    }

    constructor() {
        this._bank = new Array<Letter>();
        this._numberOfLettersInBank = 102;
        this.initializeLetterBank();
    }

    private initializeLetterBank() {
        this._bank.push(new Letter(Alphabet.BLANK.toString(), AlphabetPoint.blank, AlphabetQuantity.blank));
        this._bank.push(new Letter(Alphabet.A.toString(), AlphabetPoint.letterA, AlphabetQuantity.letterA));
        this._bank.push(new Letter(Alphabet.B.toString(), AlphabetPoint.letterB, AlphabetQuantity.letterB));
        this._bank.push(new Letter(Alphabet.C.toString(), AlphabetPoint.letterC, AlphabetQuantity.letterC));
        this._bank.push(new Letter(Alphabet.D.toString(), AlphabetPoint.letterD, AlphabetQuantity.letterD));
        this._bank.push(new Letter(Alphabet.E.toString(), AlphabetPoint.letterE, AlphabetQuantity.letterE));
        this._bank.push(new Letter(Alphabet.F.toString(), AlphabetPoint.letterF, AlphabetQuantity.letterF));
        this._bank.push(new Letter(Alphabet.G.toString(), AlphabetPoint.letterG, AlphabetQuantity.letterG));
        this._bank.push(new Letter(Alphabet.H.toString(), AlphabetPoint.letterH, AlphabetQuantity.letterH));
        this._bank.push(new Letter(Alphabet.I.toString(), AlphabetPoint.letterI, AlphabetQuantity.letterI));
        this._bank.push(new Letter(Alphabet.J.toString(), AlphabetPoint.letterJ, AlphabetQuantity.letterJ));
        this._bank.push(new Letter(Alphabet.K.toString(), AlphabetPoint.letterK, AlphabetQuantity.letterK));
        this._bank.push(new Letter(Alphabet.L.toString(), AlphabetPoint.letterL, AlphabetQuantity.letterL));
        this._bank.push(new Letter(Alphabet.M.toString(), AlphabetPoint.letterM, AlphabetQuantity.letterM));
        this._bank.push(new Letter(Alphabet.N.toString(), AlphabetPoint.letterN, AlphabetQuantity.letterN));
        this._bank.push(new Letter(Alphabet.O.toString(), AlphabetPoint.letterO, AlphabetQuantity.letterO));
        this._bank.push(new Letter(Alphabet.P.toString(), AlphabetPoint.letterP, AlphabetQuantity.letterP));
        this._bank.push(new Letter(Alphabet.Q.toString(), AlphabetPoint.letterQ, AlphabetQuantity.letterQ));
        this._bank.push(new Letter(Alphabet.R.toString(), AlphabetPoint.letterR, AlphabetQuantity.letterR));
        this._bank.push(new Letter(Alphabet.S.toString(), AlphabetPoint.letterS, AlphabetQuantity.letterS));
        this._bank.push(new Letter(Alphabet.T.toString(), AlphabetPoint.letterT, AlphabetQuantity.letterT));
        this._bank.push(new Letter(Alphabet.U.toString(), AlphabetPoint.letterU, AlphabetQuantity.letterU));
        this._bank.push(new Letter(Alphabet.V.toString(), AlphabetPoint.letterV, AlphabetQuantity.letterV));
        this._bank.push(new Letter(Alphabet.W.toString(), AlphabetPoint.letterW, AlphabetQuantity.letterW));
        this._bank.push(new Letter(Alphabet.X.toString(), AlphabetPoint.letterX, AlphabetQuantity.letterX));
        this._bank.push(new Letter(Alphabet.Y.toString(), AlphabetPoint.letterY, AlphabetQuantity.letterY));
        this._bank.push(new Letter(Alphabet.Z.toString(), AlphabetPoint.letterZ, AlphabetQuantity.letterZ));
    }

    public letterIsAvailable(chosenLetter: Letter): boolean {
        let indexOfChosenLetter = this.findIndexOfChosenLetter(chosenLetter);
        return this.bank[indexOfChosenLetter].quantity > 0;
    }

    public getLetterFromBank(chosenLetter: Letter): Letter {
        let indexOfChosenLetter = this.findIndexOfChosenLetter(chosenLetter);
        this.modifyQuantityOfLetter(indexOfChosenLetter, DECREMENT_QUANTITY);
        return this.bank[indexOfChosenLetter];
    }

    public putLetterBackInBank(chosenLetter: Letter) {
        let indexOfChosenLetter = this.findIndexOfChosenLetter(chosenLetter);
        this.modifyQuantityOfLetter(indexOfChosenLetter, INCREMENT_QUANTITY);
    }

    private modifyQuantityOfLetter(indexOfChosenLetter: number, change: number) {
        this._bank[indexOfChosenLetter].quantity += change;
        this._numberOfLettersInBank += change;
    }

    private findIndexOfChosenLetter(chosenLetter: Letter): number {
        let indexOfChosenLetter: number;
        if (chosenLetter !== null) {
            indexOfChosenLetter = this.bank.findIndex(
                (letter) => letter.alphabetLetter === chosenLetter.alphabetLetter);
        }
        return indexOfChosenLetter;
    }
}
