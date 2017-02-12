import { expect } from "chai";
import { ObjectLoader, Scene } from "three";
import { Stone, StoneColor } from "./stone.service";

describe("Stone tester should", () => {

    let loader: ObjectLoader;

    before(() => {
        loader = new ObjectLoader();
    });

    it("load blue stone", done => {
        new Stone(StoneColor.Blue, loader, () => { done(); });
    });

    it("load red stone", done => {
        new Stone(StoneColor.Red, loader, () => { done(); });
    });

    it("add stone to scene", done => {
        let scene = new Scene();
        let stone = new Stone(StoneColor.Red, loader, () => {
            stone.addToScene(scene);
            expect(scene.children.length).to.equals(1);
            done();
        });
    });

    it("remove stone from scene", done => {
        let scene = new Scene();
        let stone = new Stone(StoneColor.Red, loader, () => {
            stone.addToScene(scene);
            expect(scene.children.length).to.equals(1);
            stone.removeFromScene(scene);
            expect(scene.children.length).to.equals(0);
            done();
        });
    });
});
