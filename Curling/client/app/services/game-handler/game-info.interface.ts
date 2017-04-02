import { Scene, Geometry, Line, LineDashedMaterial, Vector3 } from "three";

import { CameraService } from "../views/cameras.service";
import { GameStatusService } from "./../game-status.service";
import { StoneHandler } from "../game-physics/stone-handler";
import { TextureHandler } from "../views/texture-handler";
import { ParticlesService } from "./../game-physics/particles.service";
import { CameraType } from "../game-physics/camera-type";
import { AbstractGameState } from "./../../models/states/abstract-game-state";
import { Broom } from "../../models/broom";
import { Rink } from "../../models/scenery/rink";
import { ShotParameters } from "../../models/shot-parameters.interface";
import { LightingService } from "./../views/ligthing.service";

export interface IGameInfo {
    stoneHandler: StoneHandler;
    textureHandler: TextureHandler;
    cameraService: CameraService;
    particlesService: ParticlesService;
    gameStatus: GameStatusService;
    lighting: LightingService;
    currentCamera: CameraType;
    line: {
        lineGeometry: Geometry,
        lineDashedMaterial: LineDashedMaterial,
        lineMesh: Line,
        lineAnimationSlower: number
    };
    broom: Broom;
    rink: Rink;
    scene: Scene;
    mousePositionPlaneXZ: Vector3;
    gameState: AbstractGameState;
    //Contains all the GameComponent to update. Each property of this object must be a GameComponent.
    gameComponentsToUpdate: Object;

    //For Angular progress bar
    isSelectingPower: boolean;
    powerBar: number;

    //For shooting
    shotParameters: ShotParameters;
}
