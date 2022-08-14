import { Client } from './client';
import { Object } from './object';
import { Scene } from './scene';
import { ObjectUpdate, PositionUpdate, RoomUpdate, RotationUpdate } from './updates';

export class Room {
    clients: Map<string, Client>;
    scene: Scene;

    constructor() {
        this.clients = new Map();
        this.scene = new Scene();
        this.scene.setOnHandleObjectUpdateCallback((object_update: ObjectUpdate) => {
            this.relayUpdate(object_update);
        });
    }

    addClient(client: Client) {
        console.log('New Client connected with ID ' + client.id.toString());
        this.clients[client.id.toString()] = client;
        for (const object in this.scene.objects) {
            const update = new ObjectUpdate(object, 'Server', this.scene.objects[object]);
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
            this.scene.handleObjectUpdate(update as ObjectUpdate);
        }
    }

    updatePosition(update: PositionUpdate) {
        console.log(update);
        this.scene.objects[update.object_id].translation = update.translation;
        for (const client in this.clients) {
            if (client == update.update_from) {
                continue;
            }
            this.clients[client].sendMessage(JSON.stringify(update));
        }
    }

    updateRotation(update: RotationUpdate) {
        console.log(update);
        this.scene.objects[update.object_id].rotation = update.rotation;
        for (const client in this.clients) {
            this.clients[client].sendMessage(JSON.stringify(update));
        }
    }

    relayUpdate(update: RoomUpdate) {
        console.log('Relaying update');
        console.log(this.clients);

        for (const client in this.clients) {
            console.log('Sending to client ' + client);
            if (client == update.update_from) {
                continue;
            }
            console.log('Sending to client ' + client);

            this.clients[client].sendMessage(JSON.stringify(update));
        }
    }
}
