import { vec3, mat4, quat } from 'gl-matrix';

export class Object {
    translation: vec3;
    rotation: quat;
    scale: vec3;
    id: string;

    constructor(name: string) {
        this.id = name;
        this.translation = vec3.create();
        this.rotation = quat.create();
        this.scale = vec3.fromValues(1.0, 1.0, 1.0);
    }

    getJSONRepresentation() {
        return JSON.stringify(this);
    }
}
