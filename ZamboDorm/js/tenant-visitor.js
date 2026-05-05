/* visitor.js — ZamboDorm Visitor Management */

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  const ov = document.getElementById('overlay');
  if (ov) ov.classList.toggle('active');
}

/* ── Phase stepper ── */
function setPhase(active) {
  const order = { a: 0, b: 1, c: 2 };
  const phases = ['a', 'b', 'c'];
  const activeIdx = order[active] ?? -1;

  const checkSVG = `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round"><path d="M20 6L9 17l-5-5"/></svg>`;

  phases.forEach((p, i) => {
    const ph = document.getElementById('ph-' + p);
    const pd = document.getElementById('pd-' + p);
    ph.classList.remove('active', 'done');
    if (i < activeIdx) {
      ph.classList.add('done');
      pd.innerHTML = checkSVG;
    }
    if (p === active) ph.classList.add('active');
  });

  document.getElementById('line-ab').classList.toggle('done', activeIdx >= 1);
  document.getElementById('line-bc').classList.toggle('done', activeIdx >= 2);
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-' + id).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ── Screen A: Guidelines ── */
function checkAck() {
  const checked = document.getElementById('ack-check').checked;
  document.getElementById('btn-to-b').disabled = !checked;
}

function goToA() {
  setPhase('a');
  showScreen('a');
}

function goToB() {
  setPhase('b');
  showScreen('b');
  const dateInput = document.getElementById('v-date');
  if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];
}

/* ── Screen B: Visitor form ── */
function goToC() {
  const fields = [
    { id: 'v-name',     msg: 'Please enter the visitor\'s full name.' },
    { id: 'v-phone',    msg: 'Please enter a phone number.' },
    { id: 'v-id',       msg: 'Please enter the government ID number.' },
    { id: 'v-purpose',  msg: 'Please select the purpose of visit.' },
    { id: 'v-duration', msg: 'Please select the expected duration.' },
    { id: 'v-date',     msg: 'Please select an expected check-in date.' },
    { id: 'v-time',     msg: 'Please select an expected check-in time.' },
  ];

  for (const f of fields) {
    const el = document.getElementById(f.id);
    if (!el || !el.value.trim()) {
      alert(f.msg);
      el && el.focus();
      return;
    }
  }

  const name     = document.getElementById('v-name').value.trim();
  const phone    = document.getElementById('v-phone').value.trim();
  const id       = document.getElementById('v-id').value.trim();
  const purpose  = document.getElementById('v-purpose').value;
  const duration = document.getElementById('v-duration').value;
  const date     = document.getElementById('v-date').value;
  const time     = document.getElementById('v-time').value;

  document.getElementById('rv-name').textContent     = name;
  document.getElementById('rv-phone').textContent    = phone;
  document.getElementById('rv-id').textContent       = id;
  document.getElementById('rv-purpose').textContent  = purpose;
  document.getElementById('rv-duration').textContent = duration;

  const d = new Date(date + 'T00:00:00');
  const formatted = d.toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' });
  const [h, m] = time.split(':');
  const hNum = parseInt(h);
  const ampm = hNum >= 12 ? 'PM' : 'AM';
  const h12  = hNum % 12 || 12;
  document.getElementById('rv-datetime').textContent = `${formatted} at ${h12}:${m} ${ampm}`;

  document.getElementById('accept-check').checked = false;
  document.getElementById('btn-submit').disabled  = true;

  setPhase('c');
  showScreen('c');
}

/* ── Screen C: Review ── */
function checkAccept() {
  const checked = document.getElementById('accept-check').checked;
  document.getElementById('btn-submit').disabled = !checked;
}

function submitVisitor() {
  // 1. Generate reference number
  const ref = '#VIS-' + new Date().getFullYear() + '-' + String(Math.floor(Math.random() * 9000) + 1000);
  document.getElementById('done-ref').textContent = ref;

  // 2. Capture all data from fields
  const visitorData = {
    id: ref,
    visitorName: document.getElementById('v-name').value.trim(),
    phone: document.getElementById('v-phone').value.trim(),
    govId: document.getElementById('v-id').value.trim(),
    purpose: document.getElementById('v-purpose').value,
    duration: document.getElementById('v-duration').value,
    date: document.getElementById('v-date').value,
    time: document.getElementById('v-time').value,
    status: 'Pending Approval',
    createdAt: new Date().toISOString()
  };

  // 3. Link to current tenant
  if (typeof UserManager !== 'undefined') {
    const activeUser = UserManager.getUser();
    if (activeUser) {
      visitorData.tenantId = activeUser.id;
      visitorData.tenantName = activeUser.name;
      // Also include room if available in user object
      if (activeUser.room) visitorData.roomNumber = activeUser.room;
    }
  }

  // 4. Save to localStorage
  try {
    const allVisitors = JSON.parse(localStorage.getItem('zambodorm_visitors') || '[]');
    allVisitors.push(visitorData);
    localStorage.setItem('zambodorm_visitors', JSON.stringify(allVisitors));
  } catch (e) {
    console.error("Error saving visitor data", e);
  }

  // 5. Update UI to success screen
  ['a', 'b', 'c'].forEach(p => {
    const ph = document.getElementById('ph-' + p);
    if (ph) {
      ph.classList.remove('active');
      ph.classList.add('done');
    }
  });
  const lineAB = document.getElementById('line-ab');
  const lineBC = document.getElementById('line-bc');
  if (lineAB) lineAB.classList.add('done');
  if (lineBC) lineBC.classList.add('done');

  showScreen('d');
}

/* ── Reset ── */
function resetAll() {
  ['ack-check', 'accept-check'].forEach(id => {
    document.getElementById(id).checked = false;
  });
  document.getElementById('btn-to-b').disabled  = true;
  document.getElementById('btn-submit').disabled = true;
  ['v-name', 'v-phone', 'v-id', 'v-date', 'v-time'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('v-purpose').value  = '';
  document.getElementById('v-duration').value = '';

  /* Reset phase dot icons back to their originals */
  const icons = {
    a: `<svg viewBox="0 0 24 24"><path d="M9 12h6M9 16h4M7 4h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" stroke-linecap="round" stroke="#9ca3af" stroke-width="2" fill="none"/></svg>`,
    b: `<svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#9ca3af" stroke-width="2" fill="none"/><circle cx="12" cy="7" r="4" stroke="#9ca3af" stroke-width="2" fill="none"/></svg>`,
    c: `<svg viewBox="0 0 24 24"><path d="M9 11l3 3L22 4" stroke="#9ca3af" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" stroke="#9ca3af" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`,
  };
  ['a', 'b', 'c'].forEach(p => {
    document.getElementById('pd-' + p).innerHTML = icons[p];
  });

  goToA();
}

/* ── Back from review goes to visitor form ── */
function goToC_back() {
  setPhase('b');
  showScreen('b');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}