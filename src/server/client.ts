import { WebSocket } from 'ws';
import { Room } from './room';

export class Client {
    role: string;
    type: string;
    connection: WebSocket;
    id: number;
    room: Room;

    constructor(role: string, type: string, connection: WebSocket, id: number, room: Room) {
        this.role = role;
        this.type = type;
        this.connection = connection;
        this.id = id;
        this.room = room;
        connection.on('message', (data) => {
            this.onMessage(data);
        });
    }

    onMessage(data) {
        this.room.updateRoom(JSON.parse(data.toString()));
    }

    sendMessage(data) {
        this.connection.send(data);
    }
}
