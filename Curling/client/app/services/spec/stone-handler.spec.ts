import { expect } from 'chai';
import { ObjectLoader, Vector3, Scene } from "three";
import { StoneHandler } from './../game-physics/stone-handler';
import { Stone, StoneColor, StoneSpin } from './../../models/stone';
import { CameraType } from './../game-physics/camera-type';
import { RinkInfo } from './../../models/scenery/rink-info.interface';

function do60Updates(stoneHandler: StoneHandler) {
    for(let i = 0; i < 60; ++i) {
        stoneHandler.update(1 / 60);
    }
}

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
            //expect(stoneHandler.power).to.equals(0);
            //expect(stoneHandler.mousePositionPlaneXZ.y).to.equals(0);
            expect(stone.stoneColor).to.equals(StoneColor.Red);
            done();
        });
    });

    it("create a StoneHandler and generate a blue stone", done => {
        let stoneHandler = new StoneHandler(objectLoader, rinkInfo, StoneColor.Blue);
        stoneHandler.generateNewStone().then((stone: Stone) => {

            //stoneHandler.mouseIsPressed = false;
            stoneHandler.invertSpin();

            //expect(stoneHandler.mouseIsPressed).to.equals(false);
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

/*
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
*/

    it("throw error due to no stone generated", () => {
        expect(() => { stoneHandler.performShot( new Vector3(0, 0, 1), 1); }).to.throw(Error);
    });

    it("clean all stones generated", done => {
        stoneHandler.generateNewStone().then((stone: Stone) => {
            stoneHandler.cleanAllStones(new Scene());
            expect(() => { stoneHandler.performShot( new Vector3(0, 0, 1), 1); }).to.throw(Error);
            done();
        });
    });

    it("clean left out of bound stone", done => {
        stoneHandler.generateNewStone().then((stone: Stone) => {
            stone.position.set(-2.15, 0, 0);
            stoneHandler.performShot(new Vector3(-1, 0, 0), 0.001, () => {
                expect(() => { stoneHandler.performShot( new Vector3(0, 0, 1), 1); }).to.throw(Error);
                done();
            });
            do60Updates(stoneHandler);
        });
    });

    it("clean right out of bound stone", done => {
        stoneHandler.generateNewStone().then((stone: Stone) => {
            stone.position.set(2.15, 0, 0);
            stoneHandler.performShot(new Vector3(1, 0, 0), 0.001, () => {
                expect(() => { stoneHandler.performShot( new Vector3(0, 0, 1), 1); }).to.throw(Error);
                done();
            });
            do60Updates(stoneHandler);
        });
    });

    it("clean top out of bound stone", done => {
        stoneHandler.generateNewStone().then((stone: Stone) => {
            stone.position.set(0, 0, 40);
            stoneHandler.performShot(new Vector3(0, 0, 1), 0.001, () => {
                expect(() => { stoneHandler.performShot( new Vector3(0, 0, 1), 1); }).to.throw(Error);
                done();
            });
            do60Updates(stoneHandler);
        });
    });

    it("clean bottom out of bound stone", done => {
        stoneHandler.generateNewStone().then((stone: Stone) => {
            stone.position.set(0, 0, 1);
            stoneHandler.performShot(new Vector3(0, 0, -1), 0.001, () => {
                expect(() => { stoneHandler.performShot( new Vector3(0, 0, 1), 1); }).to.throw(Error);
                done();
            });
            do60Updates(stoneHandler);
        });
    });


    it("handle a collision between two stones", done => {
        stoneHandler.generateNewStone().then((stone1) => {
            stone1.position.set(0.1, 0, 20);
            stone1.calculateNewBoundingSphere();

            stoneHandler.generateNewStone().then((stone2) => {
                stone2.position.set(0, 0, 19);
                stone2.calculateNewBoundingSphere();

                let direction2 = new Vector3(0, 0, 1);

                stoneHandler.performShot(direction2.clone(), 1);
                do60Updates(stoneHandler);

                expect(stone1.position.x).to.not.equal(0.1, "stone 1 x should have moved.");
                //expect(stone1.position.y).to.equal(0, "stone 1 y should not have moved.");
                expect(stone1.position.z).to.not.equal(0, "stone 1 z should have moved.");
                expect(stone2.position.x).to.not.equal(0, "stone 2 x should have moved.");
                //expect(stone2.position.y).to.equal(0, "stone 2 y should not have moved.");
                expect(stone2.position.z).to.not.equal(1, "stone 2 z should have moved.");
                expect(direction2.angleTo(stone2.direction)).to.be.greaterThan(Math.PI/12,
                    "direction should have changed.");
                expect(stone1.speed).to.not.equal(0, "stone 1 should still be in movement.");
                done();
            });
        });
    });

    it("handle a collision between three stones", done => {
        stoneHandler.generateNewStone().then((stone1) => {
            stone1.position.set(-0.2, 0, 18);

            stoneHandler.generateNewStone().then((stone2) => {
                stone2.position.set(0.2, 0, 18);

                stoneHandler.generateNewStone().then((stone3) => {
                    stone3.position.set(0, 0, 17);
                    let direction3 = new Vector3(0, 0, 1)
                    stoneHandler.performShot(new Vector3(0, 0, 1), 5);

                    do60Updates(stoneHandler);

                    expect(stone1.position.x).to.not.equal(-0.27, "stone 1 x should have moved");
                    //expect(stone1.position.y).to.equal(0, "stone 1 y should not have moved.");
                    expect(stone1.position.z).to.not.equal(0, "stone 1 z should have moved.");
                    expect(stone2.position.x).to.not.equal(0.27, "stone 2 x should have moved");
                    //expect(stone2.position.y).to.equal(0, "stone 2 y should not have moved.");
                    expect(stone2.position.z).to.not.equal(0, "stone 2 z should have moved.");
                    expect(stone3.position.x).to.not.equal(0, "stone 2 x should have moved");
                    //expect(stone3.position.y).to.not.equal(0, "stone 2 y should not have moved.");
                    expect(stone3.position.z).to.not.equal(-1, "stone 2 z should have moved.");
                    expect(stone2.speed).to.not.equal(0, "stone 2 should still be in movement.");
                    expect(stone1.speed).to.not.equal(0, "stone 1 should still be in movement.");
                    done();
                });
            });
        });
    });
});

