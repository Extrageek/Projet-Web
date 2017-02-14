import { ObjectLoader, Group, MeshPhongMaterial, Object3D, Vector3 } from "three";
import { GameComponent } from "./gameComponent.interface";

export enum StoneColor {
    Red = 0,
    Blue,
    NumberOfColors
}

export class Stone extends Group implements GameComponent {

    private static readonly STONES_PATH =
        ["/assets/models/json/curling-stone-red.json", "/assets/models/json/curling-stone-blue.json"];
    private static readonly SCALE = {x: 1, y: 1, z: 1};
    private static readonly MATERIAL_PROPERTIES = {wireframe: false, shininess: 0.7};

    private _material: MeshPhongMaterial;
    private _stoneColor: StoneColor;

    public static createStone(objectLoader: ObjectLoader, stoneColor: StoneColor,
        initialPosition: Vector3): Promise<Stone> {
            return new Promise<Stone>((resolve, reject) => {
                objectLoader.load(
                    Stone.STONES_PATH[stoneColor],
                    (obj: Object3D) => {
                        resolve(new Stone(obj, initialPosition, stoneColor));
                    }
                );
            });
        }

    //The constructor is private because the loading of the 3D model is asynchronous.
    //To obtain a Stone object, the createStone method must be called.
    //The <this> tag must have been put because of perhaps an error in the declaration of the parameters in the method
    //copy of typescript. Now, with the <this> tag, the group object passed in parameter is copied in the this class to
    //obtain a stone object.
    private constructor(obj: Object3D, initialPosition: Vector3, stoneColor: StoneColor) {
        super();
        this.copy(<this>obj, true);
        this._material = new MeshPhongMaterial(Stone.MATERIAL_PROPERTIES);
        this.position.set(initialPosition.x, initialPosition.y, initialPosition.z);
        this.scale.set(Stone.SCALE.x, Stone.SCALE.y, Stone.SCALE.z);
        this._stoneColor = stoneColor;
    }

    public get material() {
        return this._material;
    }

    public get stoneColor() {
        return this._stoneColor;
    }

    public update() {
        //TODO : Make the physic movement here
    }
}
