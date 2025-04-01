import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.154.0/build/three.module.js'; //'three' //
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/dist/cannon-es.js';


let width = window.visualViewport.width;
let height = window.visualViewport.height;

// SCENE PARAMETERS
const ORTH_CAMERA = 10;
const aspect = width / height;
const Z_POS = 30;
const GROUND_DEPTH = -5;

console.log(width);

// INTERACTIVE ANIMATION - MODIFIABLE PARAMETERS

const NUM_OF_SPHERES = 25;
const RADIUS = 2;
const MASS = 5;
    // range [0 - 1]
const RESTITUTION = 0.1;
const FRICTION = 0.9;
const ANGULAR_DAMP = 1;
const LINEAR_DAMP = 0.6;
const ROUGHNESS = 0.7;
const METALNESS = 0.2;

const GRAVITY = 10;

const MOUSE_RANGE = 20;

// instantiate scene
const scene = new THREE.Scene();

// Add lights
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);

//set camera
const camera = new THREE.OrthographicCamera(
  -aspect * ORTH_CAMERA, aspect * ORTH_CAMERA, ORTH_CAMERA, -1 * ORTH_CAMERA, ORTH_CAMERA/100, ORTH_CAMERA*100
);
camera.position.setZ(Z_POS);

// set up renderer
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#bg"),
    alpha: true
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(width, height);

// instantiate renderer
renderer.render(scene, camera);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// instantiate physics 
const world = new CANNON.World();
world.gravity.set(0, -1, 0); // setting minimal gravity otherwise you lose friction calculations


// interactive sphere object set up
const sphereMeshes = [];
const sphereBodies = [];

// Add a directional light for highlights and shadows
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 10); // Position above and to the side
//directionalLight.castShadow = true; // Enable shadow casting
scene.add(directionalLight);


const colors = [0xef9786,0xACC1F9,0xACC1F9,0xEFAA86];
let i = 0;
for (let x = 0; x < NUM_OF_SPHERES; x++) {
    i = Math.floor(Math.random() * colors.length);
    const material = new THREE.MeshStandardMaterial( {
        color: colors[i], 
        roughness: ROUGHNESS, // Determines surface smoothness (lower = shinier)
        metalness: METALNESS,
    } );
    const sphereGeometry = new THREE.SphereGeometry(RADIUS);
    sphereMeshes.push(new THREE.Mesh(sphereGeometry, material));
    sphereMeshes[x].position.x = Math.random();
    sphereMeshes[x].position.y = Math.random();
    sphereMeshes[x].position.z = Math.random();
    sphereMeshes[x].castShadow = true;
    sphereMeshes[x].receiveShadow = true;
    scene.add(sphereMeshes[x]);

    const sphereShape = new CANNON.Sphere(RADIUS);
    sphereBodies.push(new CANNON.Body({ 
        mass: MASS,
        restitution: RESTITUTION,
        friction: FRICTION,
        angularDamping: ANGULAR_DAMP  
    }));
    sphereBodies[x].addShape(sphereShape);
    sphereBodies[x].position.x = sphereMeshes[x].position.x;
    sphereBodies[x].position.y = sphereMeshes[x].position.y;
    sphereBodies[x].position.z = sphereMeshes[x].position.z;
    sphereBodies[x].linearDamping = LINEAR_DAMP;
    world.addBody(sphereBodies[x]);
}

const ground = new CANNON.Body({
    mass: 0, // Static body
    shape: new CANNON.Plane(),
});

ground.quaternion.setFromEuler( 0, 0,-Math.PI / 2); // Orient the plane horizontally
ground.position.z = GROUND_DEPTH;
world.addBody(ground);


world.addEventListener('postStep', function () {
    
    // Gravity towards (0,0,0)
    sphereBodies.forEach((s) => {
        const distance = s.position.length(); // Distance from the origin
        const gravity = new CANNON.Vec3();
        gravity.set(-s.position.x, -s.position.y, -s.position.z).normalize();
        gravity.scale(GRAVITY * Math.pow(distance, 2), s.force); // Nonlinear scaling
        s.applyLocalForce(gravity);
    })

    if (!isInteracting) return;
    //apply force based n mouse position
    sphereBodies.forEach((s) => {
        const direction = new CANNON.Vec3(); // Direction vector

        // Calculate direction from sphere to mouse position
        direction.set(
            s.position.x - mousePosition.x,
            s.position.y - mousePosition.y,
            s.position.z - mousePosition.z
        );

        const distance = direction.length(); // Calculate the distance
        direction.normalize(); // Normalize direction

        if (distance < MOUSE_RANGE) { // Only affect spheres within a certain range
            const forceMagnitude = mouseSpeed * 100 / (distance * distance); // Inverse-square law
            direction.scale(forceMagnitude, direction); // Scale force by magnitude
            s.applyImpulse(direction, s.position); // Apply force as an impulse
        }
    });

    isInteracting = false;
})


let mousePosition = new CANNON.Vec3();
let previousMousePosition = new CANNON.Vec3();
let mouseSpeed = 0;

let isInteracting = false;

// Touch events (mobile)
window.addEventListener("touchstart", (event) => {
    isInteracting = true; // Start interaction
    const touch = event.touches[0];
    console.log(`Touch started at: ${touch.clientX}, ${touch.clientY}`);
    interaction(touch.clientX, touch.clientY);
});



window.addEventListener("mousemove", (event) => {
    isInteracting = true; 
    console.log('im here');
    interaction(event.clientX, event.clientY);
});

function interaction(x, y) {
    const normalizedX = (x / width) * 2 - 1;
    const normalizedY = -(y / height) * 2 + 1;

    // Update mouse position
    
    mousePosition.set(normalizedX * 50, normalizedY * 50, 0); // Scale to fit your scene dimensions
    mouseSpeed = mousePosition.distanceTo(previousMousePosition); // Calculate movement speed
    previousMousePosition.copy(mousePosition);
};



function animate() {
    requestAnimationFrame(animate);

    //delta = Math.min(clock.getDelta(), 0.1)
    world.step(1/60);

    sphereBodies.forEach((s, i) => {
        sphereMeshes[i].position.set(s.position.x, s.position.y, s.position.z)
        sphereMeshes[i].quaternion.set(
            s.quaternion.x,
            s.quaternion.y,
            s.quaternion.z,
            s.quaternion.w
        )
    })

    renderer.render(scene, camera);
}

animate();

let isScrolling = false;

window.addEventListener("scroll", () => {
    isScrolling = true;
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => isScrolling = false, 300); // Enable resize after scrolling stops
});


addEventListener("resize", () => {
    if(isScrolling)
    {
        return;
    }

    width = window.visualViewport.width;
    height = window.visualViewport.height;

    const aspect = width / height;

    camera.left = -aspect * ORTH_CAMERA;
    camera.right = aspect * ORTH_CAMERA;
    camera.top = ORTH_CAMERA;
    camera.bottom = -ORTH_CAMERA;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
});
