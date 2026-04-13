// sysadmin-properties.js
// In-memory data — no localStorage, no frameworks.

const properties = [
  {
    id: 1,
    name: 'Sunshine Dormitory',
    first: 'Ramon', middle: 'Cruz', last: 'Dela Torre', suffix: '',
    address: '123 Maharlika St., Baliwasan, Zamboanga City',
    rooms: 24,
    dateAdded: '2024-01-15'
  },
  {
    id: 2,
    name: 'Blue Haven Dorms',
    first: 'Lourdes', middle: 'Santos', last: 'Reyes', suffix: 'Jr.',
    address: '45 Corcuera St., Tetuan, Zamboanga City',
    rooms: 18,
    dateAdded: '2024-03-08'
  },
  {
    id: 3,
    name: 'Green Valley Residence',
    first: 'Eduardo', middle: 'Bautista', last: 'Gomez', suffix: '',
    address: '78 Veterans Ave., Sta. Maria, Zamboanga City',
    rooms: 30,
    dateAdded: '2024-06-20'
  }
];

let nextId = 4;
let editingId = null;
let deletingId = null;

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatOwner(prop) {
  const parts = [prop.first, prop.middle, prop.last];
  if (prop.suffix) parts.push(prop.suffix);
  return parts.join(' ').trim();
}

function formatDate(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  return `${months[month - 1]} ${day}, ${year}`;
}

function todayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// ─── Render Table ────────────────────────────────────────────────────────────

