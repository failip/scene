import {
    WebGLRenderer,
    Raycaster,
    Vector2,
    MeshBasicMaterial,
    MeshPhongMaterial,
    Mesh,
    BoxGeometry,
    PerspectiveCamera,
    Scene,
    DirectionalLight,
    Vector3,
    AmbientLight
} from 'three';
import { TransformControls } from '../../node_modules/three/examples/jsm/controls/TransformControls.js';
import { RoomUpdate } from '../server/room.js';

const scene = new Scene();
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new WebGLRenderer();
const raycaster = new Raycaster();
const transform_controls = new TransformControls(camera, renderer.domElement);
const light = new DirectionalLight(0xffffff, 1.0);
const ambient_light = new AmbientLight(0xffffff, 0.2);
light.position.set(5, 5, 5);

var focused_object;

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new BoxGeometry();
const material = new MeshPhongMaterial({ color: 0x00ff00 });
const cube = new Mesh(geometry, material);
cube.name = 'Cube';
scene.add(cube);
scene.add(transform_controls);
transform_controls.attach(cube);
scene.add(light);
scene.add(ambient_light);
camera.position.z = 5;

transform_controls.addEventListener('objectChange', (event) => {
    const room_update = new RoomUpdate('Cube', cube.position.x, cube.position.y, cube.position.z);
    websocket.send(JSON.stringify(room_update));
});

const websocket = new WebSocket('ws://127.0.0.1:44433');
websocket.onmessage = (message) => {
    let update = JSON.parse(message.data.toString());
    console.log(update);
    let translation = update.Cube.translation;
    cube.position.x = translation[0];
    cube.position.y = translation[1];
    cube.position.z = translation[2];
};
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();
