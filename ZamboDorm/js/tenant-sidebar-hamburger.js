// Tenant Sidebar Hamburger Toggle (Dedicated for Tenant Pages)
document.addEventListener('DOMContentLoaded', function() {
  const sidebarBtn = document.getElementById('sidebarHamburger');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  
  // Function to close sidebar
  function closeTenantSidebar() {
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
    if (sidebarBtn) sidebarBtn.classList.remove('open');
  }
  
  if (sidebarBtn && sidebar && overlay) {
    // Toggle sidebar on hamburger click
    sidebarBtn.addEventListener('click', function() {
      sidebar.classList.toggle('open');
      overlay.classList.toggle('active');
      sidebarBtn.classList.toggle('open');
    });
    
    // Close sidebar on overlay click
    overlay.addEventListener('click', function() {
      closeTenantSidebar();
    });
    
    // Close sidebar when a link is clicked
    const sidebarLinks = sidebar.querySelectorAll('.sidebar-item');
    sidebarLinks.forEach(link => {
      link.addEventListener('click', function() {
        closeTenantSidebar();
      });
    });
  }
});
