
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
// // carousel
let slideIndex = 1;
document.addEventListener('DOMContentLoaded', () =>{
    showSlides(slideIndex)
});
function plusSlides(n) {
    showSlides(slideIndex +=n);
}
function showSlides(n) {
    const slides = document.getElementsByClassName("mySlides");
    if (!slides.length) return;

    if (n>slides.length) { slideIndex = 1;}
    if (n< 1 ) {slideIndex = slides.length;}

    for (let i = 0; i <slides.length; i++) {
        slides[i].style.display = 'none';
    }
    slides[slideIndex -1].style.display = "block";
}


// // // Next/previous controls
// // function plusSlides(n) {
// //   showSlides(slideIndex += n);
// // }

// // // Thumbnail image controls
// // function currentSlide(n) {
// //   showSlides(slideIndex = n);
// // }

// function showSlides(n) {
//   let i;
//   let slides = document.getElementsByClassName("mySlides");
//   let dots = document.getElementsByClassName("dot");
//   if (n > slides.length) {slideIndex = 1}
//   if (n < 1) {slideIndex = slides.length}
//   for (i = 0; i < slides.length; i++) {
//     slides[i].style.display = "none";
//   }
//   for (i = 0; i < dots.length; i++) {
//     dots[i].className = dots[i].className.replace(" active", "");
//   }
//   slides[slideIndex-1].style.display = "block";
//   dots[slideIndex-1].className += " active";
// }

// //carousel 
// document.addEventListener('DOMContentLoaded', () => {
//     const container = document.querySelector('.carousel-container')
//     const grid = document.querySelector('.carousel-grid');
//     const firstSlide = grid.querySelector('.carousel-item');
//     const nextbtn = document.querySelector('.car-btn.next');
//     const prevBtn = document.querySelector('.car-btn.prev');

//     if (!container || !grid || !firstSlide || !nextbtn || !prevBtn) {
//         console.error('Carousel elements missing.');
//         return;
//     }
//     function getScrollAmount() {
//         const slideWidth = firstSlide.getBoundingClientRect().width;
//         const styles = getComputedStyle(grid);
//         const gap = parseFloat(styles.gap) || 0;
//         return slideWidth + gap;
//     }
//     function scrollByAmount(dir = 1) {
//         container.scrollBy({ left: dir * getScrollAmount(), behavior: 'smooth' });
//     }

//     nextbtn.addEventListener('click', () => scrollByAmount(1));
//     prevBtn.addEventListener('click', () => scrollByAmount(-1));
// })
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

})

//Save name
const greeting = document.querySelector('#greeting');
const nameInput = document.querySelector('#username');
const saveNameBtn = document.querySelector ('#saveName');
const clearDataBtn = document.querySelector('#clearData');

window.addEventListener('load', () => {
    const savedName = localStorage.getItem('userName');
    greeting.textContent = savedName ? `Welcome back, ${savedName}, to CU Abhinaya!` : `Welcome to CU Abhinaya!`;
}

)

saveNameBtn.addEventListener('click', () => {
    const userName = nameInput.value.trim();
    if (userName) {
        localStorage.setItem('userName', userName);
        alert(`Thanks, ${userName}!`);
    } else {
        alert ("Please enter your first name!");
    }
})

//Clear both 
clearDataBtn.addEventListener('click', () => {
    localStorage.removeItem('userTheme');
    localStorage.removeItem('userName');
    document.body.className = 'light';
    themebtn.textContent = "Switch to Dark Mode";
    nameInput.value = '';
    alert('Your data has been cleared successfully');
});
//Drop down
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
        
            const expandBtn = card.querySelector('.expand-btn');
            const details = card.querySelector('.card-content');
            details.classList.add('.detailshidden');

            expandBtn.addEventListener('click', () => {
                const isHidden = details.classList.contains('detailshidden');
                details.classList.toggle('detailshidden');

                expandBtn.textContent = isHidden ? '-' : '+';
        });
    });
});