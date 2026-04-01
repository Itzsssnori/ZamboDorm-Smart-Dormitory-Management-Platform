'use strict';

/* ── MOCK DATA ── */
let pendingRequests = [
  { id:'V001', visitorName:'Rhamil Bagay',    phone:'09171234567', govId:'National ID – 1234-5678',  tenant:'Cedric San Antonio', room:'101-A', purpose:'Family Visit',  duration:'2 hours',   date:'Apr 2, 2026',  time:'10:00 AM', submitted:'Apr 1, 2026 · 9:15 PM' },
  { id:'V002', visitorName:'Mariel Fontanilla', phone:'09182345678', govId:'Driver\'s License – N01-23456', tenant:'Aila May Natividad', room:'102-B', purpose:'Study Group', duration:'3 hours',   date:'Apr 2, 2026',  time:'02:00 PM', submitted:'Apr 1, 2026 · 11:40 PM' },
  { id:'V003', visitorName:'Carlo Mendez',    phone:'09193456789', govId:'Passport – P0123456A',     tenant:'Maria Santos',       room:'203-B', purpose:'Delivery',      duration:'30 minutes', date:'Apr 2, 2026',  time:'09:30 AM', submitted:'Apr 2, 2026 · 7:02 AM' },
];

let allLogs = [
  { id:'L001', visitorName:'JD Handa',           phone:'09151234567', govId:'National ID – 8765-4321', tenant:'Janricson Apoy',    room:'305-C', purpose:'Study Group',  date:'Apr 1, 2026', inTime:'01:15 PM', outTime:'05:50 PM', status:'checked-out', submittedBy:'tenant' },
  { id:'L002', visitorName:'Lim Sherwin',         phone:'09162345678', govId:'Driver\'s License – N09-87654', tenant:'Anas Alon', room:'404-C', purpose:'Delivery',     date:'Apr 1, 2026', inTime:'03:45 PM', outTime:'03:55 PM', status:'checked-out', submittedBy:'tenant' },
  { id:'L003', visitorName:'Grace Tan',           phone:'09173456789', govId:'National ID – 2345-6789', tenant:'Norielle Buhawe', room:'210-A', purpose:'Family Visit',  date:'Apr 1, 2026', inTime:'06:00 PM', outTime:'08:30 PM', status:'checked-out', submittedBy:'tenant' },
  { id:'L004', visitorName:'Rhamil Bagay',        phone:'09171234567', govId:'National ID – 1234-5678', tenant:'Cedric San Antonio', room:'101-A', purpose:'Family Visit', date:'Apr 2, 2026', inTime:'10:30 AM', outTime:null,       status:'inside',      submittedBy:'tenant' },
  { id:'L005', visitorName:'Keith Bautista',      phone:'09184567890', govId:'Passport – A9876543B',   tenant:'Ramon Flores',    room:'302-A', purpose:'Other',         date:'Apr 2, 2026', inTime:'11:00 AM', outTime:null,       status:'inside',      submittedBy:'walkin' },
  { id:'L006', visitorName:'Ana Reyes',           phone:'09195678901', govId:'National ID – 3456-7890', tenant:'KC Charmelle Lagare', room:'305-C', purpose:'Family Visit', date:'Apr 2, 2026', inTime:'01:00 PM', outTime:'03:00 PM', status:'checked-out', submittedBy:'tenant' },
  { id:'V001', visitorName:'Rhamil Bagay',        phone:'09171234567', govId:'National ID – 1234-5678', tenant:'Cedric San Antonio', room:'101-A', purpose:'Family Visit', date:'Apr 2, 2026', inTime:null,       outTime:null,       status:'approved',    submittedBy:'tenant' },
  { id:'V002', visitorName:'Mariel Fontanilla',   phone:'09182345678', govId:'Driver\'s License – N01-23456', tenant:'Aila May Natividad', room:'102-B', purpose:'Study Group', date:'Apr 2, 2026', inTime:null, outTime:null, status:'pending', submittedBy:'tenant' },
  { id:'V003', visitorName:'Carlo Mendez',        phone:'09193456789', govId:'Passport – P0123456A',   tenant:'Maria Santos',    room:'203-B', purpose:'Delivery',      date:'Apr 2, 2026', inTime:null,       outTime:null,       status:'pending',     submittedBy:'tenant' },
  { id:'H001', visitorName:'Ronnie Cruz',         phone:'09206789012', govId:'National ID – 4567-8901', tenant:'Leilani Gomez',  room:'105-B', purpose:'Family Visit',  date:'Mar 31, 2026', inTime:'05:00 PM', outTime:'07:45 PM', status:'checked-out', submittedBy:'tenant' },
  { id:'H002', visitorName:'Jasmine Villanueva',  phone:'09217890123', govId:'Driver\'s License – N05-54321', tenant:'Gina Reyes', room:'404-C', purpose:'Other',        date:'Mar 31, 2026', inTime:'02:00 PM', outTime:'04:00 PM', status:'checked-out', submittedBy:'walkin' },
  { id:'H003', visitorName:'Mark Policarpio',     phone:'09228901234', govId:'Passport – B7654321C',   tenant:'Jose Dela Cruz',  room:'203-B', purpose:'Study Group',   date:'Mar 30, 2026', inTime:'03:00 PM', outTime:'06:30 PM', status:'checked-out', submittedBy:'tenant' },
];

