'use strict';

/* ── MOCK DATA ── */
let pendingPayments = [
  { id:'P001', firstName:'Aila May',      lastName:'Natividad',  email:'aila@email.com',      room:'102-B', amount:3500,  method:'GCash',         ref:'GCash-0042938471', month:'March 2026',    submitted:'Mar 28, 2026', proof:'screenshot_feb.png' },
  { id:'P002', firstName:'KC Charmelle',  lastName:'Lagare',     email:'kc@email.com',         room:'305-C', amount:3500,  method:'Maya',          ref:'Maya-TX98231',     month:'March 2026',    submitted:'Mar 27, 2026', proof:'maya_receipt.jpg' },
  { id:'P003', firstName:'Norielle John', lastName:'Buhawe',     email:'norielle@email.com',   room:'210-A', amount:7000,  method:'Bank Transfer', ref:'BDO-2024031501',   month:'Feb–Mar 2026',  submitted:'Mar 29, 2026', proof:'bank_transfer.pdf' },
  { id:'P004', firstName:'Van Claude',         lastName:'Valeros',     email:'vanny@email.com',       room:'101-A', amount:3500,  method:'GCash',         ref:'GCash-0039872134', month:'March 2026',    submitted:'Mar 30, 2026', proof:'gcash_ss.png' },
  { id:'P005', firstName:'Leilani',       lastName:'Gomez',      email:'leilani@email.com',     room:'105-B', amount:3500,  method:'Cash Payment',  ref:'N/A (Cash)',       month:'March 2026',    submitted:'Mar 30, 2026', proof:'N/A' },
  { id:'P006', firstName:'Al-shariff',         lastName:'Rojas Mateo',     email:'rojasmateo@email.com',       room:'302-A', amount:3500,  method:'Metrobank',     ref:'MB-TX00239812',    month:'March 2026',    submitted:'Mar 31, 2026', proof:'metrobank_ss.jpg' },
  { id:'P007', firstName:'Sherwin',          lastName:'Fay',      email:'sherwinlovefay@email.com',        room:'404-C', amount:3500,  method:'Maya',          ref:'Maya-TX00128',     month:'March 2026',    submitted:'Mar 31, 2026', proof:'maya_proof.png' },
  { id:'P008', firstName:'Fay',          lastName:'Lim Cruz',  email:'faylim@email.com',        room:'203-B', amount:3500,  method:'GCash',         ref:'GCash-0041102298', month:'March 2026',    submitted:'Mar 31, 2026', proof:'gcash_march.jpg' },
];

let allPayments = [
  ...pendingPayments.map(p => ({ ...p, status: 'pending' })),
  { id:'H001', firstName:'Aila May',      lastName:'Natividad',  email:'aila@email.com',      room:'102-B', amount:3500,  method:'GCash',         ref:'GCash-0031827461', month:'February 2026', submitted:'Feb 5, 2026',  proof:'gcash_feb.png',   status:'confirmed' },
  { id:'H002', firstName:'KC Charmelle',  lastName:'Lagare',     email:'kc@email.com',         room:'305-C', amount:3500,  method:'Maya',          ref:'Maya-TX81992',     month:'February 2026', submitted:'Feb 4, 2026',  proof:'maya_feb.jpg',    status:'confirmed' },
  { id:'H003', firstName:'Norielle John', lastName:'Buhawe',     email:'norielle@email.com',   room:'210-A', amount:3500,  method:'Bank Transfer', ref:'BDO-2024020201',   month:'February 2026', submitted:'Feb 3, 2026',  proof:'bank_feb.pdf',    status:'confirmed' },
  { id:'H004', firstName:'Maria',         lastName:'Santos',     email:'maria@email.com',       room:'101-A', amount:3500,  method:'GCash',         ref:'GCash-0030021934', month:'February 2026', submitted:'Feb 5, 2026',  proof:'gcash2_feb.png',  status:'confirmed' },
  { id:'H005', firstName:'Jose',          lastName:'Dela Cruz',  email:'jose@email.com',        room:'203-B', amount:3500,  method:'Cash Payment',  ref:'N/A (Cash)',       month:'January 2026',  submitted:'Jan 4, 2026',  proof:'N/A',             status:'confirmed' },
  { id:'H006', firstName:'Ramon',         lastName:'Flores',     email:'ramon@email.com',       room:'302-A', amount:3500,  method:'GCash',         ref:'GCash-0019823741', month:'January 2026',  submitted:'Jan 5, 2026',  proof:'gcash_jan.jpg',   status:'confirmed' },
  { id:'H007', firstName:'Gina',          lastName:'Reyes',      email:'gina@email.com',        room:'404-C', amount:3500,  method:'Maya',          ref:'Maya-TX67231',     month:'January 2026',  submitted:'Jan 3, 2026',  proof:'maya_jan.png',    status:'rejected', rejectReason:'Amount mismatch — submitted ₱3,000 but ₱3,500 is due.' },
  { id:'H008', firstName:'Leilani',       lastName:'Gomez',      email:'leilani@email.com',     room:'105-B', amount:3500,  method:'Bank Transfer', ref:'BDO-2024010301',   month:'December 2025', submitted:'Dec 3, 2025',  proof:'bank_dec.pdf',    status:'confirmed' },
];

