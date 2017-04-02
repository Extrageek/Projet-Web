import { expect } from "chai";
import { ObjectLoader, Group, MeshPhongMaterial, Object3D, BoxGeometry, Vector3 } from "three";
import { Broom } from "./../broom";
import { Stone, StoneColor, StoneSpin } from "./../stone";

describe("Broom class should", () => {

    let objectLoader: ObjectLoader;

    before(() => {
        objectLoader = new ObjectLoader();
    });

    it("instantiate a broom object", () => {
        Broom.createBroom(objectLoader, new Vector3(0, 0, -11.4)).then((broom: Broom) => {
            expect(broom).to.be.instanceof(Broom);
        });
    });

    it("change a broom to red correctly", () => {
        Broom.createBroom(objectLoader, new Vector3(0, 0, -11.4)).then((broom: Broom) => {
            broom.changeColourTo(THREE.ColorKeywords.red);
            expect(broom.isRed()).to.be.true;
        });
    });

    it("change a broom to red correctly", () => {
        Broom.createBroom(objectLoader, new Vector3(0, 0, -11.4)).then((broom: Broom) => {
            broom.changeColourTo(THREE.ColorKeywords.green);
            expect(broom.isRed()).to.be.false;
        });
    });

    it("validate a collision between sweep and stone", done => {
        let stones = new Array<Stone>();
        Stone.createStone(objectLoader, StoneColor.Red, new Vector3(0, 0, 0)).then((stone) => {
            stones.push(stone);
            Broom.createBroom(objectLoader, new Vector3(0, 0, 0)).then((broom: Broom) => {
                broom.verifyBroomCollision(stones);
                expect(stones[0].isSweeping).to.be.true;
                done();
            });
        });
    });

    it("do nothing if there is no collision between sweep and stone", () => {
        let stones = new Array<Stone>();
        Stone.createStone(objectLoader, StoneColor.Red, new Vector3(0, 0, 0)).then((stone) => {
            stones.push(stone);
            Broom.createBroom(objectLoader, new Vector3(0, 0, 20)).then((broom: Broom) => {
                broom.verifyBroomCollision(stones);
                expect(stones[0].isSweeping).to.be.false;
            });
        });
    });
});

