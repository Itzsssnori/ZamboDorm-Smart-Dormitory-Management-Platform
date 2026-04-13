// sysadmin-complaints.js
// In-memory data — no localStorage, no frameworks.

const complaints = [
  {
    id: 1,
    title: 'Noise Complaint',
    status: 'Pending',
    filedBy: 'Juan dela Cruz',
    role: 'Tenant',
    against: 'Blue Haven Dorms Management',
    description: 'Continuous loud music and noise coming from the unit above past midnight on multiple nights this week. Despite verbal complaints to the floor monitor, the issue has not been resolved.',
    date: '2026-03-30',
    history: [
      { date: '2026-03-30', text: 'Complaint filed by tenant.' },
      { date: '2026-03-31', text: 'Complaint received and logged by sysadmin.' }
    ]
  },
  {
    id: 2,
    title: 'Maintenance Issue',
    status: 'Resolved',
    filedBy: 'Rosa Macaraeg',
    role: 'Tenant',
    against: 'Sunshine Dormitory Administration',
    description: 'Broken air conditioning unit in Room 204 has not been repaired for three weeks despite multiple service requests submitted through the app.',
    date: '2026-03-20',
    history: [
      { date: '2026-03-20', text: 'Complaint filed.' },
      { date: '2026-03-22', text: 'Sysadmin contacted dormitory management.' },
      { date: '2026-03-25', text: 'AC unit repaired and confirmed by tenant. Case closed.' }
    ]
  },
  {
    id: 3,
    title: 'Billing Dispute',
    status: 'Pending',
    filedBy: 'Marco Villanueva',
    role: 'Tenant',
    against: 'Green Valley Residence Office',
    description: 'Was charged double for the month of March. Bank records confirm only one payment was made but the dorm system shows two transactions deducted.',
    date: '2026-04-01',
    history: [
      { date: '2026-04-01', text: 'Complaint filed with billing records attached.' }
    ]
  },
  {
    id: 4,
    title: 'Safety Hazard Report',
    status: 'Resolved',
    filedBy: 'Lena Bartolome',
    role: 'Tenant',
    against: 'Blue Haven Dorms Management',
    description: 'Exposed electrical wiring found in the hallway near Room 108. This is a serious safety risk and needs to be addressed immediately.',
    date: '2026-03-18',
    history: [
      { date: '2026-03-18', text: 'Complaint filed with photo evidence.' },
      { date: '2026-03-19', text: 'Flagged as urgent by sysadmin.' },
      { date: '2026-03-19', text: 'Electrician dispatched by dorm management.' },
      { date: '2026-03-20', text: 'Wiring secured and inspected. Case resolved.' }
    ]
  }
];

let activeStatusId  = null;
let activeCommentId = null;

// ─── Helpers ────────────────────────────────────────────────────────────────

function getStatusBadgeClass(status) {
  switch (status) {
    case 'Pending':  return 'badge--amber';
    case 'Resolved': return 'badge--green';
    default:         return 'badge--purple';
  }
}

