import { Scene, Geometry, Line, LineDashedMaterial, Vector3 } from "three";

import { StoneHandler } from "../game-physics/stone-handler";
import { TextureHandler } from "../views/texture-handler";
import { CameraService } from "../views/cameras.service";
import { CameraType } from "../game-physics/camera-type";
import { GameComponent } from "../../models/game-component.interface";
import { GameStatus } from "../../models/game-status";
import { AbstractGameState } from "../states/abstractGameState";

export interface IGameInfo {
    stoneHandler: StoneHandler;
    textureHandler: TextureHandler;
    cameraService: CameraService;
    currentCamera: CameraType;
    line: {
        lineGeometry: Geometry,
        lineDashedMaterial: LineDashedMaterial,
        lineMesh: Line,
        lineAnimationSlower: number
    };
    scene: Scene;
    mousePositionPlaneXZ: Vector3;
    gameStatus: GameStatus;
    gameState: AbstractGameState;
    //Contains all the GameComponent to update. Each property of this object must be a GameComponent.
    gameComponentsToUpdate: Object;

    //For Angular progress bar
    isSelectingPower: boolean;
    power: number;

    //For shooting
    speed: number;
    direction: Vector3;
}
