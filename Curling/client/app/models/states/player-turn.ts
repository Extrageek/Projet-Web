import { Clock, Vector3 } from "three";
import { AbstractGameState } from "./abstract-game-state";
import { CameraType } from "./../../services/game-physics/camera-type";
import { PlayerShooting } from "./player-shooting";
import { CurrentPlayer } from "../../models/current-player";
import { calculateMousePositionOnXZPlane } from "./../../services/game-physics/mouse.service";
import { IGameInfo } from "./../../services/game-handler/game-info.interface";
import { IGameServices } from "../../services/game-handler/games-services.interface";
import { IAngularInfo } from "../../services/game-handler/angular-info.interface";

export class PlayerTurn extends AbstractGameState {

    public static readonly SHOT_ANGLE_MINIMUM = -2.25;
    public static readonly SHOT_ANGLE_MAXIMUM = 2.25;
    private static readonly SHOT_POWER_MINIMUM = 0.2;
    private static readonly SHOT_POWER_MAXIMUM = 4;
    private static readonly SHOT_POWER_OFFSET = 1;
    private static readonly MAX_PROGRESS_BAR_PERCENT = 100;
    private static readonly ONE_SECOND = 1000;
    private static readonly LINE_WAIT = 2;
    private static readonly UPDATE_NAME = "PlayerTurn";

    private static _instance: AbstractGameState = null;

    private _angularInfo: IAngularInfo;
    private _powerTimer: Clock;
    private _spinParameter: number;
    //Variable added to be sure to pass in the performMouseButtonPress() first than in the
    //performMouseButtonReleased(). Even if the user pull his mouse out of the window and release the button
    //out of the window, it will not pass two times in the same function.
    private _mouseIsPressed: boolean;
    private _mousePosition: Vector3;

    /**
     * Initialize the unique PlayerTurn state.
     * @param gameInfo The informations to use by the state.
     * @param doInitialization Set to true only if the game is entering immediatly in this state.
     *  Only one game state could be constructed with this value at true, because only one game state
     *  must be active at a time.
     */
    public static createInstance(gameServices: IGameServices, gameInfo: IGameInfo, angularInfo: IAngularInfo) {
        PlayerTurn._instance = new PlayerTurn(gameServices, gameInfo, angularInfo);
    }

    /**
     * Get the instance of the state PlayerTurn. This state is used while the user is aiming and selecting power.
     * @returns The PlayerTurn state of null if the createInstance method has not been called.
     */
    public static getInstance(): AbstractGameState {
        return PlayerTurn._instance;
    }

    private constructor(gameServices: IGameServices, gameInfo: IGameInfo, angularInfo: IAngularInfo) {
        super(gameServices, gameInfo);
        this._angularInfo = angularInfo;
        this._powerTimer = new Clock(false);
        this._mouseIsPressed = false;
        this._mousePosition = new Vector3();
        this._spinParameter = 0;
    }

    public performEnteringState() {
        this._angularInfo.isSelectingPower = true;
        this._angularInfo.powerBar = 0;
        this._gameInfo.line.lineDashedMaterial.visible = true;
        this._gameInfo.gameStatus.currentPlayer = CurrentPlayer.BLUE;
    }

    public performLeavingState() {
        this._gameInfo.line.lineDashedMaterial.visible = false;
        this._angularInfo.isSelectingPower = false;
    }

    protected performSpinButtonPressed(): AbstractGameState {
        this._spinParameter = (this._spinParameter + 1) % 2;
        this._angularInfo.spin = this._spinParameter;
        return null;
    }

    public performMouseMove(event: MouseEvent): AbstractGameState {
        let mousePosition = calculateMousePositionOnXZPlane(event, this._gameServices.cameraService.currentCamera);
        if (mousePosition) {
            this._mousePosition = mousePosition;
            // Clamp to angle range if the mouse is farther than the angle minimum or maximum.
            if (this._mousePosition.x < PlayerTurn.SHOT_ANGLE_MINIMUM) {
                this._mousePosition.x = PlayerTurn.SHOT_ANGLE_MINIMUM;
            } else if (this._mousePosition.x > PlayerTurn.SHOT_ANGLE_MAXIMUM) {
                this._mousePosition.x = PlayerTurn.SHOT_ANGLE_MAXIMUM;
            }
        }
        return null;
    }

    public performMouseButtonPress(): AbstractGameState {
        if (!this._mouseIsPressed) {
            this._mouseIsPressed = true;
            this._angularInfo.powerBar = 0;
            this._powerTimer.start();
        }
        return null;
    }

    public performMouseButtonReleased(): AbstractGameState {
        let newState: AbstractGameState = null;
        if (this._mouseIsPressed) {
            this._mouseIsPressed = false;
            this._powerTimer.stop();

            let timeDelta = (this._powerTimer.oldTime - this._powerTimer.startTime) / PlayerTurn.ONE_SECOND;
            if (timeDelta > PlayerTurn.SHOT_POWER_MINIMUM) {
                AbstractGameState.shotParameters.spin = this._spinParameter;
                AbstractGameState.shotParameters.power = PlayerTurn.SHOT_POWER_OFFSET;
                AbstractGameState.shotParameters.power += (timeDelta > PlayerTurn.SHOT_POWER_MAXIMUM) ?
                    PlayerTurn.SHOT_POWER_MAXIMUM : timeDelta;
                AbstractGameState.shotParameters.direction = this._gameInfo.line.lineGeometry.vertices[1]
                    .clone()
                    .normalize();
                //Set the y value to zero because the line geometry is not exactly at y = 0.
                AbstractGameState.shotParameters.direction.setY(0);
                newState = PlayerShooting.getInstance();
            }
        }
        return newState;
    }

    public update(timePerFrame: number) {
        if (this._mouseIsPressed) {
            this._powerTimer.getDelta();
            this._angularInfo.powerBar = Math.min(
                (this._powerTimer.oldTime - this._powerTimer.startTime) / PlayerTurn.ONE_SECOND /
                PlayerTurn.SHOT_POWER_MAXIMUM * PlayerTurn.MAX_PROGRESS_BAR_PERCENT,
                PlayerTurn.MAX_PROGRESS_BAR_PERCENT
            );
        }
        this.updateLine();
    }

    private updateLine() {
        if (this._gameInfo.line.lineAnimationSlower > PlayerTurn.LINE_WAIT) {
            this._gameInfo.line.lineDashedMaterial.gapSize = ++this._gameInfo.line.lineDashedMaterial.gapSize % 3 + 1;
            this._gameInfo.line.lineAnimationSlower = 0;
        }
        ++this._gameInfo.line.lineAnimationSlower;
        this._gameInfo.line.lineGeometry.vertices.pop();
        this._gameInfo.line.lineGeometry.vertices.push(new Vector3(this._mousePosition.x, 0.1, 22.4));
        this._gameInfo.line.lineGeometry.computeLineDistances();
        this._gameInfo.line.lineGeometry.verticesNeedUpdate = true;
    }
}
