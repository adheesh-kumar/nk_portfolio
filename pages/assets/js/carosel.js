var elem = document.querySelector('.main-carousel');
var flkty = new Flickity( elem, {
  // options
  cellAlign: 'center',
  contain: true,
  draggable: false,
  wrapAround: true,
  imagesLoaded: true,
  pageDots: false,
  arrowShape: { 
    x0: 10,
    x1: 60, y1: 50,
    x2: 62, y2: 48,
    x3: 14 
  }
});

// Lazy load carousel images
function loadCarouselImage(img) {
  if (!img) return;
  
  if (img.dataset.src && !img.src) {
    // Add error handling
    img.onerror = function() {
      console.error('Failed to load carousel image:', img.dataset.src);
    };
    img.src = img.dataset.src;
    img.removeAttribute('data-src');
  }
}

// Load images for current and adjacent cells
function loadAdjacentImages(selectedIndex) {
  const cells = elem.querySelectorAll('.carousel-cell');
  const totalCells = cells.length;
  
  if (totalCells === 0) return;
  
  // Ensure index is valid
  selectedIndex = selectedIndex || 0;
  if (selectedIndex < 0 || selectedIndex >= totalCells) {
    selectedIndex = 0;
  }
  
  // Load current image
  if (cells[selectedIndex]) {
    loadCarouselImage(cells[selectedIndex]);
  }
  
  // Load next image (preload)
  const nextIndex = (selectedIndex + 1) % totalCells;
  if (cells[nextIndex]) {
    loadCarouselImage(cells[nextIndex]);
  }
  
  // Load previous image (preload)
  const prevIndex = (selectedIndex - 1 + totalCells) % totalCells;
  if (cells[prevIndex]) {
    loadCarouselImage(cells[prevIndex]);
  }
}

// Load images when carousel changes
flkty.on('change', function(index) {
  loadAdjacentImages(index);
  
  // Specifically ensure c3 (index 3) loads when nearby
  const cells = elem.querySelectorAll('.carousel-cell');
  if (cells[3] && (index === 2 || index === 3 || index === 4)) {
    loadCarouselImage(cells[3]);
  }
});

// Load first image and adjacent ones on initialization
// Wait for Flickity to be ready, then load initial images
flkty.on('ready', function() {
  const index = flkty.selectedIndex || 0;
  loadAdjacentImages(index);
  
  // Also preload c3 specifically (index 3) to ensure it loads
  const cells = elem.querySelectorAll('.carousel-cell');
  if (cells[3]) {
    loadCarouselImage(cells[3]);
  }
});

// Fallback: also try immediately in case ready already fired
if (flkty.selectedIndex !== undefined) {
  loadAdjacentImages(flkty.selectedIndex);
  // Preload c3
  const cells = elem.querySelectorAll('.carousel-cell');
  if (cells[3]) {
    loadCarouselImage(cells[3]);
  }
} else {
  // If not ready yet, wait a bit and try again
  setTimeout(function() {
    if (flkty.selectedIndex !== undefined) {
      loadAdjacentImages(flkty.selectedIndex);
      // Preload c3
      const cells = elem.querySelectorAll('.carousel-cell');
      if (cells[3]) {
        loadCarouselImage(cells[3]);
      }
    }
  }, 100);
  
  // Additional fallback: ensure c3 loads after a short delay
  setTimeout(function() {
    const cells = elem.querySelectorAll('.carousel-cell');
    if (cells[3] && cells[3].dataset.src) {
      loadCarouselImage(cells[3]);
    }
  }, 500);
}