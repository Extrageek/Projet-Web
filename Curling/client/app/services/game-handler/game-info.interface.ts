import { Geometry, Line, LineDashedMaterial, Vector3 } from "three";

import { GameStatusService } from "../game-status.service";
import { DashedLine } from "../../models/scenery/dashed-line";
import { Broom } from "../../models/broom";
import { Rink } from "../../models/scenery/rink";

export interface IGameInfo {
    gameStatus: GameStatusService;
    dashedLine: DashedLine;
    broom: Broom;
    rink: Rink;
    //Contains all the GameComponent to update. Each property of this object must be a GameComponent.
    gameComponentsToUpdate: Object;
}
