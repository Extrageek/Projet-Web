import { Plane, Object3D, Vector3, Raycaster, Intersection, Camera } from "three";

const planeXZ = new Plane(new Vector3(0, 1, 0));
const raycaster = new Raycaster();

export function calculateMousePositionOnXZPlane(event: MouseEvent, camera: Camera): Vector3 {
    raycaster.setFromCamera(calculateMousePosition(event), camera);
    return raycaster.ray.intersectPlane(planeXZ);
}

export function calculateMousePositionOnObject(event: MouseEvent, object: Object3D, camera: Camera): Intersection[] {
    raycaster.setFromCamera(calculateMousePosition(event), camera);
    return raycaster.intersectObject(object, true);
}

function calculateMousePosition(event: MouseEvent): {x: number, y: number} {
    return {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: - (event.clientY / window.innerHeight) * 2 + 1
    };
}
