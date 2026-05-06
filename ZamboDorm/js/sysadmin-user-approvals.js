/* sysadmin-user-approvals.js */

let _currentReviewId = null;
let _allRequests     = [];

/* ══════════════════════════════════════════
   INIT
══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  loadApprovals();
  updateSidebarBadge();

  // Close modal on overlay click
  document.getElementById('reviewOverlay')?.addEventListener('click', closeReviewModal);
});

/* ══════════════════════════════════════════
   LOAD & RENDER
══════════════════════════════════════════ */
function loadApprovals() {
  _allRequests = UserApprovalStore.getAll();
  updateHeaderStats();
  renderFilteredApprovals();
  updateSidebarBadge();
}

function updateHeaderStats() {
  document.getElementById('hdr-pending').textContent  = _allRequests.filter(r => r.status === 'pending').length;
  document.getElementById('hdr-approved').textContent = _allRequests.filter(r => r.status === 'approved').length;
  document.getElementById('hdr-rejected').textContent = _allRequests.filter(r => r.status === 'rejected').length;
}

function updateSidebarBadge() {
  const count  = UserApprovalStore.getPendingCount();
  const badge  = document.getElementById('sidebar-pending-count');
  if (!badge) return;
  badge.textContent = count;
  badge.classList.toggle('show', count > 0);
}

function filterApprovals() {
  renderFilteredApprovals();
}

