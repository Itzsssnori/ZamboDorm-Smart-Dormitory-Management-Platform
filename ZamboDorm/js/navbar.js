// ── Hamburger Menu Toggle ──
document.addEventListener('DOMContentLoaded', function() {
  const hamburger = document.getElementById('hbg');
  const mobileMenu = document.getElementById('mob');
  
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function() {
      mobileMenu.style.display = mobileMenu.style.display === 'none' || !mobileMenu.style.display ? 'flex' : 'none';
    });
  }

  // Close mobile menu when a link is clicked
  const mobLinks = document.querySelectorAll('.mob a');
  mobLinks.forEach(link => {
    link.addEventListener('click', function() {
      if (mobileMenu) {
        mobileMenu.style.display = 'none';
      }
    });
  });

  // Handle logout
  const logoutLinks = document.querySelectorAll('.btn-signin');
  logoutLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      if (this.textContent.includes('Log Out')) {
        e.preventDefault();
        if (confirm('Are you sure you want to logout?')) {
          // Clear session/localStorage
          localStorage.clear();
          sessionStorage.clear();
          // Redirect to signin page
          window.location.href = 'signin-page.html';
        }
      }
    });
  });
});
