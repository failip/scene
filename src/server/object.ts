import { vec3, mat4, quat } from 'gl-matrix';

export class Object {
    position: vec3;
    id: string;

    constructor(name: string) {
        this.id = name;
        this.position = vec3.create();
    }

    getJSONRepresentation() {
        return JSON.stringify(this);
    }
}
