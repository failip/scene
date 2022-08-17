import { vec3, mat4, quat } from 'gl-matrix';

export class Object {
    translation: vec3;
    rotation: quat;
    id: string;

    constructor(name: string) {
        this.id = name;
        this.translation = vec3.create();
        this.rotation = quat.create();
    }

    getJSONRepresentation() {
        return JSON.stringify(this);
    }
}
