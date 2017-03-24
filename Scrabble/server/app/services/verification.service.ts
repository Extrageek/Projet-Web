import { DictionnaryManager } from "../models/dictionnary-manager";
import { CommandsHelper } from "./commons/command/command-helper";
import { BoardHelper } from "./board/board-helper";
import { Board } from "../models/board/board";
import { SquareType } from "../models/square/square-type";
import { SquarePosition } from "../models/square/square-position";
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

        let firstRowIndex = BoardHelper.convertCharToIndex(response._squarePosition._row);
        let firstColumnIndex = response._squarePosition._column - 1;
        let initialWord = this.createStringFromArrayString(response._letters);
        let scoreWord = 0;


        if (wordOrientation === CommandsHelper.HORIZONTAL_ORIENTATION) {
            // verify the initial word
            areValidWords = this.verifyWordHorizontal(board, firstRowIndex, firstColumnIndex, initialWord);
            console.log("IS VALID WORD INITIAL --- ", areValidWords);

            console.log("LAST LETTERS ADDED  ------- ", board.lastLettersAdded);
            board.lastLettersAdded.forEach((squarePosition: SquarePosition) => {
                let word = "";
                let rowIndex = BoardHelper.convertCharToIndex(squarePosition.row);
                let columnIndex = squarePosition.column - 1;
                let square = board.squares[rowIndex][columnIndex];
                let topPartOfWord = this.discoverTopPartOfWord(board, square);
                console.log("TOP PART WORD = ", topPartOfWord);
                let downPartOfWord = this.discoverDownPartOfWord(board, square);
                console.log("DOWN PART WORD = ", downPartOfWord);
                word = topPartOfWord + square.letter.alphabetLetter + downPartOfWord;
                rowIndex -= topPartOfWord.length;
                areValidWords = areValidWords
                    && this.verifyWordVertical(board, rowIndex, columnIndex, word.toUpperCase());
                console.log("ARE VALID WORD --- ", areValidWords);
            });

        } else if (wordOrientation === CommandsHelper.VERTICAL_ORIENTATION) {
            // verify the initial word
            areValidWords = this.verifyWordVertical(board, firstRowIndex, firstColumnIndex, initialWord);
            console.log("IS VALID WORD INITIAL --- ", areValidWords);
            console.log("LAST LETTERS ADDED LENGTH ------- ", board.lastLettersAdded.length);

            board.lastLettersAdded.forEach((squarePosition: SquarePosition) => {
                let word = "";
                let rowIndex = BoardHelper.convertCharToIndex(squarePosition.row);
                let columnIndex = squarePosition.column - 1;
                let square = board.squares[rowIndex][columnIndex];
                let leftPartOfWord = this.discoverLeftPartOfWord(board, square);

                console.log("LEFT PART WORD = ", leftPartOfWord);
                let rightPartOfWord = this.discoverRightPartOfWord(board, square);
                console.log("RIGHT PART WORD = ", rightPartOfWord);
                word = leftPartOfWord + square.letter.alphabetLetter + rightPartOfWord;
                columnIndex -= leftPartOfWord.length;
                areValidWords = areValidWords
                    && this.verifyWordHorizontal(board, rowIndex, columnIndex, word.toUpperCase());
                console.log("aRE VALID WORD  --- ", areValidWords);
                console.log("\n\n\n");

            });
        }
        return areValidWords;
    }

    public verifyWordHorizontal(board: Board, rowIndex: number, firstColumnIndex: number, word: string): boolean {
        let indexLastLettersAdded = 0;
        let scoreWord = 0;
        let isWordDouble = false;
        let isWordTriple = false;

        for (let indexOffset = 0; indexOffset < word.length; indexOffset++) {
            let square = board.squares[rowIndex][firstColumnIndex + indexOffset];

            let isSquareNewLetter =
                board.lastLettersAdded[indexLastLettersAdded].column - 1 === firstColumnIndex + indexOffset
                && BoardHelper.convertCharToIndex(board.lastLettersAdded[indexLastLettersAdded].row)
                === rowIndex;

            console.log("SCORE DU MOT -- ", scoreWord);
            scoreWord += this.calculateScoreLetterInSquare(square, isSquareNewLetter);

            if (isSquareNewLetter && square.type === SquareType.DOUBLE_WORD_COUNT) {
                isWordDouble = true;
            }
            else if (isSquareNewLetter && square.type === SquareType.TRIPLE_WORD_COUNT) {
                isWordTriple = true;
            }
        }

        console.log("SCORE DU MOT -- ", scoreWord);
        scoreWord = this.applyBonusDoubleOrTripleWord(scoreWord, isWordDouble, isWordTriple);
        console.log("SCORE DU MOT -- ", scoreWord);
        scoreWord = this.applyBonus7LettersWord(scoreWord, word);
        return this.verifyIfWordExistAndSetScore(word, scoreWord);
    }

    public verifyWordVertical(board: Board, firstRowIndex: number, columnIndex: number, word: string): boolean {
        let indexLastLettersAdded = 0;
        let scoreWord = 0;
        let isWordDouble = false;
        let isWordTriple = false;

        for (let indexOffset = 0; indexOffset < word.length; indexOffset++) {
            let square = board.squares[firstRowIndex + indexOffset][columnIndex];

            let isSquareNewLetter =
                board.lastLettersAdded[indexLastLettersAdded].column - 1 === columnIndex
                && BoardHelper.convertCharToIndex(board.lastLettersAdded[indexLastLettersAdded].row)
                === firstRowIndex + indexOffset;
            console.log("SCORE DU MOT avant letter add -- ", scoreWord);

            scoreWord += this.calculateScoreLetterInSquare(square, isSquareNewLetter);

            if (isSquareNewLetter && square.type === SquareType.DOUBLE_WORD_COUNT) {
                isWordDouble = true;
            }
            else if (isSquareNewLetter && square.type === SquareType.TRIPLE_WORD_COUNT) {
                isWordTriple = true;
            }
        }
        console.log("SCORE DU MOT avant bonus -- ", scoreWord);
        scoreWord = this.applyBonusDoubleOrTripleWord(scoreWord, isWordDouble, isWordTriple);
        console.log("SCORE DU MOT avant big bonus-- ", scoreWord);
        scoreWord = this.applyBonus7LettersWord(scoreWord, word);
        return this.verifyIfWordExistAndSetScore(word, scoreWord);
    }

    public verifyIfWordExistAndSetScore(word: string, score: number): boolean {
        console.log("WORD TO VERIFY  -- ", word);

        if (word.length >= 2) {
            if (!DictionnaryManager.contains(word)) {
                return false;
            }
            else {
                console.log("---------------score to be added =", score);
                this._score += score;
                console.log("---------------score after =", this._score);
                return true;
            }
        }
        return true;
    }

    public discoverTopPartOfWord(board: Board, square: Square): string {
        let topPartOfWord = "";
        let nextRowIndex = BoardHelper.convertCharToIndex(square.position.row);
        let columnIndex = square.position.column - 1;
        let touchedTopSquare = true;
        while (touchedTopSquare) {
            touchedTopSquare = (BoardHelper.isValidRowPosition(--nextRowIndex)) ?
                board.squares[nextRowIndex][columnIndex].isBusy : false;
            if (touchedTopSquare) {
                topPartOfWord = board.squares[nextRowIndex][columnIndex].letter.alphabetLetter + topPartOfWord;
            }
        }
        return topPartOfWord;
    }

    public discoverDownPartOfWord(board: Board, square: Square): string {
        let downPartOfWord = "";
        let nextRowIndex = BoardHelper.convertCharToIndex(square.position.row);
        let columnIndex = square.position.column - 1;
        let touchedDownSquare = true;
        while (touchedDownSquare) {
            touchedDownSquare = (BoardHelper.isValidRowPosition(++nextRowIndex)) ?
                board.squares[nextRowIndex][columnIndex].isBusy : false;
            if (touchedDownSquare) {
                downPartOfWord = downPartOfWord + board.squares[nextRowIndex][columnIndex].letter.alphabetLetter;
            }
        }
        return downPartOfWord;
    }

    public discoverLeftPartOfWord(board: Board, square: Square): string {
        let leftPartOfWord = "";
        let rowIndex = BoardHelper.convertCharToIndex(square.position.row);
        let nextColumnIndex = square.position.column - 1;
        let touchedLeftSquare = true;
        while (touchedLeftSquare) {
            touchedLeftSquare = (BoardHelper.isValidColumnPosition(--nextColumnIndex)) ?
                board.squares[rowIndex][nextColumnIndex].isBusy : false;
            if (touchedLeftSquare) {
                leftPartOfWord = board.squares[rowIndex][nextColumnIndex].letter.alphabetLetter + leftPartOfWord;
            }
        }
        return leftPartOfWord;
    }

    public discoverRightPartOfWord(board: Board, square: Square): string {
        let rightPartOfWord = "";
        let rowIndex = BoardHelper.convertCharToIndex(square.position.row);
        let nextColumnIndex = square.position.column - 1;
        let touchedLeftSquare = true;
        while (touchedLeftSquare) {
            touchedLeftSquare = (BoardHelper.isValidColumnPosition(++nextColumnIndex)) ?
                board.squares[rowIndex][nextColumnIndex].isBusy : false;
            if (touchedLeftSquare) {
                rightPartOfWord = rightPartOfWord + board.squares[rowIndex][nextColumnIndex].letter.alphabetLetter;
            }
        }
        return rightPartOfWord;
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
