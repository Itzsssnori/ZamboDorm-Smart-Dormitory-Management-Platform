const properties = [
  {
    id: 1,
    name: 'Sunshine Dormitory',
    price: 3500,
    address: '123 Maharlika St., Baliwasan, Zamboanga City',
    rooms: 24,
    desc: 'Affordable student living near campus.',
    dateAdded: '2024-01-15'
  },
  {
    id: 2,
    name: 'Blue Haven Dorms',
    price: 4500,
    address: '45 Corcuera St., Tetuan, Zamboanga City',
    rooms: 18,
    desc: 'Modern facilities with high-speed internet.',
    dateAdded: '2024-03-08'
  },
  {
    id: 3,
    name: 'Green Valley Residence',
    price: 3000,
    address: '78 Veterans Ave., Sta. Maria, Zamboanga City',
    rooms: 30,
    desc: 'Quiet neighborhood with spacious common areas.',
    dateAdded: '2024-06-20'
  }
];

let nextId = 4;
let editingId = null;
let deletingId = null;

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatPrice(price) {
  return `₱${Number(price).toLocaleString()}`;
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

  countBadge.textContent = `${properties.length} ${properties.length === 1 ? 'dormitory' : 'dormitories'}`;
  tbody.innerHTML = '';

  properties.forEach(function (prop) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${escapeHtml(prop.name)}</td>
      <td class="td-price">${formatPrice(prop.price)}</td>
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
  document.getElementById('modalTitle').textContent = 'Add New Dormitory';
  clearForm();
  document.getElementById('fieldDate').value = todayISO();
  openModal('propModal', 'modalOverlay');
}

// ─── Edit Modal ──────────────────────────────────────────────────────────────

function openEditModal(id) {
  const prop = properties.find(function (p) { return p.id === id; });
  if (!prop) return;

  editingId = id;
  document.getElementById('modalTitle').textContent = 'Edit Dormitory';
  document.getElementById('fieldName').value   = prop.name;
  document.getElementById('fieldPrice').value  = prop.price;
  document.getElementById('fieldAddress').value = prop.address;
  document.getElementById('fieldRooms').value  = prop.rooms;
  document.getElementById('fieldDesc').value   = prop.desc || '';
  document.getElementById('fieldDate').value   = prop.dateAdded;
  openModal('propModal', 'modalOverlay');
}

// ─── Save ────────────────────────────────────────────────────────────────────

function saveProperty() {
  const name    = document.getElementById('fieldName').value.trim();
  const price   = document.getElementById('fieldPrice').value.trim();
  const address = document.getElementById('fieldAddress').value.trim();
  const rooms   = document.getElementById('fieldRooms').value.trim();
  const desc    = document.getElementById('fieldDesc').value.trim();
  const date    = document.getElementById('fieldDate').value.trim();

  // Validate required fields
  const required = [
    { value: name,    inputId: 'fieldName',    errId: 'errName',    msg: 'Dormitory name is required.' },
    { value: price,   inputId: 'fieldPrice',   errId: 'errPrice',   msg: 'Base price is required.' },
    { value: address, inputId: 'fieldAddress', errId: 'errAddress', msg: 'Address is required.' },
    { value: rooms,   inputId: 'fieldRooms',   errId: 'errRooms',   msg: 'Capacity is required.' },
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
      name, price: Number(price), address,
      rooms: Number(rooms),
      desc,
      dateAdded: date || todayISO()
    });
  } else {
    // Update existing
    const idx = properties.findIndex(function (p) { return p.id === editingId; });
    if (idx !== -1) {
      properties[idx] = {
        id: editingId,
        name, price: Number(price), address,
        rooms: Number(rooms),
        desc,
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
  ['fieldName', 'fieldPrice', 'fieldAddress', 'fieldRooms', 'fieldDesc', 'fieldDate'].forEach(function (id) {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  resetFormErrors();
}

function resetFormErrors() {
  ['fieldName', 'fieldPrice', 'fieldAddress', 'fieldRooms'].forEach(function (id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('error');
  });
  ['errName', 'errPrice', 'errAddress', 'errRooms'].forEach(function (id) {
    const el = document.getElementById(id);
    if (el) {
      el.classList.remove('show');
      el.textContent = '';
    }
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
