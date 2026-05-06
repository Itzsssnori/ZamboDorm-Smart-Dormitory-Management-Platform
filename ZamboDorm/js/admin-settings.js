/* admin-settings.js  — ZamboDorm Admin Settings Page
   Handles: deck config · items registry · user management (with sysadmin approval flow)
   ─────────────────────────────────────────────────────────────────────────── */

/* ═══════════════════════════════════════════════════════
   DECK RENTAL CONFIG
═══════════════════════════════════════════════════════ */
let currentDuration = 'month';

function setDuration(type) {
  currentDuration = type;
  document.getElementById('dur-day').classList.toggle('active', type === 'day');
  document.getElementById('dur-month').classList.toggle('active', type === 'month');
  updateRate();
}

function updateRate() {
  const dayRate   = parseFloat(document.getElementById('rate-day-input').value)   || 0;
  const monthRate = parseFloat(document.getElementById('rate-month-input').value) || 0;
  const isMonth   = currentDuration === 'month';
  document.getElementById('rate-label').textContent = isMonth ? 'Per Month' : 'Per Day';
  document.getElementById('rate-value').textContent = `₱${(isMonth ? monthRate : dayRate).toLocaleString()}`;
}

function updateDeckDisplay() {
  const total  = parseInt(document.getElementById('deck-count').value) || 0;
  const rented = Math.min(7, total);
  const avail  = Math.max(0, total - rented);
  document.getElementById('chip-rented').textContent = `${rented} rented`;
  document.getElementById('chip-avail').textContent  = `${avail} available`;
}

function saveDeckConfig() {
  const today = new Date().toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });
  document.getElementById('deck-last-updated').textContent = today;
  const toast = document.getElementById('deck-saved');
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

/* ═══════════════════════════════════════════════════════
   ITEMS REGISTRY
═══════════════════════════════════════════════════════ */
const REGISTRY_KEY = 'zd_registry';
let registry = [];
let editingIdx = null;

const SAMPLE_ITEMS = [
  { tenant:'Maria Santos',   room:'101-A', item:'Laptop',       brand:'Dell XPS 13',      value:65000, type:'Electronics', date:'2026-01-10', status:'Active',   serial:'DX13-2024' },
  { tenant:'Jose Reyes',     room:'202-B', item:'Electric Fan', brand:'Panasonic',         value:1800,  type:'Appliance',   date:'2026-01-15', status:'Active',   serial:'' },
  { tenant:'Ana Cruz',       room:'305-C', item:'Mini Ref',     brand:'Condura',           value:8500,  type:'Appliance',   date:'2026-01-18', status:'Pending',  serial:'CDR-4521' },
  { tenant:'Pedro Lim',      room:'104-A', item:'Guitar',       brand:'Yamaha',            value:12000, type:'Other',       date:'2026-02-02', status:'Active',   serial:'' },
  { tenant:'Sofia Tan',      room:'208-B', item:'Desk Lamp',    brand:'Philips',           value:1200,  type:'Electronics', date:'2026-02-10', status:'Active',   serial:'' },
  { tenant:'Carlos Garcia',  room:'301-D', item:'Rice Cooker',  brand:'Hanabishi',         value:2500,  type:'Appliance',   date:'2026-02-14', status:'Inactive', serial:'HRK-0987' },
  { tenant:'Lea Mendoza',    room:'407-A', item:'Study Chair',  brand:'IKEA',              value:4500,  type:'Furniture',   date:'2026-03-01', status:'Active',   serial:'' },
  { tenant:'Marco Villanueva',room:'502-C',item:'Gaming Mouse', brand:'Logitech G502',     value:3200,  type:'Electronics', date:'2026-03-05', status:'Active',   serial:'LG-G502-X' },
  { tenant:'Nina Flores',    room:'103-B', item:'Blender',      brand:'Oster',             value:2100,  type:'Appliance',   date:'2026-03-12', status:'Pending',  serial:'' },
  { tenant:'Aaron Diaz',     room:'206-A', item:'Monitor',      brand:'LG 24"',            value:14000, type:'Electronics', date:'2026-03-20', status:'Active',   serial:'LG24-557' },
];

