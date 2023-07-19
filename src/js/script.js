//module imports
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'; 

//images import
import nebula from '../img/nebula.jpg';
import stars from '../img/stars.jpg';

const f1Url = new URL('../assets/f1.glb', import.meta.url);

const renderer = new THREE.WebGLRenderer();

renderer.shadowMap.enabled = true;

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    45, 
    window.innerWidth / window.innerHeight, 
    0.1,
    500
);

const orbit = new OrbitControls(camera, renderer.domElement);

//axes
const axesHelper = new THREE.AxesHelper(15);
scene.add(axesHelper);


//camera
camera.position.set(-10, 30, 30);
orbit.update();

//cube
const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00});
const box = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(box);

//plane
const planeGeometry = new THREE.PlaneGeometry(30,30);
const planeMaterial = new THREE.MeshStandardMaterial({color: 0xffffff, side: THREE.DoubleSide});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);
plane.rotation.x = Math.PI / 2;
plane.receiveShadow = true;

//grid
const gridHelper = new THREE.GridHelper(30);
scene.add(gridHelper);

//sphere
const sphereGeometry = new THREE.SphereGeometry(4, 50, 50);
const sphereMaterial = new THREE.MeshStandardMaterial(
    {
        color: 0x0000ff,
        wireframe: false
    }
);
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);
sphere.castShadow = true;

//sphere position
sphere.position.set(5, 5, 5);

//Ambient light
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

//Directional light
// const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.8);
// scene.add(directionalLight);
// directionalLight.position.set(10, 20, 0);
// directionalLight.castShadow = true;
// directionalLight.shadow.camera.scale.set(3, 3, 3);

// //Directional light helper
// const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
// scene.add(directionalLightHelper);

const spotLight = new THREE.SpotLight(0xFFFFFF);
scene.add(spotLight);
spotLight.position.set(-100, 100, 0);
spotLight.castShadow = true;
spotLight.angle = 0.2;

const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);

//linear fog
//scene.fog = new THREE.Fog(0xFFFFFF, 0, 200);
//exponencial fog
scene.fog = new THREE.FogExp2(0xFFFFFF, 0.01);

// renderer.setClearColor(0xFFEA00)

// simple 2d texture loader
const textureLoader = new THREE.TextureLoader();
//scene.background = textureLoader.load(stars);
//---------------------------------------------------
// cube texture loader
const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
    stars, stars, stars, stars, stars, stars
]);

const box2Geometry = new THREE.BoxGeometry(4, 4, 4);
const box2Material = new THREE.MeshBasicMaterial({
    //color: 0x00ff00,
    map: textureLoader.load(nebula)
});
const box2 = new THREE.Mesh(box2Geometry, box2Material);
scene.add(box2);
box2.position.set(10, 3, 10);
box2.castShadow = true;
box2.material.map = textureLoader.load(stars);

//calculate all trig circules positions
function trigLoop() {
    let y, z;
    for(let deg = 0; deg <=360; deg++){
        y = Math.sin(deg * THREE.MathUtils.DEG2RAD);
        z = Math.cos(deg * THREE.MathUtils.DEG2RAD)
        console.log(deg.toString(), y, z);
        directionalLight.position.set(10, y, z);
    }
};

function trigCoords(deg) {
    let x, y;
    x = Math.sin(deg * THREE.MathUtils.DEG2RAD);
    y = Math.cos(deg * THREE.MathUtils.DEG2RAD)
    return {x, y};
}

const plane2Geometry = new THREE.PlaneGeometry(10, 10, 10, 10);
const plane2Material = new THREE.MeshBasicMaterial({
    color: 0xFFFFFF,
    wireframe: true
});
const plane2 = new THREE.Mesh(plane2Geometry, plane2Material);
scene.add(plane2);
plane2.position.set(10, 10, 15);

plane2.geometry.attributes.position.array[0] -= 10 * Math.random();
plane2.geometry.attributes.position.array[1] -= 10 * Math.random();
plane2.geometry.attributes.position.array[2] -= 10 * Math.random();
const lastPointz = plane2.geometry.attributes.position.array.length - 1;
plane2.geometry.attributes.position.array[lastPointz] += 10 * Math.random();

// const vShader = `
//     void main() {
//         gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//     }
// `;

// const fShader = `
//     void main() {
//         gl_FragColor = vec4(0.5, 0.5, 1.0, 1.0);
//     }
// `;

const sphere2Geometry = new THREE.SphereGeometry(4);
const sphere2Material = new THREE.MeshBasicMaterial({
    vertexShader: document.getElementById('vertexShader').textContent,
    fragmentShader: document.getElementById('fragmentShader').textContent,
});

const assetLoader = new GLTFLoader();
assetLoader.load(f1Url.href, function(gltf){
    const model = gltf.scene;      
    scene.add(model);
}, undefined, function(error){ console.log(error) });

//GUI controls
const gui = new dat.GUI();

const options = {
    color: '#ffea00',
    wireframe: false,
    speed: 0.01,
    angle: 0.2,
    penumbra: 0,
    intensity: 1
};

gui.addColor(options, 'color').onChange(function(e){
    sphereMaterial.color.set(e);
});

gui.add(options, 'wireframe').onChange(function(e){
    sphereMaterial.wireframe = e;
});

gui.add(sphere.geometry.parameters, 'heightSegments', 'widthSegments').min(0).max(50).step(1).name('polygons').onChange(function(e){
    sphere.geometry = new THREE.SphereGeometry(4, e, e);
});

gui.add(options, 'speed', 0, 0.1)

gui.add(options, 'angle', 0, 1)
gui.add(options, 'penumbra', 0, 1)
gui.add(options, 'intensity', 0, 1)

let step = 0;
let degree = 0;

const mousePosition = new THREE.Vector2();

const sphereId = sphere.id;
box2.name = 'theBox';
 
window.addEventListener('mousemove', function(e){
    mousePosition.x = e.clientX / window.innerWidth * 2 - 1;
    mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

const raycaster = new THREE.Raycaster();

//animation loop
function animate(time) {
    box.rotation.x = time/1000;
    box.rotation.y = time/1000;

    // Rotate directional light
    // degree += 1;
    // let {x, y} = trigCoords(degree);
    // directionalLight.position.set(x * 20, y * 20, 0);
    // directionalLightHelper.update();

    spotLight.angle = options.angle;
    spotLight.penumbra = options.penumbra;
    spotLight.intensity = options.intensity;
    spotLightHelper.update();

    //select elements with mouse
    raycaster.setFromCamera(mousePosition, camera);
    const intersects = raycaster.intersectObjects(scene.children);

    for(let i = 0; i < intersects.length; i++){
        if(intersects[i].object.id === sphereId){
            intersects[i].object.material.color.set(0xff0000);
        }

        if (intersects[i].object.name === 'theBox'){
            intersects[i].object.rotation.x = time/1000;
            intersects[i].object.rotation.y = time/1000;
        }
    }
    
    step += options.speed;
    sphere.position.y = Math.abs(Math.sin(step)) * 10 + 4;

    plane2.geometry.attributes.position.array[0] -= 10 * Math.random();
    plane2.geometry.attributes.position.array[1] -= 10 * Math.random();
    plane2.geometry.attributes.position.array[2] -= 10 * Math.random();
    const lastPointz = plane2.geometry.attributes.position.array.length - 1;
    plane2.geometry.attributes.position.array[lastPointz] += 10 * Math.random();
    plane2.geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});