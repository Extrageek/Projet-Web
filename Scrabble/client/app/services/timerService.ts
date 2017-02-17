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

// import { Injectable } from "@angular/core";

// @Injectable()
// export class TimerService {

//     private _secondsUnits: number;
//     private _secondsDecimals: number;
//     private _minuteUnits: number;
//     private _minuteDecimals: number;
//     private _hourUnits: number;
//     private _hourDecimals: number;

//     constructor() {
//         this._secondsUnits = 0;
//         this._secondsDecimals = 0;
//         this._minuteUnits = 0;
//         this._minuteDecimals = 0;
//         this._hourUnits = 0;
//         this._hourDecimals = 0;
//     }

//     public updateClock() {
//         ++this.secondsUnits;
//         if (this.secondsUnits === 10) {
//             ++this.secondsDecimals;
//             this.secondsUnits = 0;
//         }
//         else if (this.secondsUnits === 10 && this.secondsDecimals === 5) {
//             ++this.minuteUnits;
//             this.secondsDecimals = 0;
//             this.secondsUnits = 0;
//         }
//         else if (this.minuteUnits === 10) {
//             ++this.minuteDecimals;
//             this.minuteUnits = 0;
//             this.secondsDecimals = 0;
//             this.secondsUnits = 0;
//         }
//         else if (this.minuteUnits === 10 && this.minuteDecimals === 5) {
//             ++this.hourUnits;
//             this.minuteDecimals = 0;
//             this.minuteUnits = 0;
//             this.secondsDecimals = 0;
//             this.secondsUnits = 0;
//         }
//         else if (this.hourUnits === 10) {
//             ++this.hourDecimals;
//             this.hourUnits = 0;
//             this.minuteDecimals = 0;
//             this.minuteUnits = 0;
//             this.secondsDecimals = 0;
//             this.secondsUnits = 0;
//         }
//     }

//     get secondsUnits(): number {
//         return this._secondsUnits;
//     }
//     get secondsDecimals(): number {
//         return this._secondsDecimals;
//     }
//     get minuteUnits(): number {
//         return this._minuteUnits;
//     }
//     get minuteDecimals(): number {
//         return this._minuteDecimals;
//     }

//     get hourUnits(): number {
//         return this._hourUnits;
//     }

//     get hourDecimals(): number {
//         return this._hourDecimals;
//     }

//     set secondsUnits(_secondsUnits: number) {
//         this.secondsUnits = _secondsUnits;
//     }
//     set secondsDecimals(_secondsDecimals: number) {
//         this.secondsDecimals = _secondsDecimals;
//     }
//     set minuteUnits(_minuteUnits: number) {
//         this.minuteUnits = _minuteUnits;
//     }
//     set minuteDecimals(_minuteDecimals: number) {
//         this.minuteDecimals = _minuteDecimals;
//     }

//     set hourUnits(_hourUnits: number) {
//         this.hourUnits = _hourUnits;
//     }

//     set hourDecimals(_hourDecimals: number) {
//         this.hourDecimals = _hourDecimals;
//     }
// }