function renderTable() {
  const countBadge = document.getElementById('propCount');
  const tbody = document.getElementById('propTableBody');

  countBadge.textContent = `${properties.length} ${properties.length === 1 ? 'property' : 'properties'}`;
  tbody.innerHTML = '';

  properties.forEach(function (prop) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${escapeHtml(prop.name)}</td>
      <td>${escapeHtml(formatOwner(prop))}</td>
      <td class="td-address">${escapeHtml(prop.address)}</td>
      <td>${prop.rooms}</td>
      <td>${formatDate(prop.dateAdded)}</td>
      <td>
        <div class="action-wrap">
          <button class="btn-dots" data-id="${prop.id}" aria-label="Actions">&#8942;</button>
          <div class="dots-menu" id="menu-${prop.id}">
            <button class="btn-edit-item" data-id="${prop.id}">&#9998; Edit</button>
            <button class="btn-delete-item" data-id="${prop.id}">&#128465; Delete</button>
          </div>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Escape user-supplied strings to prevent XSS when injecting into innerHTML.
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ─── Three-dot menu toggle ───────────────────────────────────────────────────

function closeAllMenus() {
  document.querySelectorAll('.dots-menu.open').forEach(function (m) {
    m.classList.remove('open');
  });
}

document.addEventListener('click', function (e) {
  const dotsBtn = e.target.closest('.btn-dots');
  const editBtn = e.target.closest('.btn-edit-item');
  const deleteBtn = e.target.closest('.btn-delete-item');

  if (dotsBtn) {
    e.stopPropagation();
    const id = dotsBtn.dataset.id;
    const menu = document.getElementById('menu-' + id);
    const isOpen = menu.classList.contains('open');
    closeAllMenus();
    if (!isOpen) menu.classList.add('open');
    return;
  }

  if (editBtn) {
    closeAllMenus();
    openEditModal(Number(editBtn.dataset.id));
    return;
  }

  if (deleteBtn) {
    closeAllMenus();
    openDeleteModal(Number(deleteBtn.dataset.id));
    return;
  }

  // Click outside — close all menus
  closeAllMenus();
});

// ─── Add Modal ───────────────────────────────────────────────────────────────

function openAddModal() {
  editingId = null;
  document.getElementById('modalTitle').textContent = 'Add New Property';
  clearForm();
  document.getElementById('fieldDate').value = todayISO();
  openModal('propModal', 'modalOverlay');
}

// ─── Edit Modal ──────────────────────────────────────────────────────────────

function openEditModal(id) {
  const prop = properties.find(function (p) { return p.id === id; });
  if (!prop) return;

  editingId = id;
  document.getElementById('modalTitle').textContent = 'Edit Property';
  document.getElementById('fieldName').value   = prop.name;
  document.getElementById('fieldFirst').value  = prop.first;
  document.getElementById('fieldMiddle').value = prop.middle;
  document.getElementById('fieldLast').value   = prop.last;
  document.getElementById('fieldSuffix').value = prop.suffix;
  document.getElementById('fieldAddress').value = prop.address;
  document.getElementById('fieldRooms').value  = prop.rooms;
  document.getElementById('fieldDate').value   = prop.dateAdded;
  openModal('propModal', 'modalOverlay');
}

// ─── Save ────────────────────────────────────────────────────────────────────

function saveProperty() {
  const name    = document.getElementById('fieldName').value.trim();
  const first   = document.getElementById('fieldFirst').value.trim();
  const middle  = document.getElementById('fieldMiddle').value.trim();
  const last    = document.getElementById('fieldLast').value.trim();
  const suffix  = document.getElementById('fieldSuffix').value.trim();
  const address = document.getElementById('fieldAddress').value.trim();
  const rooms   = document.getElementById('fieldRooms').value.trim();
  const date    = document.getElementById('fieldDate').value.trim();

  // Validate required fields
  const required = [
    { value: name,    inputId: 'fieldName',    errId: 'errName',    msg: 'Property name is required.' },
    { value: first,   inputId: 'fieldFirst',   errId: 'errFirst',   msg: 'First name is required.' },
    { value: middle,  inputId: 'fieldMiddle',  errId: 'errMiddle',  msg: 'Middle name is required.' },
    { value: last,    inputId: 'fieldLast',    errId: 'errLast',    msg: 'Last name is required.' },
    { value: address, inputId: 'fieldAddress', errId: 'errAddress', msg: 'Address is required.' },
    { value: rooms,   inputId: 'fieldRooms',   errId: 'errRooms',   msg: 'Number of rooms is required.' },
  ];

  let valid = true;
  required.forEach(function (field) {
    const input = document.getElementById(field.inputId);
    const err   = document.getElementById(field.errId);
    if (!field.value) {
      input.classList.add('error');
      err.textContent = field.msg;
      err.classList.add('show');
      valid = false;
    } else {
      input.classList.remove('error');
      err.classList.remove('show');
    }
  });

  if (!valid) return;

  if (editingId === null) {
    // Add new
    properties.push({
      id: nextId++,
      name, first, middle, last, suffix, address,
      rooms: Number(rooms),
      dateAdded: date || todayISO()
    });
  } else {
    // Update existing
    const idx = properties.findIndex(function (p) { return p.id === editingId; });
    if (idx !== -1) {
      properties[idx] = {
        id: editingId,
        name, first, middle, last, suffix, address,
        rooms: Number(rooms),
        dateAdded: date
      };
    }
  }

  closeModal('propModal', 'modalOverlay');
  renderTable();
}

// ─── Delete Modal ────────────────────────────────────────────────────────────

function openDeleteModal(id) {
  const prop = properties.find(function (p) { return p.id === id; });
  if (!prop) return;
  deletingId = id;
  document.getElementById('deleteName').textContent = prop.name;
  openModal('deleteModal', 'deleteOverlay');
}

function confirmDelete() {
  const idx = properties.findIndex(function (p) { return p.id === deletingId; });
  if (idx !== -1) properties.splice(idx, 1);
  closeModal('deleteModal', 'deleteOverlay');
  renderTable();
}

// ─── Modal helpers ────────────────────────────────────────────────────────────

function openModal(modalId, overlayId) {
  document.getElementById(modalId).classList.add('open');
  document.getElementById(overlayId).classList.add('open');
}

function closeModal(modalId, overlayId) {
  document.getElementById(modalId).classList.remove('open');
  document.getElementById(overlayId).classList.remove('open');
}

function clearForm() {
  ['fieldName', 'fieldFirst', 'fieldMiddle', 'fieldLast',
   'fieldSuffix', 'fieldAddress', 'fieldRooms', 'fieldDate'].forEach(function (id) {
    document.getElementById(id).value = '';
  });
  resetFormErrors();
}

function resetFormErrors() {
  ['fieldName', 'fieldFirst', 'fieldMiddle', 'fieldLast',
   'fieldAddress', 'fieldRooms'].forEach(function (id) {
    document.getElementById(id).classList.remove('error');
  });
  ['errName', 'errFirst', 'errMiddle', 'errLast',
   'errAddress', 'errRooms'].forEach(function (id) {
    const el = document.getElementById(id);
    el.classList.remove('show');
    el.textContent = '';
  });
}

// ─── Init ─────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', function () {
  renderTable();

  // Open add modal
  document.getElementById('openAddModal').addEventListener('click', openAddModal);

  // Save
  document.getElementById('saveModal').addEventListener('click', saveProperty);

  // Close add/edit modal
  document.getElementById('closeModal').addEventListener('click', function () {
    closeModal('propModal', 'modalOverlay');
    resetFormErrors();
  });
  document.getElementById('cancelModal').addEventListener('click', function () {
    closeModal('propModal', 'modalOverlay');
    resetFormErrors();
  });
  document.getElementById('modalOverlay').addEventListener('click', function () {
    closeModal('propModal', 'modalOverlay');
    resetFormErrors();
  });

  // Delete confirm
  document.getElementById('confirmDelete').addEventListener('click', confirmDelete);

  // Close delete modal
  document.getElementById('closeDelete').addEventListener('click', function () {
    closeModal('deleteModal', 'deleteOverlay');
  });
  document.getElementById('cancelDelete').addEventListener('click', function () {
    closeModal('deleteModal', 'deleteOverlay');
  });
  document.getElementById('deleteOverlay').addEventListener('click', function () {
    closeModal('deleteModal', 'deleteOverlay');
  });
});