function renderFilteredApprovals() {
  const q      = (document.getElementById('ua-search')?.value || '').toLowerCase();
  const status = document.getElementById('ua-status-filter')?.value || 'pending';
  const role   = document.getElementById('ua-role-filter')?.value   || 'all';

  let list = _allRequests;
  if (status !== 'all') list = list.filter(r => r.status === status);
  if (role   !== 'all') list = list.filter(r => r.role   === role);
  if (q) list = list.filter(r =>
    [r.firstname, r.lastname, r.middlename, r.username, r.dormitory, r.role]
      .some(v => v?.toLowerCase().includes(q))
  );

  // Title
  const titleMap = { pending:'Pending Requests', approved:'Approved Accounts', rejected:'Rejected Requests', all:'All Requests' };
  document.getElementById('approvals-title').textContent = titleMap[status] || 'Requests';
  document.getElementById('approvals-count').textContent = list.length;

  const tbody = document.getElementById('approvals-tbody');
  const empty = document.getElementById('approvals-empty');
  const info  = document.getElementById('approvals-info');

  tbody.innerHTML = '';

  if (list.length === 0) {
    empty.style.display = 'flex';
    info.textContent    = 'No requests found';
    return;
  }

  empty.style.display = 'none';
  info.textContent    = `Showing ${list.length} request${list.length !== 1 ? 's' : ''}`;

  // Sort: pending first, then by date desc
  list.sort((a, b) => {
    if (a.status === 'pending' && b.status !== 'pending') return -1;
    if (a.status !== 'pending' && b.status === 'pending') return 1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  list.forEach(req => {
    const fullName   = [req.firstname, req.middlename, req.lastname].filter(Boolean).join(' ');
    const roleCls    = `role-chip-${req.role}`;
    const statusCls  = `status-chip-${req.status}`;
    const dateStr    = formatDate(req.createdAt);
    const isPending  = req.status === 'pending';

    tbody.insertAdjacentHTML('beforeend', `
      <tr>
        <td><span class="tenant-name">${fullName}</span></td>
        <td><code class="username-code" style="font-family:monospace;background:rgba(0,0,0,.06);padding:2px 6px;border-radius:4px;font-size:.82em">${req.username}</code></td>
        <td><span class="role-chip ${roleCls}">${req.role}</span></td>
        <td><span class="dorm-badge">${req.dormitory || '—'}</span></td>
        <td style="color:var(--text-muted,#9ca3af);font-size:.85rem">${dateStr}</td>
        <td><span class="status-chip ${statusCls}">${req.status}</span></td>
        <td>
          <div class="ua-action-row">
            ${isPending ? `
            <button class="ua-btn-sm approve" onclick="quickApprove('${req.id}')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              Approve
            </button>
            <button class="ua-btn-sm reject" onclick="quickReject('${req.id}')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              Reject
            </button>` : ''}
            <button class="ua-btn-sm view" onclick="openReviewModal('${req.id}')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              View
            </button>
          </div>
        </td>
      </tr>`);
  });
}

/* ══════════════════════════════════════════
   QUICK ACTIONS (inline buttons)
══════════════════════════════════════════ */
function quickApprove(id) {
  UserApprovalStore.approve(id, '');
  showToast('User account approved ✓', 'success');
  loadApprovals();
}

function quickReject(id) {
  UserApprovalStore.reject(id, '');
  showToast('Request rejected', 'warn');
  loadApprovals();
}

/* ══════════════════════════════════════════
   REVIEW MODAL
══════════════════════════════════════════ */
function openReviewModal(id) {
  _currentReviewId = id;
  const req = _allRequests.find(r => r.id === id);
  if (!req) return;

  const fullName = [req.firstname, req.middlename, req.lastname].filter(Boolean).join(' ');
  const roleCls  = `role-chip role-chip-${req.role}`;
  const statusCls= `status-chip status-chip-${req.status}`;

  document.getElementById('rv-name').textContent = fullName;
  document.getElementById('rv-username').textContent = req.username;
  document.getElementById('rv-role').innerHTML = `<span class="${roleCls}">${req.role}</span>`;
  document.getElementById('rv-dorm').textContent = req.dormitory || '—';
  document.getElementById('rv-submitted').textContent = formatDate(req.createdAt);
  document.getElementById('rv-status-badge').innerHTML = `<span class="${statusCls}">${req.status}</span>`;

  // ID Document
  const idContainer = document.getElementById('rv-id-container');
  if (req.idFileData) {
    const isImg = req.idFileData.startsWith('data:image');
    idContainer.innerHTML = isImg
      ? `<img src="${req.idFileData}" class="review-id-img" alt="ID"/>`
      : `<div class="review-id-pdf">
           <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round">
             <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
             <polyline points="14 2 14 8 20 8"/>
           </svg>
           ${req.idFileName || 'PDF Document'}
         </div>`;
  } else {
    idContainer.innerHTML = '<p class="review-no-id">No ID document uploaded.</p>';
  }

  // Notes input / already-reviewed
  const isPending = req.status === 'pending';
  document.getElementById('review-notes').value = '';
  document.getElementById('rv-notes-wrap').style.display  = isPending ? '' : 'none';
  document.getElementById('rv-action-footer').style.display = isPending ? '' : 'none';
  document.getElementById('rv-close-footer').style.display  = isPending ? 'none' : '';

  const alreadyDiv = document.getElementById('rv-already');
  if (!isPending) {
    alreadyDiv.style.display = '';
    alreadyDiv.style.background = req.status === 'approved' ? 'rgba(16,185,129,.08)' : 'rgba(239,68,68,.08)';
    alreadyDiv.style.borderColor= req.status === 'approved' ? 'rgba(16,185,129,.2)'  : 'rgba(239,68,68,.2)';
    alreadyDiv.querySelector('.review-already-inner').style.color = req.status === 'approved' ? '#065f46' : '#991b1b';
    document.getElementById('rv-reviewed-at').textContent = formatDate(req.reviewedAt);
    document.getElementById('rv-review-notes-display').textContent = req.reviewNotes || 'No notes provided.';
  } else {
    alreadyDiv.style.display = 'none';
  }

  openModal();
}

function closeReviewModal() {
  document.getElementById('reviewModal').classList.remove('open');
  document.getElementById('reviewOverlay').classList.remove('open');
  _currentReviewId = null;
}

function openModal() {
  document.getElementById('reviewModal').classList.add('open');
  document.getElementById('reviewOverlay').classList.add('open');
}

function reviewAction(action) {
  if (!_currentReviewId) return;
  const notes = document.getElementById('review-notes').value.trim();
  if (action === 'approve') {
    UserApprovalStore.approve(_currentReviewId, notes);
    showToast('User account approved and activated ✓', 'success');
  } else {
    UserApprovalStore.reject(_currentReviewId, notes);
    showToast('Request rejected', 'warn');
  }
  closeReviewModal();
  loadApprovals();
}

/* ══════════════════════════════════════════
   HELPERS
══════════════════════════════════════════ */
function formatDate(str) {
  if (!str) return '—';
  const d = new Date(str);
  if (isNaN(d)) return str;
  return d.toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });
}

function showToast(msg, type = 'success') {
  const t = document.getElementById('ua-toast');
  t.textContent = msg;
  t.className   = `ua-toast show ${type}`;
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.remove('show'), 3000);
}