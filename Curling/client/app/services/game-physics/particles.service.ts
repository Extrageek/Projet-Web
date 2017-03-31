import { Geometry, ParticleBasicMaterial, Vector3, ParticleSystem, Scene, Particle } from "three";
import { IGameInfo } from "./../game-handler/game-info.interface";

export class ParticlesService {

    private readonly PARTICLES_COUNT = 1800;
    private _geometry: Geometry;
    private _material: ParticleBasicMaterial;
    private _particle: Particle;
    private _particleSystem: ParticleSystem;
    private _scene: Scene;

    constructor(scene: Scene) {
        // this._scene = scene;
        // this._geometry = new THREE.Geometry();
        // this._material = new THREE.ParticleBasicMaterial({
        //     color: 0xFFFFFF,
        //     size: 20
        // });
        // this._particleSystem = new ParticleSystem(this._geometry, this._material);
        // this.createParticles();
    }

    private createParticles() {
        // for (let count = 0; count < this.PARTICLES_COUNT; count++) {

        //     // create a particle with random position values, -250 -> 250
        //     let pX = Math.random() * 500 - 250,
        //         pY = Math.random() * 500 - 250,
        //         pZ = Math.random() * 500 - 250;
        //     let direction = new THREE.Vector3(pX, pY, pZ);

        //     // add it to the geometry
        //     this._geometry.vertices.push(direction);
        //     this._particle = new Particle(this._material);
        //     this._particleSystem.add(this._particle);
        // }
        // // add it to the scene
        // this._scene.add(this._particleSystem);
    }

    // animation loop
    public update() {

        // // add some rotation to the system
        // this._particleSystem.rotation.y += 0.01;

        // let count = this.PARTICLES_COUNT;
        // while (count--) {
        //     // check if we need to reset
        //     if (this._particle.position.y < -200) {
        //         this._particle.position.y = 200;
        //         this._particle.velocity.y = 0;
        //     }

        //     // update the velocity with
        //     // a splat of randomniz
        //     this._particle.velocity.y -= Math.random() * .1;

        //     // and the position
        //     this._particle.position.addSelf(
        //         this._particle.velocity);
        // }

        // // flag to the particle system
        // // that we've changed its vertices.
        // this._particleSystem.
        //     geometry.
        //     __dirtyVertices = true;
    }
}
