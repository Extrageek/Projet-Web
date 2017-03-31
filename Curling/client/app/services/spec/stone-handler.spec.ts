import { expect } from "chai";
import { ObjectLoader, Vector3, Scene } from "three";
import { StoneHandler } from "./../game-physics/stone-handler";
import { Stone, StoneColor, StoneSpin } from "./../../models/stone";
import { CameraType } from "./../game-physics/camera-type";
import { RinkInfo } from "./../../models/scenery/rink-info.interface";
import { ShotParameters } from "../../models/shot-parameters.interface";

function do60Updates(stoneHandler: StoneHandler) {
    for (let i = 0; i < 60; ++i) {
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
            expect(stone.stoneColor).to.equals(StoneColor.Red);
            done();
        });
    });

    it("create a StoneHandler and generate a blue stone", done => {
        let stoneHandler = new StoneHandler(objectLoader, rinkInfo, StoneColor.Blue);
        stoneHandler.generateNewStone().then((stone: Stone) => {
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
    let shotParameters1: ShotParameters;
    let shotParameters2: ShotParameters;

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
        shotParameters1 = 
        {
            power: 1,
            direction: new Vector3(0, 0, 1),
            spin: StoneSpin.Clockwise
        }
        shotParameters2 = 
        {
            power: 1,
            direction: new Vector3(0, 0, 1),
            spin: StoneSpin.Clockwise
        }
    });

    afterEach(() => {
        clearTimeout(timeoutId);
    });

    it("throw error due to no stone generated", () => {
        expect(() => { stoneHandler.performShot(shotParameters1); }).to.throw(Error);
    });

    it("clean all stones generated", done => {
        stoneHandler.generateNewStone().then((stone: Stone) => {
            stoneHandler.cleanAllStones(new Scene());
            expect(() => { stoneHandler.performShot(shotParameters1); }).to.throw(Error);
            done();
        });
    });

    it("clean left out of bound stone", done => {
        shotParameters1.direction.set(-1, 0, 0);
        shotParameters1.power = 0.001;
        stoneHandler.generateNewStone().then((stone: Stone) => {
            stone.position.set(-2.15, 0, 0);
            stoneHandler.performShot(shotParameters1, () => {
                expect(() => { stoneHandler.performShot(shotParameters2); }).to.throw(Error);
                done();
            });
            do60Updates(stoneHandler);
        });
    });

    it("clean right out of bound stone", done => {
        shotParameters1.direction.set(1, 0, 0);
        shotParameters1.power = 0.001;
        stoneHandler.generateNewStone().then((stone: Stone) => {
            stone.position.set(2.15, 0, 0);
            stoneHandler.performShot(shotParameters1, () => {
                expect(() => { stoneHandler.performShot(shotParameters2); }).to.throw(Error);
                done();
            });
            do60Updates(stoneHandler);
        });
    });

    it("clean top out of bound stone", done => {
        shotParameters1.direction.set(0, 0, 1);
        shotParameters1.power = 0.001;
        stoneHandler.generateNewStone().then((stone: Stone) => {
            stone.position.set(0, 0, 40);
            stoneHandler.performShot(shotParameters1, () => {
                expect(() => { stoneHandler.performShot(shotParameters2); }).to.throw(Error);
                done();
            });
            do60Updates(stoneHandler);
        });
    });

    it("clean bottom out of bound stone", done => {
        shotParameters1.direction.set(0, 0, -1);
        shotParameters1.power = 0.001;
        stoneHandler.generateNewStone().then((stone: Stone) => {
            stone.position.set(0, 0, 1);
            stoneHandler.performShot(shotParameters1, () => {
                expect(() => { stoneHandler.performShot(shotParameters2); }).to.throw(Error);
                done();
            });
            do60Updates(stoneHandler);
        });
    });

    /*
    it("handle a collision between two stones", done => {
        stoneHandler.generateNewStone().then((stone1) => {
            stone1.position.set(0.1, 0, 13);
            stone1.calculateNewBoundingSphere();
    
            stoneHandler.generateNewStone().then((stone2) => {
                stone2.position.set(0, 0, 12);
                stone2.calculateNewBoundingSphere();
    
                let direction2 = new Vector3(0, 0, 1);
                stoneHandler.performShot(new Vector3(0, 0, 1), 10, ()=> {});
    
                for (let i = 0; i < 30; ++i) {
                    stoneHandler.update(1/60);
                }
    
    
                expect(stone1.position.x).to.not.equal(0.1, "stone 1 x should have moved.");
                expect(stone1.position.y).to.equal(0, "stone 1 y should not have moved.");
                expect(stone1.position.z).to.not.equal(0, "stone 1 z should have moved.");
                expect(stone2.position.x).to.not.equal(0, "stone 2 x should have moved.");
                expect(stone2.position.y).to.equal(0, "stone 2 y should not have moved.");
                expect(stone2.position.z).to.not.equal(1, "stone 2 z should have moved.");
                expect(direction2.angleTo(stone2.direction)).to.be.greaterThan(Math.PI / 12,
                    "direction should have changed.");
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
                    stone3.position.set(0, 0, -2);
                    let direction3 = new Vector3(0, 0, 1);
    
                    for (let i = 0; i < 6000; ++i) {
                        stoneHandler.performShot(new Vector3(0, 0, 1), 10, ()=> {});
                        stoneHandler.update(1);
                    }
    
                    expect(stone1.position.x).to.not.equal(-0.27, "stone 1 x should have moved");
                    expect(stone1.position.y).to.equal(0, "stone 1 y should not have moved.");
                    expect(stone1.position.z).to.not.equal(0, "stone 1 z should have moved.");
                    expect(stone2.position.x).to.not.equal(0.27, "stone 2 x should have moved");
                    expect(stone2.position.y).to.equal(0, "stone 2 y should not have moved.");
                    expect(stone2.position.z).to.not.equal(0, "stone 2 z should have moved.");
                    expect(stone3.position.x).to.not.equal(0, "stone 2 x should have moved");
                    expect(stone3.position.y).to.equal(0, "stone 2 y should not have moved.");
                    expect(stone3.position.z).to.not.equal(-1, "stone 2 z should have moved.");
                    expect(stone2.speed).to.not.equal(0, "stone 2 should still be in movement.");
                    expect(stone1.speed).to.not.equal(0, "stone 1 should still be in movement.");
                    done();
                });
            });
        });
    });
    */
});