let reviewingId    = null;
let denyMode       = false;
let viewingId      = null;
let checkoutTarget = null;

/* ── HELPERS ── */
function ini(name) {
  const parts = name.trim().split(' ');
  return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase() || name[0].toUpperCase();
}

function now12() {
  const d = new Date();
  let h = d.getHours(), m = d.getMinutes();
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')} ${ampm}`;
}

function showToast(msg, type = 'success') {
  const t = document.getElementById('admin-toast');
  const icons = {
    success: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    error:   `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
    warning: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/></svg>`,
  };
  t.className = `admin-toast ${type}`;
  t.innerHTML = (icons[type] || '') + ' ' + msg;
  t.classList.add('show');
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.remove('show'), 3500);
}

function updateStats() {
  const inside  = allLogs.filter(l => l.status === 'inside').length;
  const pending = pendingRequests.length;
  const approved = allLogs.filter(l => {
    const today = new Date().toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });
    return (l.status === 'approved' || l.status === 'inside' || l.status === 'checked-out') && l.date.includes('Apr 2');
  }).length;

  document.getElementById('sv-pending').textContent   = pending;
  document.getElementById('sv-approved').textContent  = approved;
  document.getElementById('sv-inside').textContent    = inside;
  document.getElementById('badge-pending').textContent = pending + ' new';

  const pendingCount = document.getElementById('tab-pending-count');
  if (pendingCount) pendingCount.textContent = pending;
}

/* ── TAB SWITCHING ── */
function openTab(name) {
  ['pending','log','inside'].forEach(t => {
    document.getElementById(`panel-${t}`).classList.toggle('active', t === name);
    document.getElementById(`tab-${t}-btn`).classList.toggle('active', t === name);
  });
}

/* ── RENDER PENDING ── */
function renderPending() {
  const list = document.getElementById('pending-list');
  if (!pendingRequests.length) {
    list.innerHTML = `<div class="empty-state"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg><p>No pending requests — all caught up!</p></div>`;
    return;
  }
  list.innerHTML = pendingRequests.map(r => `
    <div class="req-card" id="req-${r.id}">
      <div class="req-avatar">${ini(r.visitorName)}</div>
      <div class="req-info">
        <div class="req-name">${r.visitorName}</div>
        <div class="req-meta">
          <span class="req-meta-chip">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
            Room ${r.room} · ${r.tenant}
          </span>
          <span class="req-meta-chip">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            ${r.date} · ${r.time}
          </span>
          <span class="req-meta-chip">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            ${r.duration}
          </span>
        </div>
      </div>
      <div class="req-right">
        <span class="req-purpose-badge">${r.purpose}</span>
        <span class="req-time">${r.submitted}</span>
        <div class="req-actions">
          <button class="req-btn review" onclick="openReview('${r.id}')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            Review
          </button>
          <button class="req-btn approve" onclick="quickApprove('${r.id}')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
            Approve
          </button>
        </div>
      </div>
    </div>`).join('');
}

