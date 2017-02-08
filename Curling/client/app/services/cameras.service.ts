import { Injectable } from '@angular/core';
import { PerspectiveCamera, Vector3 } from "three";

@Injectable()
export class CameraService {
    private static FIELD_OF_VIEW = 65;
    private static INITIAL_POSITION_P = {x: 0, y: 6, z: -24};
    private static POINT_TO_P = {x: 0, y: 0, z: -10};
    private static INITIAL_POSITION_T = {x: 0, y: 20, z: 0};
    private static POINT_TO_T = {x: 0, y: 0, z: 0};
    private static ROTATION_T = {x: 0, y: 0, z: -Math.PI / 2};
    private static PERSPECTIVE_CAMERA_INDEX = 0;
    private static TOPVIEW_CAMERA_INDEX = 1;

    private _cameras: PerspectiveCamera[];
    private _lastCameraUsedIndex: number;

    get perspectiveCamera() {
        this._lastCameraUsedIndex = CameraService.PERSPECTIVE_CAMERA_INDEX;
        return this._cameras[CameraService.PERSPECTIVE_CAMERA_INDEX];
    }

    get topViewCamera() {
        this._lastCameraUsedIndex = CameraService.TOPVIEW_CAMERA_INDEX;
        return this._cameras[CameraService.TOPVIEW_CAMERA_INDEX];
    }

    constructor() {
        this._cameras = new Array<PerspectiveCamera>();
        this._lastCameraUsedIndex = -1;
        this.createNewPerspectiveCamera(CameraService.INITIAL_POSITION_P, CameraService.POINT_TO_P);
        this.createNewPerspectiveCamera(CameraService.INITIAL_POSITION_T, CameraService.POINT_TO_T,
        CameraService.ROTATION_T);
    }

    private createNewPerspectiveCamera(
        position: {x: number, y: number, z: number},
        lookAt: {x: number, y: number, z: number},
        rotation?: {x: number, y: number, z: number}) {
        let camera = new PerspectiveCamera(CameraService.FIELD_OF_VIEW, window.innerWidth / window.innerHeight,
            1, 10000);
        camera.position.set(position.x, position.y, position.z);
        camera.lookAt(new Vector3(lookAt.x, lookAt.y, lookAt.z));
        if (rotation !== undefined) {
            camera.rotateX(rotation.x);
            camera.rotateY(rotation.y);
            camera.rotateZ(rotation.z);
        }
        this._cameras.push(camera);
    }

    public nextCamera(): PerspectiveCamera {
        this._lastCameraUsedIndex = (this._lastCameraUsedIndex + 1) % this._cameras.length;
        return this._cameras[this._lastCameraUsedIndex];
    }
}

