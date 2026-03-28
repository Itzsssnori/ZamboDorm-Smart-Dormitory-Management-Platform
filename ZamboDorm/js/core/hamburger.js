/**
 * Shared hamburger menu functionality
 * For pages with inline navbar (index.html)
 * Pages with zd-navbar component handle hamburger internally
 */

document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  // Only initialize if hamburger and mobileMenu exist
  if (!hamburger || !mobileMenu) return;

  // Check if navbar component already handles this
  // If navbar is a zd-navbar component, skip (it handles itself)
  const navbar = document.querySelector('zd-navbar');
  if (navbar) return;

  // Attach hamburger toggle
  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    hamburger.classList.toggle('hamburger--open');
    mobileMenu.classList.toggle('mobile-menu--open');
  });

  // Close menu when link clicked
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('hamburger--open');
      mobileMenu.classList.remove('mobile-menu--open');
    });
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      hamburger.classList.remove('hamburger--open');
      mobileMenu.classList.remove('mobile-menu--open');
    }
  });
});
