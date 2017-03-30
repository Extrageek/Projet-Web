import { expect, assert } from "chai";
import { VerificationService } from '../verification.service';
import { Board } from '../../models/board/board';
import { DictionnaryManager } from "../../models/dictionnary-manager";
import { CommandsHelper } from "../commons/command/command-helper";
import { BoardHelper } from "../board/board-helper";
import { SquareType } from "../../models/square/square-type";
import { SquarePosition } from "../../models/square/square-position";
import { Square } from "../../models/square/square";
import { Letter } from "../../models/letter";
import { IPlaceWordResponse } from "../commons/command/place-word-response.interface";

describe("VerificationService ", () => {
    let verificationService: VerificationService;
    let board = new Board();
    let score = 17;

    const WORD_7_LETTERS = 7;
    const BONUS_DOUBLE = 2;
    const BONUS_TRIPLE = 3;
    const BONUS_WORD_7_LETTERS = 50;

    it("should create a new VerificationService", () => {
        expect(verificationService).to.be.undefined;
        verificationService = new VerificationService();
        expect(verificationService).to.not.be.undefined;
        expect(verificationService.score).to.equals(0);
    });

    it("should get and set score", () => {
        expect(verificationService.score).to.equals(0);
        verificationService.score = score;
        expect(verificationService.score).to.equals(score);
    });

    it("should create a string from an array of string", () => {
        let arrayStr = ["S", "C", "R", "A", "B", "B", "L", "E"];
        let word = verificationService.createStringFromArrayString(arrayStr);
        expect(word).to.be.length(arrayStr.length);
        expect(word).to.be.equals("SCRABBLE");
    });

    it("should apply a bonus when a seven letters word is placed", () => {
        let word = "letters";
        let newScore = verificationService.applyBonus7LettersWord(score, word);
        expect(newScore).to.be.equals(score + BONUS_WORD_7_LETTERS);
    });

    it("should not apply a bonus when a word with less than 7 letters is placed", () => {
        let word = "word";
        let newScore = verificationService.applyBonus7LettersWord(score, word);
        expect(newScore).to.be.equals(score);
    });

    it("should double the word score when it's a double bonus", () => {
        let newScore = verificationService.applyBonusDoubleOrTripleWord(score, true, false);
        expect(newScore).to.be.equals(score * BONUS_DOUBLE);
    });

    it("should triple the word score when it's a triple bonus", () => {
        let newScore = verificationService.applyBonusDoubleOrTripleWord(score, false, true);
        expect(newScore).to.be.equals(score * BONUS_TRIPLE);
    });

    it("should not increase the word score when there is no bonus", () => {
        let newScore = verificationService.applyBonusDoubleOrTripleWord(score, false, false);
        expect(newScore).to.be.equals(score);
    });

    it("should double the letter score when it's a on double letter bonus", () => {
        let letter = new Letter("A", 1, 0);
        board.squares[6][6].letter = letter;
        let newScore = verificationService.calculateScoreLetterInSquare(board.squares[6][6], true);
        expect(newScore).to.be.equals(letter.point * BONUS_DOUBLE);
    });

    it("should triple the letter score when it's a on triple letter bonus", () => {
        let letter = new Letter("A", 1, 0);
        board.squares[5][5].letter = letter;
        let newScore = verificationService.calculateScoreLetterInSquare(board.squares[5][5], true);
        expect(newScore).to.be.equals(letter.point * BONUS_TRIPLE);
    });

    it("should not increase the letter score when there is no bonus", () => {
        let letter = new Letter("A", 1, 0);
        board.squares[7][7].letter = letter;
        let newScore = verificationService.calculateScoreLetterInSquare(board.squares[7][7], true);
        expect(newScore).to.be.equals(letter.point);
    });

    it("should not increase the letter score when the letter on the square has been previsouly placer", () => {
        let letter = new Letter("A", 1, 0);
        board.squares[5][5].letter = letter;
        let newScore = verificationService.calculateScoreLetterInSquare(board.squares[5][5], false);
        expect(newScore).to.be.equals(letter.point);

    });
});
