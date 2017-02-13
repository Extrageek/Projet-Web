import { ObjectLoader, Object3D, Scene } from "three";
import { GameComponent } from "../services/gameComponent.interface";
import { RenderToScene } from "../services/renderToScene.interface";

export enum StoneColor {
    Red = 0,
    Blue
}

export class Stone implements GameComponent, RenderToScene {

    private static readonly STONES_PATH =
        ["/assets/models/json/curling-stone-red.json", "/assets/models/json/curling-stone-blue.json"];
    private static readonly INITIAL_POSITION = {x: 0, y: 0, z: -15};

    private _objectLoaded: boolean;
    private _stone: Object3D;

    constructor(stoneColor: StoneColor, modelLoader: ObjectLoader, callBackWhenFinishLoading: Function) {
        this._objectLoaded = false;
        modelLoader.load(Stone.STONES_PATH[stoneColor], (obj: Object3D) => {
            this._objectLoaded = true;
            obj.position.set(Stone.INITIAL_POSITION.x, Stone.INITIAL_POSITION.y, Stone.INITIAL_POSITION.z);
            this._stone = obj;
            callBackWhenFinishLoading();
        });
    }

    public addToScene(scene: Scene): boolean {
        if (this._objectLoaded) {
            scene.add(this._stone);
        }
        return this._objectLoaded;
    }

    public removeFromScene(scene: Scene): boolean {
        if (this._objectLoaded) {
            scene.remove(this._stone);
        }
        return this._objectLoaded;
    }

    public update() {
        //TODO : Make the physic movement here
    }
}
