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

// ─── Demo Data ──────────────────────────────────────────────────────────────

const demoUsers = [
  // Sunshine Dormitory (id: 1)
  { name: 'Juan Dela Cruz', email: 'juan@example.com', role: 'landlord', propertyId: 1 },
  { name: 'Maria Clara', email: 'maria@example.com', role: 'tenant', assignedDormId: 1 },
  { name: 'Jose Rizal', email: 'jose@example.com', role: 'tenant', assignedDormId: 1 },
  { name: 'Antonio Luna', email: 'antonio@example.com', role: 'guard', assignedDormId: 1 },
  // Blue Haven Dorms (id: 2)
  { name: 'Andres Bonifacio', email: 'andres@example.com', role: 'landlord', propertyId: 2 },
  { name: 'Emilio Aguinaldo', email: 'emilio@example.com', role: 'tenant', assignedDormId: 2 },
  { name: 'Apolinario Mabini', email: 'mabini@example.com', role: 'tenant', assignedDormId: 2 },
  { name: 'Melchora Aquino', email: 'melchora@example.com', role: 'tenant', assignedDormId: 2 },
  { name: 'Gabriela Silang', email: 'gabriela@example.com', role: 'guard', assignedDormId: 2 },
  { name: 'Lapu-Lapu', email: 'lapu@example.com', role: 'guard', assignedDormId: 2 },
  // Green Valley Residence (id: 3)
  { name: 'Tandang Sora', email: 'sora@example.com', role: 'landlord', propertyId: 3 },
  { name: 'Diego Silang', email: 'diego@example.com', role: 'tenant', assignedDormId: 3 },
];

function getCombinedUsers() {
  const localUsers = JSON.parse(localStorage.getItem('zambodorm_all_users') || '[]');
  return [...demoUsers, ...localUsers];
}

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
  const allUsers = JSON.parse(localStorage.getItem('zambodorm_all_users') || '[]');

  countBadge.textContent = `${properties.length} ${properties.length === 1 ? 'dormitory' : 'dormitories'}`;
  tbody.innerHTML = '';

  properties.forEach(function (prop) {
    // Filter users assigned to this property
    const propUsers = allUsers.filter(u => u.propertyId === prop.id || u.assignedDormId === prop.id);
    const tenants = propUsers.filter(u => u.role === 'tenant').length;
    const admins = propUsers.filter(u => u.role === 'admin' || u.role === 'landlord').length;
    const securities = propUsers.filter(u => u.role === 'security' || u.role === 'guard').length;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td data-label="Dormitory Name">${escapeHtml(prop.name)}</td>
      <td data-label="Price/mo" class="td-price">${formatPrice(prop.price)}</td>
      <td data-label="Address" class="td-address">${escapeHtml(prop.address)}</td>
      <td data-label="Capacity">${prop.rooms}</td>
      <td data-label="Users/Staff">
        <button class="btn-user-counts" onclick="openUserListModal(${prop.id})" style="background: rgba(124, 58, 237, 0.08); border: 1px solid rgba(124, 58, 237, 0.2); border-radius: 6px; padding: 4px 8px; cursor: pointer; text-align: left; font-family: inherit; transition: all 0.2s; width: 100%;">
          <div style="font-size: 0.7rem; color: #7c3aed; font-weight: 700; margin-bottom: 2px; white-space: nowrap;">👥 Assigned Users</div>
          <div style="font-size: 0.8rem; color: #1e1b4b; display: flex; gap: 6px;">
            <span>T: <strong>${tenants}</strong></span>
            <span>A: <strong>${admins}</strong></span>
            <span>S: <strong>${securities}</strong></span>
          </div>
        </button>
      </td>
      <td data-label="Date Added">${formatDate(prop.dateAdded)}</td>
      <td data-label="Actions">
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
  
  // Load pending dorm applications
  loadPendingDormApplications();
});

// ─── PENDING DORM APPLICATIONS HANDLER ──────────────────────────────────────
let currentPendingApp = null;

function loadPendingDormApplications() {
  const pendingDorms = localStorage.getItem('zambodorm_pending_dorms');
  const apps = pendingDorms ? JSON.parse(pendingDorms) : [];
  
  const container = document.getElementById('pendingAppsContainer');
  const card = document.getElementById('pendingAppCard');
  const badge = document.getElementById('pendingCount');
  
  if (apps.length === 0) {
    card.style.display = 'none';
    return;
  }
  
  card.style.display = 'block';
  badge.textContent = apps.length;
  
  container.innerHTML = apps.map((app, idx) => `
    <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px; background: white; border: 1px solid #fbbf24; border-radius: 6px; margin-bottom: 10px;">
      <div style="flex: 1;">
        <div style="font-weight: 600; color: #1f2937; margin-bottom: 4px;">${app.dormName}</div>
        <div style="font-size: 0.9rem; color: #6b7280;">
          📍 ${app.dormLocation} • 👤 ${app.adminName} • 📅 ${app.submittedDate} ${app.submittedTime}
        </div>
      </div>
      <button onclick="openAppReviewModal(${idx})" style="padding: 8px 16px; background: #f59e0b; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 0.9rem;">Review</button>
    </div>
  `).join('');
}