/* ── QUICK APPROVE ── */
function quickApprove(id) {
  const r = pendingRequests.find(x => x.id === id);
  if (!r) return;
  pendingRequests = pendingRequests.filter(x => x.id !== id);
  const existing = allLogs.find(x => x.id === id);
  if (existing) existing.status = 'approved';
  renderPending();
  renderLog();
  updateStats();
  showToast(`${r.visitorName}'s visit approved!`, 'success');
}

/* ── REVIEW MODAL ── */
function openReview(id) {
  const r = pendingRequests.find(x => x.id === id);
  if (!r) return;
  reviewingId = id;
  denyMode = false;

  document.getElementById('rv-avatar').textContent    = ini(r.visitorName);
  document.getElementById('rv-visitor-name').textContent = r.visitorName;
  document.getElementById('rv-phone').textContent     = r.phone;
  document.getElementById('rv-purpose').textContent   = r.purpose;
  document.getElementById('rv-tenant').textContent    = r.tenant;
  document.getElementById('rv-room').textContent      = r.room;
  document.getElementById('rv-govid').textContent     = r.govId;
  document.getElementById('rv-date').textContent      = r.date;
  document.getElementById('rv-time').textContent      = r.time;
  document.getElementById('rv-duration').textContent  = r.duration;
  document.getElementById('rv-submitted').textContent = r.submitted;
  document.getElementById('mr-sub').textContent       = `Request from ${r.tenant}'s visitor`;

  document.getElementById('deny-reason-wrap').style.display = 'none';
  document.getElementById('deny-reason').value = '';
  const denyBtn = document.getElementById('btn-deny-toggle');
  denyBtn.classList.remove('confirming');
  denyBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg> Deny`;
  document.getElementById('btn-approve-action').style.display = '';
  openModal('modal-review');
}

function toggleDenyMode() {
  if (!denyMode) {
    denyMode = true;
    document.getElementById('deny-reason-wrap').style.display = 'block';
    const btn = document.getElementById('btn-deny-toggle');
    btn.classList.add('confirming');
    btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg> Confirm Denial`;
    document.getElementById('btn-approve-action').style.display = 'none';
  } else {
    const reason = document.getElementById('deny-reason').value.trim();
    if (!reason) { showToast('⚠️ Please enter a reason for denial.', 'warning'); return; }
    denyRequest(reviewingId, reason);
    closeModal('modal-review');
  }
}

function approveRequest() {
  if (!reviewingId) return;
  quickApprove(reviewingId);
  closeModal('modal-review');
}

function denyRequest(id, reason) {
  const r = pendingRequests.find(x => x.id === id);
  if (!r) return;
  pendingRequests = pendingRequests.filter(x => x.id !== id);
  const existing = allLogs.find(x => x.id === id);
  if (existing) { existing.status = 'denied'; existing.denyReason = reason; }
  renderPending();
  renderLog();
  updateStats();
  showToast(`Visit by ${r.visitorName} denied.`, 'warning');
}

/* ── RENDER LOG TABLE ── */
function renderLog() {
  const search  = (document.getElementById('log-search')?.value || '').toLowerCase();
  const statusF = document.getElementById('log-status')?.value  || 'all';
  const purposeF= document.getElementById('log-purpose')?.value || 'all';

  let list = allLogs.filter(l => {
    const text = `${l.visitorName} ${l.tenant} ${l.room}`.toLowerCase();
    return (!search || text.includes(search))
        && (statusF  === 'all' || l.status  === statusF)
        && (purposeF === 'all' || l.purpose === purposeF);
  });

  const tbody = document.getElementById('log-tbody');
  const empty = document.getElementById('log-empty');
  const info  = document.getElementById('log-info');

  info.textContent = `Showing ${list.length} of ${allLogs.length} records`;
  if (!list.length) { tbody.innerHTML = ''; empty.style.display = 'block'; return; }
  empty.style.display = 'none';

  const statusLabel = { approved:'Approved', pending:'Pending', denied:'Denied', 'checked-out':'Checked Out', inside:'Inside' };

  tbody.innerHTML = list.map(l => `
    <tr>
      <td><div class="v-name-cell"><div class="v-avatar-sm">${ini(l.visitorName)}</div><div class="v-name-info"><strong>${l.visitorName}</strong><span>${l.phone}</span></div></div></td>
      <td>${l.tenant}</td>
      <td><span class="room-pill">${l.room}</span></td>
      <td>${l.purpose}</td>
      <td>${l.date}</td>
      <td class="time-in">${l.inTime || '<span class="time-na">—</span>'}</td>
      <td class="time-out">${l.outTime || '<span class="time-na">—</span>'}</td>
      <td><span class="status-pill status-${l.status}">${statusLabel[l.status] || l.status}</span></td>
      <td>
        <button class="tbl-act-btn" title="View" onclick="openViewRecord('${l.id}')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>
      </td>
    </tr>`).join('');
}

