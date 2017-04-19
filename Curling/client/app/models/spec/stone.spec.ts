import { expect, assert } from "chai";
import { ObjectLoader, Vector3, Mesh } from "three";
import { Stone, StoneColor, StoneSpin } from "./../stone";
import { Subject } from "rxjs/Subject";

describe("Stone tester should", function () {
    this.timeout(15000);
    let objectLoader: ObjectLoader;

    before(() => {
        objectLoader = new ObjectLoader();
    });

    it("load red stone", done => {
        Stone.createStone(objectLoader, StoneColor.Red, new Vector3(0, 0, 0)).then((stone: Stone) => {
            expect(stone).to.be.instanceof(Stone);
            expect(stone.stoneColor).to.equals(StoneColor.Red);
            done();
        }).catch(() => {
            console.log("rip");
            console.log("rip");
        });
    });

    it("load blue stone", done => {
        Stone.createStone(objectLoader, StoneColor.Blue, new Vector3(0, 0, 0)).then((stone: Stone) => {
            expect(stone).to.be.instanceof(Stone);

            stone.sweeping = true;

            expect(stone.isSweeping).to.equals(true);
            expect(stone.stoneColor).to.equals(StoneColor.Blue);
            done();
        }).catch(() => {
            console.log("rip");
            console.log("rip");
        });
    });

    it("build stone with a clockwise spin then invert its spin", done => {
        Stone.createStone(objectLoader, StoneColor.Blue, new Vector3(0, 0, 0)).then((stone: Stone) => {
            expect(stone).to.be.instanceof(Stone);

            expect(stone.spin).to.equals(StoneSpin.Clockwise);
            stone.spin = StoneSpin.CounterClockwise;

            expect(stone.spin).to.equals(StoneSpin.CounterClockwise);

            expect(stone.stoneColor).to.equals(StoneColor.Blue);
            done();
        });
    });

    it("Make a stone bounce up and down", done => {
        let subject = new Subject();

        Stone.createStone(objectLoader, StoneColor.Blue, new Vector3(0, 0, 0)).then((stone: Stone) => {
            let observer = stone.bounce();
            subject.subscribe(observer);
            expect(stone.position.y).to.equal(0);
            subject.next();
            subject.next();
            subject.next();
            subject.next();
            expect(stone.position.y > 0).to.be.true;
            subject.complete();
            expect(stone.position.y).to.equal(0);
            done();
        });
    });

    it('contains a group of Glow component in a Blue Stone', (done) => {
        Stone.createStone(objectLoader, StoneColor.Blue, new Vector3(0, 0, 0)).then((stone: Stone) => {
            stone.setIllumination(true);

            // Should contains the glow object
            let glow = <THREE.Object3D>stone.getObjectByName(stone.glowObjectName);
            assert(glow.type === stone.stoneGlow.type);

            done();
        });
    });

    it('contains a group of Glow component in a Red Stone', (done) => {
        Stone.createStone(objectLoader, StoneColor.Blue, new Vector3(0, 0, 0)).then((stone: Stone) => {
            stone.setIllumination(true);

            // Should contains the glow object
            let glow = <THREE.Object3D>stone.getObjectByName(stone.glowObjectName);
            assert(glow.type === stone.stoneGlow.type);

            done();
        });
    });
    // TODO: Test the light off case
});

describe("Stone tester physics should", () => {

    let objectLoader: ObjectLoader;
    let stone: Stone;
    let initialPosition: Vector3;
    let frameNumber: number;
    let totalNumberOfFrames: number;
    let timePerFrame: number;

    before(() => {
        objectLoader = new ObjectLoader();
        totalNumberOfFrames = 20;
        timePerFrame = 1 / totalNumberOfFrames;
        initialPosition = new Vector3(0, 0, 0);
    });

    beforeEach(done => {
        frameNumber = 0;
        Stone.createStone(objectLoader, StoneColor.Red, initialPosition).then((stoneCreated: Stone) => {
            stone = stoneCreated;
            done();
        });
    });

    // it("verify stone movement", done => {
    //     let speed = Stone.SPEED_DIMINUTION_NUMBER;
    //     let direction = new Vector3(1, 1, 2);
    //     let directionNormalized = direction.clone().normalize();
    //     //Applying MRUA with t = 1 second. Xf = Xi + V0 * t + a * t^2 / 2
    //     let finalPosition = initialPosition.clone().add(
    //         directionNormalized.multiplyScalar(speed - Stone.SPEED_DIMINUTION_NUMBER / 2));
    //     stone.speed = Stone.SPEED_DIMINUTION_NUMBER;
    //     stone.direction = direction;
    //     function update() {
    //         stone.update(timePerFrame);

    //         ++frameNumber;
    //         if (frameNumber === totalNumberOfFrames) {
    //             //toFixed method used to compare the 6 decimals of the numbers only due to the imprecision of floats.
    //             expect(stone.position.x.toFixed(6)).to.equals(finalPosition.x.toFixed(6));
    //             expect(stone.position.y.toFixed(6)).to.equals(finalPosition.y.toFixed(6));
    //             expect(stone.position.z.toFixed(6)).to.equals(finalPosition.z.toFixed(6));
    //             expect(stone.speed).to.equals(0);
    //             done();
    //         }
    //         else {
    //             setTimeout(update, timePerFrame * 1000);
    //         }
    //     }
    //     setTimeout(update, timePerFrame * 1000);
    // });
});
