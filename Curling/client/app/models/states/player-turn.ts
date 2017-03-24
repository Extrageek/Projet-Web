import { Clock, Vector3 } from "three";
import { AbstractGameState } from "./abstract-game-state";
import { IGameInfo } from "./../../services/game-handler/game-info.interface";
import { CameraType } from "./../../services/game-physics/camera-type";
import { GameComponent } from "../../models/game-component.interface";
import { PlayerShooting } from "./player-shooting";
import { CurrentPlayer } from "../../models/current-player";
import { calculateMousePosition } from "./../../services/game-physics/mouse-position-calculate";

export class PlayerTurn extends AbstractGameState {

    public static readonly SHOT_ANGLE_MINIMUM = -2.25;
    public static readonly SHOT_ANGLE_MAXIMUM = 2.25;
    private static readonly SHOT_POWER_MINIMUM = 0.2;
    private static readonly SHOT_POWER_MAXIMUM = 4;
    private static readonly SHOT_POWER_OFFSET = 1;
    private static readonly MAX_PROGRESS_BAR_PERCENT = 100;
    private static readonly LINE_WAIT = 2;
    private static readonly UPDATE_NAME = "PlayerTurn";

    private static _instance: AbstractGameState = null;
    private _powerTimer: Clock;

    //Variable added to be sure to pass in the performMouseButtonPress() first than in the
    //performMouseButtonReleased(). Even if the user pull his mouse out of the window and release the button
    //out of the window, it will not pass two times in the same function.
    private _mouseIsPressed: boolean;

    /**
     * Initialize the unique PlayerTurn state.
     * @param gameInfo The informations to use by the state.
     * @param doInitialization Set to true only if the game is entering immediatly in this state.
     *  Only one game state could be constructed with this value at true, because only one game state
     *  must be active at a time.
     */
    public static createInstance(gameInfo: IGameInfo, doInitialization = false): void {
        PlayerTurn._instance = new PlayerTurn(gameInfo, doInitialization);
    }

    /**
     * Get the instance of the state PlayerTurn. This state is used while the user is aiming and selecting power.
     * @returns The PlayerTurn state of null if the createInstance method has not been called.
     */
    public static getInstance(): AbstractGameState {
        return PlayerTurn._instance;
    }

    private constructor(gameInfo: IGameInfo, doInitialization = false) {
        super(gameInfo, doInitialization);
        this._powerTimer = new Clock(false);
        this._mouseIsPressed = false;
    }

    public performEnteringState(): void {
        this._gameInfo.isSelectingPower = true;
        this._gameInfo.power = 0;
        this._gameInfo.line.lineDashedMaterial.visible = true;
        this._gameInfo.gameStatus.currentPlayer = CurrentPlayer.BLUE;
    }

    public performLeavingState() {
        this._gameInfo.line.lineDashedMaterial.visible = false;
    }

    public performMouseMove(event: MouseEvent): AbstractGameState {
        this._gameInfo.mousePositionPlaneXZ = calculateMousePosition(event, this._gameInfo.currentCamera);

        // Clamp to angle range
        // Under
        if (this._gameInfo.mousePositionPlaneXZ.x < PlayerTurn.SHOT_ANGLE_MINIMUM) {
            this._gameInfo.mousePositionPlaneXZ.x = PlayerTurn.SHOT_ANGLE_MINIMUM;
        }
        // Over
        if (this._gameInfo.mousePositionPlaneXZ.x > PlayerTurn.SHOT_ANGLE_MAXIMUM) {
            this._gameInfo.mousePositionPlaneXZ.x = PlayerTurn.SHOT_ANGLE_MAXIMUM;
        }

        return null;
    }


    public performMouseButtonPress(): AbstractGameState {
        if (!this._mouseIsPressed) {
            this._mouseIsPressed = true;
            this._gameInfo.power = 0;
            this._powerTimer.start();
        }
        return null;
    }

    public performMouseButtonReleased(): AbstractGameState {
        let newState: AbstractGameState = null;
        if (this._mouseIsPressed) {
            this._mouseIsPressed = false;
            this._gameInfo.isSelectingPower = false;
            this._powerTimer.stop();

            let timeDelta = (this._powerTimer.oldTime - this._powerTimer.startTime) / 1000;
            if (timeDelta > PlayerTurn.SHOT_POWER_MINIMUM) {
                this._gameInfo.speed = PlayerTurn.SHOT_POWER_OFFSET;
                this._gameInfo.speed += (timeDelta > PlayerTurn.SHOT_POWER_MAXIMUM) ?
                    PlayerTurn.SHOT_POWER_MAXIMUM : timeDelta;
                this._gameInfo.direction = this._gameInfo.line.lineGeometry.vertices[1].clone().normalize();
                newState = PlayerShooting.getInstance();
            }
        }
        return newState;
    }

    public update(timePerFrame: number) {
        if (this._mouseIsPressed) {
            this._powerTimer.getDelta();
            this._gameInfo.power = Math.min((this._powerTimer.oldTime - this._powerTimer.startTime) / 1000 /
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
        this._gameInfo.line.lineGeometry.vertices.push(new Vector3(this._gameInfo.mousePositionPlaneXZ.x, 0.1, 22.4));
        this._gameInfo.line.lineGeometry.computeLineDistances();
        this._gameInfo.line.lineGeometry.verticesNeedUpdate = true;
    }

}
