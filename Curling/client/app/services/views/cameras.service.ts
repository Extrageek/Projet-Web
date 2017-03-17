import { Injectable } from "@angular/core";
import { Object3D, PerspectiveCamera, Vector3 } from "three";
import { GameComponent } from "../../models/game-component.interface";

interface FollowInformation {
    objectToFollow: Object3D;
    objectWhoFollow: Object3D;
    distanceVector: Vector3;
}

interface FollowUpdate {
    followInformation: FollowInformation;
    functionToApply: Function;
}

@Injectable()
export class CameraService implements GameComponent {
    private static readonly FIELD_OF_VIEW = 65;
    public static readonly INITIAL_POSITION_P = {x: 0, y: 6, z: -24};
    private static readonly POINT_TO_P = {x: 0, y: 0, z: -10};
    private static readonly INITIAL_POSITION_T = {x: 0, y: 20, z: 0};
    private static readonly POINT_TO_T = {x: 0, y: 0, z: 0};
    private static readonly ROTATION_T = {x: 0, y: 0, z: -Math.PI / 2};
    private static readonly PERSPECTIVE_CAMERA_INDEX = 0;
    private static readonly TOPVIEW_CAMERA_INDEX = 1;

    private _cameras: PerspectiveCamera[];
    private _camerasToUpdate: FollowUpdate[];
    private _lastCameraUsedIndex: number;

    private _perspectiveCameraMoving: boolean;

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
        this._camerasToUpdate = new Array<FollowUpdate>();
        this._perspectiveCameraMoving = false;
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

    public movePerspectiveCameraToFollowObjectOnZ(objectToFollow: Object3D): void {
        if (!this._perspectiveCameraMoving) {
            this._perspectiveCameraMoving = true;
            let camera = this._cameras[CameraService.PERSPECTIVE_CAMERA_INDEX];
            let distance = new Vector3(0, 0, camera.position.z - objectToFollow.position.z);
            this._camerasToUpdate.push(
            {followInformation: {
                "objectToFollow": objectToFollow,
                "objectWhoFollow": camera,
                "distanceVector": distance
                },
                "functionToApply": this.followObjectOnZAxis});
        }
    }

    public stopPerspectiveCameraToFollowObjectOnZ() {
        if (this._perspectiveCameraMoving) {
            this._perspectiveCameraMoving = false;
            let index = this._camerasToUpdate.findIndex((element : FollowUpdate) => {
                return element.followInformation.objectWhoFollow ===
                    this._cameras[CameraService.PERSPECTIVE_CAMERA_INDEX];
            });
            if (index > -1) {
                this._camerasToUpdate.splice(index, 1);
            }
        }
    }

    private followObjectOnZAxis(informations: FollowInformation) {
        informations.objectWhoFollow.position.z =
            informations.objectToFollow.position.z + informations.distanceVector.z;
    }

    public replacePCameraToInitialPosition() {
        this.stopPerspectiveCameraToFollowObjectOnZ();
        this._cameras[CameraService.PERSPECTIVE_CAMERA_INDEX].position.set(
            CameraService.INITIAL_POSITION_P.x,
            CameraService.INITIAL_POSITION_P.y,
            CameraService.INITIAL_POSITION_P.z);
    }

    public update(timePerFrame: number): void {
        this._camerasToUpdate.map((element: FollowUpdate, index: number, updateArray: FollowUpdate[]) => {
            element.functionToApply(element.followInformation);
        });
    }
}