function formatDate(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  return months[month - 1] + ' ' + day + ', ' + year;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ─── Summary Cards ────────────────────────────────────────────────────────────

function updateSummaryCards() {
  document.getElementById('countTotal').textContent    = complaints.length;
  document.getElementById('countPending').textContent  = complaints.filter(function (c) { return c.status === 'Pending'; }).length;
  document.getElementById('countResolved').textContent = complaints.filter(function (c) { return c.status === 'Resolved'; }).length;
}

// ─── Render List ──────────────────────────────────────────────────────────────

function renderList() {
  updateSummaryCards();

  const list = document.getElementById('complaintsList');
  list.innerHTML = '';

  complaints.forEach(function (complaint) {
    const badgeClass = getStatusBadgeClass(complaint.status);

    const card = document.createElement('div');
    card.className = 'complaint-card';
    card.innerHTML = `
      <div class="complaint-card-main">
        <div class="complaint-card-top">
          <span class="complaint-title">${escapeHtml(complaint.title)}</span>
          <span class="badge ${badgeClass}">${escapeHtml(complaint.status)}</span>
        </div>
        <div class="complaint-meta">
          <span>Filed by: <strong>${escapeHtml(complaint.filedBy)}</strong></span>
          <span>Role: <strong>${escapeHtml(complaint.role)}</strong></span>
          <span>Against: <strong>${escapeHtml(complaint.against)}</strong></span>
        </div>
        <p class="complaint-desc">${escapeHtml(complaint.description)}</p>
      </div>
      <div class="complaint-card-footer">
        <span class="complaint-date">Filed: ${formatDate(complaint.date)}</span>
        <div class="complaint-actions">
          <button class="btn-comment" data-id="${complaint.id}">&#128172; Comment</button>
          <div class="action-wrap">
            <button class="btn-dots" data-id="${complaint.id}" aria-label="More actions">&#8942;</button>
            <div class="dots-menu" id="menu-${complaint.id}">
              <button class="btn-view-details" data-id="${complaint.id}">&#128065; View Details</button>
              <button class="btn-edit-status" data-id="${complaint.id}">&#9998; Edit Status</button>
            </div>
          </div>
        </div>
      </div>
    `;
    list.appendChild(card);
  });
}

// ─── Three-dot menu toggle ────────────────────────────────────────────────────

function closeAllMenus() {
  document.querySelectorAll('.dots-menu.open').forEach(function (m) {
    m.classList.remove('open');
  });
}

// ─── View Details Modal ───────────────────────────────────────────────────────

function openViewDetails(id) {
  const complaint = complaints.find(function (c) { return c.id === id; });
  if (!complaint) return;

  document.getElementById('vTitle').textContent    = complaint.title;
  document.getElementById('vStatus').textContent   = complaint.status;
  document.getElementById('vFiledBy').textContent  = complaint.filedBy;
  document.getElementById('vRole').textContent     = complaint.role;
  document.getElementById('vAgainst').textContent  = complaint.against;
  document.getElementById('vDate').textContent     = formatDate(complaint.date);
  document.getElementById('vDescription').textContent = complaint.description;

  const historyEl = document.getElementById('vHistory');
  historyEl.innerHTML = '';
  complaint.history.forEach(function (entry) {
    const div = document.createElement('div');
    div.className = 'history-entry';
    div.innerHTML = `
      <div class="history-entry-meta">${escapeHtml(formatDate(entry.date))}</div>
      <div class="history-entry-text">${escapeHtml(entry.text)}</div>
    `;
    historyEl.appendChild(div);
  });

  openModal('viewModal', 'viewOverlay');
}

// ─── Edit Status Modal ────────────────────────────────────────────────────────

function openEditStatus(id) {
  const complaint = complaints.find(function (c) { return c.id === id; });
  if (!complaint) return;

  activeStatusId = id;
  document.getElementById('statusComplaintTitle').textContent = complaint.title;
  document.getElementById('statusSelect').value = complaint.status;
  openModal('statusModal', 'statusOverlay');
}

function saveStatus() {
  const complaint = complaints.find(function (c) { return c.id === activeStatusId; });
  if (complaint) {
    complaint.status = document.getElementById('statusSelect').value;
  }
  closeModal('statusModal', 'statusOverlay');
  renderList();
}

// ─── Comment Modal ────────────────────────────────────────────────────────────

function openComment(id) {
  const complaint = complaints.find(function (c) { return c.id === id; });
  if (!complaint) return;

  activeCommentId = id;
  document.getElementById('commentComplaintTitle').textContent = complaint.title;
  document.getElementById('commentText').value = '';
  openModal('commentModal', 'commentOverlay');
}

function submitComment() {
  // No persistence required — just close the modal.
  closeModal('commentModal', 'commentOverlay');
}

// ─── Modal Helpers ────────────────────────────────────────────────────────────

function openModal(modalId, overlayId) {
  document.getElementById(modalId).classList.add('open');
  document.getElementById(overlayId).classList.add('open');
}

function closeModal(modalId, overlayId) {
  document.getElementById(modalId).classList.remove('open');
  document.getElementById(overlayId).classList.remove('open');
}

// ─── Event Delegation ─────────────────────────────────────────────────────────

document.addEventListener('click', function (e) {
  const dotsBtn      = e.target.closest('.btn-dots');
  const viewBtn      = e.target.closest('.btn-view-details');
  const statusBtn    = e.target.closest('.btn-edit-status');
  const commentBtn   = e.target.closest('.btn-comment');

  if (dotsBtn) {
    e.stopPropagation();
    const id   = dotsBtn.dataset.id;
    const menu = document.getElementById('menu-' + id);
    const isOpen = menu.classList.contains('open');
    closeAllMenus();
    if (!isOpen) menu.classList.add('open');
    return;
  }

  if (viewBtn) {
    closeAllMenus();
    openViewDetails(Number(viewBtn.dataset.id));
    return;
  }

  if (statusBtn) {
    closeAllMenus();
    openEditStatus(Number(statusBtn.dataset.id));
    return;
  }

  if (commentBtn) {
    openComment(Number(commentBtn.dataset.id));
    return;
  }

  // Outside click — close all menus
  closeAllMenus();
});

// ─── Init ─────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', function () {
  renderList();

  // Status modal
  document.getElementById('saveStatus').addEventListener('click', saveStatus);
  document.getElementById('closeStatus').addEventListener('click', function () {
    closeModal('statusModal', 'statusOverlay');
  });
  document.getElementById('cancelStatus').addEventListener('click', function () {
    closeModal('statusModal', 'statusOverlay');
  });
  document.getElementById('statusOverlay').addEventListener('click', function () {
    closeModal('statusModal', 'statusOverlay');
  });

  // View modal
  document.getElementById('closeView').addEventListener('click', function () {
    closeModal('viewModal', 'viewOverlay');
  });
  document.getElementById('cancelView').addEventListener('click', function () {
    closeModal('viewModal', 'viewOverlay');
  });
  document.getElementById('viewOverlay').addEventListener('click', function () {
    closeModal('viewModal', 'viewOverlay');
  });

  // Comment modal
  document.getElementById('submitComment').addEventListener('click', submitComment);
  document.getElementById('closeComment').addEventListener('click', function () {
    closeModal('commentModal', 'commentOverlay');
  });
  document.getElementById('cancelComment').addEventListener('click', function () {
    closeModal('commentModal', 'commentOverlay');
  });
  document.getElementById('commentOverlay').addEventListener('click', function () {
    closeModal('commentModal', 'commentOverlay');
  });
});
