import { Letter } from "../../models/lettersBank/letter";
import { LetterBank } from "../../models/lettersBank/letterbank";

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

    public initializeEasel(): Array<string> {
        let newEasel = this.getLetterFromBank(FULL_EASEL);
        return this.parseFromListOfLetterToListOfString(newEasel);
    }

    public exchangeLetters(lettersToBeChanged: Array<string>): Array<string> {
        let newLetters = new Array<Letter>();
        if (lettersToBeChanged.length < this.bank.numberOfLettersInBank) {
            this.putLetterBackInBank(this.parseFromListOfStringToListOfLetter(lettersToBeChanged));
            newLetters = this.getLetterFromBank(lettersToBeChanged.length);
        }

        return this.parseFromListOfLetterToListOfString(newLetters);
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
            // console.log("final Number", randomNumber);
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
        let randomNumber = (Math.random() * (1 - Math.random()) / (1 - Math.random()));
        // console.log("randomNumber: ", randomNumber);
        let offset = MAX_LETTER_POSITION - MIN_LETTER_POSITION;
        return Math.floor((randomNumber * offset) % offset + MIN_LETTER_POSITION);
    }

    public parseFromListOfStringToListOfLetter(alphabets: Array<string>): Array<Letter> {

        if (alphabets === null) {
            throw new Error("Null argument error: the letters cannot be null");
        }

        let letters = new Array<Letter>();
        alphabets.forEach((element => {
            let letter = this._bank.bank.filter((alphaLetter) => alphaLetter.alphabetLetter === element)[0];
            letters.push(letter);
        }));

        return letters;
    }

    public parseFromListOfLetterToListOfString(letters: Array<Letter>): Array<string> {

        if (letters === null) {
            throw new Error("Null argument error, the parameter cannot be null");
        }

        let newList = new Array<string>();
        letters.forEach((letter) => {
            newList.push(letter.alphabetLetter);
        });
        return newList;
    }

    public getNumberOfLettersInBank(): number {
        let numberOfLetters = this.bank.numberOfLettersInBank;
        return this.bank.numberOfLettersInBank;
    }
}
