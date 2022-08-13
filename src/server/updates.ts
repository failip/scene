import { vec3 } from 'gl-matrix';
import { Object } from './object';

export interface RoomUpdate {
    update_type: string;
    object_id: string;
    update_from: string;
}

export class PositionUpdate implements RoomUpdate {
    public update_type = 'Position';
    constructor(public object_id: string, public update_from: string, public translation: vec3) {}
}

export class RotationUpdate implements RoomUpdate {
    public update_type = 'Rotation';
    constructor(public object_id: string, public update_from: string, public rotation: vec3) {}
}

export class ObjectUpdate implements RoomUpdate {
    public update_type = 'Object';
    constructor(public object_id: string, public update_from: string, public object: Object) {}
}
