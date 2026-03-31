// Sidebar Hamburger Toggle (Reusable)
document.addEventListener('DOMContentLoaded', function() {
  const sidebarBtn = document.getElementById('sidebarHamburger');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  if (sidebarBtn && sidebar && overlay) {
    sidebarBtn.addEventListener('click', function() {
      sidebar.classList.add('open');
      overlay.classList.add('active');
    });
    overlay.addEventListener('click', function() {
      sidebar.classList.remove('open');
      overlay.classList.remove('active');
    });
  }
});
