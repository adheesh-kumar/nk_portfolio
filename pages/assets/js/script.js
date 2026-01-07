
// Splash screen (slow-load indicator)
// TEMP: set this to e.g. 1200 to force-show the splash for at least that many ms (even on fast loads).
// Set back to 0 to restore normal behavior.
const SPLASH_DEBUG_FORCE_MS = 0;

let splashEl = null;
let splashShowTimer = null;
let splashShownAt = 0;

function ensureSplash() {
    if (splashEl) return splashEl;

    const el = document.createElement("div");
    el.id = "splash-screen";
    el.className = "splash-screen";
    el.setAttribute("aria-hidden", "true");

    el.innerHTML = `
        <div class="splash-screen__content" role="status" aria-live="polite">
            <div class="splash-screen__spinner" aria-hidden="true"></div>
            <div class="splash-screen__label">Loading…</div>
        </div>
    `;

    // Append ASAP (script is loaded late in the page, but still before heavy media finishes)
    document.body.appendChild(el);
    splashEl = el;
    return el;
}

function showSplashIfSlow() {
    const el = ensureSplash();
    if (splashShowTimer) clearTimeout(splashShowTimer);

    // Avoid flashing the overlay on fast loads: only show if we're still loading after 150ms
    splashShowTimer = setTimeout(() => {
        el.classList.add("is-active");
        el.setAttribute("aria-hidden", "false");
        splashShownAt = Date.now();
    }, SPLASH_DEBUG_FORCE_MS > 0 ? 0 : 150);
}

function hideSplash() {
    if (splashShowTimer) {
        clearTimeout(splashShowTimer);
        splashShowTimer = null;
    }

    const el = splashEl || document.getElementById("splash-screen");
    if (!el) return;

    // If we're forcing the splash for debugging, keep it on-screen for at least the configured duration
    if (SPLASH_DEBUG_FORCE_MS > 0 && el.classList.contains("is-active")) {
        const elapsed = Date.now() - (splashShownAt || Date.now());
        const remaining = SPLASH_DEBUG_FORCE_MS - elapsed;
        if (remaining > 0) {
            setTimeout(hideSplash, remaining);
            return;
        }
    }

    // If it never became visible, just remove it
    if (!el.classList.contains("is-active")) {
        el.remove();
        splashEl = null;
        return;
    }

    el.classList.add("is-hidden");
    el.classList.remove("is-active");
    el.setAttribute("aria-hidden", "true");

    setTimeout(() => {
        el.remove();
        if (splashEl === el) splashEl = null;
    }, 250);
}

// Fade in for every page on load
function showPageContent() {
    document.body.style.overflow = "auto";
    hideSplash();

    const element = document.getElementsByClassName("body-wrapper")[0];
    if (!element) return;
    
    element.classList.remove("visible");
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
        checkOpen.style.zIndex = '-1';
    }

    const pinks = document.getElementById("load-circles-here");
    
    if (pinks) {
        const numCircles = pinks.children.length;
        for (i = 0; i < numCircles; i++)
        {
            if (pinks.children[i].id != 'menu-circle-close') pinks.children[i].style.opacity = '0';
        }
    }

    const checkBalls = document.getElementById("balls");

    if (checkBalls)
    {
        checkBalls.style.opacity = "1";
    }

    element.classList.add("visible");
}

// Wait for critical images to load before showing content
function waitForCriticalImages() {
    // Get all images that should load first (eager loading or first carousel image)
    const criticalImages = [];
    
    // Get images with loading="eager"
    const eagerImages = document.querySelectorAll('img[loading="eager"]');
    eagerImages.forEach(img => {
        if (img.src && !img.complete) {
            criticalImages.push(img);
        }
    });
    
    // Get first carousel image if it exists
    const firstCarouselImg = document.querySelector('.carousel-cell img[src]');
    if (firstCarouselImg && !firstCarouselImg.complete && !criticalImages.includes(firstCarouselImg)) {
        criticalImages.push(firstCarouselImg);
    }
    
    // Get first video if it exists (for Biomiq header video)
    const firstVideo = document.querySelector('video[autoplay]');
    if (firstVideo) {
        criticalImages.push(firstVideo);
    }
    
    // If no critical images, show content immediately
    if (criticalImages.length === 0) {
        showPageContent();
        return;
    }
    
    // Wait for all critical images to load
    let loadedCount = 0;
    const totalImages = criticalImages.length;
    
    // Check if images are already loaded
    criticalImages.forEach(img => {
        if (img.complete || (img.tagName === 'VIDEO' && img.readyState >= 2)) {
            loadedCount++;
        } else {
            img.addEventListener('load', () => {
                loadedCount++;
                if (loadedCount === totalImages) {
                    showPageContent();
                }
            });
            img.addEventListener('error', () => {
                loadedCount++;
                if (loadedCount === totalImages) {
                    showPageContent();
                }
            });
        }
    });
    
    // If all images are already loaded
    if (loadedCount === totalImages) {
        showPageContent();
    }
    
    // Fallback timeout - show content after 3 seconds max
    setTimeout(() => {
        if (!document.getElementsByClassName("body-wrapper")[0].classList.contains("visible")) {
            showPageContent();
        }
    }, 3000);
}

window.addEventListener("pageshow", function() {
    // Small delay to ensure DOM is ready
    showSplashIfSlow();
    setTimeout(waitForCriticalImages, 50);
});
