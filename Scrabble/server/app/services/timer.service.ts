import { Observable } from "rxjs/Observable";

const ONE_SECOND = 1000;

export class TimerService {

    private _minutesMaxValue: number;
    public set minutesMaxValue(value: number) {
        this._minutesMaxValue = value;
    }
    public get minutesMaxValue(): number {
        return this._minutesMaxValue;
    }

    private _secondsMaxValue: number;
    public get secondsMaxValue(): number {
        return this._secondsMaxValue;
    }
    public set secondsMaxValue(v: number) {
        this._secondsMaxValue = v;
    }

    private _seconds: number;
    public get seconds(): number {
        return this._seconds;
    }

    private _minutes: number;
    public get minutes(): number {
        return this._minutes;
    }

    constructor(minuteMaxValue: number, secondMaxValue: number) {
        this._minutesMaxValue = minuteMaxValue;
        this._secondsMaxValue = secondMaxValue;
        this.initializeCounter();
    }

    public updateClock() {
        --this._seconds;
        if (this._seconds < 0) {
            --this._minutes;
            this._seconds = this._secondsMaxValue;
            if (this._minutes < 0) {
                this._minutes = this._minutesMaxValue;
            }
        }
    }

    public initializeCounter() {
        this._minutes = this._minutesMaxValue;
        this._seconds = this._secondsMaxValue;
    }

    public timer() {
        let observable = new Observable((observer: any) => {
            setInterval(() => {
                this.updateClock();
                let count = { minutes: this.minutes, seconds: this.seconds };
                observer.next(count);
            }, ONE_SECOND);

            return () => {
                this.initializeCounter();
            };
        });
        return observable;
    }

    public timerIsRunning(): boolean {
        return (this.minutes > 0 || this.seconds > 0);
    }
}
