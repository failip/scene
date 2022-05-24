import { WebSocketServer } from 'ws';
import { Client } from './client';
import { Room } from './room';

const wss = new WebSocketServer({ port: 8080 });
const room = new Room();
var id = 0;

wss.on('connection', function connection(ws) {
    room.addClient(new Client("Viewer", "Browser", ws, id, room));
    id += 1;
});



