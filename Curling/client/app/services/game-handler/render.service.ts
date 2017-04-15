import { Injectable } from "@angular/core";
import {
    Scene, PerspectiveCamera, WebGLRenderer, Renderer, ObjectLoader, Geometry,
    CubeGeometry, MeshBasicMaterial, MultiMaterial, Mesh, Line,
    LineDashedMaterial, ImageUtils, BackSide, Vector3, Clock
} from "three";

import { GameStatusService } from "../game-status.service";
import { CameraService } from "../views/cameras.service";
import { LightingService } from "../views/ligthing.service";
import { ParticlesService } from "../game-physics/particles.service";
import { SoundManager } from "../sound-manager";
import { UserService } from "../user.service";

import { StoneHandler } from "../game-physics/stone-handler";
import { TextureHandler } from "../views/texture-handler";
import { StatesHandler } from "./states-handler";

import { Rink } from "../../models/scenery/rink";
import { Arena } from "../../models/scenery/arena";
import { Broom } from "../../models/broom";

import { StoneColor } from "../../models/stone";
import { IRinkInfo } from "../../models/scenery/rink-info.interface";
import { IGameInfo } from "./game-info.interface";
import { IGameServices } from "./games-services.interface";
import { IAngularInfo } from "./angular-info.interface";

@Injectable()
export class RenderService {

    private static readonly NUMBER_OF_MODELS_TO_LOAD = 4;
    private static readonly MEDIUM_BLUE = 0x0000E0;

    private _numberOfModelsLoaded: number;
    private _lightingService: LightingService;
    private _objectLoader: ObjectLoader;
    private _mesh: Mesh;
    private _scene: Scene;
    private _clock: Clock;
    private _renderer: Renderer;
    private _animationID: number;

    private _gameServices: IGameServices;
    private _gameInfo: IGameInfo;
    public _angularInfo: IAngularInfo;

    constructor(gameStatusService: GameStatusService,
        cameraService: CameraService,
        lightingService: LightingService,
        userService: UserService) {

        this._gameServices = {
            cameraService: cameraService,
            particlesService: null,
            soundService: null,
            stoneHandler: null,
            textureHandler: null,
            userService: userService
        };

        this._gameInfo = {
            gameStatus: gameStatusService,
            broom: null,
            rink: null,
            gameComponentsToUpdate: new Object(),
            line: { lineGeometry: null, lineDashedMaterial: null, lineMesh: null, lineAnimationSlower: null }
        };

        this._angularInfo = {
            isSelectingPower: false,
            powerBar: 0,
            spin: 0,
            showText: false
        };

        this._lightingService = lightingService;
        this._gameInfo.gameStatus.randomFirstPlayer();
        this._animationID = null;
        this._numberOfModelsLoaded = 0;
        this._scene = new Scene();
        this._objectLoader = new ObjectLoader();
    }

    public initAndStart() {
        if (!this._animationID && this._numberOfModelsLoaded >= RenderService.NUMBER_OF_MODELS_TO_LOAD) {
            this.startGame();
        }
        else {
            //Clock for the time per frame.
            this._clock = new Clock(false);

            this._renderer = new WebGLRenderer({ antialias: true, devicePixelRatio: window.devicePixelRatio });

            //Part 2: Scenery
            this.generateSkybox();
            this._lightingService.setUpLighting(this._scene);

            //Part 3: Components
            this.loadComponents();

            //Part 5: Events
            // bind to window resizes
            window.addEventListener("resize", _ => this.onResize());
        }
    }

    public putCanvasIntoHTMLElement(container: HTMLElement) {
        if (this._renderer !== undefined) {
            container.appendChild(this._renderer.domElement);
        }
    }

    public removeCanvasElement() {
        if (this._renderer.domElement.parentElement) {
            this._renderer.domElement.parentElement.removeChild(this._renderer.domElement);
        }
    }

    get gameInfo(): IGameInfo {
        return this._gameInfo;
    }

    private startGame() {
        StatesHandler.getInstance().startGame();
        this._renderer.setSize(window.innerWidth, window.innerHeight);
        this._gameServices.cameraService.resizeCurrentCamera();
        this._clock.start();
        this.animate();
    }

    /**
     * Stop the running game. If the game is loading something asynchronous (a stone), then the game must wait until
     * the resolution of the promise to be able to stop the game. Otherwise, new stones could be loaded before the
     * old stones were cleared. The game cannot be restarted until the promise is resolved.
     * @return Promise<void> A promise that will resolve when the game is really stoped.
     */
    public stopGame(): Promise<void> {
        if (this._animationID) {
            window.cancelAnimationFrame(this._animationID);
            this._clock.stop();
            return StatesHandler.getInstance().stopGame()
                .then(() => {
                    this._animationID = null;
                });
        }
    }

    public loadComponents() {
        this.loadParticleService();
        this.loadSoundService();
        this.loadTextureHandler();
        this.loadRink();
        this.loadArena();
        this.loadLine();
        this.loadBroom();
    }

    private loadParticleService() {
        this._gameServices.particlesService = new ParticlesService(this._scene);
    }

    private loadSoundService() {
        this._gameServices.soundService = SoundManager.getInstance();
    }