function openAppReviewModal(idx) {
  const pendingDorms = localStorage.getItem('zambodorm_pending_dorms');
  const apps = JSON.parse(pendingDorms);
  currentPendingApp = { ...apps[idx], index: idx };
  
  document.getElementById('appAdminName').textContent = currentPendingApp.adminName || '-';
  document.getElementById('appAdminEmail').textContent = currentPendingApp.adminEmail || '-';
  document.getElementById('appAdminPhone').textContent = currentPendingApp.adminPhone || '-';
  document.getElementById('appSubmittedDate').textContent = `${currentPendingApp.submittedDate} ${currentPendingApp.submittedTime}`;
  
  document.getElementById('appDormName').textContent = currentPendingApp.dormName || '-';
  document.getElementById('appDormLocation').textContent = currentPendingApp.dormLocation || '-';
  document.getElementById('appDormPhone').textContent = currentPendingApp.dormPhone || '-';
  document.getElementById('appTotalRooms').textContent = currentPendingApp.totalRooms || '-';
  document.getElementById('appCapacity').textContent = currentPendingApp.capacity || '-';
  document.getElementById('appAmenities').textContent = (currentPendingApp.amenities && currentPendingApp.amenities.length > 0) 
    ? currentPendingApp.amenities.join(', ') 
    : 'None listed';
  document.getElementById('appDescription').textContent = currentPendingApp.description || 'No description provided';
  
  const docsList = document.getElementById('appDocumentsList');
  if (currentPendingApp.documents && currentPendingApp.documents.length > 0) {
    docsList.innerHTML = currentPendingApp.documents.map(doc => `
      <div style="padding: 10px; background: #f3e8ff; border-radius: 6px; text-align: center; font-size: 0.85rem; word-break: break-word;">
        <div style="margin-bottom: 6px; color: #7c3aed;">📄</div>
        <div style="color: #6b21a8; font-weight: 600;">${doc.name}</div>
        <div style="color: #9333ea; font-size: 0.8rem;">${(doc.size / 1024).toFixed(1)}KB</div>
      </div>
    `).join('');
  } else {
    docsList.innerHTML = '<div style="grid-column: 1/-1; color: #9ca3af; text-align: center; padding: 20px;">No documents uploaded</div>';
  }
  
  const photosList = document.getElementById('appPhotosList');
  if (currentPendingApp.photos && currentPendingApp.photos.length > 0) {
    photosList.innerHTML = currentPendingApp.photos.map((photo, idx) => `
      <img src="${photo}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 6px; border: 1px solid #fed7aa;" alt="Dorm photo ${idx + 1}" />
    `).join('');
  } else {
    photosList.innerHTML = '<div style="grid-column: 1/-1; color: #9ca3af; text-align: center; padding: 40px;">No photos uploaded</div>';
  }
  
  document.getElementById('approvalNotes').value = '';
  document.getElementById('appOverlay').style.display = 'block';
  document.getElementById('appReviewModal').style.display = 'flex';
}

function closeAppReviewModal() {
  document.getElementById('appOverlay').style.display = 'none';
  document.getElementById('appReviewModal').style.display = 'none';
  currentPendingApp = null;
}

function approveDormApplication() {
  if (!currentPendingApp) return;
  
  const notes = document.getElementById('approvalNotes').value.trim();
  const pendingDorms = JSON.parse(localStorage.getItem('zambodorm_pending_dorms'));
  pendingDorms[currentPendingApp.index].status = 'Approved';
  pendingDorms[currentPendingApp.index].approvalDate = new Date().toLocaleDateString('en-PH');
  if (notes) pendingDorms[currentPendingApp.index].approvalNotes = notes;
  
  const approvedApp = pendingDorms.splice(currentPendingApp.index, 1)[0];
  localStorage.setItem('zambodorm_pending_dorms', JSON.stringify(pendingDorms));
  
  const adminApps = JSON.parse(localStorage.getItem('zambodorm_dorm_applications') || '[]');
  const adminAppIdx = adminApps.findIndex(a => a.id === approvedApp.id);
  if (adminAppIdx !== -1) {
    adminApps[adminAppIdx].status = 'Approved';
    adminApps[adminAppIdx].approvalDate = approvedApp.approvalDate;
    if (notes) adminApps[adminAppIdx].approvalNotes = notes;
    localStorage.setItem('zambodorm_dorm_applications', JSON.stringify(adminApps));
  }
  
  showToast(`✅ Dorm "${approvedApp.dormName}" approved successfully! Added to properties.`);
  closeAppReviewModal();
  loadPendingDormApplications();
}

