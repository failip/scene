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
        this.scene.setOnHandlePositionUpadteCallback((position_update: PositionUpdate) => {
            this.relayUpdate(position_update);
        });
        this.scene.setOnHandleRoationUpdateCallback((rotation_update: RotationUpdate) => {
            this.relayUpdate(rotation_update);
        });
    }

    addClient(client: Client) {
        console.log('New Client connected with ID ' + client.id.toString());
        this.clients.set(client.id.toString(), client);
        this.scene.objects.forEach((object: Object, object_id: string) => {
            const update = new ObjectUpdate(object_id, 'Server', object);
            client.sendMessage(JSON.stringify(update));
        });
    }

    removeClient(client: Client) {
        console.log('Client disconnected with ID ' + client.id.toString());
        this.clients.delete(client.id.toString());
    }

    updateRoom(update: RoomUpdate) {
        if (update.update_type == 'Position') {
            this.scene.handlePositionUpdate(update as PositionUpdate);
        } else if (update.update_type == 'Rotation') {
            this.scene.handleRotationUpdate(update as RotationUpdate);
        } else if (update.update_type == 'Object') {
            this.scene.handleObjectUpdate(update as ObjectUpdate);
        }
    }

    relayUpdate(update: RoomUpdate) {
        console.log(update);
        this.clients.forEach((client: Client, client_id: string) => {
            if (client_id != update.update_from) {
                client.sendMessage(JSON.stringify(update));
            }
        });
    }
}
