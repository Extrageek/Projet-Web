import { expect } from "chai";
import { CameraService } from "./cameras.service";
import { PerspectiveCamera, Vector3 } from "three";

describe("Testing camera service", () => {
    it("should create a new camera service with valid cameras", () => {
        let cameraService = new CameraService();
        expect(cameraService.perspectiveCamera).to.be.instanceof(PerspectiveCamera);
        expect(cameraService.topViewCamera).to.be.instanceof(PerspectiveCamera);
    });
});
