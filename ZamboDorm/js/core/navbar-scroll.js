/**
 * Navbar Scroll Effect
 * Enhances navbar blur effect as user scrolls
 * Works with sticky positioning (navbar stays visible)
 */

let navbar = document.querySelector('.navbar');

if (!navbar && document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    navbar = document.querySelector('nav.navbar') || document.querySelector('zd-navbar nav.navbar');
  });
}

if (navbar) {
  let isScrolled = false;

  window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;

    // Enhance blur effect when scrolling
    if (scrollPosition > 0 && !isScrolled) {
      navbar.classList.add('navbar--scrolled');
      isScrolled = true;
    } else if (scrollPosition === 0 && isScrolled) {
      navbar.classList.remove('navbar--scrolled');
      isScrolled = false;
    }
  });
}
