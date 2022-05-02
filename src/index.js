import * as THREE from 'three';

//import particleSystem
import { fountain, fireball, smoke, cloud, snow, rain, starfield, fluorescence, startunnel, firework, candle } from "./example.js";
import ParticleEngine from "./particleEngine/ParitcleSystem";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 10, window.innerWidth / window.innerHeight, 0.1, 1000 );

const clock = new THREE.Clock();
// camera.up.x = 0;
//     camera.up.y = 0;
//     camera.up.z = 1;
    camera.position.set(0, 0, 200);

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const engine = new ParticleEngine();

engine.setValues(startunnel);
const particles = engine.initialize();
console.log("particles:",particles);
engine.particleMesh.rotation.x = Math.PI / 2;
scene.add(particles);

function animate() {
    requestAnimationFrame( animate );

    renderer.render( scene, camera );

    const dt = clock.getDelta();

    engine.update( dt * 0.5 );

};

animate();