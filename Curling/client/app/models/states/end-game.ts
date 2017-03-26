import { Vector3 } from "three";
import { AbstractGameState } from "./abstract-game-state";
import { IGameInfo } from "./../../services/game-handler/game-info.interface";

export class EndGame extends AbstractGameState {

    private static _instance: AbstractGameState = null;

    /**
     * Initialize the unique EndGame state.
     * @param gameInfo The informations to use by the state.
     * @param doInitialization Set to true only if the game is entering immediatly in this state.
     *  Only one game state could be constructed with this value at true, because only one game state
     *  must be active at a time.
     */
    public static createInstance(gameInfo: IGameInfo, doInitialization = false) {
        EndGame._instance = new EndGame(gameInfo, doInitialization);
    }

    /**
     * Get the instance of the state EndGame. This state is used while the game is finished.
     * @returns The EndGame state of null if the createInstance method has not been called.
     */
    public static getInstance(): AbstractGameState {
        return EndGame._instance;
    }

    private constructor(gameInfo: IGameInfo, doInitialization = false) {
        super(gameInfo, doInitialization);
    }

    protected performEnteringState() {
        if (this._gameInfo.gameStatus.scorePlayer > this._gameInfo.gameStatus.scoreComputer) {
            this._gameInfo.textureHandler.addText(new Vector3(0, 5, -10), "Vous avez gagné!");
            //this._textureHandler.setText("Vous avez gagné!", this._scene);
        }
        else if (this._gameInfo.gameStatus.scorePlayer < this._gameInfo.gameStatus.scoreComputer) {
            this._gameInfo.textureHandler.addText(new Vector3(0, 5, -10), "Vous avez perdu!");
            //this._textureHandler.setText("Vous avez perdu!", this._scene);
        }
        else {
            this._gameInfo.textureHandler.addText(new Vector3(7, 3.5, -18), "C'est une partie nulle.");
            //this._textureHandler.setText("C'est une partie nulle.", this._scene);
        }
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
