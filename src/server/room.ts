import { Client } from "./client";

export class Room {
    clients: Client[];

    constructor() {
        this.clients = []; 
    }

    addClient(client: Client) {
        this.clients.push(client);
    }

    updateRoom(update) {
        console.log(update);
    }
}
