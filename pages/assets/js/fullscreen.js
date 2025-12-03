
// Select all <img> elements inside the .rows container
const images = Array.from(document.querySelectorAll('.rows img')).map(image => ".".concat(image.src.substring(image.src.indexOf("/assets"))).replaceAll("%20", "\ "));
var curIndex = 0;

function myFoo(img) {
    const fs = document.createElement("img");
    curIndex = images.indexOf(img.getAttribute("src"));
    fs.setAttribute("src", images[curIndex]);
    const fsParent = document.getElementsByClassName("fullscreen")[0];
    const bw = document.getElementsByClassName("body-wrapper")[0];
    const photos = document.getElementById("photos");
    photos.replaceChildren(fs);
    bw.classList.remove("visible");
    fsParent.classList.add("active");
    document.body.style.overflow = 'hidden';
};

function closeFs() {
    const fsParent = document.getElementsByClassName("fullscreen")[0];
    const bw = document.getElementsByClassName("body-wrapper")[0];
    fsParent.classList.remove("active");
    bw.classList.add("visible");
    document.body.style.overflow = 'auto';

};

function setPhoto() {
    const photos = document.getElementById("photos");
    photos.children[0].setAttribute("src", images[curIndex]);
}
function next() {
    curIndex++;
    if (curIndex >= images.length) {
        curIndex = 0;
    }

    setPhoto();
}


function prev() {
    curIndex--;
    if (curIndex < 0) {
        curIndex = images.length - 1;
    }

    setPhoto();
}