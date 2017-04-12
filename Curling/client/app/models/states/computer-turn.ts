import { Vector3 } from "three";

import { AbstractGameState } from "./abstract-game-state";
import { ComputerShooting } from "./computer-shooting";
import { ComputerAI } from "../../models/AI/computerAI";
import { Stone } from "../../models/stone";
import { StoneColor } from "../../models/stone";
import { IGameInfo } from "./../../services/game-handler/game-info.interface";
import { IGameServices } from "../../services/game-handler/games-services.interface";

export class ComputerTurn extends AbstractGameState {

    private static _instance: AbstractGameState = null;

    private _computerAI: ComputerAI;

    /**
     * Use this property to change the intelligence of the computer.
     * @param computerAI The new computerAI to use to determine the shot.
     */
    public set computerAI(computerAI: ComputerAI) {
        if (computerAI === undefined || computerAI === null) {
            throw new Error("The computerAI cannot be null.");
        }
        this._computerAI = computerAI;
    }

    /**
     * Initialize the unique ComputerTurn state.
     * @param gameInfo The informations to use by the state.
     * @param doInitialization Set to true only if the game is entering immediatly in this state.
     *  Only one game state could be constructed with this value at true, because only one game state
     *  must be active at a time.
     */
    public static createInstance(gameServices: IGameServices, gameInfo: IGameInfo, computerAI: ComputerAI) {
        ComputerTurn._instance = new ComputerTurn(gameServices, gameInfo, computerAI);
    }

    /**
     * Get the instance of the state ComputerTurn. sThis state is used while the computer is aiming and chosing power.
     * @returns The ComputerTurn state of null if the createInstance method has not been called.
     */
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

    protected performMouseMove(): AbstractGameState {
        return null;
    }

    protected performMouseButtonPress(): AbstractGameState {
        return null;
    }

    protected performMouseButtonReleased(): AbstractGameState {
        return null;
    }
}
