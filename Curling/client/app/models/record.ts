import { Injectable } from '@angular/core';
import { Difficulty } from './../services/user.service';

@Injectable()
export class Record {
    private _username: string;
    private _difficulty: Difficulty;
    private _scorePlayer: number;
    private _scoreComputer: number;
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
        return this._difficulty;
    }

    public set difficulty(difficulty: Difficulty) {
        this._difficulty = difficulty;
    }

    public get scorePlayer(): number {
        return this._scorePlayer;
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
