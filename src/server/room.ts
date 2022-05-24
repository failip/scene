import { Client } from './client';
import { Object } from './object';

export class Room {
    clients: Client[];
    objects: {};

    constructor() {
        this.clients = [];
        this.objects = {};
        let cube = new Object('Cube');
        this.objects['Cube'] = cube;
        console.log(cube.getJSONRepresentation());
    }

    addClient(client: Client) {
        this.clients.push(client);
        client.sendMessage(JSON.stringify(this.objects));
    }

    updateRoom(update) {
        this.objects['Cube'].position[0] = update.x;
        this.objects['Cube'].position[1] = update.y;
        this.objects['Cube'].position[2] = update.z;
        for (const client_index in this.clients) {
            this.clients[client_index].sendMessage(JSON.stringify(this.objects));
        }
    }
}
