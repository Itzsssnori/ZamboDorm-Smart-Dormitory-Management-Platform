/**
 * ZamboDorm NavBar Web Component
 * Flexible navbar component for both public and authenticated pages
 * Pulls user data dynamically from UserManager (localStorage)
 * Usage:
 *   Public: <zd-navbar></zd-navbar>
 *   Auth: <zd-navbar authenticated></zd-navbar> (pulls user data from localStorage)
 */
class ZDNavBar extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.attachEventListeners();
  }

  isAuthenticated() {
    return typeof UserManager !== 'undefined' && UserManager.isAuthenticated();
  }

  getUserName() {
    return typeof UserManager !== 'undefined' ? UserManager.getName() : 'User';
  }

  getUserInitials() {
    return typeof UserManager !== 'undefined' ? UserManager.getInitials() : 'U';
  }

  render() {
    const isAuth = this.isAuthenticated();
    const userName = this.getUserName();
    const userInitials = this.getUserInitials();

    this.innerHTML = `
      <!-- NAVBAR -->
      <nav class="navbar">
        <div class="navbar__inner">

          <!-- Logo -->
          <a href="../html/index.html" class="logo">
            <div class="logo__icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 9.5L12 3L21 9.5V20C21 20.55 20.55 21 20 21H4C3.45 21 3 20.55 3 20V9.5Z" fill="white" fill-opacity="0.95"/>
                <rect x="9" y="14" width="6" height="7" rx="1" fill="rgba(124,58,237,0.65)"/>
              </svg>
            </div>
            <span class="logo__text">Zambo<span class="logo__text--accent">Dorm</span></span>
          </a>

          <!-- Nav Links -->
          <ul class="navbar__links">
            <li><a href="../html/index.html#hero" class="navbar__link">Home</a></li>
            <li><a href="../html/index.html#core-features" class="navbar__link">Features</a></li>
            <li><a href="../html/index.html#about" class="navbar__link">About</a></li>
            <li><a href="../html/index.html#contact" class="navbar__link">Contact</a></li>
          </ul>

          <!-- Sign In / User Profile -->
          <div class="navbar__right">
            ${isAuth ? `
              <a href="#" class="navbar__user-profile">
                <div class="navbar__user-avatar">${userInitials}</div>
                <span class="navbar__user-name">${userName}</span>
              </a>
              <a href="javascript:void(0)" class="btn btn--signin" id="logoutBtn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"/>
                </svg>
                Log Out
              </a>
            ` : `
              <a href="signin-page.html" class="btn btn--signin">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"/>
                </svg>
                Sign In
              </a>
            `}
          </div>

          <!-- Hamburger (mobile) -->
          <button class="hamburger" id="hamburger" aria-label="Toggle menu">
            <span></span><span></span><span></span>
          </button>

        </div>
      </nav>

      <div class="mobile-menu" id="mobileMenu">
        <div class="mobile-menu__inner">
          <a href="../html/index.html#hero" class="mobile-menu__link">
            Home
          </a>
          <a href="../html/index.html#core-features" class="mobile-menu__link">
            Features
          </a>
          <a href="../html/index.html#about" class="mobile-menu__link">
            About
          </a>
          <a href="../html/index.html#contact" class="mobile-menu__link">
            Contact
          </a>
          <div class="mobile-menu__divider"></div>
          ${isAuth ? `
            <a href="../html/index.html" class="btn btn--signin mobile-menu__link" id="logoutBtnMobile">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"/>
              </svg>
              Log Out
            </a>
          ` : `
            <a href="signin-page.html" class="btn btn--signin mobile-menu__link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"/>
              </svg>
              Sign In
            </a>
          `}
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    const hamburger = this.querySelector('#hamburger');
    const mobileMenu = this.querySelector('#mobileMenu');

    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('hamburger--open');
        mobileMenu.classList.toggle('mobile-menu--open');
      });

      // Close menu when a link is clicked
      mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          hamburger.classList.remove('hamburger--open');
          mobileMenu.classList.remove('mobile-menu--open');
        });
      });
    }

    // Handle logout with confirmation using UserManager
    const logoutBtn = this.querySelector('#logoutBtn');
    const logoutBtnMobile = this.querySelector('#logoutBtnMobile');
    
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (typeof UserManager !== 'undefined') {
          UserManager.logout();
        } else {
          if (confirm('Are you sure you want to logout?')) {
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = '../html/index.html';
          }
        }
      });
    }

    if (logoutBtnMobile) {
      logoutBtnMobile.addEventListener('click', (e) => {
        e.preventDefault();
        if (typeof UserManager !== 'undefined') {
          UserManager.logout();
        } else {
          if (confirm('Are you sure you want to logout?')) {
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = '../html/index.html';
          }
        }
      });
    }

    // Update active nav link based on scroll position
    this.setupScrollNavigation();
  }

  setupScrollNavigation() {
    const sections = document.querySelectorAll('section, .hero, footer');
    const navLinks = this.querySelectorAll('.navbar__link, .mobile-menu__link');

    const observerOptions = {
      threshold: 0.3
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            link.classList.remove('navbar__link--active', 'mobile-menu__link--active');
            if (link.getAttribute('href') === `#${id}`) {
              if (link.closest('.navbar__links')) {
                link.classList.add('navbar__link--active');
              } else if (link.closest('.mobile-menu__inner')) {
                link.classList.add('mobile-menu__link--active');
              }
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(section => {
      observer.observe(section);
    });
  }
}

// Register the custom element
customElements.define('zd-navbar', ZDNavBar);
