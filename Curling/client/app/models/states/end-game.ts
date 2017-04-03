import { Vector3 } from "three";
import { AbstractGameState } from "./abstract-game-state";
import { IGameInfo } from "./../../services/game-handler/game-info.interface";
import { ParticlesService } from "./../../services/game-physics/particles.service";

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
        console.log("entering end game set");
        this._gameInfo.cameraService.moveCameraEndRink();
        this._gameInfo.lighting.adjustEndGameStateLighthing(this._gameInfo.scene);
        //this._gameInfo.particlesService = new ParticlesService(this._gameInfo.scene);
        let textPositin = new Vector3(6, 3, 17);
        if (this._gameInfo.gameStatus.scorePlayer > this._gameInfo.gameStatus.scoreComputer) {
            this._gameInfo.textureHandler.addText(textPositin, "Vous avez gagné!", 0x0000ff);
        }
        else if (this._gameInfo.gameStatus.scorePlayer < this._gameInfo.gameStatus.scoreComputer) {
            this._gameInfo.textureHandler.addText(textPositin, "Vous avez perdu!", 0xff0000);
        }
        else {
            this._gameInfo.textureHandler.addText(textPositin, "C'est une partie nulle", 0x000000);

        }
        this._gameInfo.gameStatus.gameIsFinished();
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
