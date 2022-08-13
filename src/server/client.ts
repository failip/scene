import { RawData, WebSocket } from 'ws';
import { Room } from './room';
import { RoomUpdate } from './updates';

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
        connection.send(id);
        connection.on('message', (data) => {
            this.onMessage(data);
        });
        connection.on('close', (data) => {
            this.onConnectionClosed();
        });
    }

    onConnectionClosed() {
        this.room.removeClient(this);
    }

    onMessage(data: RawData) {
        this.room.updateRoom(JSON.parse(data.toString()) as RoomUpdate);
    }

    sendMessage(data: string) {
        this.connection.send(data);
    }
}
