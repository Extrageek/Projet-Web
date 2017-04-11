import { AbstractGameState } from "./abstract-game-state";
import { EndSet } from "./end-set";
import { LoadingStone } from "./loading-stone";
import { CameraType } from "./../../services/game-physics/camera-type";
import { IGameInfo } from "./../../services/game-handler/game-info.interface";
import { IGameServices } from "../../services/game-handler/games-services.interface";

export class PlayerShooting extends AbstractGameState {

    private static _instance: AbstractGameState = null;
    private static readonly UPDATE_NAME = "PlayerShooting";
    private _isHoldingMouseButton = false;
    private _raycaster = new THREE.Raycaster();

    /**
     * Initialize the unique PlayerShooting state.
     * @param gameInfo The informations to use by the state.
     * @param doInitialization Set to true only if the game is entering immediatly in this state.
     *  Only one game state could be constructed with this value at true, because only one game state
     *  must be active at a time.
     */
    public static createInstance(gameServices: IGameServices, gameInfo: IGameInfo) {
        PlayerShooting._instance = new PlayerShooting(gameServices, gameInfo);
    }

    /**
     * Get the instance of the state PlayerShooting. This state is used while the stones are moving.
     * @returns The PlayerShooting state of null if the createInstance method has not been called.
     */
    public static getInstance(): AbstractGameState {
        return PlayerShooting._instance;
    }

    private constructor(gameServices: IGameServices, gameInfo: IGameInfo) {
        super(gameServices, gameInfo);
    }

    protected performEnteringState() {
        this._gameInfo.broom.showBroom();
        //TODO : CHANGE GREEN ONCE YOU PASS THE FIRST LINE
        this._gameInfo.broom.changeColourTo(THREE.ColorKeywords.green);
        this._gameServices.stoneHandler.performShot(
            AbstractGameState.shotParameters,
            () => {
                this._gameInfo.gameStatus.usedStone();
                let newState: AbstractGameState;
                if (this._gameInfo.gameStatus.currentStonesPlayer === 0
                    && this._gameInfo.gameStatus.currentStonesComputer === 0) {
                    newState = EndSet.getInstance();
                }
                else {
                    newState = LoadingStone.getInstance();
                }
                this.leaveState(newState);
            });
    }

    protected performLeavingState() {
        this._gameInfo.broom.hideBroom();
        this._gameServices.stoneHandler.removeOutOfBoundsStones();
        this._gameInfo.gameStatus.nextPlayer();
        this._gameServices.cameraService.replacePCameraToInitialPosition();
    }

    protected performMouseMove(event: MouseEvent): AbstractGameState {

        let currentCamera: THREE.Camera;
        if (this._gameInfo.currentCamera === CameraType.PERSPECTIVE_CAM) {
            currentCamera = this._gameServices.cameraService.getPerspectiveCamera();
        }
        else if (this._gameInfo.currentCamera === CameraType.ORTHOGRAPHIC_CAM) {
            currentCamera = this._gameServices.cameraService.getTopViewCamera();
        }

        let x = (event.clientX / window.innerWidth) * 2 - 1;
        let y = - (event.clientY / window.innerHeight) * 2 + 1;

        this._raycaster.setFromCamera({ x, y }, currentCamera);

        for (let i = 0; i < this._gameInfo.rink.children.length; i++) {
            let child = this._gameInfo.rink.children[i];
            let intersects = this._raycaster.intersectObject(child);
            if (intersects.length > 0) {
                this._gameInfo.broom.position.set(0, 0, 0);
                this._gameInfo.broom.position.copy(intersects[0].point);
            }
        }
        return null;
    }

    protected performMouseButtonPress(): AbstractGameState {
        if (!this._gameInfo.broom.isRed()) {
            this._gameInfo.broom.position.add(new THREE.Vector3(0.2, 0, 0));
            this._gameServices.soundService.broomInSound;
            if (!this._isHoldingMouseButton) {
                this._isHoldingMouseButton = true;
                this._gameInfo.broom.verifyBroomCollision(this._gameServices.stoneHandler.stoneOnTheGame);
            }
        }
        return null;
    }

    protected performMouseButtonReleased(): AbstractGameState {
        if (!this._gameInfo.broom.isRed()) {
            this._gameInfo.broom.translateZ(0.3);
            this._isHoldingMouseButton = false;
            this._gameServices.soundService.broomOutSound;
        }
        return null;
    }

    public update(timePerFrame: number) {
        if (this._gameServices.stoneHandler.checkPassHogLine()) {
            this._gameInfo.broom.changeColourTo(THREE.ColorKeywords.red);
        }
        else {
            this._gameInfo.broom.changeColourTo(THREE.ColorKeywords.green);
        }
    }
}
