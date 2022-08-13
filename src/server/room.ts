import { Client } from './client';
import { Object } from './object';
import { PositionUpdate, RoomUpdate, RotationUpdate } from './updates';

export class Room {
    clients: Map<string, Client>;
    objects: Map<string, Object>;

    constructor() {
        this.clients = new Map();
        this.objects = new Map();
        let cube = new Object('Cube');
        this.addObject(cube);
        console.log(cube.getJSONRepresentation());
    }

    addObject(object: Object) {
        this.objects[object.id] = object;
    }

    addClient(client: Client) {
        console.log('New Client connected with ID ' + client.id.toString());
        this.clients[client.id.toString()] = client;
        client.sendMessage(JSON.stringify(this.objects));
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
        }
    }

    updatePosition(update: PositionUpdate) {
        console.log(update.translation);
        this.objects[update.object_id].translation = update.translation;
        for (const client_index in this.clients) {
            this.clients[client_index].sendMessage(JSON.stringify(this.objects));
        }
    }

    updateRotation(update: RotationUpdate) {
        console.log(update.rotation);
        this.objects[update.object_id].rotation = update.rotation;
        for (const client_index in this.clients) {
            this.clients[client_index].sendMessage(JSON.stringify(this.objects));
        }
    }
}
