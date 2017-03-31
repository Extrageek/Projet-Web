import { Vector3 } from "three";

import { AbstractGameState } from "./abstract-game-state";
import { IGameInfo } from "./../../services/game-handler/game-info.interface";
import { ComputerShooting } from "./computer-shooting";
import { ComputerAI } from "../../models/computerAI";
import { Stone } from "../../models/stone";
import { Difficulty } from "../../models/difficulty";

export class ComputerTurn extends AbstractGameState {

    private static _instance: AbstractGameState = null;

    private _computerAI: ComputerAI;
    // Speed should be chosen by AI
    private _speed = 8;

    /**
     * Initialize the unique ComputerTurn state.
     * @param gameInfo The informations to use by the state.
     * @param doInitialization Set to true only if the game is entering immediatly in this state.
     *  Only one game state could be constructed with this value at true, because only one game state
     *  must be active at a time.
     */
    public static createInstance(gameInfo: IGameInfo, doInitialization = false) {
        ComputerTurn._instance = new ComputerTurn(gameInfo, doInitialization);
    }

    /**
     * Get the instance of the state ComputerTurn. sThis state is used while the computer is aiming and chosing power.
     * @returns The ComputerTurn state of null if the createInstance method has not been called.
     */
    public static getInstance(): AbstractGameState {
        return ComputerTurn._instance;
    }

    private constructor(gameInfo: IGameInfo, doInitialization = false) {
        super(gameInfo, doInitialization);
        this._computerAI = new ComputerAI(gameInfo.rink, 0.85, Stone.THETA, Difficulty.PERFECT);
    }
    protected performEnteringState(): void {
        //TODO : Pass in parameters the real arrays.
        let shotParameters = this._computerAI.determineNextShotParameters([], []);
        this._gameInfo.shotParameters.power = shotParameters.power;
        this._gameInfo.shotParameters.direction = shotParameters.direction;
        this._gameInfo.shotParameters.spin = shotParameters.spin;
        this.leaveState(ComputerShooting.getInstance());
    }

    protected performLeavingState() {
        //Nothing to do
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
