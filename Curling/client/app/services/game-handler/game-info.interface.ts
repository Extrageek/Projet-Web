import { Geometry, Line, LineDashedMaterial, Vector3 } from "three";

import { GameStatusService } from "../game-status.service";
import { CameraType } from "../game-physics/camera-type";
import { Broom } from "../../models/broom";
import { Rink } from "../../models/scenery/rink";

export interface IGameInfo {
    gameStatus: GameStatusService;
    line: {
        lineGeometry: Geometry,
        lineDashedMaterial: LineDashedMaterial,
        lineMesh: Line,
        lineAnimationSlower: number
    };
    broom: Broom;
    rink: Rink;
    //Contains all the GameComponent to update. Each property of this object must be a GameComponent.
    gameComponentsToUpdate: Object;
}
