import { Injectable } from "@angular/core";
import { Scene, PerspectiveCamera, WebGLRenderer, Renderer, ObjectLoader, FontLoader, Geometry, CubeGeometry,
    TextGeometry, MeshBasicMaterial, MeshFaceMaterial, MeshPhongMaterial, MultiMaterial, Mesh, SpotLight, Group,
    Line, LineDashedMaterial, Font, ImageUtils, BackSide, FlatShading, SmoothShading, Vector3, Clock } from "three";
import { GameStatusService } from './../game-status.service';
import { CameraService } from './../views/cameras.service';
import { Arena } from './../../models/scenery/arena';
import { Rink } from './../../models/scenery/rink';
import { Stone, StoneColor } from './../../models/stone';
import { RinkInfo } from './../../models/scenery/rink-info.interface';
import { StoneHandler, Points } from '../game-physics/stone-handler';
import { CameraType } from '../game-physics/camera-type';

import { LightingService } from './../views/ligthing.service';
import { TextureHandler } from '../views/texture-handler';
import { IGameInfo } from "./game-info.interface";
import { AbstractGameState } from "../states/abstract-game-state";
import { LoadingStone } from "../states/loading-stone";
import { PlayerTurn } from "../states/player-turn";
import { ComputerTurn } from "../states/computer-turn";
import { Shooting } from "../states/shooting";
import { EndSet } from "../states/end-set";
import { EndGame } from "../states/end-game";

@Injectable()
export class RenderService {

    private static readonly NUMBER_OF_MODELS_TO_LOAD = 3;

    private _numberOfModelsLoaded: number;
    private _currentCamera: PerspectiveCamera;
    private _lightingService: LightingService;
    private _objectLoader: ObjectLoader;
    private _mesh: Mesh;
    private _clock: Clock;
    private _renderer: Renderer;
    private _animationStarted: boolean;

    _gameInfo: IGameInfo;

    constructor(gameStatusService: GameStatusService, cameraService: CameraService, lightingService: LightingService) {
        console.log("here!");
        this._gameInfo = {
            gameStatus: gameStatusService.gameStatus,
            cameraService: cameraService,
            scene: new Scene(),
            currentCamera: CameraType.PERSPECTIVE_CAM,
            gameComponentsToUpdate: new Object(),
            isSelectingPower: false,
            line: {lineGeometry: null, lineDashedMaterial: null, lineMesh: null, lineAnimationSlower: null},
            mousePositionPlaneXZ: new Vector3(0, 0, 0),
            power: 0,
            gameState: null,
            direction: null,
            speed: 0,
            stoneHandler: null,
            textureHandler: null
        };
        this._lightingService = lightingService;
        Object.defineProperty(this._gameInfo.gameComponentsToUpdate, "cameraService", {value: cameraService});
        this._gameInfo.gameStatus.randomFirstPlayer();
        this._animationStarted = false;
        this._numberOfModelsLoaded = 0;
        this._objectLoader = new ObjectLoader();
    }

    public init(container: HTMLElement) {
        console.log("init!");
        //Clock for the time per frame.
        this._clock = new Clock(false);

        this._renderer = new WebGLRenderer({antialias: true, devicePixelRatio: window.devicePixelRatio});
        this._renderer.setSize(window.innerWidth, window.innerHeight, true);

        this._currentCamera = this._gameInfo.cameraService.perspectiveCamera;

        //Part 2: Scenery
        this.loadLine();
        this._lightingService.setUpLighting(this._gameInfo.scene);
        this.generateSkybox();

        //Part 3: Components
        this.loadTextureHandler();
        this.loadRink();
        this.loadArena();

        //Part 4: Service
        this.linkRenderServerToCanvas(container);

        //Part 5: Events
        // bind to window resizes
        window.addEventListener('resize', _ => this.onResize());
    }

    public loadLine() {
        let geometry = new Geometry();
        geometry.vertices.push(new Vector3(0, 0.1, -11.1)); // First HogLine
        geometry.vertices.push(new Vector3(0, 0.1, 22.4)); // EndPoint
        geometry.computeLineDistances();

        let material = new LineDashedMaterial({
            color: 0x0000e0,
            linewidth: 5,
            dashSize: 1,
            gapSize: 1,
            visible: false
        });

        this._gameInfo.line.lineGeometry = geometry;
        this._gameInfo.line.lineDashedMaterial = material;
        this._gameInfo.line.lineMesh = new Line(geometry, material);
        this._gameInfo.line.lineAnimationSlower = 0;
        this._gameInfo.scene.add(this._gameInfo.line.lineMesh);
    }

    public linkRenderServerToCanvas(container: HTMLElement) {
        // Inser the canvas into the DOM
        if (container.getElementsByTagName('canvas').length === 0) {
            container.appendChild(this._renderer.domElement);
        }
    }

