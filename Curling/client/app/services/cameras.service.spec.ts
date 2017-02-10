import { expect } from "chai";
import { CameraService } from "./cameras.service";
import { PerspectiveCamera, Object3D, Vector3 } from "three";

describe("Camera service should", () => {

    let cameraService: CameraService;

    beforeEach(() => {
        cameraService = new CameraService();
    });

    it("create a new camera service with valid cameras", () => {
        expect(cameraService.perspectiveCamera).to.be.instanceof(PerspectiveCamera);
        expect(cameraService.topViewCamera).to.be.instanceof(PerspectiveCamera);
    });

    it("get perspective camera", () => {
        expect(cameraService.perspectiveCamera).to.be.instanceof(PerspectiveCamera);
    });

    it("get topView camera", () => {
        expect(cameraService.topViewCamera).to.be.instanceof(PerspectiveCamera);
    });

    it("get perspective camera than topView camera", () => {
        expect(cameraService.perspectiveCamera).to.be.instanceof(PerspectiveCamera);
        expect(cameraService.topViewCamera).to.be.instanceof(PerspectiveCamera);
    });

    it("get perspective, topView and perspective camera again", () => {
        let perspectiveCamera = cameraService.nextCamera();
        let topViewCamera = cameraService.nextCamera();
        let perspectiveCameraAgain = cameraService.nextCamera();
        expect(perspectiveCamera).to.equals(perspectiveCameraAgain);
        expect(perspectiveCamera).to.not.equals(topViewCamera);
    });

    it("follow object", done => {
        const displacementByFrame = 0.02;
        const numberOfFrames = 80;
        let objectFollowed = new Object3D();
        let perspectiveCamera = cameraService.perspectiveCamera;
        let displacementVector = new Vector3(0, 0, displacementByFrame * numberOfFrames);
        let expectedPosition = perspectiveCamera.position.add(displacementVector);
        cameraService.movePerspectiveCameraToFollowObjectOnZ(objectFollowed);
        let frameNumber = 0;
        function update() {
            objectFollowed.position.addScalar(displacementByFrame);
            cameraService.update();
            ++frameNumber;
            if (frameNumber < numberOfFrames) {
                setTimeout(update, 1);
            }
            else {
                expect(perspectiveCamera.position.x).to.equals(expectedPosition.x);
                expect(perspectiveCamera.position.y).to.equals(expectedPosition.y);
                expect(perspectiveCamera.position.z).to.equals(expectedPosition.z);
                done();
            }
        }
        setTimeout(update, 1);
    });

    it("stop follow object", done => {
        const displacementByFrame = 0.02;
        const numberOfFramesBefore = 80;
        const numberOfFramesAfter = 20;
        let objectFollowed = new Object3D();
        let perspectiveCamera = cameraService.perspectiveCamera;
        let displacementVector = new Vector3(0, 0, displacementByFrame * numberOfFramesBefore);
        let expectedPosition = perspectiveCamera.position.add(displacementVector);
        cameraService.movePerspectiveCameraToFollowObjectOnZ(objectFollowed);
        let frameNumber = 0;
        function update() {
            objectFollowed.position.addScalar(displacementByFrame);
            cameraService.update();
            ++frameNumber;
            if (frameNumber < numberOfFramesBefore) {
                window.requestAnimationFrame(update);
            }
            else {
                cameraService.stopPerspectiveCameraToFollowObjectOnZ();
                window.requestAnimationFrame(updatePart2);
            }
        }
        function updatePart2() {
            objectFollowed.position.addScalar(displacementByFrame);
            ++frameNumber;
            if (frameNumber < numberOfFramesAfter) {
                setTimeout(update, 1);
            }
            else {
                expect(perspectiveCamera.position.x).to.equals(expectedPosition.x);
                expect(perspectiveCamera.position.y).to.equals(expectedPosition.y);
                expect(perspectiveCamera.position.z).to.equals(expectedPosition.z);
                done();
            }
        }
        setTimeout(update, 1);
    });
});
