import {
    WebGLRenderer,
    Raycaster,
    MeshPhongMaterial,
    Mesh,
    BoxGeometry,
    PerspectiveCamera,
    Scene,
    DirectionalLight,
    AmbientLight,
    Vector2
} from 'three';
import { TransformControls } from '../../node_modules/three/examples/jsm/controls/TransformControls.js';
import { ObjectUpdate, PositionUpdate, RoomUpdate, RotationUpdate } from '../server/updates.js';
import { Object } from '../server/object';
import * as ControlScene from '../server/scene.js';
import { quat, vec3 } from 'gl-matrix';

const scene = new Scene();
const control_scene = new ControlScene.Scene();
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new WebGLRenderer();
const transform_controls = new TransformControls(camera, renderer.domElement);
const light = new DirectionalLight(0xffffff, 1.0);
const ambient_light = new AmbientLight(0xffffff, 0.2);
light.position.set(5, 5, 5);

enum ControlMode {
    Translate = 'translate',
    Rotate = 'rotate',
    Scale = 'scale'
}

function set_transform_control_mode(control_mode: ControlMode): void {
    transform_controls.setMode(control_mode);
}

var current_control_mode: ControlMode = ControlMode.Translate;

set_transform_control_mode(current_control_mode);

const objects: Map<string, Mesh> = new Map();
scene.add(transform_controls);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
var cube: Mesh;
scene.add(light);
scene.add(ambient_light);
camera.position.z = 5;

var id: string;
var focused_object: Mesh;

transform_controls.addEventListener('objectChange', (event) => {
    switch (current_control_mode) {
        case ControlMode.Translate:
            const position_update = new PositionUpdate(
                focused_object.name,
                id,
                focused_object.position.toArray()
            );
            websocket.send(JSON.stringify(position_update));
            break;
        case ControlMode.Rotate:
            const rotation_update = new RotationUpdate(
                focused_object.name,
                id,
                focused_object.quaternion.toArray() as quat
            );
            websocket.send(JSON.stringify(rotation_update));
            break;
    }
});

const websocket = new WebSocket('ws://192.168.0.178:44433');

websocket.onmessage = (message) => {
    id = message.data.toString();
    websocket.onmessage = (message) => {
        let update = JSON.parse(message.data.toString()) as RoomUpdate;
        console.log(update);
        if (update.update_type == 'Position') {
            const position_update = update as PositionUpdate;
            objects
                .get(update.object_id)
                .position.set(
                    position_update.translation[0],
                    position_update.translation[1],
                    position_update.translation[2]
                );
        } else if (update.update_type == 'Rotation') {
            const rotation_update = update as RotationUpdate;
            objects
                .get(update.object_id)
                .quaternion.set(
                    rotation_update.rotation[0],
                    rotation_update.rotation[1],
                    rotation_update.rotation[2],
                    rotation_update.rotation[3]
                );
        }

        if (update.update_type == 'Object') {
            control_scene.handleObjectUpdate(update as ObjectUpdate);
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

function addNewObject(object: Object) {
    const geometry = new BoxGeometry();
    const material = new MeshPhongMaterial({ color: 0x00ff00 });
    cube = new Mesh(geometry, material);
    cube.name = object.id;
    scene.add(cube);
    transform_controls.attach(cube);
    focused_object = cube;
    return cube;
}

control_scene.setOnAddObjectCallback((object: Object) => {
    const update = new ObjectUpdate(object.id, id, object);
    websocket.send(JSON.stringify(update));
    const new_scene_object = addNewObject(object);
    objects.set(object.id, new_scene_object);
    new_scene_object.position.set(
        object.translation[0],
        object.translation[1],
        object.translation[2]
    );
    new_scene_object.quaternion.set(
        object.rotation[0],
        object.rotation[1],
        object.rotation[2],
        object.rotation[3]
    );
});

control_scene.setOnHandleObjectUpdateCallback((object_update: ObjectUpdate) => {
    const new_scene_object = addNewObject(object_update.object);
    objects.set(object_update.object_id, new_scene_object);
    new_scene_object.position.set(
        object_update.object.translation[0],
        object_update.object.translation[1],
        object_update.object.translation[2]
    );
    new_scene_object.quaternion.set(
        object_update.object.rotation[0],
        object_update.object.rotation[1],
        object_update.object.rotation[2],
        object_update.object.rotation[3]
    );
});

document.addEventListener(
    'keydown',
    (event) => {
        var name = event.key;
        var code = event.code;
        if (code == 'KeyA') {
            const object = new Object('Cube' + Date.now().toString());
            control_scene.addObject(object);
        } else if (code == 'KeyR') {
            current_control_mode = ControlMode.Rotate;
            set_transform_control_mode(current_control_mode);
        } else if (code == 'KeyT') {
            current_control_mode = ControlMode.Translate;
            set_transform_control_mode(current_control_mode);
        } else if (code == 'KeyS') {
            current_control_mode = ControlMode.Scale;
            set_transform_control_mode(current_control_mode);
        }
    },
    false
);

animate();

var raycaster = new Raycaster();
var mouse = new Vector2();

document.onmousedown = onDocumentMouseDown;

function onDocumentMouseDown(event) {
    event.preventDefault();

    mouse.x = event.clientX / renderer.domElement.clientWidth * 2 - 1;
    mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const objects_to_check = Array.from(objects.values());

    var intersects = raycaster.intersectObjects(objects_to_check);

    if (intersects.length > 0) {
        for (const intersect in intersects) {
            const object = intersects[intersect].object as Mesh;
            if (focused_object.name != object.name) {
                focused_object = object;
                transform_controls.attach(focused_object);
            }
        }
    }
}
