import { SoundManager } from "../sound-manager";
import { Object3D } from "three";

import { expect } from "chai";

/*
let instance: SoundManager;
describe("Sound manager should should", function () {
    this.timeout(15000);

    before(done => {
        SoundManager.createSoundManager()
            .then((soundManager: SoundManager) => {
                instance = soundManager;
                console.log("here");
                done();
            })
            .catch((reason) => {
                console.log(reason.message);
                done(reason);
            });
    });

    it("Initialize the instance of a sound manager, should not ", () => {
        expect(instance).to.not.equal(null);
    });

    it("Broom sound should be correctly initialized and playable", () => {
        setTimeout(() => {
            let broomSoundIn = instance.broomInSound;
            expect(broomSoundIn).to.be.an.instanceof(Audio);
            expect(broomSoundIn.getLoop()).to.equal(false);
        }, 2000);
    });

    it("Initialize the instance of a sound manager should not be undefined", () => {
        setTimeout(() => {
            let broomSoundOut = instance.broomOutSound;
            expect(broomSoundOut).to.be.an.instanceof(Audio);
            expect(broomSoundOut.getLoop()).to.equal(false);
        }, 2000);
    });

    it("Initialize the instance of a sound manager should not be undefined", () => {
        setTimeout(() => {
            let collisionSound = instance.collisionSound;
            expect(collisionSound).to.be.an.instanceof(Audio);
            expect(collisionSound.getLoop()).to.equal(false);
        }, 2000);
    });

    it("Initialize the instance of a sound manager should not be undefined", () => {

        let obj: Object3D;
        obj = new Object3D();
        setTimeout(() => {
            let audioListener = instance.listener;
            expect(audioListener).to.be.an.instanceof(AudioListener);
            obj.add(audioListener);
            expect(obj.children.length).to.equal(1);
        }, 2000);
    });
});
*/
