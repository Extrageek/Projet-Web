import { expect } from "chai";
import { TimerService } from "./timerService";

let service : TimerService;
const ONE_HOUR = 3600;
const ONE_MINUTE = 60;
const SEVEN_MINUTES = 420;
describe("TimerService properties validation", () => {

    beforeEach(() => {
        service = new TimerService();
    });

    it("Timer attributes should all be initialized at 0", () => {
        expect(service.seconds).to.be.equal(0);
        expect(service.minute).to.be.equal(0);
        expect(service.hour).to.be.equal(0);
    });


    it("Timer attributes should be correct after 60 ticks", done => {
        for (let i = 0; i < ONE_MINUTE; ++i ) {
            service.updateClock();
        }
        expect(service.seconds).to.be.equal(0);
        expect(service.minute).to.be.equal(1);
        expect(service.hour).to.be.equal(0);

        service.updateClock();

        expect(service.seconds).to.be.equal(1);
        expect(service.minute).to.be.equal(1);
        expect(service.hour).to.be.equal(0);
        done();
    });

    it("Timer attributes should be correct after 3600 ticks", done => {
        for (let i = 0; i < ONE_HOUR; ++i ) {
            service.updateClock();
        }
        expect(service.seconds).to.be.equal(0);
        expect(service.minute).to.be.equal(60);
        expect(service.hour).to.be.equal(0);

        service.updateClock();
        expect(service.seconds).to.be.equal(0);
        expect(service.minute).to.be.equal(0);
        expect(service.hour).to.be.equal(1);
        done();
    });
});