let paymentMethods = [
  { id:'M001', name:'GCash',         category:'E-Wallet',      instructions:'Send to 0917-XXX-XXXX · Name: ZamboDorm Mgmt', enabled:true },
  { id:'M002', name:'Maya',          category:'E-Wallet',      instructions:'Send to 0918-XXX-XXXX · Name: ZamboDorm Mgmt', enabled:true },
  { id:'M003', name:'BDO',           category:'Bank Transfer', instructions:'Account: 123-456-789 · Branch: Zamboanga City',  enabled:true },
  { id:'M004', name:'BPI',           category:'Bank Transfer', instructions:'Account: 987-654-321 · Name: ZamboDorm Mgmt',   enabled:true },
  { id:'M005', name:'Metrobank',     category:'Bank Transfer', instructions:'Account: 456-789-012 · Name: ZamboDorm Inc.',   enabled:true },
  { id:'M006', name:'Cash Payment',  category:'Cash',          instructions:'Visit the office · Mon–Sat 9AM–5PM',            enabled:true },
  { id:'M007', name:'Palawan',       category:'Remittance',    instructions:'Sender name: ZamboDorm · Ref: Tenant room no.',  enabled:false },
  { id:'M008', name:'Cebuana',       category:'Remittance',    instructions:'Branch: Zamboanga Downtown · Reference required', enabled:false },
];

const methodIcons = {
  'E-Wallet':       { bg:'rgba(16,185,129,0.12)', stroke:'#10b981',  path:'<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>' },
  'Bank Transfer':  { bg:'rgba(59,130,246,0.12)', stroke:'#3b82f6',  path:'<rect x="2" y="7" width="20" height="14" rx="2"/><line x1="2" y1="11" x2="22" y2="11"/>' },
  'Cash':           { bg:'rgba(245,158,11,0.12)', stroke:'#f59e0b',  path:'<rect x="1" y="4" width="22" height="16" rx="2"/><circle cx="12" cy="12" r="3"/>' },
  'Remittance':     { bg:'rgba(124,58,237,0.10)', stroke:'#7c3aed',  path:'<path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/>' },
  'Online Banking': { bg:'rgba(239,68,68,0.10)',  stroke:'#ef4444',  path:'<rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>' },
};

let reviewingId = null;
let rejectMode = false;

