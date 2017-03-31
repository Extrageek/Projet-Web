import { Vector3 } from "three";
import { StoneSpin } from "./stone";

export interface ShotParameters {
    spin: StoneSpin;
    direction: Vector3;
    power: number;
}
