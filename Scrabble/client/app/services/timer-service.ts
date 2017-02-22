import { Injectable } from "@angular/core";

@Injectable()
export class TimerService {

    private _seconds: number;
    public get seconds(): number {
        return this._seconds;
    }
    public set seconds(second: number) {
        this._seconds = second;
    }

    private _minutes: number;
    public get minutes(): number {
        return this._minutes;
    }
    public set minutes(minutes: number) {
        this._minutes = minutes;
    }

    constructor() {
        this.seconds = 0;
        this.minutes = 5;
    }

    public updateClock() {
        --this.seconds;
        if (this.seconds < 0) {
            --this.minutes;
            this.seconds = 59;
        }
    }

    public timerIsRunning(): boolean {
        return (this.minutes > 0 || this.seconds > 0);
    }
}
