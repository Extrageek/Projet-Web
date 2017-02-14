import { Alphabet } from '../../models/lettersBank/alphabet';
import { AlphabetPoint } from '../../commons/alphabet-point';
import { AlphabetQuantity } from '../../commons/alphabet-quantity';
import { Letter } from '../../models/lettersBank/letter';
import { LetterBank } from '../../models/lettersBank/letterbank';
import { LetterBankHandler } from './letterbank-handler';

import { expect } from 'chai';

let _bankHandler: LetterBankHandler;

describe("BankLetterHandler should", () => {
    beforeEach(() => {
        _bankHandler = new LetterBankHandler();
    });

    it("construct a bank of letters correctly", () => {
        let bank = new LetterBank();
        expect(_bankHandler.bank).to.be.deep.equals(bank);
    });

    it("initialize an easel correctly", () => {
        let newEasel = _bankHandler.initializeEasel();
        expect(newEasel.length).to.be.equal(7);
        expect(_bankHandler.bank.numberOfLettersInBank).to.be.equal(95);
    });

    it("exchange letters correctly in case there are sufficiant letters in bank", () => {
        let newEasel = new Array<Letter>();
        let lettersToChange = new Array<Letter>();
        let previousQuantityOfLettersInBank = _bankHandler.bank.numberOfLettersInBank;
        lettersToChange.push(new Letter(Alphabet.BLANK.toString(), AlphabetPoint.blank, AlphabetQuantity.blank));
        lettersToChange.push(new Letter(Alphabet.A.toString(), AlphabetPoint.letterA, AlphabetQuantity.letterA));
        lettersToChange.push(new Letter(Alphabet.B.toString(), AlphabetPoint.letterB, AlphabetQuantity.letterB));
        lettersToChange.push(new Letter(Alphabet.C.toString(), AlphabetPoint.letterC, AlphabetQuantity.letterC));
        lettersToChange.push(new Letter(Alphabet.D.toString(), AlphabetPoint.letterD, AlphabetQuantity.letterD));
        lettersToChange.push(new Letter(Alphabet.E.toString(), AlphabetPoint.letterE, AlphabetQuantity.letterE));
        newEasel = _bankHandler.exchangeLetters(lettersToChange);
        expect(newEasel.length).to.be.equal(lettersToChange.length);
        expect(previousQuantityOfLettersInBank).to.be.equal(_bankHandler.bank.numberOfLettersInBank);
    });

    it("prevent player from exchanging letters in case there are not sufficiant letters in bank", () => {
        let newEasel = new Array<Letter>();
        let lettersToChange = new Array<Letter>();
        _bankHandler.bank.numberOfLettersInBank = 1;
        lettersToChange.push(new Letter(Alphabet.BLANK.toString(), AlphabetPoint.blank, AlphabetQuantity.blank));
        lettersToChange.push(new Letter(Alphabet.A.toString(), AlphabetPoint.letterA, AlphabetQuantity.letterA));
        lettersToChange.push(new Letter(Alphabet.B.toString(), AlphabetPoint.letterB, AlphabetQuantity.letterB));
        lettersToChange.push(new Letter(Alphabet.C.toString(), AlphabetPoint.letterC, AlphabetQuantity.letterC));
        newEasel = _bankHandler.exchangeLetters(lettersToChange);
        expect(newEasel.length).to.be.equal(0);
        expect(_bankHandler.bank.numberOfLettersInBank).to.be.equal(1);
    });

    it("refill a player's easel after when letters are missing", () => {
        let numberOfLetersPlaced = 3;
        let newEasel = new Array<Letter>();
        newEasel = _bankHandler.refillEasel(numberOfLetersPlaced);
        expect(newEasel.length).to.be.equal(numberOfLetersPlaced);
    });
});
