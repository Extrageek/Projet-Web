import { Difficulty } from './user-setting';

/**
 * name
 */
export class Record {
    private _username: string = '';
    private _difficulty: Difficulty;
    private _scorePlayer: number = 0;
    private _scoreComputer: number = 0;
    private _date: Date;

    constructor(username: string, difficulty: Difficulty, scorePlayer: number, scoreComputer: number, date?: Date) {
        this._username = username;
        this._difficulty = difficulty;
        this._scorePlayer = scorePlayer;
        this._scoreComputer = scoreComputer;
        this._date = new Date();
    }

    public get username(): string {
        return this._username;
    }

    public set username(username: string) {
        this._username = username;
    }

    public get difficulty(): Difficulty {
        return this.difficulty;
    }

    public set difficulty(difficulty: Difficulty) {
        this.difficulty = difficulty;
    }

    public get scorePlayer(): number {
        return this.difficulty;
    }

    public set scorePlayer(scorePlayer: number) {
        this._scorePlayer = scorePlayer;
    }

    public get scoreComputer(): number {
        return this._scoreComputer;
    }

    public set scoreComputer(scoreComputer: number) {
        this._scoreComputer = scoreComputer;
    }
}