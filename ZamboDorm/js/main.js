const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

// Close menu when a link is clicked
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

// Update active nav link based on scroll position
const sections = document.querySelectorAll('section, .hero, footer');
const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');

const observerOptions = {
  threshold: 0.3
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}, observerOptions);

sections.forEach(section => {
  observer.observe(section);
});

// Demo badge buttons
const demoBadges = document.querySelectorAll('.about-badge');
demoBadges.forEach((badge, index) => {
  badge.addEventListener('click', () => {
    const demos = ['sys-administration.html', 'admin-overview.html', 'tenant-myroom.html'];
    if (demos[index]) {
      window.location.href = `../${demos[index]}`;
    }
  });
});
