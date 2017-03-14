import { Letter } from "./letter";
import { Alphabet } from "./alphabet";
import { AlphabetPoint } from "./commons/alphabet-point";
import { AlphabetQuantity } from "./commons/alphabet-quantity";

const INCREMENT_QUANTITY = 1;
const DECREMENT_QUANTITY = -1;

export class LetterBank {
    private _bank: Array<Letter>;
    public get bank(): Array<Letter> {
        return this._bank;
    }

    private _numberOfLettersInBank: number;
    public get numberOfLettersInBank(): number {
        return this._numberOfLettersInBank;
    }
    public set numberOfLettersInBank(numberOfLettersInBank: number) {
        this._numberOfLettersInBank = numberOfLettersInBank;
    }

    constructor() {
        this._bank = new Array<Letter>();
        this.numberOfLettersInBank = 102;
        this.initializeLetterBank();
    }

    private initializeLetterBank() {
        this._bank.push(new Letter(Alphabet.blank, AlphabetPoint.blank, AlphabetQuantity.blank));
        this._bank.push(new Letter(Alphabet.letterA, AlphabetPoint.letterA, AlphabetQuantity.letterA));
        this._bank.push(new Letter(Alphabet.letterB, AlphabetPoint.letterB, AlphabetQuantity.letterB));
        this._bank.push(new Letter(Alphabet.letterC, AlphabetPoint.letterC, AlphabetQuantity.letterC));
        this._bank.push(new Letter(Alphabet.letterD, AlphabetPoint.letterD, AlphabetQuantity.letterD));
        this._bank.push(new Letter(Alphabet.letterE, AlphabetPoint.letterE, AlphabetQuantity.letterE));
        this._bank.push(new Letter(Alphabet.letterF, AlphabetPoint.letterF, AlphabetQuantity.letterF));
        this._bank.push(new Letter(Alphabet.letterG, AlphabetPoint.letterG, AlphabetQuantity.letterG));
        this._bank.push(new Letter(Alphabet.letterH, AlphabetPoint.letterH, AlphabetQuantity.letterH));
        this._bank.push(new Letter(Alphabet.letterI, AlphabetPoint.letterI, AlphabetQuantity.letterI));
        this._bank.push(new Letter(Alphabet.letterJ, AlphabetPoint.letterJ, AlphabetQuantity.letterJ));
        this._bank.push(new Letter(Alphabet.letterK, AlphabetPoint.letterK, AlphabetQuantity.letterK));
        this._bank.push(new Letter(Alphabet.letterL, AlphabetPoint.letterL, AlphabetQuantity.letterL));
        this._bank.push(new Letter(Alphabet.letterM, AlphabetPoint.letterM, AlphabetQuantity.letterM));
        this._bank.push(new Letter(Alphabet.letterN, AlphabetPoint.letterN, AlphabetQuantity.letterN));
        this._bank.push(new Letter(Alphabet.letterO, AlphabetPoint.letterO, AlphabetQuantity.letterO));
        this._bank.push(new Letter(Alphabet.letterP, AlphabetPoint.letterP, AlphabetQuantity.letterP));
        this._bank.push(new Letter(Alphabet.letterQ, AlphabetPoint.letterQ, AlphabetQuantity.letterQ));
        this._bank.push(new Letter(Alphabet.letterR, AlphabetPoint.letterR, AlphabetQuantity.letterR));
        this._bank.push(new Letter(Alphabet.letterS, AlphabetPoint.letterS, AlphabetQuantity.letterS));
        this._bank.push(new Letter(Alphabet.letterT, AlphabetPoint.letterT, AlphabetQuantity.letterT));
        this._bank.push(new Letter(Alphabet.letterU, AlphabetPoint.letterU, AlphabetQuantity.letterU));
        this._bank.push(new Letter(Alphabet.letterV, AlphabetPoint.letterV, AlphabetQuantity.letterV));
        this._bank.push(new Letter(Alphabet.letterW, AlphabetPoint.letterW, AlphabetQuantity.letterW));
        this._bank.push(new Letter(Alphabet.letterX, AlphabetPoint.letterX, AlphabetQuantity.letterX));
        this._bank.push(new Letter(Alphabet.letterY, AlphabetPoint.letterY, AlphabetQuantity.letterY));
        this._bank.push(new Letter(Alphabet.letterZ, AlphabetPoint.letterZ, AlphabetQuantity.letterZ));
    }

    public letterIsAvailable(chosenLetter: Letter): boolean {
        let indexOfChosenLetter = this.findIndexOfChosenLetter(chosenLetter);
        return (indexOfChosenLetter !== null) ? this.bank[indexOfChosenLetter].quantity > 0 : false;
    }

    public getLetterFromBank(chosenLetter: Letter): Letter {
        // I found a bug 
        // The Letterbank try to exchange and send null letters, and decrement even if the quantity is 0.
        // This must be fixed to return the same letter in this case
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
        return (chosenLetter !== null) ?
            this.bank.findIndex((letter) => letter.alphabetLetter === chosenLetter.alphabetLetter) : null;
    }
}
