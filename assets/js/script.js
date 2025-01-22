// Fade in for every page on load
window.addEventListener("load", 
    function() {
        const element = document.getElementsByClassName("body-wrapper")[0];
        element.classList.add("visible");
    });
