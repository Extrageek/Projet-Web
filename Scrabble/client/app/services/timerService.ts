import { Injectable } from "@angular/core";

@Injectable()
export class TimerService {

    private _seconds: number;
    private _minute: number;
    private _hour: number;

    constructor() {
        this._seconds = 0;
        this._minute = 0;
        this._hour = 0;
    }

    public updateClock() {
        ++this._seconds;
        if (this._seconds === 60) {
            ++this._minute;
            this._seconds = 0;
        }
        else if (this._minute === 60) {
            ++this._hour;
            this._minute = 0;
            this._seconds = 0;
        }
    }

    get minute(): number {
        return this._minute;
    }
    get hour(): number {
        return this._hour;
    }
    get seconds(): number {
        return this._seconds;
    }
}
