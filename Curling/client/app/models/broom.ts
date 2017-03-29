import { ObjectLoader, Group, MeshPhongMaterial, Object3D, BoxGeometry, Vector3 } from "three";
import { Stone } from "./stone";

export class Broom extends Group {

    private static readonly BROOM_PATH = "/assets/models/json/broom.json";
    private static readonly SCALE = { x: 0.4, y: 0.4, z: 0.4 };
    private static readonly MATERIAL_PROPERTIES = { wireframe: false, shininess: 0.7 };
    private static readonly BOUNDING_SPHERE_RADIUS = 1;
    private _material: MeshPhongMaterial;
    //Bounding sphere used for collisions. Only works if the stones are displaced on the XZ plane.
    private _redBroom: Boolean;
    private _boundingSphere: THREE.Sphere;

    public static createBroom(objectLoader: ObjectLoader, initialPosition: Vector3): Promise<Broom> {
        return new Promise<Broom>((resolve, reject) => {
            objectLoader.load(
                Broom.BROOM_PATH,
                (obj: Object3D) => {
                    resolve(new Broom(obj, initialPosition));
                }
            );
        });
    }

    constructor(obj: Object3D, initialPosition: Vector3) {
        super();
        this.copy(<this>obj, true);
        this._material = new MeshPhongMaterial(Broom.MATERIAL_PROPERTIES);
        this.position.set(0, 0, -11.4);
        this.scale.set(Broom.SCALE.x, Broom.SCALE.y, Broom.SCALE.z);
        this._redBroom = true;
        this._boundingSphere = new THREE.Sphere(this.position, Broom.BOUNDING_SPHERE_RADIUS);
    }

    public changeColourTo(newColour: number) {
        for (let i = 0; i < this.children.length; i++) {
            let child = this.children[i];
            (<THREE.MeshStandardMaterial>(<THREE.Mesh>child).material).emissive.setHex(newColour);
        }
        if (THREE.ColorKeywords.green === newColour) {
            this._redBroom = false;
        } else if (THREE.ColorKeywords.red === newColour) {
            this._redBroom = true;
        }
    }

    public isRed(): Boolean {
        return this._redBroom;
    }

    public verifyBroomCollision(stones: Stone[]) {
        stones.map((stone: Stone) => {
            if (this._boundingSphere.intersectsSphere(stone.boundingSphere)) {
                stone.sweeping = true;
            }
        });
    }
}
