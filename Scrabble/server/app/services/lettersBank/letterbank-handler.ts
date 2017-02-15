import { Letter } from '../../models/lettersBank/letter';
import { LetterBank } from '../../models/lettersBank/letterbank';

const FULL_EASEL = 7;
const MIN_LETTER_POSITION = 0;
const MAX_LETTER_POSITION = 26;

export class LetterBankHandler {
    private _bank: LetterBank;

    public get bank(): LetterBank {
        return this._bank;
    }

    constructor() {
        this.createLetterBank();
    }

    private createLetterBank() {
        this._bank = new LetterBank();
    }

    public initializeEasel(): Array<Letter> {
        let newEasel = this.getLetterFromBank(FULL_EASEL);
        return newEasel;
    }

    public exchangeLetters(lettersToBeChanged: Array<Letter>): Array<Letter> {
        let newLetters = new Array<Letter>();
        if (lettersToBeChanged.length < this.bank.numberOfLettersInBank) {
            this.putLetterBackInBank(lettersToBeChanged);
            newLetters = this.getLetterFromBank(lettersToBeChanged.length);
        }
        return newLetters;
    }

    public refillEasel(numberOfLetters: number): Array<Letter> {
        let newLetters = new Array<Letter>();
        return newLetters = this.getLetterFromBank(numberOfLetters);
    }

    private getLetterFromBank(numberOfLetters: number): Array<Letter> {
        let newEasel = new Array<Letter>();
        let randomLetter: Letter;
        let randomNumber: number;
        let chosenLetter: Letter;

        for (let index = 0; index < numberOfLetters; index++) {
            randomNumber = this.getRandomLetter();
            randomLetter = this.bank.bank[randomNumber];
            if (this._bank.letterIsAvailable(randomLetter)) {
                chosenLetter = this.bank.getLetterFromBank(randomLetter);
                newEasel.push(chosenLetter);
            } else {
                index--;
            }
        }
        return newEasel;
    }

    private putLetterBackInBank(lettersToBeChanged: Array<Letter>) {
        for (let index = 0; index < lettersToBeChanged.length; index++) {
            this.bank.putLetterBackInBank(lettersToBeChanged[index]);
        }
    }

    private getRandomLetter(): number {
        let randomNumber = Math.floor((Math.random() / Math.random() / Math.random()));
        let offset = MAX_LETTER_POSITION - MIN_LETTER_POSITION;
        return (randomNumber % offset) + MIN_LETTER_POSITION;
    }

    public getLetterByAlphabet(alphabets: Array<string>): Array<Letter> {

        if (alphabets === null) {
            throw new Error("Null argument error: the letters cannot be null");
        }

        let letters = new Array<Letter>();
        alphabets.forEach((element => {
            let letter = this._bank.bank.filter((letter) => letter.alphabetLetter === element)[0];
            letters.push(letter);
        }))

        return letters;
    }
}
