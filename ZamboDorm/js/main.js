// Demo badge buttons (About section)
const demoBadges = document.querySelectorAll('.about__feature');
demoBadges.forEach((badge, index) => {
  badge.addEventListener('click', () => {
    const demos = ['sys-administration.html', 'admin-overview.html', 'tenant-myroom.html'];
    if (demos[index]) {
      window.location.href = `../${demos[index]}`;
    }
  });
});
