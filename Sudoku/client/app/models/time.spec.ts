import { expect } from "chai";
import {Time} from "./time";

describe("Time class tests", () => {
    let time : Time;
    beforeEach(() => {
        time = new Time();
    });

    it("should return attribute seconds correctly", () => {
        expect(time.seconds).to.equal(0, "not equal to 0");
    });

    it("should return attribute minute correctly", () => {
        expect(time.minutes).to.equal(0, "not equal to 0");
    });

    it("should return attribute hours correctly", () => {
        expect(time.hours).to.equal(0, "not equal to 0");
    });

    it("should set attribute seconds correctly", () => {
        time.seconds = 55;
        expect(time.seconds).to.equal(55, "not equal to 55");
    });

    it("should set attribute minute correctly", () => {
        time.minutes = 55;
        expect(time.minutes).to.equal(55, "not equal to 55");
    });

    it("should set attribute hours correctly", () => {
        time.hours = 23;
        expect(time.hours).to.equal(23, "not equal to 23");
    });

    it("should reset attributes correctly", () => {
        time.hours = 23;
        time.resetTime();
        expect(time.seconds).to.equal(0, "not equal to 0");
        expect(time.minutes).to.equal(0, "not equal to 0");
        expect(time.hours).to.equal(0, "not equal to 0");
    });

    it("should correctly compare two times", () => {
        let timer1 = new Time();
        let timer2 = new Time();
        expect(timer1.compareTo(timer2)).to.equal(0,"not equal to 0");
        timer1.seconds = 5;
        expect(timer1.compareTo(timer2)).to.equal(1,"not equal to 0");
        timer2.seconds = 10;
        expect(timer1.compareTo(timer2)).to.equal(-1,"not equal to 0");

    });


});
