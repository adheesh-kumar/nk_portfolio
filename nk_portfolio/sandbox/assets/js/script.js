// Fade in for every page on load
window.addEventListener("pageshow", 
    function() {
        document.body.style.overflow = "auto";

        const element = document.getElementsByClassName("body-wrapper")[0];
        const body = element.children;

        for (i = 0; i < body.length; i++)
        {
            body[i].style.opacity = '1';
        }

        const checkBg = document.getElementById("bg");

        if (checkBg)
        {
            checkBg.style.opacity = "1";
        }

        const checkOpen = document.getElementById("open-menu-bg");

        if (checkOpen)
        {
            checkOpen.style.opacity = "0";
        }



        const pinks = document.getElementById("load-circles-here");
        //const whites = document.getElementsByClassName("circle-white");
    
        const numCircles = pinks.children.length;


        for (i = 0; i < numCircles; i++)
        {
            if (pinks.children[i].id != 'menu-circle-close') pinks.children[i].style.opacity = '0';
        }


        element.classList.add("visible");
    });

/*
// Fade in for every page on load
window.addEventListener("load", 
    function() {
        const element = document.getElementsByClassName("body-wrapper")[0];
        

        
        element.classList.add("visible");
    });
*/