/*
Menu animation constants
*/

const MENU_ANIMATION_DURATION = 0.5;
const MENU_EASE = "power1.out";
const MENU_TRANSITION_VARS = {
    duration: MENU_ANIMATION_DURATION,
    ease: MENU_EASE
};
const TO_VARS = {
    opacity:1, 
    scale:1, 
    duration:MENU_ANIMATION_DURATION, 
    ease:MENU_EASE
};
const MENU_TRANSITION_DELAY = 0.8;
const SCALE_GAP = 3;
const RING_START = 6;
const RING_STEP = 8;

/*global mutable variables*/
// number of rings to create for transition depending on screen size
let numRings = 5;
let baseWidth = 0;
const menuInTransition = gsap.timeline();
const menuCloseTransition = gsap.timeline();



// animation for button hover
const buttonHover = gsap.timeline({paused:true});

buttonHover.to(".menu-button-bg", {
    zIndex:0,
    opacity:1
})
buttonHover.from(".menu-button-bg", {
    scale:0,
    duration: MENU_ANIMATION_DURATION,
    ease: MENU_EASE
}, "<");

// hovering functions
function menuHover()
{
    buttonHover.timeScale(1);
    buttonHover.play();
}

function menuLeave()
{
    if (!menuInTransition.isActive() && !menuCloseTransition.isActive()) {
        buttonHover.timeScale(5);
        buttonHover.reverse();
    }
}


//creates a transition DOM circle
function createCircle(num, color, wh) {
    const circle = document.createElement("div");
    circle.classList.add("circle-"+color);
    circle.classList.add("button-placement");
    circle.id = "circle-" + color + "-" + num;
    circle.style.width = wh + "px";
    circle.style.height = wh + "px";

    return circle;
}

//sets up all transition circles
function initalizeCircles()
{
    //get and clear wrapper
    const circleWrapper = document.getElementById("load-circles-here");
    while (circleWrapper.firstChild) {
        circleWrapper.removeChild(circleWrapper.firstChild);
    }

    //calculate num of circles needed
    const fillScreen = Math.sqrt((window.innerWidth*window.innerWidth + window.innerHeight*window.innerHeight));
    baseWidth = parseFloat(getComputedStyle(document.querySelector(".menu-button")).width);
    const ringRadius = baseWidth * RING_STEP / 2;
    numRings = Math.ceil(fillScreen / ringRadius);

    //append circles to wrapper
    for (let i = numRings - 1; i >= 0; i--) {
        circleWrapper.appendChild(createCircle(i, "white", baseWidth*RING_START + baseWidth*RING_STEP*i));
        circleWrapper.appendChild(createCircle(i, "pink", baseWidth*RING_START + baseWidth*RING_STEP*i));
    }
}
 

 
 //calculates each circles transition variables (scale)
function getFromVars(ringNum, addGap) {
    const shallowCopy = Object.assign({}, MENU_TRANSITION_VARS);
    let numer_base = RING_START + (ringNum - 1) * RING_STEP;
    if (ringNum - 1 < 0)
    {
        numer_base = 1;
    }
    const numer = numer_base + addGap*SCALE_GAP;
    const denom = RING_START + ringNum * RING_STEP;
    shallowCopy.scale = numer/denom;
    return shallowCopy;
}

//function to perform the menu page transition and navigate to the menu page
function openMenuTransition() {

    menuInTransition.to(document.body, {overflow:"hidden"});
    
    //begin fading out the page content
    menuInTransition.to([document.getElementsByClassName("body-wrapper")[0].children, '#bg', '#balls'], {
        opacity:0, 
        duration: MENU_ANIMATION_DURATION, 
        delay: MENU_TRANSITION_DELAY
    }, "<");

    //scale and fade in the 'rings'
    for (let i = 0; i < numRings; i++) {
        let numer_base = RING_START + (i - 1) * RING_STEP;
        if (i - 1 < 0)
        {
            numer_base = 1;
        }
        const numerF = numer_base + false*SCALE_GAP;
        const numerT = numer_base + true*SCALE_GAP;
        const denom = RING_START + i * RING_STEP;
        menuInTransition.fromTo("#circle-pink-"+i, {
                duration: MENU_ANIMATION_DURATION,
                ease: MENU_EASE,
                scale: numerF/denom,
            }, {
                opacity:1, 
                scale:1, 
                duration:MENU_ANIMATION_DURATION, 
                ease:MENU_EASE
            },"<");
        menuInTransition.fromTo("#circle-white-"+i, {
                duration: MENU_ANIMATION_DURATION,
                ease: MENU_EASE,
                scale: numerT/denom,
            }, {
                opacity:1, 
                scale:1, 
                duration:MENU_ANIMATION_DURATION, 
                ease:MENU_EASE
            },"<"); 
    }

    //makes the call to the menu
    menuInTransition.call(
        () => {
            window.location.href = "menu.html";
        }
    );
}


function closeMenuTransition(){
    baseWidth = parseFloat(getComputedStyle(document.querySelector(".menu-button")).width);
    const white = getComputedStyle(document.documentElement).getPropertyValue("--primaryBG").trim();
    const w = parseFloat(getComputedStyle(document.querySelector("#menu-circle-close")).width);

    menuCloseTransition.to(document.documentElement, {backgroundColor:white});
    menuCloseTransition.to(document.body, {overflow:"hidden"});
    menuCloseTransition.to(document.body, {backgroundColor:white, duration:0}, "<");
    menuCloseTransition.to("#close-icon", {fill:white}, "<");
    menuCloseTransition.to([document.getElementsByClassName("body-wrapper")[0].children, "#close-menu-bg", "#constant"], {
        opacity:0, 
        duration: MENU_ANIMATION_DURATION, 
        delay: MENU_TRANSITION_DELAY
    });
    menuCloseTransition.to("#close-background",
        {
            opacity:0,
            duration: MENU_ANIMATION_DURATION
        }, "<");
    menuCloseTransition.to("#menu-circle-close",
        {
            scale: baseWidth / w,
            duration: MENU_ANIMATION_DURATION,
            opacity:1
        }, "<");

    menuCloseTransition.call(
        () => {
            history.back();
        }
    );
}

//event listeners
const openMenu = document.getElementById("open-menu");
const closeMenu = document.getElementById("close-menu");

document.querySelector(".menu-button").addEventListener("mouseover", menuHover);
document.querySelector(".menu-button").addEventListener("mouseleave", menuLeave);

if (openMenu)
{
    document.getElementById("open-menu").addEventListener("click", openMenuTransition);
    initalizeCircles();
    window.addEventListener("resize", initalizeCircles);
}

if (closeMenu)
{
    document.getElementById("close-menu").addEventListener("click", closeMenuTransition);
}

window.addEventListener("pageshow", () => {
    window.scrollTo(0, 0);
});