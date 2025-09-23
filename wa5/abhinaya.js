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

navToggle.addEventListener('click', showMenu);

expandBtn.addEventListener('click', showInfo);

  function showInfo() {
    
    if (info == true) {
        details.style.display = 'flex';
        expandBtn.textContent = '-';
        info = false;
    }
    else if (info == false) {
        details.style.display = 'none';
        expandBtn.textContent = '+';

        info = true;
    }
};
