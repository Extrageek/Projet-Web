import { expect } from "chai";
import { TimerService } from "./timer-service";

let service : TimerService;
const FIVE_MINUTES = 300;
const ONE_MINUTE = 60;
describe("TimerService properties validation", () => {

    beforeEach(() => {
        service = new TimerService();
    });

    it("Timer attributes should be initialized correctly", () => {
        expect(service.seconds).to.be.equal(0);
        expect(service.minutes).to.be.equal(5);
    });


    it("Timer attributes should be correct after 60 ticks", done => {
        for (let i = 0; i < ONE_MINUTE; ++i ) {
            service.updateClock();
        }
        expect(service.seconds).to.be.equal(0);
        expect(service.minutes).to.be.equal(4);

        service.updateClock();

        expect(service.seconds).to.be.equal(59);
        expect(service.minutes).to.be.equal(3);
        done();
    });

    it("Timer attributes should be set to 0 after 300 ticks", done => {
        for (let i = 0; i < FIVE_MINUTES; ++i ) {
            service.updateClock();
        }
        expect(service.seconds).to.be.equal(0);
        expect(service.minutes).to.be.equal(0);
        done();
    });
});

