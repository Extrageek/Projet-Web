import { Group, MeshPhongMaterial, ObjectLoader, Object3D, Vector3 } from "three";
import { RinkInfo } from "./rinkInfo.interface";

export class Rink extends Group implements RinkInfo {
    public static readonly TARGET_CENTER = new Vector3(/*TODO:Find the center*/);
    public static readonly TARGET_RADIUS = 1/*TODO:Find the radius*/;
    public static readonly INITIAL_STONE_POSITION = new Vector3(0, 0, -15);

    private static readonly MODEL_PATH = "/assets/models/json/curling-rink.json";
    private static readonly POSITION = {x: 0, y: 0, z: 0};
    private static readonly SCALE = {x: 1, y: 1, z: 1};
    private static readonly MATERIAL_PROPERTIES = {wireframe: false, shininess: 0.4};

    private _material: MeshPhongMaterial;

    public static createRink(objectLoader: ObjectLoader): Promise<Rink> {
        return new Promise<Rink>((resolve, reject) => {
            objectLoader.load(
                Rink.MODEL_PATH,
                (obj: Object3D) => {
                    resolve(new Rink(obj));
                }
            );
        });
    }

    //The constructor is private because the loading of the 3D model is asynchronous.
    //To obtain a Rink object, the createRink method must be called.
    //The <this> tag must have been put because of perhaps an error in the declaration of the parameters in the method
    //copy of typescript. Now, with the <this> tag, the group object passed in parameter is copied in the this class to
    //obtain a Rink object.
    private constructor(groupObject: Object3D) {
        super();
        this.copy(<this>groupObject, true);
        this._material = new MeshPhongMaterial(Rink.MATERIAL_PROPERTIES);
        this.position.set(Rink.POSITION.x, Rink.POSITION.y, Rink.POSITION.z);
        this.scale.set(Rink.SCALE.x, Rink.SCALE.y, Rink.SCALE.z);
    }

    public get material() {
        return this._material;
    }

    public get targetCenter(): Vector3 {
        return Rink.TARGET_CENTER;
    }

    public get targetRadius(): number {
        return Rink.TARGET_RADIUS;
    }

    public get initialStonePosition(): Vector3 {
        return Rink.INITIAL_STONE_POSITION;
    }
}