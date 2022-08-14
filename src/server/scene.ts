import { Object } from './object';
import { ObjectUpdate } from './updates';

export class Scene {
    objects: Map<string, Object>;

    private onAddObjectCallback: (object: Object) => void;
    private onRemoveObjectCallback: (object: Object) => void;
    private onHandleObjectUpdateCallback: (object_update: ObjectUpdate) => void;

    constructor() {
        this.objects = new Map();
    }

    addObject(object: Object): void {
        if (!this.isObjectInScene(object)) {
            this.objects[object.id] = object;
            if (this.onAddObjectCallback) {
                this.onAddObjectCallback(object);
            }
        }
    }

    removeObject(object: Object): void {
        if (this.isObjectInScene(object)) {
            this.objects.delete(object.id);
            if (this.onRemoveObjectCallback) {
                this.onRemoveObjectCallback(object);
            }
        }
    }

    isObjectInScene(object: Object): boolean {
        return this.objects.has(object.id);
    }

    handleObjectUpdate(object_update: ObjectUpdate) {
        if (!this.isObjectInScene(object_update.object)) {
            this.objects[object_update.object_id] = object_update.object;
            if (this.onHandleObjectUpdateCallback) {
                console.log('Handling callback update');
                console.log(object_update);
                this.onHandleObjectUpdateCallback(object_update);
            }
        }
    }

    setOnHandleObjectUpdateCallback(callback: (object_update: ObjectUpdate) => void) {
        this.onHandleObjectUpdateCallback = callback;
    }

    setOnAddObjectCallback(callback: (object: Object) => void) {
        this.onAddObjectCallback = callback;
    }

    setOnRemoveObjectCallback(callback: (object: Object) => void) {
        this.onRemoveObjectCallback = callback;
    }
}
