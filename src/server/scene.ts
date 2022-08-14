import { Object } from './object';
import { ObjectUpdate, PositionUpdate, RotationUpdate } from './updates';

export class Scene {
    objects: Map<string, Object>;

    private onAddObjectCallback: (object: Object) => void;
    private onRemoveObjectCallback: (object: Object) => void;
    private onHandleObjectUpdateCallback: (object_update: ObjectUpdate) => void;
    private onHandlePositionUpdateCallback: (position_update: PositionUpdate) => void;
    private onHandleRotationUpdateCallback: (roation_update: RotationUpdate) => void;

    constructor() {
        this.objects = new Map();
    }

    addObject(object: Object): void {
        if (!this.isObjectInScene(object.id)) {
            this.objects.set(object.id, object);
            if (this.onAddObjectCallback) {
                this.onAddObjectCallback(object);
            }
        }
    }

    removeObject(object: Object): void {
        if (this.isObjectInScene(object.id)) {
            this.objects.delete(object.id);
            if (this.onRemoveObjectCallback) {
                this.onRemoveObjectCallback(object);
            }
        }
    }

    isObjectInScene(object_id: string): boolean {
        return this.objects.has(object_id);
    }

    handleObjectUpdate(object_update: ObjectUpdate): void {
        console.log(object_update);

        if (!this.isObjectInScene(object_update.object_id)) {
            this.objects.set(object_update.object_id, object_update.object);
            if (this.onHandleObjectUpdateCallback) {
                console.log('Relaying handle object');

                this.onHandleObjectUpdateCallback(object_update);
            }
        }
    }

    handlePositionUpdate(position_update: PositionUpdate) {
        if (this.isObjectInScene(position_update.object_id)) {
            this.objects.get(position_update.object_id).translation = position_update.translation;
            if (this.onHandlePositionUpdateCallback) {
                this.onHandlePositionUpdateCallback(position_update);
            }
        }
    }

    handleRotationUpdate(rotation_update: RotationUpdate) {
        if (this.isObjectInScene(rotation_update.object_id)) {
            this.objects.get(rotation_update.object_id).rotation = rotation_update.rotation;
            if (this.onHandleRotationUpdateCallback) {
                this.onHandleRotationUpdateCallback(rotation_update);
            }
        }
    }

    setOnHandleObjectUpdateCallback(callback: (object_update: ObjectUpdate) => void): void {
        this.onHandleObjectUpdateCallback = callback;
    }

    setOnAddObjectCallback(callback: (object: Object) => void): void {
        this.onAddObjectCallback = callback;
    }

    setOnRemoveObjectCallback(callback: (object: Object) => void): void {
        this.onRemoveObjectCallback = callback;
    }

    setOnHandlePositionUpadteCallback(callback: (position_update: PositionUpdate) => void): void {
        this.onHandlePositionUpdateCallback = callback;
    }

    setOnHandleRoationUpdateCallback(callback: (rotation_update: RotationUpdate) => void): void {
        this.onHandleRotationUpdateCallback = callback;
    }
}
