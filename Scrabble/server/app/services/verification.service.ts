import { DictionnaryManager } from "../models/dictionnary-manager";
import { CommandsHelper } from "./commons/command/command-helper";
import { BoardHelper } from "./board/board-helper";
import { Board } from "../models/board/board";
import { SquareType } from "../models/square/square-type";
import { Square } from "../models/square/square";
import { IPlaceWordResponse } from "./commons/command/place-word-response.interface";

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
        let areValidWords = true;
        let word = response._letters.toString();
        console.log("MOT FORME PAR LE JOUEUR ----------------- ", word);
        let wordOrientation = response._wordOrientation;
        let firstRowIndex = BoardHelper.convertCharToIndex(response._squarePosition._row);
        let firstColumnIndex = response._squarePosition._column - 1;

        if (wordOrientation === CommandsHelper.HORIZONTAL_ORIENTATION) {
            // verify the initial word
            let scoreWord = 0;
            let isWordDouble = false;
            let isWordTriple = false;
            for (let indexOffset = 0; indexOffset < word.length; indexOffset++) {
                let scoreLetter = 0;
                let square = board.squares[firstRowIndex][firstColumnIndex + indexOffset];

                scoreWord += scoreLetter;
            }

        } else if (wordOrientation === CommandsHelper.VERTICAL_ORIENTATION) {
            // verify the initial word
            for (let index = 0; index < word.length; index++) {

            }
        }


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

    public calculateScoreLetterInSquare(square: Square): number {
        if (square.type === SquareType.DOUBLE_LETTER_COUNT) {

        }
        else if (square.type === SquareType.TRIPLE_LETTER_COUNT) {

        }
        else {
            return square.letter.point;
        }
    }
    // comptabiliser
    // lettre * case
    // boolean pour mot double / triple
    // BONUS que pour les lettres ajoutees

}