function filterLog() { renderLog(); }

/* ── RENDER CURRENTLY INSIDE ── */
function renderInside() {
  const list = document.getElementById('inside-list');
  const inside = allLogs.filter(l => l.status === 'inside');
  if (!inside.length) {
    list.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg><p>No visitors currently inside</p></div>`;
    return;
  }
  list.innerHTML = inside.map(l => `
    <div class="inside-card">
      <div class="inside-name">${l.visitorName}</div>
      <div class="inside-tenant">Visiting ${l.tenant} · Room ${l.room}</div>
      <div class="inside-row"><span class="inside-lbl">Purpose</span><span class="inside-val">${l.purpose}</span></div>
      <div class="inside-row"><span class="inside-lbl">Checked In</span><span class="inside-val time-in">${l.inTime}</span></div>
      <div class="inside-row"><span class="inside-lbl">Phone</span><span class="inside-val">${l.phone}</span></div>
      <div class="inside-row"><span class="inside-lbl">Gov't ID</span><span class="inside-val">${l.govId}</span></div>
      <div class="inside-footer">
        <button class="btn-checkout-card" onclick="checkoutFromCard('${l.id}')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Check Out
        </button>
      </div>
    </div>`).join('');
}

/* ── VIEW RECORD MODAL ── */
function openViewRecord(id) {
  const l = allLogs.find(x => x.id === id);
  if (!l) return;
  viewingId = id;

  const statusLabel = { approved:'Approved', pending:'Pending', denied:'Denied', 'checked-out':'Checked Out', inside:'Currently Inside' };
  const statusClass = { approved:'status-approved', pending:'status-pending', denied:'status-denied', 'checked-out':'status-checked-out', inside:'status-inside' };

  document.getElementById('view-sub').textContent = `${l.purpose} · ${l.date}`;
  document.getElementById('view-body').innerHTML = `
    <div style="display:flex;align-items:center;gap:0.9rem;background:rgba(124,58,237,0.05);border:1px solid rgba(124,58,237,0.10);border-radius:10px;padding:1rem;margin-bottom:1.25rem;">
      <div style="width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#7c3aed,#a855f7);display:flex;align-items:center;justify-content:center;font-size:0.85rem;font-weight:800;color:white;flex-shrink:0;">${ini(l.visitorName)}</div>
      <div style="flex:1"><strong style="display:block;font-size:0.95rem;font-weight:800;color:#1e1b4b">${l.visitorName}</strong><span style="font-size:0.78rem;color:#6b7280">${l.phone}</span></div>
      <span class="status-pill ${statusClass[l.status] || ''}">${statusLabel[l.status] || l.status}</span>
    </div>
    <div class="vr-row"><span class="vr-lbl">Visiting</span><span class="vr-val">${l.tenant}</span></div>
    <div class="vr-row"><span class="vr-lbl">Room</span><span class="vr-val">${l.room}</span></div>
    <div class="vr-row"><span class="vr-lbl">Gov't ID</span><span class="vr-val">${l.govId}</span></div>
    <div class="vr-row"><span class="vr-lbl">Purpose</span><span class="vr-val">${l.purpose}</span></div>
    <div class="vr-row"><span class="vr-lbl">Date</span><span class="vr-val">${l.date}</span></div>
    <div class="vr-row"><span class="vr-lbl">Check-In</span><span class="vr-val" style="color:#10b981">${l.inTime || '—'}</span></div>
    <div class="vr-row"><span class="vr-lbl">Check-Out</span><span class="vr-val" style="color:#7c3aed">${l.outTime || '—'}</span></div>
    ${l.denyReason ? `<div class="vr-row"><span class="vr-lbl">Denial Reason</span><span class="vr-val" style="color:#ef4444">${l.denyReason}</span></div>` : ''}
  `;

  const checkoutBtn = document.getElementById('btn-checkout');
  if (l.status === 'inside') {
    checkoutBtn.style.display = '';
    checkoutTarget = id;
  } else {
    checkoutBtn.style.display = 'none';
    checkoutTarget = null;
  }
  openModal('modal-view');
}

/* ── CHECK OUT ── */
function checkoutVisitor() {
  if (!checkoutTarget) return;
  const l = allLogs.find(x => x.id === checkoutTarget);
  if (!l) return;
  l.status  = 'checked-out';
  l.outTime = now12();
  closeModal('modal-view');
  renderLog();
  renderInside();
  updateStats();
  showToast(`${l.visitorName} checked out at ${l.outTime}.`, 'success');
}

function checkoutFromCard(id) {
  const l = allLogs.find(x => x.id === id);
  if (!l) return;
  l.status  = 'checked-out';
  l.outTime = now12();
  renderInside();
  renderLog();
  updateStats();
  showToast(`${l.visitorName} checked out at ${l.outTime}.`, 'success');
}

/* ── WALK-IN MODAL ── */
function openWalkInModal() {
  ['wi-name','wi-phone','wi-govid','wi-tenant'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  const timeEl = document.getElementById('wi-intime');
  if (timeEl) {
    const d = new Date();
    timeEl.value = `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
  }
  openModal('modal-walkin');
}

