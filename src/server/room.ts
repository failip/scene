import { Client } from './client';
import { Object } from './object';
import { ObjectUpdate, PositionUpdate, RoomUpdate, RotationUpdate } from './updates';

export class Room {
    clients: Map<string, Client>;
    objects: Map<string, Object>;

    constructor() {
        this.clients = new Map();
        this.objects = new Map();
    }

    addObject(object: Object) {
        this.objects[object.id] = object;
    }

    addClient(client: Client) {
        console.log('New Client connected with ID ' + client.id.toString());
        this.clients[client.id.toString()] = client;
        for (const object in this.objects) {
            const update = new ObjectUpdate(object, 'Server', this.objects[object]);
            client.sendMessage(JSON.stringify(update));
        }
    }

    removeClient(client: Client) {
        console.log('Client disconnected with ID ' + client.id.toString());
        this.clients.delete(client.id.toString());
    }

    updateRoom(update: RoomUpdate) {
        if (update.update_type == 'Position') {
            this.updatePosition(update as PositionUpdate);
        } else if (update.update_type == 'Rotation') {
            this.updateRotation(update as RotationUpdate);
        } else if (update.update_type == 'Object') {
            this.updateNewObject(update as ObjectUpdate);
        }
    }

    updatePosition(update: PositionUpdate) {
        console.log(update);
        this.objects[update.object_id].translation = update.translation;
        for (const client in this.clients) {
            if (client == update.update_from) {
                continue;
            }
            this.clients[client].sendMessage(JSON.stringify(update));
        }
    }

    updateRotation(update: RotationUpdate) {
        console.log(update);
        this.objects[update.object_id].rotation = update.rotation;
        for (const client in this.clients) {
            this.clients[client].sendMessage(JSON.stringify(update));
        }
    }

    updateNewObject(update: ObjectUpdate) {
        console.log(update);
        this.addObject(update.object);
        for (const client in this.clients) {
            if (client == update.update_from) {
                continue;
            }
            this.clients[client].sendMessage(JSON.stringify(update));
        }
    }
}
