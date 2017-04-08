import { Vector3 } from "three";
import { AbstractGameState } from "./abstract-game-state";
import { IGameInfo } from "./../../services/game-handler/game-info.interface";
import { ParticlesService } from "./../../services/game-physics/particles.service";
import { StoneColor } from "../stone";

export class EndGame extends AbstractGameState {

    private static _instance: AbstractGameState = null;
    private static readonly TEXT_POSITION = new Vector3(6, 3, 20);
    private static readonly RED = 0xff0000;
    private static readonly BLUE = 0x0000ff;
    private static readonly YELLOW = 0xffff00;

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
        this.addEndGameText();
        this._gameInfo.particlesService = new ParticlesService(this._gameInfo.scene);
        this._gameInfo.gameStatus.gameIsFinished();
    }

    private addEndGameText() {
        if (this._gameInfo.gameStatus.scorePlayer > this._gameInfo.gameStatus.scoreComputer) {
            this._gameInfo.stoneHandler.bounceWinningPlayerStones(StoneColor.Blue);
            this._gameInfo.textureHandler.addText(EndGame.TEXT_POSITION, "Vous avez gagne!", EndGame.BLUE);
        }
        else if (this._gameInfo.gameStatus.scorePlayer < this._gameInfo.gameStatus.scoreComputer) {
            this._gameInfo.stoneHandler.bounceWinningPlayerStones(StoneColor.Red);
            this._gameInfo.textureHandler.addText(EndGame.TEXT_POSITION, "Vous avez perdu!", EndGame.RED);
        }
        else {
            this._gameInfo.textureHandler.addText(EndGame.TEXT_POSITION, "C'est une partie nulle", EndGame.YELLOW);
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
