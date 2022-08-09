import { Client } from './client';
import { Object } from './object';
import { PositionUpdate, RoomUpdate, RotationUpdate } from './updates';

export class Room {
    clients: Client[];
    objects: Map<string, Object>;

    constructor() {
        this.clients = [];
        this.objects = new Map();
        let cube = new Object('Cube');
        this.objects['Cube'] = cube;
        console.log(cube.getJSONRepresentation());
    }

    addClient(client: Client) {
        console.log('New Client connected.');
        this.clients.push(client);
        client.sendMessage(JSON.stringify(this.objects));
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
