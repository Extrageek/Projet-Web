import { Injectable } from '@angular/core';
import { PerspectiveCamera, Vector3 } from "three";

@Injectable()
export class CameraService {
    static FIELD_OF_VIEW = 35;
    static INITIAL_POSITION_P = {x: 0, y: 9, z:-27};
    static POINT_TO = {x: 0, y: 0, z: 3};
    static INITIAL_POSITION_T = {x: 0, y: 15, z: 0};

    private _perspectiveCamera: PerspectiveCamera;
    private _topViewCamera: PerspectiveCamera;

    get perspectiveCamera() {
        return this._perspectiveCamera;
    }

    get topViewCamera() {
        return this._topViewCamera;
    }

    constructor() {
        this._perspectiveCamera = new PerspectiveCamera(
            CameraService.FIELD_OF_VIEW, window.innerWidth / window.innerHeight, 1, 10000);
        this._perspectiveCamera.position.set(
            CameraService.INITIAL_POSITION_P.x, CameraService.INITIAL_POSITION_P.y, CameraService.INITIAL_POSITION_P.z)
        this._perspectiveCamera.lookAt(new Vector3(
            CameraService.POINT_TO.x,
            CameraService.POINT_TO.y,
            CameraService.POINT_TO.z));

        this._topViewCamera = new PerspectiveCamera(
            CameraService.FIELD_OF_VIEW, window.innerWidth / window.innerHeight, 1, 10000);
        this._topViewCamera.position.set(
            CameraService.INITIAL_POSITION_T.x, CameraService.INITIAL_POSITION_T.y, CameraService.INITIAL_POSITION_T.z);
        this._topViewCamera.lookAt(new Vector3(0, 0, 0));
    }


}

