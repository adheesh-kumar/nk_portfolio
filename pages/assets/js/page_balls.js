import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.154.0/build/three.module.js'; //'three' //


let width = window.innerWidth;
let height = window.innerHeight;

// SCENE PARAMETERS
const ORTH_CAMERA = 10;
const aspect = width / height;
const Z_POS = 30;


// INTERACTIVE ANIMATION - MODIFIABLE PARAMETERS

    // range [0 - 1]
const ROUGHNESS = 0.7;
const METALNESS = 0.2;


// instantiate scene
const scene = new THREE.Scene();

// Add lights
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);

let pers = 1;

if (width > height)
{
    pers = 2;
}

//set camera
const camera = new THREE.OrthographicCamera(
  -aspect * ORTH_CAMERA, aspect * ORTH_CAMERA, pers*ORTH_CAMERA, -1*pers * ORTH_CAMERA, ORTH_CAMERA/100, ORTH_CAMERA*100
);
camera.position.setZ(Z_POS);

// set up renderer
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#balls"),
    alpha: true
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(width, pers*height);



// Add a directional light for highlights and shadows
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 10); // Position above and to the side
//directionalLight.castShadow = true; // Enable shadow casting
scene.add(directionalLight);

// const xPos = [0, width, 0, width, 0, width, width];
// const yPos = [0, 0, height/2, height/2, (height - height/3)];

let left = -aspect * ORTH_CAMERA;
let right = aspect * ORTH_CAMERA;
let top = pers*ORTH_CAMERA;
let bottom = -1*pers*ORTH_CAMERA;


// const xPos = [0, 20, 0, width, 0, width, width];
// const yPos = [0, 0, height/2, height/2, (height - height/3)];

const bigSmall = [1, 2, 2, 1, 2];



function drawBalls()
{
    let RADIUS = 2;

    if(width < 500)
    {
        RADIUS = 1;
    }

    const xPos = [left, right - pers, left, right, right];
    const yPos = [top, top - pers, (top + bottom)/2, (top + bottom)/2, bottom + bigSmall[4] + RADIUS];
    const colors = [0xef9786,0xACC1F9,0xEFAA86];
    for (let x = 0; x < 5; x++) {
        const i = Math.floor(Math.random() * colors.length);
        const material = new THREE.MeshStandardMaterial( {
            color: colors[i], 
            roughness: ROUGHNESS, // Determines surface smoothness (lower = shinier)
            metalness: METALNESS,
        } );
        const sphereGeometry = new THREE.SphereGeometry(RADIUS + (Math.random() * bigSmall[x]));
        const ball = new THREE.Mesh(sphereGeometry, material);
        ball.position.x = xPos[x]; + Math.random() * (right-left)/15;
        ball.position.y = yPos[x] + Math.random();
        ball.position.z = 0;
        ball.castShadow = true;
        ball.receiveShadow = true;
        scene.add(ball);
    }
    // instantiate renderer
    renderer.render(scene, camera);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
}


let isScrolling = false;
let scrollTimeout; 

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

    width = window.innerWidth;
    height = window.innerHeight;

    if (width > height)
    {
        pers = 2;
    }
    else
    {
        pers = 1;
    }

    while(scene.children.length > 0){ 
        scene.remove(scene.children[0]); 
    }
    renderer.clear();

    scene.add(ambientLight);
    scene.add(directionalLight);


    const aspect = width / height;

    camera.left = -aspect * ORTH_CAMERA;
    camera.right = aspect * ORTH_CAMERA;
    camera.top = pers*ORTH_CAMERA;
    camera.bottom = -1*pers*ORTH_CAMERA;
    camera.updateProjectionMatrix();

    left = -aspect * ORTH_CAMERA;
    right = aspect * ORTH_CAMERA;
    top = pers*ORTH_CAMERA;
    bottom = -1*pers*ORTH_CAMERA;

    renderer.setSize(width, pers*height);

    drawBalls();
});


drawBalls();