function loadRegistry() {
  const stored = localStorage.getItem(REGISTRY_KEY);
  registry = stored ? JSON.parse(stored) : [...SAMPLE_ITEMS];
  if (!stored) saveRegistry();
  renderRegistry();
}

function saveRegistry() {
  localStorage.setItem(REGISTRY_KEY, JSON.stringify(registry));
}

function renderRegistry(list = null) {
  const rows = list ?? registry;
  const tbody = document.getElementById('registry-tbody');
  const empty = document.getElementById('registry-empty');
  const info  = document.getElementById('reg-info');

  tbody.innerHTML = '';
  if (rows.length === 0) {
    empty.style.display = 'flex';
    info.textContent = 'No items found';
    return;
  }
  empty.style.display = 'none';
  info.textContent = `Showing ${rows.length} item${rows.length !== 1 ? 's' : ''}`;

  rows.forEach((item, i) => {
    const realIdx = registry.indexOf(item);
    const statusClass = { Active:'status-active', Pending:'status-pending', Inactive:'status-inactive' }[item.status] || '';
    tbody.insertAdjacentHTML('beforeend', `
      <tr>
        <td><span class="tenant-name">${item.tenant}</span></td>
        <td><span class="room-badge">${item.room}</span></td>
        <td><strong>${item.item}</strong></td>
        <td class="text-muted">${item.brand || '—'}</td>
        <td>₱${Number(item.value || 0).toLocaleString()}</td>
        <td><span class="type-chip">${item.type}</span></td>
        <td class="text-muted">${formatDate(item.date)}</td>
        <td><span class="status-chip ${statusClass}">${item.status}</span></td>
        <td>
          <div class="action-btns">
            <button class="action-btn edit-btn" title="Edit" onclick="openEditModal(${realIdx})">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button class="action-btn del-btn" title="Remove" onclick="openDeleteModal(${realIdx})">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
            </button>
          </div>
        </td>
      </tr>`);
  });

  // Update stats
  document.getElementById('stat-total').textContent   = registry.length;
  document.getElementById('stat-highval').textContent = registry.filter(r => Number(r.value) >= 10000).length;
  document.getElementById('stat-pending').textContent = registry.filter(r => r.status === 'Pending').length;
}

function filterRegistry() {
  const q    = document.getElementById('reg-search').value.toLowerCase();
  const stat = document.getElementById('reg-status').value;
  const type = document.getElementById('reg-type').value;
  const filtered = registry.filter(r => {
    const matchQ    = !q || [r.tenant, r.room, r.item, r.brand].some(v => v?.toLowerCase().includes(q));
    const matchStat = stat === 'all' || r.status === stat;
    const matchType = type === 'all' || r.type === type;
    return matchQ && matchStat && matchType;
  });
  renderRegistry(filtered);
}

function formatDate(str) {
  if (!str) return '—';
  const d = new Date(str);
  return isNaN(d) ? str : d.toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });
}

