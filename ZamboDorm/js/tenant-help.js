// Hamburger
(function(){
  var hbg=document.getElementById('hbg'),mob=document.getElementById('mob'),sb=document.getElementById('sidebar');
  hbg.addEventListener('click',function(e){
    e.stopPropagation();
    var open=mob.classList.toggle('open');
    hbg.classList.toggle('open',open);
    if(sb)sb.classList.toggle('open',open);
  });
  document.addEventListener('click',function(e){
    if(!hbg.contains(e.target)&&!mob.contains(e.target)){
      mob.classList.remove('open');hbg.classList.remove('open');
      if(sb)sb.classList.remove('open');
    }
  });
})();

/* ── Sidebar toggle ── */
function toggleSidebar() {
  const sb = document.getElementById('sidebar');
  const ov = document.getElementById('overlay');
  sb.classList.toggle('open');
  if (ov) ov.classList.toggle('active');
}

// FAQ accordion
function toggleFAQ(btn) {
  var item = btn.closest('.faq-item');
  var isOpen = item.classList.contains('open');
  // close all in same panel
  var panel = item.closest('.faq-panel');
  panel.querySelectorAll('.faq-item.open').forEach(function(i){ i.classList.remove('open'); });
  if (!isOpen) item.classList.add('open');
}

// Category switch
function switchCat(cat, btn) {
  document.querySelectorAll('.faq-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  var panel = document.getElementById('faq-' + cat);
  if (panel) panel.classList.add('active');
  btn.classList.add('active');
  document.getElementById('search-input').value = '';
  document.getElementById('no-results').style.display = 'none';
}

// Jump from quick links
function jumpTo(cat) {
  var btn = Array.from(document.querySelectorAll('.cat-btn')).find(b => b.getAttribute('onclick') && b.getAttribute('onclick').includes("'" + cat + "'"));
  if (btn) { switchCat(cat, btn); document.querySelector('.help-grid').scrollIntoView({behavior:'smooth',block:'start'}); }
}

// Search
function searchFAQ(query) {
  query = query.trim().toLowerCase();
  if (!query) {
    // restore active panel
    document.querySelectorAll('.faq-panel').forEach(p => { p.style.display=''; });
    var active = document.querySelector('.cat-btn.active');
    if (active) { var cat = active.getAttribute('onclick').match(/'([^']+)'/)[1]; document.querySelectorAll('.faq-panel').forEach(p => p.classList.remove('active')); document.getElementById('faq-'+cat).classList.add('active'); }
    document.getElementById('no-results').style.display='none';
    return;
  }
  var found = 0;
  document.querySelectorAll('.faq-panel').forEach(p => { p.classList.remove('active'); p.style.display='none'; });
  // show all panels, filter items
  var allPanels = document.querySelectorAll('.faq-panel');
  allPanels.forEach(function(panel) {
    var hasMatch = false;
    panel.querySelectorAll('.faq-item').forEach(function(item) {
      var text = item.textContent.toLowerCase();
      var match = text.includes(query);
      item.style.display = match ? '' : 'none';
      if (match) { hasMatch = true; found++; }
    });
    if (hasMatch) { panel.style.display=''; panel.classList.add('active'); }
  });
  document.getElementById('no-results').style.display = found === 0 ? 'block' : 'none';
}

// Toast
function showToast(msg) {
  var t = document.getElementById('toast');
  t.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> ' + msg;
  t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 3000);
}

// Helpful buttons
function helpful(btn) { btn.textContent = '✅ Thanks!'; btn.disabled = true; btn.closest('.faq-helpful').querySelector('.btn-no').style.display='none'; }
function notHelpful(btn) { showToast('Thanks for the feedback. We\'ll improve this answer.'); btn.disabled=true; }