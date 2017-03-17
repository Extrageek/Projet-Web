import { expect } from 'chai';
import { ObjectLoader, Vector3 } from "three";
import { StoneHandler } from './stone-handler';
import { Stone, StoneColor, StoneSpin } from './../../models/stone';
import { CameraType } from './camera-type';
import { RinkInfo } from './../../models/scenery/rink-info.interface';

describe("StoneHandler tests should", () => {

    let objectLoader: ObjectLoader;
    let rinkInfo: RinkInfo;

    before(() => {
        objectLoader = new ObjectLoader();
        rinkInfo = {
            targetCenter: new Vector3(0, 0, -15),
            targetRadius: 3,
            initialStonePosition: new Vector3(0, 0, 0)
        };
    });

    it("create a StoneHandler and generate a red stone", done => {
        let stoneHandler = new StoneHandler(objectLoader, rinkInfo, StoneColor.Red);
        stoneHandler.generateNewStone().then((stone: Stone) => {
            expect(stoneHandler.power).to.equals(0);
            expect(stoneHandler.mousePositionPlaneXZ.y).to.equals(0);
            expect(stone.stoneColor).to.equals(StoneColor.Red);
            done();
        });
    });

    it("create a StoneHandler and generate a blue stone", done => {
        let stoneHandler = new StoneHandler(objectLoader, rinkInfo, StoneColor.Blue);
        stoneHandler.generateNewStone().then((stone: Stone) => {

            stoneHandler.mouseIsPressed = false;
            stoneHandler.invertSpin();

            expect(stoneHandler.mouseIsPressed).to.equals(false);
            expect(stoneHandler.currentSpin).to.equals(StoneSpin.CounterClockwise);
            expect(stone.stoneColor).to.equals(StoneColor.Blue);
            done();
        });
    });
});

describe("StoneHandler tests should", () => {

    let objectLoader: ObjectLoader;
    let rinkInfo: RinkInfo;
    let stoneHandler: StoneHandler;
    let timeoutId: NodeJS.Timer;

    before(() => {
        objectLoader = new ObjectLoader();
        rinkInfo = {
            targetCenter: new Vector3(0, 0, -15),
            targetRadius: 3,
            initialStonePosition: new Vector3(0, 0, 0)
        };
    });

    beforeEach(() => {
        stoneHandler = new StoneHandler(objectLoader, rinkInfo, StoneColor.Blue);
    });

    afterEach(() => {
        clearTimeout(timeoutId);
    });

    it("clamp mouse position", () => {
        let e: MouseEvent = new MouseEvent('onmousedown', {
            clientX: window.innerWidth,
            clientY: window.innerHeight,

        });
        stoneHandler.calculateMousePosition(e, CameraType.PERSPECTIVE_CAM);

        expect(stoneHandler.mousePositionPlaneXZ.x).to.be.equal(StoneHandler.SHOT_ANGLE_MINIMUM);

        stoneHandler.calculateMousePosition(e, CameraType.ORTHOGRAPHIC_CAM);

        expect(stoneHandler.mousePositionPlaneXZ.x).to.be.equal(StoneHandler.SHOT_ANGLE_MINIMUM);

        e = new MouseEvent('onmousedown', {
            clientX: 0,
            clientY: 0
        });

        stoneHandler.calculateMousePosition(e, undefined);

        stoneHandler.calculateMousePosition(e, CameraType.PERSPECTIVE_CAM);

        expect(stoneHandler.mousePositionPlaneXZ.x).to.be.equal(StoneHandler.SHOT_ANGLE_MAXIMUM);
    });

    it("throw error due to no stone generated", () => {
        expect(stoneHandler.performShot.bind(1, new Vector3(0, 0, 1))).to.throw(Error);
    });

    it("handle a collision between two stones", done => {
        stoneHandler.startPower();
        setTimeout(() => {

            stoneHandler.generateNewStone().then((stone1) => {
                stone1.position.set(0.27, 0, 0);

                stoneHandler.generateNewStone().then((stone2) => {
                    stone2.position.set(0, 0, -1);
                    stoneHandler.performShot(new Vector3(0, 0, 1), () => { /* Do nothing*/ });
                    stoneHandler.update(0.2);
                    stoneHandler.performShot(new Vector3(0, 0, 1), () => { /* Do nothing*/ });
                    stoneHandler.update(0.2);

                    done();
                });
            });

            for (let stone of stoneHandler.stoneOnTheGame){
                expect(stone.speed).to.not.be.equal(0, "stone" + stone + " was not in the collision");
            }
        }, 1000);
    });

    it("handle a collision between three stones", done => {
        stoneHandler.startPower();
        setTimeout(() => {
            stoneHandler.generateNewStone().then((stone1) => {

                stone1.position.set(-0.27, 0, 0);
                stoneHandler.generateNewStone().then((stone2) => {
                    stone2.position.set(0.27, 0, 0);

                    stoneHandler.generateNewStone().then((stone3) => {
                        stone3.position.set(0, 0, -1);
                        stoneHandler.performShot(new Vector3(0, 0, 1), () => { /* Do nothing*/ });
                        stoneHandler.update(0.2);
                        stoneHandler.performShot(new Vector3(0, 0, 1), () => { /* Do nothing*/ });
                        stoneHandler.update(0.2);
                        expect(stoneHandler.stoneOnTheGame[0].position).to.not.equal(new Vector3(-0.27, 0, 0));
                        expect(stoneHandler.stoneOnTheGame[1].position).to.not.equal(new Vector3(0.27, 0, 0));
                        expect(stoneHandler.stoneOnTheGame[2].position).to.not.equal(new Vector3(0, 0, -1));
                        stoneHandler.update(5);
                        stoneHandler.cleanAllStones();
                        expect(stoneHandler.stoneOnTheGame.length).to.be.equal(0);
                        done();
                    });
                });
            });

            for (let stone of stoneHandler.stoneOnTheGame){
                expect(stone.speed).to.not.be.equal(0, "stone" + stone + " was not in the collision");
            }
        }, 1000);

    });
});