    /**
     * See : http://danni-three.blogspot.ca/2013/09/threejs-skybox.html
     */
    private generateSkybox() {
        let imagePrefix = "../../assets/images/frozen_";
        let directions = ["rt", "lf", "up", "dn", "ft", "bk"];
        let imageSuffix = ".jpg";
        let materialArray = Array<MeshBasicMaterial>();
        for (let i = 0; i < 6; i++) {
            materialArray.push( new MeshBasicMaterial({
                map: ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
                side: BackSide
            }));
        }
        let geometry = new CubeGeometry(200, 200, 200);
        let material = new MeshFaceMaterial(materialArray);
        this._mesh = new Mesh(geometry, material);
        this._gameInfo.scene.add(this._mesh);
    }


    private loadTextureHandler() {
        TextureHandler.createTextureHandler(this._gameInfo.scene)
            .then((textureHandler: TextureHandler) => {
                this._gameInfo.textureHandler = textureHandler;
                this.onFinishedLoadingModel();
            })
            .catch((error) => {
                //Switch to error state
                console.log(error);
            });
    }

    private loadRink() {
        Rink.createRink(this._objectLoader).then((rink: Rink) => {
            this._mesh.add(rink);
            this.loadStoneHandler(rink);
        });
    }

    private loadArena() {
        Arena.createArena(this._objectLoader).then((arena: Arena) => {
            this._mesh.add(arena);
            this.onFinishedLoadingModel();
        });
    }

    //Must be called after the rinkinfo is initialised.
    public loadStoneHandler(rinkInfo: RinkInfo) {
        let stoneColor: StoneColor;
        stoneColor = this._gameInfo.gameStatus.currentPlayer === 0 ? StoneColor.Blue : StoneColor.Red;
        this._gameInfo.stoneHandler = new StoneHandler(this._objectLoader, rinkInfo, stoneColor);
        Object.defineProperty(this._gameInfo.gameComponentsToUpdate, "stoneHandler",
            {value: this._gameInfo.stoneHandler});
        this.initializeAllStates(stoneColor);
        this._gameInfo.gameState = LoadingStone.getInstance();
        this.onFinishedLoadingModel();
    }

    private initializeAllStates(stoneColor: number) {
        LoadingStone.createInstance(this._gameInfo, true);
        PlayerTurn.createInstance(this._gameInfo);
        ComputerTurn.createInstance(this._gameInfo);
        Shooting.createInstance(this._gameInfo);
        EndSet.createInstance(this._gameInfo);
        EndGame.createInstance(this._gameInfo);
    }

    public switchCamera() {
        this._currentCamera = this._gameInfo.cameraService.nextCamera();
        this._gameInfo.currentCamera = (this._gameInfo.currentCamera + 1) % CameraType.NB_CAMERAS;
        this.onResize();
    }

    private onFinishedLoadingModel() {
        ++this._numberOfModelsLoaded;
        if (!this._animationStarted && this._numberOfModelsLoaded >= RenderService.NUMBER_OF_MODELS_TO_LOAD) {
            this._animationStarted = true;
            if (document.hasFocus()) {
                this._clock.start();
            }
            // Add events here to be sure they won't encounter undefined property
            window.addEventListener('mousemove', (event: MouseEvent) => this.onMouseMove(event));
            window.addEventListener('keydown', (event: KeyboardEvent) => this.switchSpin(event));
            window.addEventListener('mousedown', _ => this.onMousePressed());
            window.addEventListener('mouseup', _ => this.onMouseReleased());
            this.animate();
        }
    }

    private animate() {
        window.requestAnimationFrame(_ => this.animate());

        if (this._clock.running === true) {
            let timePerFrame = this._clock.getDelta();
            let keys = Object.getOwnPropertyNames(this._gameInfo.gameComponentsToUpdate);
            keys.forEach((key: string, index: number, array: string[]) => {
                this._gameInfo.gameComponentsToUpdate[key].update(timePerFrame);
            });
        }
        this._renderer.render(this._gameInfo.scene, this._currentCamera);
    }

    public toogleFocus(toogle: boolean) {
        if (toogle === true) {
            this._clock.start();
        }
        else {
            this._clock.stop();
        }
    }

    onWindowResize() {
        let factor = 0.8;
        let newWidth: number = window.innerWidth * factor;
        let newHeight: number = window.innerHeight * factor;

        this._currentCamera.aspect = newWidth / newHeight;
        this._currentCamera.updateProjectionMatrix();

        this._renderer.setSize(newWidth, newHeight);
    }

    onResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        this._currentCamera.aspect = width / height;
        this._currentCamera.updateProjectionMatrix();

        this._renderer.setSize(width, height);
    }

    switchSpin(event: KeyboardEvent) {
        let sKeyCode = 83;
        if (event.keyCode === sKeyCode) {
            this._gameInfo.stoneHandler.invertSpin();
        }
    }

    onMouseMove(event: MouseEvent) {
        this._gameInfo.gameState.onMouseMove(event);
    }

    onMousePressed() {
        this._gameInfo.gameState.onMouseButtonPress();
    }

    onMouseReleased() {
        this._gameInfo.gameState.onMouseButtonReleased();
    }

    public updateText(newText: string) {
        //this._textureHandler.setText(newText, this._scene);
    }

    public print() {
        console.log(this);
    }

    public translateMesh(x: number, y: number) {
        print();
        this._mesh.position.x += x;
        this._mesh.position.y += y;
    }
}
