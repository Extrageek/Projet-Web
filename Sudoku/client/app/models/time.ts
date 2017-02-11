export class Time {
    private _hours: number;
    private _minutes: number;
    private _seconds: number;

    constructor() {
        this.resetTime();
    }

    get hours(): number {
        return this._hours;
    }

    set hours(value: number) {
        this._hours = value;
    }

    get minutes(): number {
        return this._minutes;
    }

    set minutes(value: number) {
        this._minutes = value;
    }

    get seconds(): number {
        return this._seconds;
    }

    set seconds(value: number) {
        this._seconds = value;
    }

    public resetTime(): void {
        this._hours = 0;
        this._minutes = 0;
        this._seconds = 0;
    }
}
