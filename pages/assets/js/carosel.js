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
  if (img.dataset.src && !img.src) {
    img.src = img.dataset.src;
    img.removeAttribute('data-src');
  }
}

// Load images for current and adjacent cells
function loadAdjacentImages(selectedIndex) {
  const cells = elem.querySelectorAll('.carousel-cell');
  const totalCells = cells.length;
  
  // Load current image
  loadCarouselImage(cells[selectedIndex]);
  
  // Load next image (preload)
  const nextIndex = (selectedIndex + 1) % totalCells;
  loadCarouselImage(cells[nextIndex]);
  
  // Load previous image (preload)
  const prevIndex = (selectedIndex - 1 + totalCells) % totalCells;
  loadCarouselImage(cells[prevIndex]);
}

// Load images when carousel changes
flkty.on('change', function(index) {
  loadAdjacentImages(index);
});

// Load first image and adjacent ones on initialization
if (flkty.selectedIndex !== undefined) {
  loadAdjacentImages(flkty.selectedIndex);
}