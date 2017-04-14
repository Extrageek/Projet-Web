import { AbstractGameState } from "./abstract-game-state";
import { ComputerShooting } from "./computer-shooting";
import { ComputerAI } from "../../models/AI/computerAI";
import { StoneColor } from "../../models/stone";
import { IGameInfo } from "../../services/game-handler/game-info.interface";
import { IGameServices } from "../../services/game-handler/games-services.interface";

/**
 * This state is used when the computer is calculating the next shot parameters.
 */
export class ComputerTurn extends AbstractGameState {

    private static _instance: AbstractGameState = null;

    private _computerAI: ComputerAI;

    /**
     * Use this property to change the intelligence of the computer.
     * @param computerAI The new computerAI used to determine the shot parameters.
     */
    public set computerAI(computerAI: ComputerAI) {
        if (computerAI === undefined || computerAI === null) {
            throw new Error("The computerAI cannot be null.");
        }
        this._computerAI = computerAI;
    }

    public static createInstance(gameServices: IGameServices, gameInfo: IGameInfo, computerAI: ComputerAI) {
        ComputerTurn._instance = new ComputerTurn(gameServices, gameInfo, computerAI);
    }

    public static getInstance(): AbstractGameState {
        return ComputerTurn._instance;
    }

    private constructor(gameServices: IGameServices, gameInfo: IGameInfo, computerAI: ComputerAI) {
        super(gameServices, gameInfo);
        this._computerAI = computerAI;
    }

    protected performEnteringState(): void {
        let nearestPlayerStone = this._gameServices.stoneHandler.findClosestCenterStonePosition(StoneColor.Blue);
        let shotParameters;
        if (nearestPlayerStone !== undefined) {
            shotParameters = this._computerAI.determineShotParametersOnStone(nearestPlayerStone);
        } else {
            shotParameters = this._computerAI.determineShotParametersOnCenter();
        }
        AbstractGameState.shotParameters.power = shotParameters.power;
        AbstractGameState.shotParameters.direction = shotParameters.direction;
        AbstractGameState.shotParameters.spin = shotParameters.spin;
        this.leaveState(ComputerShooting.getInstance());
    }
}
