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
import { PositionUpdate, RoomUpdate } from '../server/updates.js';

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
    const position_update = new PositionUpdate('Cube', cube.position);
    websocket.send(JSON.stringify(position_update));
});

const websocket = new WebSocket('ws://127.0.0.1:44433');
websocket.onmessage = (message) => {
    let update = JSON.parse(message.data.toString()) as RoomUpdate;
    if ((update.update_type = 'Position')) {
        const position_update = update as PositionUpdate;
        cube.position = position_update.translation;
    }
};
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();
