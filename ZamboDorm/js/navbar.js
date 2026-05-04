/**
 * ZamboDorm NavBar Web Component
 * Flexible navbar component for both public and authenticated pages
 * Pulls user data dynamically from UserManager (localStorage)
 * Usage:
 *   Public: <zd-navbar></zd-navbar>
 *   Auth:   <zd-navbar authenticated></zd-navbar>
 */

class ZDNavBar extends HTMLElement {
  constructor() {
    super();
    // Determine the base path prefix based on the current location
    const path = window.location.pathname;
    this.prefix = (path.includes('/html/') || path.includes('\\html\\')) ? '../' : '';
  }

  connectedCallback() {
    this.render();
    this.attachEventListeners();
    // Sync any greetings on the page once the navbar (and UserManager) are ready
    if (typeof UserManager !== 'undefined') {
      UserManager.updatePageGreetings();
    }
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
    const p = this.prefix;

    this.innerHTML = `
      <!-- NAVBAR -->
      <nav class="navbar">
        <div class="navbar__inner">

          <!-- Logo -->
          <a href="${p}index.html" class="logo">
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
            <li><a href="${p}index.html#hero" class="navbar__link">Home</a></li>
            <li><a href="${p}index.html#core-features" class="navbar__link">Features</a></li>
            <li><a href="${p}index.html#about" class="navbar__link">About</a></li>
            <li><a href="${p}index.html#contact" class="navbar__link">Contact</a></li>
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
              <a href="${p}html/signin-page.html" class="btn btn--signin">
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
          <a href="${p}index.html#hero" class="mobile-menu__link">Home</a>
          <a href="${p}index.html#core-features" class="mobile-menu__link">Features</a>
          <a href="${p}index.html#about" class="mobile-menu__link">About</a>
          <a href="${p}index.html#contact" class="mobile-menu__link">Contact</a>
          <div class="mobile-menu__divider"></div>
          ${isAuth ? `
            <a href="javascript:void(0)" class="btn btn--signin mobile-menu__link" id="logoutBtnMobile">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"/>
              </svg>
              Log Out
            </a>
          ` : `
            <a href="${p}html/signin-page.html" class="btn btn--signin mobile-menu__link">
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

      // ✅ FIX: Only listen to clicks that originate INSIDE mobileMenu
      // and only when mobileMenu is actually open. This prevents the
      // listener from intercepting sidebar link clicks when menu is closed.
      mobileMenu.addEventListener('click', (e) => {
        // Ignore clicks if the mobile menu isn't open
        if (!mobileMenu.classList.contains('mobile-menu--open')) return;

        const link = e.target.closest('a');
        if (!link) return;

        // ✅ Make sure the clicked link is actually inside THIS mobileMenu,
        // not a sidebar item or any other element in the document
        if (!mobileMenu.contains(link)) return;

        hamburger.classList.remove('hamburger--open');
        mobileMenu.classList.remove('mobile-menu--open');
      });
    }

    // Handle logout
    const logoutBtn = this.querySelector('#logoutBtn');
    const logoutBtnMobile = this.querySelector('#logoutBtnMobile');

    const doLogout = (e) => {
      e.preventDefault();
      // ✅ Stop logout clicks from bubbling anywhere else
      e.stopPropagation();
      if (typeof UserManager !== 'undefined') {
        UserManager.logout();
      } else {
        if (confirm('Are you sure you want to logout?')) {
          localStorage.clear();
          sessionStorage.clear();
          window.location.href = '../index.html';
        }
      }
    };

    if (logoutBtn) logoutBtn.addEventListener('click', doLogout);
    if (logoutBtnMobile) logoutBtnMobile.addEventListener('click', doLogout);

    // ── Scroll-based active link: ONLY run on the landing page ──────────────
    const currentFile = window.location.pathname.split('/').pop();
    const isLandingPage = currentFile === 'index.html' || currentFile === '';

    if (isLandingPage) {
      this.setupScrollNavigation();
    }
  }

  setupScrollNavigation() {
    const sections = document.querySelectorAll('section, .hero, footer');
    const navLinks = this.querySelectorAll('.navbar__link, .mobile-menu__link');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            // ✅ FIX: Only update links that are anchor-style (#section)
            // Never touch links pointing to .html pages (sidebar pages)
            const href = link.getAttribute('href') || '';
            if (!href.includes('#')) return;

            link.classList.remove('navbar__link--active', 'mobile-menu__link--active');
            if (href === `#${id}` || href.endsWith(`#${id}`)) {
              if (link.closest('.navbar__links')) {
                link.classList.add('navbar__link--active');
              } else if (link.closest('.mobile-menu__inner')) {
                link.classList.add('mobile-menu__link--active');
              }
            }
          });
        }
      });
    }, { threshold: 0.3 });

    sections.forEach(section => observer.observe(section));
  }
}

// Register the custom element
customElements.define('zd-navbar', ZDNavBar);