import { vec3 } from 'gl-matrix';

export interface RoomUpdate {
    update_type: string;
    object_id: string;
}

export class PositionUpdate implements RoomUpdate {
    public update_type = 'Position';
    constructor(public object_id: string, public translation: vec3) {}
}

export class RotationUpdate implements RoomUpdate {
    public update_type = 'Rotation';
    constructor(public object_id: string, public rotation: vec3) {}
}