/* ── ITEM MODAL ── */
function openAddModal() {
  editingIdx = null;
  document.getElementById('item-modal-title').textContent = 'Add New Item';
  document.getElementById('item-modal-sub').textContent   = 'Register an item or appliance for a tenant';
  document.getElementById('item-submit-btn').textContent  = 'Add Item';
  ['f-tenant','f-room','f-item','f-brand','f-serial'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('f-value').value  = '';
  document.getElementById('f-type').value   = 'Electronics';
  document.getElementById('f-status').value = 'Active';
  openModal('modal-item');
}

function openEditModal(idx) {
  editingIdx = idx;
  const item = registry[idx];
  document.getElementById('item-modal-title').textContent = 'Edit Item';
  document.getElementById('item-modal-sub').textContent   = 'Update item record';
  document.getElementById('item-submit-btn').textContent  = 'Save Changes';
  document.getElementById('f-tenant').value  = item.tenant;
  document.getElementById('f-room').value    = item.room;
  document.getElementById('f-item').value    = item.item;
  document.getElementById('f-brand').value   = item.brand;
  document.getElementById('f-value').value   = item.value;
  document.getElementById('f-type').value    = item.type;
  document.getElementById('f-serial').value  = item.serial;
  document.getElementById('f-status').value  = item.status;
  openModal('modal-item');
}

function submitItem() {
  const tenant = document.getElementById('f-tenant').value.trim();
  const room   = document.getElementById('f-room').value.trim();
  const item   = document.getElementById('f-item').value.trim();
  if (!tenant || !room || !item) { showToast('Please fill in required fields', 'warn'); return; }

  const obj = {
    tenant, room, item,
    brand:  document.getElementById('f-brand').value.trim(),
    value:  parseFloat(document.getElementById('f-value').value) || 0,
    type:   document.getElementById('f-type').value,
    serial: document.getElementById('f-serial').value.trim(),
    status: document.getElementById('f-status').value,
    date:   editingIdx !== null ? registry[editingIdx].date : new Date().toISOString().split('T')[0],
  };

  if (editingIdx !== null) {
    registry[editingIdx] = obj;
    showToast('Item updated successfully');
  } else {
    registry.push(obj);
    showToast('Item added to registry');
  }
  saveRegistry();
  renderRegistry();
  closeModal('modal-item');
}

let deleteTarget = null;
function openDeleteModal(idx) {
  deleteTarget = idx;
  document.getElementById('confirm-item-name').textContent = registry[idx].item;
  openModal('modal-confirm');
}

function confirmDelete() {
  if (deleteTarget === null) return;
  registry.splice(deleteTarget, 1);
  deleteTarget = null;
  saveRegistry();
  renderRegistry();
  closeModal('modal-confirm');
  showToast('Item removed from registry');
}

/* ═══════════════════════════════════════════════════════
   USER MANAGEMENT  (approval flow)
═══════════════════════════════════════════════════════ */
const USERS_KEY = 'zd_users';
let users = [];
let editingUserIdx = null;
let deleteUserTarget = null;

// Which dorm this admin manages — pulled from localStorage if set
function getDormName() {
  try {
    const profile = JSON.parse(localStorage.getItem('zd_admin_profile') || '{}');
    return profile.dormitory || 'ZamboDorm';
  } catch { return 'ZamboDorm'; }
}

function loadUsers() {
  const stored = localStorage.getItem(USERS_KEY);
  users = stored ? JSON.parse(stored) : [];
  renderUsers();
}

function saveUsers() {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function renderUsers(list = null) {
  const rows  = list ?? users;
  const tbody = document.getElementById('users-tbody');
  const empty = document.getElementById('users-empty');
  const info  = document.getElementById('users-info');

  tbody.innerHTML = '';
  if (rows.length === 0) {
    empty.style.display = 'flex';
    info.textContent = 'No users found';
    return;
  }
  empty.style.display = 'none';
  info.textContent = `Showing ${rows.length} user${rows.length !== 1 ? 's' : ''}`;

  rows.forEach((u) => {
    const realIdx = users.indexOf(u);
    const roleBadge = { admin:'role-admin', security:'role-security', staff:'role-staff' }[u.role] || '';
    const statusClass = u.status === 'active' ? 'status-active' : 'status-inactive';
    tbody.insertAdjacentHTML('beforeend', `
      <tr>
        <td><span class="tenant-name">${u.name}</span></td>
        <td><code class="username-code">${u.username}</code></td>
        <td><span class="role-chip ${roleBadge}">${u.role}</span></td>
        <td class="text-muted">${formatDate(u.dateCreated?.split('T')[0])}</td>
        <td><span class="status-chip ${statusClass}">${u.status}</span></td>
        <td>
          <div class="action-btns">
            <button class="action-btn edit-btn" title="Edit" onclick="openEditUserModal(${realIdx})">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button class="action-btn del-btn" title="Delete" onclick="openDeleteUserModal(${realIdx})">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
            </button>
          </div>
        </td>
      </tr>`);
  });
}

function filterUsers() {
  const q      = document.getElementById('user-search').value.toLowerCase();
  const role   = document.getElementById('user-role-filter').value;
  const status = document.getElementById('user-status-filter').value;
  const filtered = users.filter(u => {
    const matchQ   = !q || [u.name, u.username, u.role].some(v => v?.toLowerCase().includes(q));
    const matchR   = role   === 'all' || u.role   === role;
    const matchS   = status === 'all' || u.status === status;
    return matchQ && matchR && matchS;
  });
  renderUsers(filtered);
}

/* ── CREATE USER (sends to pending approval) ── */
let _nuIdFile = null;

function createUser() {
  const firstname  = document.getElementById('nu-firstname').value.trim();
  const middlename = document.getElementById('nu-middlename').value.trim();
  const lastname   = document.getElementById('nu-lastname').value.trim();
  const username   = document.getElementById('nu-username').value.trim();
  const password   = document.getElementById('nu-password').value;
  const role       = document.getElementById('nu-role').value;

  if (!firstname || !lastname || !username || !password) {
    showToast('Please fill in all required fields', 'warn');
    return;
  }
  if (password.length < 6) {
    showToast('Password must be at least 6 characters', 'warn');
    return;
  }

  // Check duplicate username in pending requests
  const existing = UserApprovalStore.getAll().find(r => r.username === username && r.status === 'pending');
  if (existing) {
    showToast('A pending request for this username already exists', 'warn');
    return;
  }

  // Submit to approval store
  UserApprovalStore.submit({
    firstname, middlename, lastname, username, password, role,
    idFileName: _nuIdFile?.name || null,
    idFileData: _nuIdFile?.data || null,
    dormitory:  getDormName(),
  });

  showToast('User request submitted — awaiting Sysadmin approval', 'success', 4000);

  // Clear form
  ['nu-firstname','nu-middlename','nu-lastname','nu-username','nu-password'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('nu-role').value = 'security';
  resetIdUpload();
  _nuIdFile = null;

  // Show pending banner
  renderPendingBanner();
}

function renderPendingBanner() {
  const pendingCount = UserApprovalStore.getPendingCount();
  let banner = document.getElementById('pending-requests-banner');
  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'pending-requests-banner';
    banner.className = 'pending-banner';
    const panel = document.getElementById('panel-add-user');
    panel.insertAdjacentElement('afterbegin', banner);
  }
  if (pendingCount > 0) {
    banner.innerHTML = `
      <div class="pending-banner-inner">
        <div class="pending-banner-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
          </svg>
        </div>
        <div class="pending-banner-text">
          <strong>${pendingCount} pending request${pendingCount > 1 ? 's' : ''}</strong> awaiting Sysadmin approval.
          New users will appear in the Manage Users tab once approved.
        </div>
      </div>`;
    banner.style.display = 'flex';
  } else {
    banner.style.display = 'none';
  }
}

/* ── EDIT USER ── */
let _euIdFile = null;

function openEditUserModal(idx) {
  editingUserIdx = idx;
  const u = users[idx];
  document.getElementById('eu-name').value     = u.name;
  document.getElementById('eu-username').value = u.username;
  document.getElementById('eu-password').value = '';
  document.getElementById('eu-role').value     = u.role;
  document.getElementById('eu-status').value   = u.status;
  const currentLabel = document.getElementById('eu-id-current');
  currentLabel.textContent = u.idFileName ? `Current ID: ${u.idFileName}` : 'No ID on file.';
  document.getElementById('eu-id-preview-name').textContent = 'JPG, PNG, WEBP, GIF or PDF · max 5 MB';
  _euIdFile = null;
  openModal('modal-edit-user');
}

function saveEditUser() {
  if (editingUserIdx === null) return;
  const name     = document.getElementById('eu-name').value.trim();
  const username = document.getElementById('eu-username').value.trim();
  const password = document.getElementById('eu-password').value;
  const role     = document.getElementById('eu-role').value;
  const status   = document.getElementById('eu-status').value;
  if (!name || !username) { showToast('Name and username are required', 'warn'); return; }

  const u = users[editingUserIdx];
  u.name     = name;
  u.username = username;
  u.role     = role;
  u.status   = status;
  if (password) u.password = password;
  if (_euIdFile) {
    u.idFileName = _euIdFile.name;
    u.idFileData = _euIdFile.data;
  }
  saveUsers();
  renderUsers();
  closeModal('modal-edit-user');
  showToast('User updated successfully');
}

function openDeleteUserModal(idx) {
  deleteUserTarget = idx;
  document.getElementById('confirm-user-name').textContent = users[idx].name;
  openModal('modal-confirm-user');
}

function confirmDeleteUser() {
  if (deleteUserTarget === null) return;
  users.splice(deleteUserTarget, 1);
  deleteUserTarget = null;
  saveUsers();
  renderUsers();
  closeModal('modal-confirm-user');
  showToast('User deleted');
}

/* ── TABS ── */
function switchUserTab(tab) {
  document.getElementById('tab-add-user').classList.toggle('active', tab === 'add');
  document.getElementById('tab-manage-user').classList.toggle('active', tab === 'manage');
  document.getElementById('panel-add-user').style.display    = tab === 'add'    ? '' : 'none';
  document.getElementById('panel-manage-user').style.display = tab === 'manage' ? '' : 'none';
  if (tab === 'manage') { loadUsers(); }
}

/* ── ROLE INFO BOX ── */
const ROLE_INFO = {
  security: 'Security accounts can log in and will be redirected to the Visitor Log page.',
  admin:    'Admin accounts have full access to all admin dashboard features.',
  staff:    'Staff accounts can access selected modules as configured by the admin.',
};

document.addEventListener('DOMContentLoaded', () => {
  const roleSelect = document.getElementById('nu-role');
  if (roleSelect) {
    roleSelect.addEventListener('change', () => {
      document.getElementById('role-info-text').textContent = ROLE_INFO[roleSelect.value] || '';
    });
  }
});

/* ── ID UPLOAD (Add User) ── */
function handleIdUpload(input) {
  const file = input.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) { showToast('File exceeds 5MB limit', 'warn'); return; }
  const reader = new FileReader();
  reader.onload = e => {
    _nuIdFile = { name: file.name, data: e.target.result };
    const isImg = file.type.startsWith('image/');
    document.getElementById('id-preview').style.display    = 'flex';
    document.getElementById('id-dropzone').querySelector('.id-dropzone-default').style.display = 'none';
    const img  = document.getElementById('id-preview-img');
    const icon = document.getElementById('id-preview-icon');
    if (isImg) { img.src = e.target.result; img.style.display = 'block'; icon.style.display = 'none'; }
    else        { img.style.display = 'none'; icon.style.display = 'flex'; }
    document.getElementById('id-preview-name').textContent = file.name;
    document.getElementById('id-preview-size').textContent = (file.size / 1024).toFixed(1) + ' KB';
  };
  reader.readAsDataURL(file);
}

function resetIdUpload() {
  _nuIdFile = null;
  document.getElementById('nu-id-upload').value = '';
  document.getElementById('id-preview').style.display = 'none';
  const def = document.getElementById('id-dropzone').querySelector('.id-dropzone-default');
  if (def) def.style.display = '';
}

function handleEditIdUpload(input) {
  const file = input.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) { showToast('File exceeds 5MB limit', 'warn'); return; }
  const reader = new FileReader();
  reader.onload = e => {
    _euIdFile = { name: file.name, data: e.target.result };
    document.getElementById('eu-id-preview-name').textContent = `✓ ${file.name}`;
  };
  reader.readAsDataURL(file);
}

/* ═══════════════════════════════════════════════════════
   MODAL HELPERS
═══════════════════════════════════════════════════════ */
function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) {
    document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
  }
});

function togglePw(inputId, btn) {
  const input = document.getElementById(inputId);
  const shown = input.type === 'text';
  input.type = shown ? 'password' : 'text';
  btn.querySelector('svg').style.opacity = shown ? '1' : '0.5';
}

/* ═══════════════════════════════════════════════════════
   TOAST
═══════════════════════════════════════════════════════ */
function showToast(msg, type = 'success', duration = 2800) {
  const t = document.getElementById('admin-toast');
  t.textContent = msg;
  t.className   = `admin-toast show ${type === 'warn' ? 'toast-warn' : ''}`;
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), duration);
}

/* ═══════════════════════════════════════════════════════
   INIT
═══════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  updateRate();
  updateDeckDisplay();
  loadRegistry();
  loadUsers();
  renderPendingBanner();
});
