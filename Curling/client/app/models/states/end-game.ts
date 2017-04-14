import { Vector3 } from "three";
import { AbstractGameState } from "./abstract-game-state";
import { IGameInfo } from "../../services/game-handler/game-info.interface";
import { IGameServices } from "../../services/game-handler/games-services.interface";
import { StoneColor } from "../stone";

/**
 * This state is used when the game is finished. It performs the animation of the stones and show text.
 */
export class EndGame extends AbstractGameState {

    private static readonly TEXT_POSITION = new Vector3(6, 3, 20);
    private static readonly RED = 0xff0000;
    private static readonly BLUE = 0x0000ff;
    private static readonly YELLOW = 0xffff00;
    private static _instance: AbstractGameState = null;

    private _endGameTextIdentifier: number;

    public static createInstance(gameServices: IGameServices, gameInfo: IGameInfo) {
        EndGame._instance = new EndGame(gameServices, gameInfo);
    }

    public static getInstance(): AbstractGameState {
        return EndGame._instance;
    }

    private constructor(gameServices: IGameServices, gameInfo: IGameInfo) {
        super(gameServices, gameInfo);
    }

    protected performEnteringState() {
        this._gameServices.cameraService.setPerspectiveCameraCurrent();
        this._gameServices.cameraService.movePCameraEndRink();
        Object.defineProperty(this._gameInfo.gameComponentsToUpdate, "particleService",
            { value: this._gameServices.particlesService });
        this._gameServices.particlesService.addParticulesToScene();
        this.addAppropriateEndGameText();
        this._gameInfo.gameStatus.gameIsFinished();
    }

    private addAppropriateEndGameText() {
        if (this._gameInfo.gameStatus.scorePlayer > this._gameInfo.gameStatus.scoreComputer) {
            this._gameServices.stoneHandler.bounceWinningPlayerStones(StoneColor.Blue);
            this.addEndGameText(EndGame.TEXT_POSITION, "Vous avez gagne!", EndGame.BLUE);
        }
        else if (this._gameInfo.gameStatus.scorePlayer < this._gameInfo.gameStatus.scoreComputer) {
            this._gameServices.stoneHandler.bounceWinningPlayerStones(StoneColor.Red);
            this.addEndGameText(EndGame.TEXT_POSITION, "Vous avez perdu!", EndGame.RED);
        }
        else {
            this.addEndGameText(EndGame.TEXT_POSITION, "C'est une partie nulle", EndGame.YELLOW);
        }
    }

    protected performLeavingState(): Promise<void> {
        this.removeEndGameText();
        delete this._gameInfo.gameComponentsToUpdate["particleService"];
        return Promise.resolve();
    }

    private addEndGameText(position: Vector3, text: string, textColor: number) {
        this._endGameTextIdentifier = this._gameServices.textureHandler.addText(position, text, textColor);
    }

    private removeEndGameText() {
        this._gameServices.textureHandler.removeText(this._endGameTextIdentifier);
    }

    /**
     * Bloc the camera toggle by overriding this method.
     */
    protected performCameraToggle(): AbstractGameState {
        return null;
    }
}
