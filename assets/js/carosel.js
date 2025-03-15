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
