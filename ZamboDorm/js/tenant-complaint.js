/* ── State ── */
let selectedCategory = null;
let selectedUrgency  = null;

/* ── Sidebar toggle (mobile) ── */
function toggleSidebar() {
  const sb = document.getElementById('sidebar');
  const ov = document.getElementById('overlay');
  sb.classList.toggle('open');
  ov.classList.toggle('active');
}

/* ── Step helpers ── */
function setStep(n) {
  [1, 2, 3].forEach(i => {
    const el = document.getElementById('step' + i);
    el.classList.remove('active', 'done');
    if (i < n)  el.classList.add('done');
    if (i === n) el.classList.add('active');
  });
}

function showScreen(name) {
  ['category', 'detail', 'review', 'done'].forEach(s => {
    document.getElementById('screen-' + s).style.display = 'none';
  });
  document.getElementById('screen-' + name).style.display = 'block';
}

/* ── Screen 1 ── */
function selectCategory(el) {
  document.querySelectorAll('.cat-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  selectedCategory = el.dataset.cat;
  document.getElementById('btn-next-1').disabled = false;
}

function goToDetail() {
  if (!selectedCategory) return;
  document.getElementById('field-category').value = selectedCategory;
  document.getElementById('detail-title').textContent = selectedCategory;
  document.getElementById('detail-sub').textContent = 'Provide more details so we can address your ' + selectedCategory.toLowerCase() + ' promptly.';
  setStep(2);
  showScreen('detail');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ── Screen 2 ── */
function setUrgency(level) {
  selectedUrgency = level;
  document.getElementById('urg-low').className    = 'urgency-btn';
  document.getElementById('urg-medium').className = 'urgency-btn';
  document.getElementById('urg-high').className   = 'urgency-btn';
  if (level === 'low')    document.getElementById('urg-low').classList.add('selected');
  if (level === 'medium') document.getElementById('urg-medium').classList.add('selected-yellow');
  if (level === 'high')   document.getElementById('urg-high').classList.add('selected-red');
}

function handleFile(input) {
  if (input.files.length > 0) {
    document.getElementById('file-preview').textContent = '📎 ' + input.files[0].name;
  }
}

function goToReview() {
  const title = document.getElementById('field-title').value.trim();
  const desc  = document.getElementById('field-desc').value.trim();
  const date  = document.getElementById('field-date').value;
  const time  = document.getElementById('field-time').value;

  if (!title) { alert('Please enter an issue title.'); return; }
  if (!desc)  { alert('Please describe your issue.'); return; }
  if (!selectedUrgency) { alert('Please select an urgency level.'); return; }
  if (!date)  { alert('Please select a preferred date.'); return; }
  if (!time)  { alert('Please select a preferred time slot.'); return; }

  document.getElementById('rv-category').textContent = selectedCategory;
  document.getElementById('rv-title').textContent    = title;
  document.getElementById('rv-desc').textContent     = desc;

  const urgencyLabels  = { low: '🟢 Low', medium: '🟡 Medium', high: '🔴 High / Urgent' };
  const urgencyClasses = { low: 'badge-low', medium: 'badge-medium', high: 'badge-high' };
  const rvU = document.getElementById('rv-urgency');
  rvU.innerHTML = `<span class="badge ${urgencyClasses[selectedUrgency]}">${urgencyLabels[selectedUrgency]}</span>`;

  const dateObj = new Date(date + 'T00:00:00');
  document.getElementById('rv-date').textContent = dateObj.toLocaleDateString('en-PH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  document.getElementById('rv-time').textContent = time;

  setStep(3);
  showScreen('review');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goBack(from) {
  if (from === 1) { setStep(1); showScreen('category'); }
  if (from === 2) { setStep(2); showScreen('detail'); }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ── Screen 3: Submit ── */
function submitReport() {
  const ticketNum = '#SR-' + new Date().getFullYear() + '-' + String(Math.floor(Math.random() * 9000) + 1000);
  document.getElementById('done-ticket').textContent = ticketNum;
  showScreen('done');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ── Reset ── */
function resetForm() {
  selectedCategory = null;
  selectedUrgency  = null;
  document.querySelectorAll('.cat-card').forEach(c => c.classList.remove('selected'));
  document.getElementById('btn-next-1').disabled = true;
  document.getElementById('field-title').value = '';
  document.getElementById('field-desc').value  = '';
  document.getElementById('field-date').value  = '';
  document.getElementById('field-time').value  = '';
  document.getElementById('urg-low').className    = 'urgency-btn';
  document.getElementById('urg-medium').className = 'urgency-btn';
  document.getElementById('urg-high').className   = 'urgency-btn';
  document.getElementById('file-preview').textContent = '';
  setStep(1);
  showScreen('category');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* Set today as min date */
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('field-date').min = new Date().toISOString().split('T')[0];
});