/* ── HELPERS ── */
function ini(f, l) { return ((f[0]||'') + (l[0]||'')).toUpperCase(); }
function fmtPHP(n) { return '₱' + Number(n).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

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

/* ── TAB SWITCHING ── */
function openTab(name) {
  ['pending', 'all', 'methods'].forEach(t => {
    document.getElementById(`panel-${t}`).classList.toggle('active', t === name);
    document.getElementById(`tab-${t}-btn`).classList.toggle('active', t === name);
  });
}

/* ── RENDER PENDING ── */
function renderPending() {
  const list = document.getElementById('pending-list');
  const badge = document.getElementById('tab-pending-count');
  const pendingCount = document.getElementById('pending-count');
  badge.textContent = pendingPayments.length;
  pendingCount.textContent = pendingPayments.length + ' pending';

  if (!pendingPayments.length) {
    list.innerHTML = `<div class="empty-state"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg><p>All payments verified — nothing pending!</p></div>`;
    return;
  }

  list.innerHTML = pendingPayments.map(p => `
    <div class="pay-card" id="card-${p.id}">
      <div class="pay-avatar">${ini(p.firstName, p.lastName)}</div>
      <div class="pay-info">
        <div class="pay-name">${p.firstName} ${p.lastName}</div>
        <div class="pay-meta">
          <span class="pay-meta-item">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
            Room ${p.room}
          </span>
          <span class="pay-meta-item">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            ${p.month}
          </span>
          <span class="pay-meta-item">Submitted ${p.submitted}</span>
        </div>
      </div>
      <div class="pay-right">
        <div class="pay-amount">${fmtPHP(p.amount)}</div>
        <span class="pay-method-badge">${p.method}</span>
        <div class="pay-actions">
          <button class="pay-btn review" onclick="openReview('${p.id}')">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            Review
          </button>
          <button class="pay-btn approve" onclick="quickApprove('${p.id}')">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
            Approve
          </button>
        </div>
      </div>
    </div>`).join('');
}

/* ── QUICK APPROVE ── */
function quickApprove(id) {
  const p = pendingPayments.find(x => x.id === id);
  if (!p) return;
  pendingPayments = pendingPayments.filter(x => x.id !== id);
  const existing = allPayments.find(x => x.id === id);
  if (existing) existing.status = 'confirmed';
  renderPending();
  renderAll();
  showToast(`${p.firstName} ${p.lastName}'s payment approved!`, 'success');
}

/* ── REVIEW MODAL ── */
function openReview(id) {
  const p = pendingPayments.find(x => x.id === id);
  if (!p) return;
  reviewingId = id;
  rejectMode = false;

  document.getElementById('rv-avatar').textContent     = ini(p.firstName, p.lastName);
  document.getElementById('rv-name').textContent       = `${p.firstName} ${p.lastName}`;
  document.getElementById('rv-email').textContent      = p.email;
  document.getElementById('rv-amount').textContent     = fmtPHP(p.amount);
  document.getElementById('rv-room').textContent       = p.room;
  document.getElementById('rv-month').textContent      = p.month;
  document.getElementById('rv-method').textContent     = p.method;
  document.getElementById('rv-ref').textContent        = p.ref;
  document.getElementById('rv-submitted').textContent  = p.submitted;
  document.getElementById('rv-proof').textContent      = p.proof;
  document.getElementById('mr-subtitle').textContent   = `Payment from ${p.firstName} ${p.lastName}`;

  document.getElementById('reject-reason-wrap').style.display = 'none';
  document.getElementById('reject-reason').value = '';
  document.getElementById('btn-reject-toggle').classList.remove('confirming');
  document.getElementById('btn-reject-toggle').innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg> Reject`;
  document.getElementById('btn-approve-action').style.display = '';

  openModal('modal-review');
}

function toggleRejectMode() {
  if (!rejectMode) {
    rejectMode = true;
    document.getElementById('reject-reason-wrap').style.display = 'block';
    document.getElementById('btn-reject-toggle').classList.add('confirming');
    document.getElementById('btn-reject-toggle').innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg> Confirm Rejection`;
    document.getElementById('btn-approve-action').style.display = 'none';
  } else {
    const reason = document.getElementById('reject-reason').value.trim();
    if (!reason) { showToast('⚠️ Please enter a rejection reason.', 'warning'); return; }
    rejectPayment(reviewingId, reason);
    closeModal('modal-review');
  }
}

