import {
    Geometry, ParticleBasicMaterial, Vector3, ParticleSystem,
    Scene, Particle, PointsMaterial, Points
} from "three";
import { IGameInfo } from "./../game-handler/game-info.interface";

export class ParticlesService {

    private readonly PARTICLES_COUNT = 1800;
    private _geometry: Geometry;
    private _material: PointsMaterial;
    private _particleSystem: Points;

    constructor(scene: Scene) {
        this._geometry = new THREE.Geometry();
        this._material = new THREE.PointsMaterial({
            color: 0xFFF000,
            size: 0.5
        });
        this.createParticles(scene);
    }

    private createParticles(scene: Scene) {
        for (let count = 0; count < this.PARTICLES_COUNT; count++) {
            //this.setConffetiColor();
            this.setConffetiPosition();
        }
        this._particleSystem = new THREE.Points(this._geometry, this._material);
        scene.add(this._particleSystem);
    }

    private setConffetiColor() {
        let hexColor = Number('0x' + ("000000" + Math.random().toString(16).slice(2, 8).toUpperCase()).slice(-6));
        this._material = new PointsMaterial({
            color: hexColor
        });
    }

    private setConffetiPosition() {
        let positionAxisX = Math.random() * 100 - 50;
        let positionAxisY = Math.random() * 5 - 5;
        let positionAxisZ = Math.random() * 100 - 50;
        this._geometry.vertices.push(new THREE.Vector3(positionAxisX, positionAxisY, positionAxisZ));
    }

    public update() {
        // this._particleSystem.rotation.x += 0.01;
        // this._particleSystem.rotation.y += 0.01;
        // this._particleSystem.rotation.z += 0.01;

        if (this._particleSystem.position.y > 0) {
            this._particleSystem.position.set(
                this._particleSystem.position.x,
                this._particleSystem.position.y -= 0.1,
                this._particleSystem.position.z);
        } else {
            this._particleSystem.position.set(
                this._particleSystem.position.x,
                0,
                this._particleSystem.position.z);
        }
    }
}
