// import { SoundManager } from "../sound-manager";
// import { Object3D } from "three";
//
// import { expect } from "chai";
//
// let instance: SoundManager;
// describe("Sound manager should should", function () {
//     this.timeout(15000);
//
//     before((done) => {
//         instance = SoundManager.getInstance();
//         done();
//     });
//
//     it("Initialize the instance of a sound manager, should not ", () => {
//         expect(instance).to.not.equal(null);
//     });
//
//     it("Broom sound should be correctly initialized and playable", () => {
//             let broomSoundIn = instance.playBroomInSound();
//             expect(broomSoundIn).to.be.an.instanceof(Audio);
//             expect(broomSoundIn.getLoop()).to.equal(false);
//     });
//
//     it("Initialize the instance of a sound manager should not be undefined", () => {
//             let broomSoundOut = instance.playBroomOutSound();
//             expect(broomSoundOut).to.be.an.instanceof(Audio);
//             expect(broomSoundOut.getLoop()).to.equal(false);
//     });
//
//     it("Initialize the instance of a sound manager should not be undefined", () => {
//             let collisionSound = instance.playCollisionSound();
//             expect(collisionSound).to.be.an.instanceof(Audio);
//             expect(collisionSound.getLoop()).to.equal(false);
//     });
//
//     it("Initialize the instance of a sound manager should not be undefined", () => {
//
//         let obj: Object3D;
//         obj = new Object3D();
//             let audioListener = instance.listener;
//             expect(audioListener).to.be.an.instanceof(AudioListener);
//             obj.add(audioListener);
//             expect(obj.children.length).to.equal(1);
//     });
// });