function logWalkIn() {
  const name   = document.getElementById('wi-name').value.trim();
  const govid  = document.getElementById('wi-govid').value.trim();
  const tenant = document.getElementById('wi-tenant').value.trim();
  if (!name)   { showToast('⚠️ Please enter the visitor\'s name.', 'warning'); return; }
  if (!govid)  { showToast('⚠️ Please enter a government ID.', 'warning'); return; }
  if (!tenant) { showToast('⚠️ Please enter the tenant being visited.', 'warning'); return; }

  const rawTime = document.getElementById('wi-intime').value;
  let inTime = now12();
  if (rawTime) {
    const [h, m] = rawTime.split(':');
    const hh = parseInt(h);
    const ampm = hh >= 12 ? 'PM' : 'AM';
    inTime = `${String(hh % 12 || 12).padStart(2,'0')}:${m} ${ampm}`;
  }

  const today = new Date().toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });
  const newLog = {
    id:          'W' + Date.now(),
    visitorName: name,
    phone:       document.getElementById('wi-phone').value.trim() || 'N/A',
    govId:       govid,
    tenant:      tenant.split('–')[0].trim(),
    room:        tenant.includes('–') ? tenant.split('–')[1].trim() : '—',
    purpose:     document.getElementById('wi-purpose').value,
    date:        today,
    inTime,
    outTime:     null,
    status:      'inside',
    submittedBy: 'walkin',
  };

  allLogs.unshift(newLog);
  closeModal('modal-walkin');
  renderLog();
  renderInside();
  updateStats();
  showToast(`${name} logged as walk-in visitor.`, 'success');
}

/* ── EXPORT ── */
function exportLog() {
  showToast('Log export started — CSV downloading shortly.', 'success');
}

/* ── MODAL HELPERS ── */
function openModal(id) {
  document.getElementById(id).classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
  document.body.style.overflow = '';
  if (id === 'modal-review') {
    const footer = document.querySelector('#modal-review .modal-footer');
    footer.innerHTML = `
      <button class="btn-modal-deny" id="btn-deny-toggle" onclick="toggleDenyMode()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
        Deny
      </button>
      <button class="btn-modal-approve" id="btn-approve-action" onclick="approveRequest()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
        Approve Visit
      </button>`;
  }
}

document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) closeModal(e.target.id);
});

/* ── SIDEBAR OVERLAY ── */
document.getElementById('overlay')?.addEventListener('click', () => {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('overlay').classList.remove('active');
});

/* ── INIT ── */
renderPending();
renderLog();
renderInside();
updateStats();