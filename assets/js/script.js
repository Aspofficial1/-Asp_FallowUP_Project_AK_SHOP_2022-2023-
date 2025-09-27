'use strict';

/**
 * navbar toggle
 */

const overlay = document.querySelector("[data-overlay]");
const navOpenBtn = document.querySelector("[data-nav-open-btn]");
const navbar = document.querySelector("[data-navbar]");
const navCloseBtn = document.querySelector("[data-nav-close-btn]");

const navElemArr = [overlay, navOpenBtn, navCloseBtn];

for (let i = 0; i < navElemArr.length; i++) {
  navElemArr[i].addEventListener("click", function () {
    navbar.classList.toggle("active");
    overlay.classList.toggle("active");
  });
}

/**
 * add active class on header when scrolled 200px from top
 */

const header = document.querySelector("[data-header]");

window.addEventListener("scroll", function () {
  window.scrollY >= 200 ? header.classList.add("active")
    : header.classList.remove("active");
});

/**
 * dark mode toggle
 */

const darkModeToggle = document.querySelector("#dark-mode-toggle");
const darkModeIcon = darkModeToggle.querySelector("ion-icon");

// Check for saved theme in localStorage
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
  darkModeIcon.setAttribute("name", "sunny-outline");
}

darkModeToggle.addEventListener("click", function () {
  document.body.classList.toggle("dark-mode");
  const isDarkMode = document.body.classList.contains("dark-mode");
  darkModeIcon.setAttribute("name", isDarkMode ? "sunny-outline" : "moon-outline");
  localStorage.setItem("theme", isDarkMode ? "dark" : "light");
});