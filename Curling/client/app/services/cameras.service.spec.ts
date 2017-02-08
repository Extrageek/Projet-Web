import { expect } from "chai";
import { CameraService } from "./cameras.service";
import { PerspectiveCamera } from "three";

describe("Testing behavior of camera service", () => {

    let cameraService: CameraService;

    beforeEach(() => {
        cameraService = new CameraService();
    });

    it("should create a new camera service with valid cameras", () => {
        let cameraService = new CameraService();
        expect(cameraService.perspectiveCamera).to.be.instanceof(PerspectiveCamera);
        expect(cameraService.topViewCamera).to.be.instanceof(PerspectiveCamera);
    });

    it("should get perspective camera", () => {
        expect(cameraService.perspectiveCamera).to.be.instanceof(PerspectiveCamera);
    });

    it("should get topView camera", () => {
        expect(cameraService.topViewCamera).to.be.instanceof(PerspectiveCamera);
    });

    it("should get perspective camera than topView camera", () => {
        expect(cameraService.perspectiveCamera).to.be.instanceof(PerspectiveCamera);
        expect(cameraService.topViewCamera).to.be.instanceof(PerspectiveCamera);
    });

    it("should get perspective, topView and perspective camera again", () => {
        let perspectiveCamera = cameraService.nextCamera();
        let topViewCamera = cameraService.nextCamera();
        let perspectiveCameraAgain = cameraService.nextCamera();
        expect(perspectiveCamera).to.equals(perspectiveCameraAgain);
        expect(perspectiveCamera).to.not.equals(topViewCamera);
    });
});
