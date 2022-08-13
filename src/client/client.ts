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

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new BoxGeometry();
const material = new MeshPhongMaterial({ color: 0x00ff00 });
const cube: Mesh = new Mesh(geometry, material);
cube.name = 'Cube';
scene.add(cube);
scene.add(transform_controls);
transform_controls.attach(cube);
scene.add(light);
scene.add(ambient_light);
camera.position.z = 5;

var id: string;

transform_controls.addEventListener('objectChange', (event) => {
    const position_update = new PositionUpdate('Cube', id, cube.position.toArray());
    websocket.send(JSON.stringify(position_update));
});

const websocket = new WebSocket('ws://127.0.0.1:44433');

websocket.onmessage = (message) => {
    id = message.data.toString();
    websocket.onmessage = (message) => {
        let update = JSON.parse(message.data.toString()) as RoomUpdate;
        if ((update.update_type = 'Position')) {
            console.log(update);
            const position_update = update as PositionUpdate;
            cube.position.set(
                position_update.translation[0],
                position_update.translation[1],
                position_update.translation[2]
            );
        }
    };
};

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

animate();
