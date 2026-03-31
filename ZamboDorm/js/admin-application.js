let currentFormStep = 1;

function goToScreen(n) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-' + n).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateProgress(step) {
  for (let i = 1; i <= 3; i++) {
    const c = document.getElementById('pc' + i);
    const l = document.getElementById('pl' + i);
    if (!c || !l) continue;
    if (i < step)      { c.className = 'prog-circle done';    l.className = 'prog-label done';    c.innerHTML = '✓'; }
    else if (i === step){ c.className = 'prog-circle current'; l.className = 'prog-label current'; c.textContent = i; }
    else               { c.className = 'prog-circle pending'; l.className = 'prog-label';         c.textContent = i; }
  }
  for (let i = 1; i <= 2; i++) {
    const line = document.getElementById('pline' + i);
    if (line) line.className = 'prog-line' + (i < step ? ' done' : '');
  }
}

function validateStep1() {
  const rules = [
    { id: 'f-fname',   fg: 'fg-fname',   test: v => v.trim().length > 0 },
    { id: 'f-lname',   fg: 'fg-lname',   test: v => v.trim().length > 0 },
    { id: 'f-email',   fg: 'fg-email',   test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
    { id: 'f-phone',   fg: 'fg-phone',   test: v => v.trim().length >= 7 },
    { id: 'f-address', fg: 'fg-address', test: v => v.trim().length > 0 },
    { id: 'f-idtype',  fg: 'fg-idtype',  test: v => v !== '' },
    { id: 'f-idnum',   fg: 'fg-idnum',   test: v => v.trim().length > 0 },
  ];
  return validate(rules);
}

function validateStep2() {
  const rules = [
    { id: 'f-dormname',  fg: 'fg-dormname',  test: v => v.trim().length > 0 },
    { id: 'f-dormaddr',  fg: 'fg-dormaddr',  test: v => v.trim().length > 0 },
    { id: 'f-dormphone', fg: 'fg-dormphone', test: v => v.trim().length >= 7 },
    { id: 'f-rooms',     fg: 'fg-rooms',     test: v => parseInt(v) > 0 },
    { id: 'f-dormtype',  fg: 'fg-dormtype',  test: v => v !== '' },
    { id: 'f-dormdesc',  fg: 'fg-dormdesc',  test: v => v.trim().length > 10 },
  ];
  return validate(rules);
}

function validateStep3() {
  let ok = true;
  const fileChecks = [
    { id: 'file-id',     fg: 'fg-file-id' },
    { id: 'file-doc',    fg: 'fg-file-doc' },
    { id: 'file-dorm',   fg: 'fg-file-dorm' },
    { id: 'file-person', fg: 'fg-file-person' },
  ];
  fileChecks.forEach(f => {
    const el = document.getElementById(f.id);
    const fg = document.getElementById(f.fg);
    fg.classList.remove('error');
    if (!el.files || el.files.length === 0) { fg.classList.add('error'); ok = false; }
  });
  // Check dorm photos count
  const dormFiles = document.getElementById('file-dorm');
  const dormFg = document.getElementById('fg-file-dorm');
  if (dormFiles.files && dormFiles.files.length > 0 && dormFiles.files.length < 3) {
    dormFg.classList.add('error');
    dormFg.querySelector('.form-error').textContent = 'Please upload at least 3 dorm photos.';
    ok = false;
  }
  return ok;
}

function validate(rules) {
  let ok = true;
  rules.forEach(r => {
    const el = document.getElementById(r.id);
    const fg = document.getElementById(r.fg);
    fg.classList.remove('error');
    if (!r.test(el.value)) { fg.classList.add('error'); ok = false; }
  });
  return ok;
}

function nextFormStep(step) {
  if (step === 1 && !validateStep1()) { showToast('Please fill in all required fields.'); return; }
  if (step === 2 && !validateStep2()) { showToast('Please fill in all required fields.'); return; }

  document.getElementById('form-step-' + step).style.display = 'none';
  document.getElementById('form-step-' + (step + 1)).style.display = 'block';
  currentFormStep = step + 1;
  updateProgress(currentFormStep);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function prevFormStep(step) {
  document.getElementById('form-step-' + step).style.display = 'none';
  document.getElementById('form-step-' + (step - 1)).style.display = 'block';
  currentFormStep = step - 1;
  updateProgress(currentFormStep);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function confirmExit() { openModal('modal-exit'); }
function exitApplication() { closeModal('modal-exit'); goToScreen(1); }

function handleFile(inputId, nameId, areaId) {
  const input = document.getElementById(inputId);
  const nameEl = document.getElementById(nameId);
  const area = document.getElementById(areaId);
  if (input.files && input.files.length > 0) {
    const count = input.files.length;
    nameEl.textContent = count > 1 ? `${count} files selected` : input.files[0].name;
    nameEl.classList.add('show');
    area.style.borderColor = 'var(--success)';
    area.style.background = 'rgba(16,185,129,0.04)';
  }
}

function openReviewModal() {
  if (!validateStep3()) { showToast('Please upload all required documents.'); return; }
  const data = [
    { l: 'First Name',    v: document.getElementById('f-fname').value },
    { l: 'Last Name',     v: document.getElementById('f-lname').value },
    { l: 'Email',         v: document.getElementById('f-email').value },
    { l: 'Phone',         v: document.getElementById('f-phone').value },
    { l: 'Home Address',  v: document.getElementById('f-address').value },
    { l: 'ID Type',       v: document.getElementById('f-idtype').value },
    { l: 'ID Number',     v: document.getElementById('f-idnum').value },
    { l: 'Dorm Name',     v: document.getElementById('f-dormname').value },
    { l: 'Dorm Address',  v: document.getElementById('f-dormaddr').value },
    { l: 'Dorm Phone',    v: document.getElementById('f-dormphone').value },
    { l: 'Total Rooms',   v: document.getElementById('f-rooms').value },
    { l: 'Dorm Type',     v: document.getElementById('f-dormtype').value },
    { l: 'Gov ID File',   v: document.getElementById('file-id').files[0]?.name || '—' },
    { l: 'Validity Doc',  v: document.getElementById('file-doc').files[0]?.name || '—' },
    { l: 'Dorm Photos',   v: document.getElementById('file-dorm').files?.length + ' file(s)' },
    { l: 'Admin Photo',   v: document.getElementById('file-person').files[0]?.name || '—' },
  ];
  document.getElementById('review-list').innerHTML = data.map(d =>
    `<div class="review-row"><span class="review-lbl">${d.l}</span><span class="review-val">${d.v}</span></div>`
  ).join('');
  openModal('modal-review');
}

function submitApplication() {
  closeModal('modal-review');
  goToScreen(4);
}

function openModal(id) { document.getElementById(id).classList.add('open'); document.body.style.overflow = 'hidden'; }
function closeModal(id) { document.getElementById(id).classList.remove('open'); document.body.style.overflow = ''; }
document.addEventListener('click', e => { if (e.target.classList.contains('modal-overlay')) closeModal(e.target.id); });

function showToast(msg) {
  const t = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  t.classList.add('show');
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.remove('show'), 3500);
}

// Drag over file areas
document.querySelectorAll('.file-upload-area').forEach(area => {
  area.addEventListener('dragover', e => { e.preventDefault(); area.classList.add('dragover'); });
  area.addEventListener('dragleave', () => area.classList.remove('dragover'));
  area.addEventListener('drop', e => { e.preventDefault(); area.classList.remove('dragover'); });
});