import { vec3, mat4, quat } from 'gl-matrix';

export class Object {
    translation: vec3;
    rotation: vec3;
    id: string;

    constructor(name: string) {
        this.id = name;
        this.translation = vec3.create();
        this.rotation = vec3.create();
    }

    getJSONRepresentation() {
        return JSON.stringify(this);
    }
}
