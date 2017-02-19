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
        //TODO : Player turns should end
        if (this.minutes === 0 && this.seconds === 0) {
            this.seconds = 0;
            this.minutes = 0;
        }
    }
}

// import { Injectable } from "@angular/core";

// @Injectable()
// export class TimerService {

//     private _seconds: number;
//     private _minute: number;
//     private _hour: number;

//     constructor() {
//         this._seconds = 0;
//         this._minute = 0;
//         this._hour = 0;
//     }

//     public updateClock() {
//         ++this._seconds;
//         if (this._seconds === 60) {
//             ++this._minute;
//             this._seconds = 0;
//         }
//         else if (this._minute === 60) {
//             ++this._hour;
//             this._minute = 0;
//             this._seconds = 0;
//         }
//     }

//     get minute(): number {
//         return this._minute;
//     }
//     get hour(): number {
//         return this._hour;
//     }
//     get seconds(): number {
//         return this._seconds;
//     }
// }
