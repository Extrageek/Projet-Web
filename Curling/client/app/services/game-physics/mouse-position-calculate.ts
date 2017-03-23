import { Vector3 } from "three";
import { CameraType } from "../game-physics/camera-type";

export function calculateMousePosition(event: MouseEvent, cameraType: CameraType): Vector3 {
    let mousePosition: Vector3;
    if (cameraType === CameraType.PERSPECTIVE_CAM) {
        mousePosition = new Vector3(
            -(event.clientX / window.innerWidth) / 0.02215 + 22.55, // Numbers to align with the rink model
            0,
            (event.clientY / window.innerHeight) / 0.008 + 46.75 // Numbers to align with the rink model
        );
    } else if (cameraType === CameraType.ORTHOGRAPHIC_CAM) {
        mousePosition = new Vector3(
            -(event.clientY / window.innerHeight) / 0.038 + 13.2 ,
            0,
            (event.clientX / window.innerWidth) / 0.0268 - 18.6
        );
    } else {
        throw new Error("calculateMousePosition : camera unrecognized");
    }
    return mousePosition;
}
