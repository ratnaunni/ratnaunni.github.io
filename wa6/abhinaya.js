document.addEventListener('DOMContentLoaded', () =>{
const container = document.querySelector('.carousel-container')
const grid = document.querySelector('.carousel-grid');
const carousel = document.querySelector ('.carousel-container');
const nextbtn = document.querySelector ('.car-btn.next');
const prevBtn = document.querySelector ('.car-btn.prev');

if (!container || !grid || !firstSlide ||!nextBtn || !prevBtn) {
  console.error('Carousel elements missing. Check class names.');
      return;
    }
function getScrollAmount (){
    const slideWidth = firstSlide.getBoundingClientRect().width;
    const styles = getComputedStyle(grid);
    const gap = parseFloat(styles.columnGap) || 0;
}
function scrollByAmount (dir = 1){
    container.scrollBy({left: dir * getScrollAmount(), behavior:'smooth'});
}

nextbtn.addEventListener('click', () => scrollByAmount(1));
prevBtn.addEventListener ('click', () => scrollByAmount (-1));
})