    public loadLine() {
        let geometry = new Geometry();
        geometry.vertices.push(new Vector3(0, 0.1, -18)); // First HogLine
        geometry.vertices.push(new Vector3(0, 0.1, 22.4)); // EndPoint
        geometry.computeLineDistances();

        let material = new LineDashedMaterial({
            color: RenderService.MEDIUM_BLUE,
            linewidth: 5,
            dashSize: 1,
            gapSize: 1,
            visible: false
        });

        this._gameInfo.line.lineGeometry = geometry;
        this._gameInfo.line.lineDashedMaterial = material;
        this._gameInfo.line.lineMesh = new Line(geometry, material);
        this._gameInfo.line.lineAnimationSlower = 0;
        this._scene.add(this._gameInfo.line.lineMesh);
    }

    /**
     * See : http://danni-three.blogspot.ca/2013/09/threejs-skybox.html
     */
    public generateSkybox() {
        let imagePrefix = "../../assets/images/scenery_";
        let directions = ["right", "left", "up", "down", "front", "back"];
        let imageSuffix = ".jpg";
        let materialArray = Array<MeshBasicMaterial>();
        for (let i = 0; i < 6; i++) {
            materialArray.push(new MeshBasicMaterial({
                map: ImageUtils.loadTexture(imagePrefix + directions[i] + imageSuffix),
                side: BackSide
            }));
        }
        let material = new MultiMaterial(materialArray);
        let geometry = new CubeGeometry(200, 200, 200);
        this._mesh = new Mesh(geometry, material);
        this._scene.add(this._mesh);
    }

    private loadTextureHandler() {
        TextureHandler.createTextureHandler(this._scene)
            .then((textureHandler: TextureHandler) => {
                this._gameServices.textureHandler = textureHandler;
                this.onFinishedLoadingModel();
            })
            .catch((error) => {
                //Switch to error state
                console.log(error);
            });
    }

    public loadBroom() {
        Broom.createBroom(this._objectLoader, this._scene, new Vector3(0, 0, -11.4))
            .then((broom: Broom) => {
                this._gameInfo.broom = broom;
                this.onFinishedLoadingModel();
            });
    }

    private loadRink() {
        Rink.createRink(this._objectLoader).then((rink: Rink) => {
            this._mesh.add(rink);
            this._gameInfo.rink = rink;
            this.loadStoneHandler(rink);
        });
    }

    private loadArena() {
        Arena.createArena(this._objectLoader).then((arena: Arena) => {
            //this._sceneryService.mesh.add(arena);
            //this._mesh.add(arena);
            this.onFinishedLoadingModel();
        });
    }

    //Must be called after the rinkinfo is initialised.
    private loadStoneHandler(rinkInfo: IRinkInfo) {
        let stoneColor: StoneColor;
        stoneColor = this._gameInfo.gameStatus.currentPlayer === 0 ? StoneColor.Blue : StoneColor.Red;
        this._gameServices.stoneHandler = new StoneHandler(this._objectLoader, rinkInfo, this._scene, stoneColor);
        Object.defineProperty(this._gameInfo.gameComponentsToUpdate, "stoneHandler",
            { value: this._gameServices.stoneHandler });
        Object.defineProperty(this._gameInfo.gameComponentsToUpdate, "cameraService",
            { value: this._gameServices.cameraService });
        this.onFinishedLoadingModel();
    }

    private onFinishedLoadingModel() {
        ++this._numberOfModelsLoaded;
        if (!this._animationID && this._numberOfModelsLoaded >= RenderService.NUMBER_OF_MODELS_TO_LOAD) {
            StatesHandler.createInstance(this._gameServices, this._gameInfo, this._angularInfo);
            this.startGame();
            // Add events here to be sure they won"t encounter undefined property
            window.addEventListener("mousemove", (event: MouseEvent) => this.onMouseMove(event));
            window.addEventListener("keydown", (event: KeyboardEvent) => this.switchSpin(event));
            window.addEventListener("mousedown", _ => this.onMousePressed());
            window.addEventListener("mouseup", _ => this.onMouseReleased());
        }
    }

    private animate() {
        this._animationID = window.requestAnimationFrame(() => this.animate());

        if (this._clock.running === true) {
            let timePerFrame = this._clock.getDelta();
            //Execute the update action in the state
            StatesHandler.getInstance().update(timePerFrame);
            //Update the other components
            let keys = Object.getOwnPropertyNames(this._gameInfo.gameComponentsToUpdate);
            keys.forEach((key: string) => {
                this._gameInfo.gameComponentsToUpdate[key].update(timePerFrame);
            });
        }
        this._renderer.render(this._scene, this._gameServices.cameraService.currentCamera);
    }

    public toogleFocus(toogle: boolean) {
        if (toogle === true) {
            this._clock.start();
        }
        else {
            this._clock.stop();
        }
    }

    onResize() {
        if (this._animationID) {
            this._gameServices.cameraService.resizeCurrentCamera();
            this._renderer.setSize(window.innerWidth, window.innerHeight);
        }
    }

    switchSpin(event: KeyboardEvent) {
        if (this._animationID) {
            let sKeyCode = 83;
            if (event.keyCode === sKeyCode) {
                StatesHandler.getInstance().onSpinButtonPressed();
            }
        }
    }

    public switchCamera() {
        if (this._animationID) {
            StatesHandler.getInstance().onSpacebarPressed();
        }
    }

    onMouseMove(event: MouseEvent) {
        if (this._animationID) {
            StatesHandler.getInstance().onMouseMove(event);
        }
    }

    onMousePressed() {
        if (this._animationID) {
            StatesHandler.getInstance().onMouseButtonPressed();
        }
    }

    onMouseReleased() {
        if (this._animationID) {
            StatesHandler.getInstance().onMouseButtonReleased();
        }
    }
}