function rejectDormApplication() {
  if (!currentPendingApp) return;
  
  const notes = document.getElementById('approvalNotes').value.trim();
  
  if (!notes) {
    showToast('⚠️ Please provide a reason for rejection in the notes field.');
    return;
  }
  
  const pendingDorms = JSON.parse(localStorage.getItem('zambodorm_pending_dorms'));
  pendingDorms[currentPendingApp.index].status = 'Rejected';
  pendingDorms[currentPendingApp.index].rejectionNotes = notes;
  
  const rejectedApp = pendingDorms.splice(currentPendingApp.index, 1)[0];
  localStorage.setItem('zambodorm_pending_dorms', JSON.stringify(pendingDorms));
  
  const adminApps = JSON.parse(localStorage.getItem('zambodorm_dorm_applications') || '[]');
  const adminAppIdx = adminApps.findIndex(a => a.id === rejectedApp.id);
  if (adminAppIdx !== -1) {
    adminApps[adminAppIdx].status = 'Rejected';
    adminApps[adminAppIdx].rejectionNotes = notes;
    localStorage.setItem('zambodorm_dorm_applications', JSON.stringify(adminApps));
  }
  
  showToast(`❌ Dorm "${rejectedApp.dormName}" rejected. Admin will be notified.`);
  closeAppReviewModal();
  loadPendingDormApplications();
}

document.getElementById('closeAppReview').addEventListener('click', closeAppReviewModal);
document.getElementById('approveAppBtn').addEventListener('click', approveDormApplication);
document.getElementById('rejectAppBtn').addEventListener('click', rejectDormApplication);

function showToast(message) {
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.cssText = 'position: fixed; bottom: 20px; right: 20px; background: #1f2937; color: white; padding: 12px 20px; border-radius: 6px; font-size: 0.9rem; z-index: 10000; animation: slideIn 0.3s ease-out;';
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ─── USER LIST MODAL HANDLER ───────────────────────────────────────────────
function openUserListModal(propId) {
  const prop = properties.find(p => p.id === propId);
  if (!prop) return;

  const allUsers = getCombinedUsers();
  const propUsers = allUsers.filter(u => u.propertyId === propId || u.assignedDormId === propId);

  document.getElementById('userListModalTitle').textContent = `Users for ${prop.name}`;
  const content = document.getElementById('userListContent');
  content.innerHTML = '';

  if (propUsers.length === 0) {
    content.innerHTML = '<div style="padding: 20px; text-align: center; color: #6b7280;">No users assigned to this property.</div>';
  } else {
    const groups = {
      'Admin/Landlord': propUsers.filter(u => u.role === 'admin' || u.role === 'landlord'),
      'Security': propUsers.filter(u => u.role === 'security' || u.role === 'guard'),
      'Tenant': propUsers.filter(u => u.role === 'tenant')
    };

    for (const [role, users] of Object.entries(groups)) {
      if (users.length > 0) {
        const section = document.createElement('div');
        section.style.marginBottom = '20px';
        section.innerHTML = `
          <h4 style="font-size: 0.8rem; font-weight: 800; text-transform: uppercase; color: #7c3aed; margin-bottom: 8px; border-bottom: 1px solid rgba(124, 58, 237, 0.1); padding-bottom: 4px;">${role}s (${users.length})</h4>
          <div style="display: grid; gap: 8px;">
            ${users.map(u => `
              <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; background: #f8f7ff; border-radius: 6px; border: 1px solid rgba(124, 58, 237, 0.1);">
                <div>
                  <div style="font-weight: 600; color: #1e1b4b; font-size: 0.9rem;">${u.name}</div>
                  <div style="font-size: 0.8rem; color: #6b7280;">${u.email}</div>
                </div>
              </div>
            `).join('')}
          </div>
        `;
        content.appendChild(section);
      }
    }
  }

  openModal('userListModal', 'userListOverlay');
}

document.addEventListener('DOMContentLoaded', function() {
  const closeUserList = document.getElementById('closeUserList');
  const closeUserListBtn = document.getElementById('closeUserListBtn');
  const userListOverlay = document.getElementById('userListOverlay');

  if(closeUserList) closeUserList.onclick = () => closeModal('userListModal', 'userListOverlay');
  if(closeUserListBtn) closeUserListBtn.onclick = () => closeModal('userListModal', 'userListOverlay');
  if(userListOverlay) userListOverlay.onclick = () => closeModal('userListModal', 'userListOverlay');
});