function approvePayment() {
  if (!reviewingId) return;
  quickApprove(reviewingId);
  closeModal('modal-review');
}

function rejectPayment(id, reason) {
  const p = pendingPayments.find(x => x.id === id);
  if (!p) return;
  pendingPayments = pendingPayments.filter(x => x.id !== id);
  const existing = allPayments.find(x => x.id === id);
  if (existing) { existing.status = 'rejected'; existing.rejectReason = reason; }
  renderPending();
  renderAll();
  showToast(`Payment rejected. ${p.firstName} will be notified.`, 'warning');
}

/* ── RENDER ALL TABLE ── */
function renderAll() {
  const search = (document.getElementById('all-search')?.value || '').toLowerCase();
  const statusF = document.getElementById('all-status')?.value || 'all';
  const monthF  = document.getElementById('all-month')?.value  || 'all';

  let list = allPayments.filter(p => {
    const text = `${p.firstName} ${p.lastName} ${p.room} ${p.method} ${p.ref}`.toLowerCase();
    return (!search || text.includes(search))
        && (statusF === 'all' || p.status === statusF)
        && (monthF  === 'all' || p.month  === monthF);
  });

  const tbody  = document.getElementById('all-tbody');
  const empty  = document.getElementById('all-empty');
  const info   = document.getElementById('all-info');

  info.textContent = `Showing ${list.length} of ${allPayments.length} payments`;

  if (!list.length) { tbody.innerHTML = ''; empty.style.display = 'block'; return; }
  empty.style.display = 'none';

  tbody.innerHTML = list.map(p => `
    <tr>
      <td><div class="t-name-cell"><div class="t-avatar-sm">${ini(p.firstName, p.lastName)}</div><div class="t-name-info"><strong>${p.firstName} ${p.lastName}</strong><span>${p.email}</span></div></div></td>
      <td><span class="room-pill">${p.room}</span></td>
      <td class="amt-cell">${fmtPHP(p.amount)}</td>
      <td>${p.method}</td>
      <td>${p.month}</td>
      <td class="date-cell">${p.submitted}</td>
      <td><span class="status-pill status-${p.status}">${p.status.charAt(0).toUpperCase() + p.status.slice(1)}</span></td>
      <td>
        ${p.status === 'pending'
          ? `<button class="tbl-act-btn" title="Review" onclick="openReview('${p.id}')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button>`
          : `<button class="tbl-act-btn" title="View" onclick="viewRecord('${p.id}')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button>`
        }
      </td>
    </tr>`).join('');
}

function filterAll() { renderAll(); }

function viewRecord(id) {
  const p = allPayments.find(x => x.id === id);
  if (!p) return;
  // Populate modal in read-only mode
  document.getElementById('rv-avatar').textContent     = ini(p.firstName, p.lastName);
  document.getElementById('rv-name').textContent       = `${p.firstName} ${p.lastName}`;
  document.getElementById('rv-email').textContent      = p.email;
  document.getElementById('rv-amount').textContent     = fmtPHP(p.amount);
  document.getElementById('rv-room').textContent       = p.room;
  document.getElementById('rv-month').textContent      = p.month;
  document.getElementById('rv-method').textContent     = p.method;
  document.getElementById('rv-ref').textContent        = p.ref;
  document.getElementById('rv-submitted').textContent  = p.submitted;
  document.getElementById('rv-proof').textContent      = p.proof + (p.rejectReason ? ` · Rejected: "${p.rejectReason}"` : '');
  document.getElementById('mr-subtitle').textContent   = `${p.status.charAt(0).toUpperCase() + p.status.slice(1)} payment record`;
  document.getElementById('reject-reason-wrap').style.display = 'none';
  document.getElementById('btn-reject-toggle').style.display  = 'none';
  document.getElementById('btn-approve-action').style.display = 'none';
  document.querySelector('#modal-review .modal-footer').innerHTML = `<button class="btn-modal-cancel" onclick="closeModal('modal-review')">Close</button>`;
  openModal('modal-review');
}

/* ── PAYMENT METHODS ── */
function renderMethods() {
  const grid = document.getElementById('methods-grid');
  grid.innerHTML = paymentMethods.map(m => {
    const icon = methodIcons[m.category] || methodIcons['E-Wallet'];
    return `
    <div class="method-tile${m.enabled ? '' : ' disabled'}" id="mt-${m.id}">
      <div class="mt-top">
        <div class="mt-icon-wrap" style="background:${icon.bg}">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${icon.stroke}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${icon.path}</svg>
        </div>
        <label class="toggle">
          <input type="checkbox" ${m.enabled ? 'checked' : ''} onchange="toggleMethod('${m.id}', this.checked)"/>
          <span class="toggle-slider"></span>
        </label>
      </div>
      <div>
        <div class="mt-name">${m.name}</div>
        <div class="mt-cat">${m.category}</div>
      </div>
      <div class="mt-instructions">${m.instructions}</div>
      <button class="mt-delete" onclick="deleteMethod('${m.id}')">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
        Remove
      </button>
    </div>`;
  }).join('');
}

function toggleMethod(id, enabled) {
  const m = paymentMethods.find(x => x.id === id);
  if (m) {
    m.enabled = enabled;
    document.getElementById(`mt-${id}`)?.classList.toggle('disabled', !enabled);
    showToast(`${m.name} ${enabled ? 'enabled' : 'disabled'}.`, enabled ? 'success' : 'warning');
  }
}

function deleteMethod(id) {
  const m = paymentMethods.find(x => x.id === id);
  if (!m) return;
  if (!confirm(`Remove "${m.name}" from payment methods?`)) return;
  paymentMethods = paymentMethods.filter(x => x.id !== id);
  renderMethods();
  showToast(`${m.name} removed.`, 'warning');
}

function openAddMethodModal() {
  document.getElementById('nm-name').value         = '';
  document.getElementById('nm-instructions').value = '';
  openModal('modal-method');
}

function addMethod() {
  const name = document.getElementById('nm-name').value.trim();
  if (!name) { showToast('⚠️ Please enter a method name.', 'warning'); return; }
  const cat  = document.getElementById('nm-category').value;
  const inst = document.getElementById('nm-instructions').value.trim();
  paymentMethods.push({
    id: 'M' + Date.now(),
    name, category: cat,
    instructions: inst || 'No instructions provided.',
    enabled: true,
  });
  renderMethods();
  closeModal('modal-method');
  showToast(`${name} added successfully!`, 'success');
}

/* ── MODAL HELPERS ── */
function openModal(id) {
  document.getElementById(id).classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
  document.body.style.overflow = '';
  // Restore footer buttons if review modal was used as read-only
  if (id === 'modal-review') {
    const footer = document.querySelector('#modal-review .modal-footer');
    footer.innerHTML = `
      <button class="btn-modal-reject" id="btn-reject-toggle" onclick="toggleRejectMode()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
        Reject
      </button>
      <button class="btn-modal-approve" id="btn-approve-action" onclick="approvePayment()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
        Approve Payment
      </button>`;
  }
}

document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) closeModal(e.target.id);
});

/* ── EXPORT (stub) ── */
function exportCSV() {
  showToast('Export started — CSV will download shortly.', 'success');
}

/* ── SIDEBAR OVERLAY ── */
function toggleSidebar() {
  const sb = document.getElementById('sidebar');
  const ov = document.getElementById('overlay');
  sb.classList.toggle('open');
  if (ov) ov.classList.toggle('active');
}
document.getElementById('overlay')?.addEventListener('click', () => {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('overlay').classList.remove('active');
});

/* ── INIT ── */
renderPending();
renderAll();
renderMethods();