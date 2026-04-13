// sysadmin-application.js
// In-memory data — no localStorage, no frameworks.

const applications = [
  {
    id: 1,
    name: 'Pedro Reyes',
    business: 'Reyes Dormitories Inc.',
    email: 'pedro.reyes@example.com',
    phone: '+63 912 345 6789',
    dormCount: 3,
    date: '2026-03-28',
    status: 'Pending',
    properties: [
      { name: 'Reyes Dorm A', capacity: 20 },
      { name: 'Reyes Dorm B', capacity: 15 },
      { name: 'Reyes Dorm C', capacity: 18 }
    ]
  },
  {
    id: 2,
    name: 'Maria Santos',
    business: 'Santos Housing Solutions',
    email: 'maria.santos@example.com',
    phone: '+63 923 456 7890',
    dormCount: 1,
    date: '2026-03-27',
    status: 'Pending',
    properties: [
      { name: 'Santos Residence Hall', capacity: 25 }
    ]
  },
  {
    id: 3,
    name: 'Ana Lopez',
    business: 'Lopez Residences',
    email: 'ana.lopez@example.com',
    phone: '+63 945 678 9012',
    dormCount: 1,
    date: '2026-03-26',
    status: 'Pending',
    properties: [
      { name: 'Lopez Dormitory', capacity: 12 }
    ]
  },
  {
    id: 4,
    name: 'Carlos Mendoza',
    business: 'Mendoza Property Group',
    email: 'carlos.mendoza@example.com',
    phone: '+63 956 789 0123',
    dormCount: 2,
    date: '2026-02-14',
    status: 'Complete',
    properties: [
      { name: 'Mendoza Hall', capacity: 30 },
      { name: 'Mendoza Annex', capacity: 22 }
    ]
  }
];

let activeStatusId  = null;
let activeCommentId = null;

// ─── Helpers ────────────────────────────────────────────────────────────────

function getStatusBadgeClass(status) {
  switch (status) {
    case 'Pending':    return 'badge--amber';
    case 'Complete':   return 'badge--green';
    case 'Incomplete': return 'badge--orange';
    case 'Rejected':   return 'badge--red';
    default:           return 'badge--purple';
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

// ─── Summary Cards ───────────────────────────────────────────────────────────

function updateSummaryCards() {
  document.getElementById('countTotal').textContent    = applications.length;
  document.getElementById('countPending').textContent  = applications.filter(function (a) { return a.status === 'Pending'; }).length;
  document.getElementById('countApproved').textContent = applications.filter(function (a) { return a.status === 'Complete'; }).length;
}

// ─── Render List ─────────────────────────────────────────────────────────────

function renderList() {
  updateSummaryCards();

  const list = document.getElementById('appList');
  list.innerHTML = '';

  applications.forEach(function (app) {
    const dormLabel = app.dormCount === 1 ? '1 Dormitory' : app.dormCount + ' Dormitories';
    const badgeClass = getStatusBadgeClass(app.status);

    const card = document.createElement('div');
    card.className = 'app-card';
    card.innerHTML = `
      <div class="app-card-header">
        <span class="app-card-name">${escapeHtml(app.name)}</span>
        <span class="badge ${badgeClass}">${escapeHtml(app.status)}</span>
      </div>
      <div class="app-card-details">
        <span>&#127968; ${escapeHtml(app.business)}</span>
        <span>&#9993; ${escapeHtml(app.email)}</span>
        <span>&#128222; ${escapeHtml(app.phone)}</span>
        <span>&#127968; ${dormLabel}</span>
        <span>&#128197; Applied: ${formatDate(app.date)}</span>
      </div>
      <div class="app-card-actions">
        <button class="btn-view"        data-id="${app.id}">&#128065; View Details</button>
        <button class="btn-edit-status" data-id="${app.id}">&#9998; Edit Status</button>
        <button class="btn-comment"     data-id="${app.id}">&#128172; Comment</button>
      </div>
    `;
    list.appendChild(card);
  });
}

// ─── View Modal ──────────────────────────────────────────────────────────────

function openView(id) {
  const app = applications.find(function (a) { return a.id === id; });
  if (!app) return;

  document.getElementById('vName').textContent     = app.name;
  document.getElementById('vBusiness').textContent = app.business;
  document.getElementById('vEmail').textContent    = app.email;
  document.getElementById('vPhone').textContent    = app.phone;
  document.getElementById('vDate').textContent     = formatDate(app.date);

  const tbody = document.getElementById('vProperties');
  tbody.innerHTML = '';
  app.properties.forEach(function (prop) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${escapeHtml(prop.name)}</td>
      <td>${prop.capacity}</td>
    `;
    tbody.appendChild(tr);
  });

  openModal('viewModal', 'viewOverlay');
}

// ─── Edit Status Modal ───────────────────────────────────────────────────────

function openEditStatus(id) {
  const app = applications.find(function (a) { return a.id === id; });
  if (!app) return;

  activeStatusId = id;
  document.getElementById('statusApplicantName').textContent = app.name;
  document.getElementById('statusSelect').value = app.status;
  openModal('statusModal', 'statusOverlay');
}

function saveStatus() {
  const app = applications.find(function (a) { return a.id === activeStatusId; });
  if (app) {
    app.status = document.getElementById('statusSelect').value;
  }
  closeModal('statusModal', 'statusOverlay');
  renderList();
}

// ─── Comment Modal ───────────────────────────────────────────────────────────

function openComment(id) {
  const app = applications.find(function (a) { return a.id === id; });
  if (!app) return;

  activeCommentId = id;
  document.getElementById('commentApplicantName').textContent = app.name;
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

// ─── Event Delegation for Card Buttons ───────────────────────────────────────

document.addEventListener('click', function (e) {
  const viewBtn   = e.target.closest('.btn-view');
  const statusBtn = e.target.closest('.btn-edit-status');
  const commentBtn = e.target.closest('.btn-comment');

  if (viewBtn)    { openView(Number(viewBtn.dataset.id));        return; }
  if (statusBtn)  { openEditStatus(Number(statusBtn.dataset.id)); return; }
  if (commentBtn) { openComment(Number(commentBtn.dataset.id));  return; }
});

// ─── Init ─────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', function () {
  renderList();

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
