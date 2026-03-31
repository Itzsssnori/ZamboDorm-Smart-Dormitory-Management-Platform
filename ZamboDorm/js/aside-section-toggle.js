/**
 * ZamboDorm Sidebar Toggle
 * Handles responsive sidebar behavior:
 *   - Adds a hamburger/overlay toggle for mobile
 *   - Marks the active sidebar item based on current page
 *   - Closes sidebar on link click (mobile)
 */

(function () {
  /* ─── Active link ─────────────────────────────────────── */
  const currentPage = window.location.pathname.split('/').pop();
  document.querySelectorAll('.sidebar-item').forEach(item => {
    const href = item.getAttribute('href');
    if (href && href === currentPage) {
      item.classList.add('active');
    }
  });

  /* ─── Inject mobile toggle button into the sidebar ───── */
  function injectToggleButton() {
    // Don't inject twice
    if (document.getElementById('sidebarToggleBtn')) return;

    const btn = document.createElement('button');
    btn.id = 'sidebarToggleBtn';
    btn.setAttribute('aria-label', 'Toggle sidebar');
    btn.innerHTML = `
      <svg id="sidebarToggleIcon" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
           width="22" height="22">
        <!-- hamburger bars (default) -->
        <line class="bar bar1" x1="3" y1="6"  x2="21" y2="6"/>
        <line class="bar bar2" x1="3" y1="12" x2="21" y2="12"/>
        <line class="bar bar3" x1="3" y1="18" x2="21" y2="18"/>
      </svg>`;

    Object.assign(btn.style, {
      position: 'fixed',
      bottom: '1.5rem',
      right: '1.5rem',
      zIndex: '300',
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      border: 'none',
      background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
      color: 'white',
      cursor: 'pointer',
      display: 'none',          // shown only on mobile via CSS
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 16px rgba(124,58,237,0.40)',
      transition: 'transform 0.2s, box-shadow 0.2s',
    });

    btn.addEventListener('mouseenter', () => {
      btn.style.transform = 'scale(1.08)';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'scale(1)';
    });

    document.body.appendChild(btn);

    // Inject required CSS once
    const style = document.createElement('style');
    style.textContent = `
      /* Show FAB only on mobile */
      @media (max-width: 768px) {
        #sidebarToggleBtn { display: flex !important; }
      }

      /* Slide-in sidebar on mobile */
      @media (max-width: 768px) {
        .sidebar {
          position: fixed !important;
          left: -260px !important;   /* hidden off-screen */
          top: 68px !important;
          width: 260px !important;
          height: calc(100vh - 68px) !important;
          max-height: none !important;
          overflow-y: auto !important;
          transition: left 0.3s cubic-bezier(0.22,1,0.36,1) !important;
          z-index: 200 !important;
          box-shadow: none;
        }
        .sidebar.sidebar--open {
          left: 0 !important;
          box-shadow: 4px 0 24px rgba(124,58,237,0.18) !important;
        }
        .main-content {
          margin-left: 0 !important;
          padding-top: 1.5rem !important;
        }

        /* Dim overlay behind sidebar */
        #sidebarOverlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.35);
          z-index: 199;
        }
        #sidebarOverlay.active { display: block; }
      }

      /* Smooth icon morph */
      #sidebarToggleBtn svg line {
        transform-origin: center;
        transition: transform 0.3s ease, opacity 0.3s ease;
      }
      #sidebarToggleBtn.is-open .bar1 {
        transform: translateY(6px) rotate(45deg);
      }
      #sidebarToggleBtn.is-open .bar2 {
        opacity: 0;
      }
      #sidebarToggleBtn.is-open .bar3 {
        transform: translateY(-6px) rotate(-45deg);
      }
    `;
    document.head.appendChild(style);

    /* Overlay element */
    const overlay = document.createElement('div');
    overlay.id = 'sidebarOverlay';
    document.body.appendChild(overlay);

    /* Toggle logic */
    const sidebar = document.getElementById('sidebar');

    function openSidebar() {
      sidebar.classList.add('sidebar--open');
      overlay.classList.add('active');
      btn.classList.add('is-open');
    }

    function closeSidebar() {
      sidebar.classList.remove('sidebar--open');
      overlay.classList.remove('active');
      btn.classList.remove('is-open');
    }

    btn.addEventListener('click', () => {
      sidebar.classList.contains('sidebar--open') ? closeSidebar() : openSidebar();
    });

    overlay.addEventListener('click', closeSidebar);

    // Close on any sidebar link tap (mobile UX)
    sidebar.querySelectorAll('.sidebar-item').forEach(item => {
      item.addEventListener('click', () => {
        if (window.innerWidth <= 768) closeSidebar();
      });
    });

    // Close on resize back to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) closeSidebar();
    });
  }

  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectToggleButton);
  } else {
    injectToggleButton();
  }
})();