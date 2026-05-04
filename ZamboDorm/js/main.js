// Demo badge buttons (About section)
const demoBadges = document.querySelectorAll('.about__feature');
demoBadges.forEach((badge, index) => {
  badge.addEventListener('click', () => {
    // Correct paths relative to index.html
    const demos = ['html/sysadmin-overview.html', 'html/admin-overview.html', 'html/tenant-myroom.html'];
    if (demos[index]) {
      window.location.href = demos[index];
    }
  });
});
