import { DictionnaryManager } from "../models/dictionnary-manager";
import { CommandsHelper } from "./commons/command/command-helper";
import { BoardHelper } from "./board/board-helper";
import { Board } from "../models/board/board";
import { SquareType } from "../models/square/square-type";
import { Square } from "../models/square/square";
import { IPlaceWordResponse } from "./commons/command/place-word-response.interface";

const WORD_7_LETTERS = 7;
const BONUS_DOUBLE = 2;
const BONUS_TRIPLE = 3;
const BONUS_WORD_7_LETTERS = 50;

export class VerificationService {
    private _score: number;

    public get score(): number {
        return this._score;
    }
    public set score(v: number) {
        this._score = v;
    }

    constructor() {
        this._score = 0;
    }

    public verifyWordsCreated(response: IPlaceWordResponse, board: Board): boolean {
        this._score = 0;
        let areValidWords = true;

        let wordOrientation = response._wordOrientation;

        let scoreWord = 0;


        if (wordOrientation === CommandsHelper.HORIZONTAL_ORIENTATION) {
            // verify the initial word
            areValidWords = this.verifyWordHorizontal(board, response);

        } else if (wordOrientation === CommandsHelper.VERTICAL_ORIENTATION) {
            // verify the initial word
            areValidWords = this.verifyWordVertical(board, response);
        }

        // verify every other words created with lastLettersAdded


        // BONUS +50 si les 7 lettres placees

        // pour chaque lettre ajoutee verifier
        // en haut
        // en bas
        // a gauche
        // a droite
        // si ca touche une lettre deja presente
        // si oui continuer dans ce sens
        // comptabiliser les points au fur et a mesure
        // ajouter la lettre au debut mot pour conserver le mot 
        // une fois la fin dans ce sens, repartir de la lettre de base et partir dans lautre sens
        // comptabiliser
        // ajouter lettre a la fin du mot
        // verifier le mot forme (2 lettres min) dans le dictionnaire
        // ajouter le mot forme si ok
        // ajouter le score
        return areValidWords;
    }

    public verifyWordHorizontal(board: Board, response: IPlaceWordResponse) {
        let rowIndex = BoardHelper.convertCharToIndex(response._squarePosition._row);
        let firstColumnIndex = response._squarePosition._column - 1;
        let indexLastLettersAdded = 0;
        let word = this.createStringFromArrayString(response._letters);
        let scoreWord = 0;
        let isWordDouble = false;
        let isWordTriple = false;

        for (let indexOffset = 0; indexOffset < word.length; indexOffset++) {
            let square = board.squares[rowIndex][firstColumnIndex + indexOffset];

            let isSquareNewLetter =
                board.lastLettersAdded[indexLastLettersAdded].column - 1 === firstColumnIndex + indexOffset
                && BoardHelper.convertCharToIndex(board.lastLettersAdded[indexLastLettersAdded].row)
                === rowIndex;

            scoreWord += this.calculateScoreLetterInSquare(square, isSquareNewLetter);

            if (isSquareNewLetter && square.type === SquareType.DOUBLE_WORD_COUNT) {
                isWordDouble = true;
            }
            else if (isSquareNewLetter && square.type === SquareType.TRIPLE_WORD_COUNT) {
                isWordTriple = true;
            }
        }
        scoreWord = this.applyBonusDoubleOrTripleWord(scoreWord, isWordDouble, isWordTriple);
        this._score += this.applyBonus7LettersWord(scoreWord, word);
        return DictionnaryManager.contains(word);
    }

    public verifyWordVertical(board: Board, response: IPlaceWordResponse) {
        let firstRowIndex = BoardHelper.convertCharToIndex(response._squarePosition._row);
        let columnIndex = response._squarePosition._column - 1;
        let indexLastLettersAdded = 0;
        let word = this.createStringFromArrayString(response._letters);
        let scoreWord = 0;
        let isWordDouble = false;
        let isWordTriple = false;

        for (let indexOffset = 0; indexOffset < word.length; indexOffset++) {
            let square = board.squares[firstRowIndex + indexOffset][columnIndex];

            let isSquareNewLetter =
                board.lastLettersAdded[indexLastLettersAdded].column - 1 === columnIndex
                && BoardHelper.convertCharToIndex(board.lastLettersAdded[indexLastLettersAdded].row)
                === firstRowIndex + indexOffset;

            scoreWord += this.calculateScoreLetterInSquare(square, isSquareNewLetter);

            if (isSquareNewLetter && square.type === SquareType.DOUBLE_WORD_COUNT) {
                isWordDouble = true;
            }
            else if (isSquareNewLetter && square.type === SquareType.TRIPLE_WORD_COUNT) {
                isWordTriple = true;
            }
        }
        scoreWord = this.applyBonusDoubleOrTripleWord(scoreWord, isWordDouble, isWordTriple);
        this._score += this.applyBonus7LettersWord(scoreWord, word);
        return DictionnaryManager.contains(word);
    }

    public discoverWordPartGoingUp(board: Board, square: Square){
        
    }

    public calculateScoreLetterInSquare(square: Square, isSquareNewLetter: boolean): number {
        if (isSquareNewLetter) {
            if (square.type === SquareType.DOUBLE_LETTER_COUNT) {
                return square.letter.point * BONUS_DOUBLE;
            }
            else if (square.type === SquareType.TRIPLE_LETTER_COUNT) {
                return square.letter.point * BONUS_TRIPLE;
            }
        }
        return square.letter.point;
    }

    public applyBonusDoubleOrTripleWord(score: number, isWordDouble: boolean, isWordTriple: boolean): number {
        if (isWordDouble) {
            return score * BONUS_DOUBLE;
        }
        else if (isWordTriple) {
            return score * BONUS_TRIPLE;
        }
        else {
            return score;
        }
    }

    public applyBonus7LettersWord(score: number, word: string): number {
        if (word.length === WORD_7_LETTERS) {
            return score + BONUS_WORD_7_LETTERS;
        }
        return score;
    }
    // comptabiliser
    // lettre * case
    // boolean pour mot double / triple
    // BONUS que pour les lettres ajoutees
    public createStringFromArrayString(letters: Array<string>): string {
        let word = "";
        letters.forEach((letter: string) => {
            word += letter.toUpperCase();
        });
        return word;
    }
}
