//module imports
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui'; 

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

renderer.setClearColor(0xFFEA00)

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
    
    step += options.speed;
    sphere.position.y = Math.abs(Math.sin(step)) * 10 + 4;

    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);