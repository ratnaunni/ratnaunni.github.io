// 1. SELECT ELEMENTS
const navToggle = document.getElementById("burger-menu"); // Targeting the new ID
const mainNav = document.querySelector(".main-nav");   
const navLinks = document.querySelector(".nav-links"); 

// 2. TOGGLE MENU OPEN/CLOSED (Burger/X Click)
navToggle.addEventListener("click", () => {
    // Toggles the "is-open" class on the main container (controls menu slide/visibility)
    const isOpen = mainNav.classList.toggle("is-open");
    
    // Toggles the "close" class on the button (controls icon animation from burger to X)
    navToggle.classList.toggle("close"); 

    // Update the accessibility attribute
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
});

// 3. CLOSE MOBILE MENU WHEN CLICKING A LINK
document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    if (mainNav.classList.contains("is-open")) {
      mainNav.classList.remove("is-open");
      
      // IMPORTANT: Remove the "close" class so the icon reverts to the burger state
      navToggle.classList.remove("close"); 
      
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
});