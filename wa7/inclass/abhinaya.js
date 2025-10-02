
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const expandBtn = document.querySelector('.expand-btn');
const details = document.querySelector('.card-content');
let info = false;
function showMenu() {
    var shown = navMenu.classList.toggle("show");
    navMenu.classList.toggle("hide");

    if (shown) {
        navToggle.setAttribute("aria-expanded", "true");
        navToggle.classList.toggle("hide");
    } else {
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.style.transform = "rotate(0deg)";
    }
}
function checkKey(key_code) {
    if (key_code === 32) {
        showMenu();
        console.log("worked");
    }
}
//Navbar
document.addEventListener('DOMContentLoaded', () =>{
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu){
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('show');
        });
    }
});
//carousel 
document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.carousel-container')
    const grid = document.querySelector('.carousel-grid');
    const firstSlide = grid.querySelector('.carousel-item');
    const nextbtn = document.querySelector('.car-btn.next');
    const prevBtn = document.querySelector('.car-btn.prev');

    if (!container || !grid || !firstSlide || !nextbtn || !prevBtn) {
        console.error('Carousel elements missing.');
        return;
    }
    function getScrollAmount() {
        const slideWidth = firstSlide.getBoundingClientRect().width;
        const styles = getComputedStyle(grid);
        const gap = parseFloat(styles.gap) || 0;
        return slideWidth + gap;
    }
    function scrollByAmount(dir = 1) {
        container.scrollBy({ left: dir * getScrollAmount(), behavior: 'smooth' });
    }

    nextbtn.addEventListener('click', () => scrollByAmount(1));
    prevBtn.addEventListener('click', () => scrollByAmount(-1));
})
let themebtn = document.querySelector('#theme');
themebtn.addEventListener('click', changeTheme);

// Save user's theme choice

//change theme when clicked
function changeTheme() {
    //get current theme, or defaults to light
    let ogTheme = localStorage.getItem('userTheme') || 'light';

    //switch to other theme
    let newTheme = ogTheme === 'light' ? 'dark' : 'light';

    //save in local storage
    localStorage.setItem('userTheme', newTheme);
    document.body.className = newTheme;

    //updates button text
    themebtn.textContent = newTheme == 'light' ? "Switch to Dark Mode" : 'Switch to Light Mode';
}
// Load saved theme on page load
window.addEventListener('load', function () {
    //gets and appies saved theme
    const savedTheme = localStorage.getItem('userTheme') || 'light';
    document.body.className = savedTheme;

    // changes button text to match theme
    themebtn.textContent = savedTheme === 'light' ? "Switch to Dark Mode" : 'Switch to Light Mode';

});