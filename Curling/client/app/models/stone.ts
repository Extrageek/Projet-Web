import { ObjectLoader, Object3D, Scene } from "three";

export enum StoneColor {
    Red = 0,
    Blue
}

export class Stone implements GameComponent {

    private static readonly STONES_PATH =
        ["/assets/models/json/curling-stone-red.json", "/assets/models/json/curling-stone-blue.json"];
    private static readonly INITIAL_POSITION = {x: 0, y: 0, z: -15};

    private objectLoaded: boolean;
    private stone: Object3D;

    constructor(stoneColor: StoneColor, modelLoader: ObjectLoader, callBackWhenFinishLoading: Function) {
        this.objectLoaded = false;
        modelLoader.load(Stone.STONES_PATH[stoneColor], (obj: Object3D) => {
            this.objectLoaded = true;
            obj.position.set(Stone.INITIAL_POSITION.x, Stone.INITIAL_POSITION.y, Stone.INITIAL_POSITION.z);
            this.stone = obj;
            callBackWhenFinishLoading();
        });
    }

    public addToScene(scene: Scene): boolean {
        if (this.objectLoaded) {
            scene.add(this.stone);
        }
        return this.objectLoaded;
    }

    public removeFromScene(scene: Scene): boolean {
        if (this.objectLoaded) {
            scene.remove(this.stone);
        }
        return this.objectLoaded;
    }

    public update() {
        //TODO : Make the physic movement here
    }
}
