import { Group, MeshPhongMaterial, Object3D, ObjectLoader } from "three";

export class Arena extends Group {

    private static readonly MODEL_PATH = "/assets/models/json/arena.json";
    private static readonly POSITION = {x: 0, y: 0, z: 0};
    private static readonly SCALE = {x: 1, y: 1, z: 1};
    private static readonly MATERIAL_PROPERTIES = {wireframe: false, shininess: 0.2};

    private _material: MeshPhongMaterial;

    public static createArena(objectLoader: ObjectLoader): Promise<Arena> {
        return new Promise<Arena>((resolve, reject) => {
            objectLoader.load(
                Arena.MODEL_PATH,
                (obj: Object3D) => {
                    resolve(new Arena(obj));
                }
            );
        });
    }

    //The constructor is private because the loading of the 3D model is asynchronous.
    //To obtain an Area object, the createArena method must be called.
    //The <this> tag must have been put because of perhaps an error in the declaration of the parameters in the method
    //copy of typescript. Now, with the <this> tag, the group object passed in parameter is copied in the this class to
    //obtain an Arena object.
    private constructor(groupObject: Object3D) {
        super();
        this.copy(<this>groupObject, true);
        this._material = new MeshPhongMaterial(Arena.MATERIAL_PROPERTIES);
        this.position.set(Arena.POSITION.x, Arena.POSITION.y, Arena.POSITION.z);
        this.scale.set(Arena.SCALE.x, Arena.SCALE.y, Arena.SCALE.z);
    }

    public get material() {
        return this._material;
    }
}
