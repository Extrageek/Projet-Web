import { Letter } from "./letter";
import { CommandsHelper } from "../services/commons/command/command-helper";

/**
 * Easel
 */
export class Easel {
    private _letters: Array<Letter>;

    constructor() {
        this._letters = new Array<Letter>();
    }

    public get letters(): Array<Letter> {
        return this._letters;
    }
    public set letters(v: Array<Letter>) {
        this._letters = v;
    }

    public containsLetter(letter: Letter): boolean {
        console.log("TAILLE EASEL ----", this.letters.length);

        this._letters.forEach((elem: Letter) => {
            console.log("lettre     ", elem.alphabetLetter);
        });
        let contains = this._letters.some((letterEasel: Letter) => {
            return letterEasel.alphabetLetter === letter.alphabetLetter;
        });
        console.log("--------- ", contains);
        return true;
    }

    public exchangeLetters(lettersToBeExchanged: Array<string>, newLettersStr: Array<string>): boolean {
        let indexOfLettersToChange = new Array<number>();

        let tempEaselLetters = new Array<string>();
        this._letters.forEach((letter) => {
            tempEaselLetters.push(letter.alphabetLetter);
        });

        for (let index = 0; index < lettersToBeExchanged.length; ++index) {
            if (lettersToBeExchanged[index] === CommandsHelper.BLANK_VALUE) {
                lettersToBeExchanged[index] = CommandsHelper.BLANK_WORD;
            }

            let letterIndex = tempEaselLetters.findIndex((letter: string) =>
                letter.toUpperCase() === lettersToBeExchanged[index].toUpperCase());

            if (letterIndex === -1 || letterIndex === undefined) {
                return false;
            }

            tempEaselLetters[letterIndex] = '-1';
            indexOfLettersToChange.push(letterIndex);
        }
        if (indexOfLettersToChange.length === lettersToBeExchanged.length) {
            for (let i = 0; i < indexOfLettersToChange.length; i++) {
                let indexEasel = indexOfLettersToChange[i];
                this._letters[indexEasel].alphabetLetter = newLettersStr[i];
            }
            return true;
        }
        return false;
    }
}
