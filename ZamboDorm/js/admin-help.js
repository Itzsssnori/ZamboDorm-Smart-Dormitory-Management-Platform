/* ── ACCORDION ── */
function toggleFAQ(el) {
  const item = el.closest('.faq-item');
  const isOpen = item.classList.contains('open');
  // Close all in same panel
  item.closest('.faq-panel').querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

/* ── CATEGORY SWITCH ── */
function switchCat(id, btn) {
  document.querySelectorAll('.faq-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  const panel = document.getElementById('faq-' + id);
  if (panel) panel.classList.add('active');
  btn.classList.add('active');
  // Clear search
  document.getElementById('search-input').value = '';
  document.getElementById('no-results').style.display = 'none';
}

/* ── QUICK LINK JUMP ── */
function jumpTo(id) {
  const btn = Array.from(document.querySelectorAll('.cat-btn')).find(b => b.getAttribute('onclick')?.includes(`'${id}'`));
  if (btn) btn.click();
  window.scrollTo({ top: document.querySelector('.help-grid').offsetTop - 100, behavior: 'smooth' });
}

/* ── SEARCH ── */
function searchFAQ(query) {
  query = query.trim().toLowerCase();
  if (!query) {
    // Show default panel
    document.querySelectorAll('.faq-panel').forEach(p => p.classList.remove('active'));
    document.getElementById('faq-tenants').classList.add('active');
    document.getElementById('no-results').style.display = 'none';
    document.querySelectorAll('.cat-btn').forEach((b,i) => b.classList.toggle('active', i===0));
    return;
  }
  let found = 0;
  document.querySelectorAll('.faq-panel').forEach(panel => {
    let panelHasMatch = false;
    panel.querySelectorAll('.faq-item').forEach(item => {
      const text = item.textContent.toLowerCase();
      const match = text.includes(query);
      item.style.display = match ? '' : 'none';
      if (match) { panelHasMatch = true; found++; }
    });
    panel.classList.toggle('active', panelHasMatch);
  });
  document.getElementById('no-results').style.display = found === 0 ? 'block' : 'none';
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
}

/* ── HELPFUL ── */
function helpful(btn) {
  const row = btn.closest('.faq-helpful');
  row.innerHTML = '<span style="color:var(--success);font-weight:700;font-size:.82rem">✓ Thanks for the feedback!</span>';
}
function notHelpful(btn) {
  const row = btn.closest('.faq-helpful');
  row.innerHTML = '<span style="color:var(--text-muted);font-size:.82rem">We\'ll work on improving this. <a href="mailto:dev@zambodorm.com" style="color:var(--primary);font-weight:700;">Contact support →</a></span>';
}

/* ── TOAST ── */
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3500);
}
