import { expect, assert } from "chai";
import { TimerService } from '../timer.service';

describe("TimerService", () => {
    let timerService: TimerService;
    let minute = 0;
    let second = 5;

    it("should create a new TimerService", () => {
        timerService = new TimerService(minute, second);
        expect(timerService).not.to.be.undefined;

        assert(timerService.minutes === minute);
        assert(timerService.seconds === second);
    });

    it("should set a new minute and second max value in the timer by using the constructor", () => {
        timerService = new TimerService(5, 3);

        assert(timerService.minutesMaxValue === 5);
        assert(timerService.secondsMaxValue === 3);
    });

    it("should set as maximum values 5:59 in the timer", () => {
        timerService = new TimerService(5, 3);
        timerService.minutesMaxValue = 5;
        timerService.secondsMaxValue = 59;

        assert(timerService.minutesMaxValue === 5);
        assert(timerService.secondsMaxValue === 59);
    });

    it("The timer should not be running", () => {
        timerService = new TimerService(0, 0);
        let isRunning = timerService.timerIsRunning();

        assert(isRunning === false);
    });

    it("The timer should be running", () => {
        timerService = new TimerService(5, 2);
        let isRunning = timerService.timerIsRunning();

        assert(isRunning === true);
    });

    it("should decrement one time the second in the clock", () => {
        let timerServiceLocal = new TimerService(5, 3);
        timerService.updateClock();

        assert(timerService.minutes === 5);
        assert(timerService.seconds === 2);
    });

    it("should decrement one time the minute in the clock", () => {
        let timerServiceLocal = new TimerService(5, 2);
        timerService.updateClock();
        timerService.updateClock();
        timerService.updateClock();

        assert(timerService.minutes === 4);
        assert(timerService.seconds === 2);
    });

    it("should reset the timer to it initials values after 0:00", () => {
        let timerServiceLocal = new TimerService(5, 59);

        for (let index = 0; index < 5; index++) {
            for (let i = 0; i <= 59; i++) {
                timerService.updateClock();
            }
        }

        assert(timerService.minutes === 4);
        assert(timerService.seconds === 59);
    });

    it("should reset the minutes to it's max value", () => {
        let timerServiceLocal = new TimerService(5, 59);

        for (let index = 0; index < 5; index++) {
            for (let i = 0; i <= 59; i++) {
                timerService.updateClock();
            }
        }

        assert(timerService.minutes === 4);
        assert(timerService.seconds === 59);
    });

});
