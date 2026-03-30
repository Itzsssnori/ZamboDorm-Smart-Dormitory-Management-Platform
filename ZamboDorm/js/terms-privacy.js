function switchDoc(doc, btn) {
  document.querySelectorAll('.toc-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.doc-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('panel-' + doc).classList.add('active');
  document.getElementById('toc-tos').style.display = doc === 'tos' ? 'block' : 'none';
  document.getElementById('toc-pp').style.display  = doc === 'pp'  ? 'block' : 'none';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleSection(id) {
  const section = document.getElementById(id);
  section.classList.toggle('open');
}

function expandAll(panelId) {
  const panel = document.getElementById(panelId);
  const allClosed = !panel.querySelector('.doc-section.open');
  panel.querySelectorAll('.doc-section').forEach(s => {
    if (allClosed) s.classList.add('open');
    else s.classList.remove('open');
  });
  const btn = document.querySelector(`#${panelId} ~ * .btn-expand-all, .doc-controls .btn-expand-all`);
}

function scrollToSection(id) {
  const section = document.getElementById(id);
  if (!section) return;
  section.classList.add('open');
  setTimeout(() => section.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
}

// Highlight active TOC link on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const id = e.target.id;
      document.querySelectorAll('.toc-link').forEach(l => {
        l.classList.toggle('active', l.getAttribute('onclick')?.includes(`'${id}'`));
      });
    }
  });
}, { rootMargin: '-20% 0px -70% 0px' });

document.querySelectorAll('.doc-section').forEach(s => observer.observe(s));