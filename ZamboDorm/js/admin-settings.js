'use strict';

/* ══════════════════════════════════════
   STATE
══════════════════════════════════════ */
let duration = 'month';
let nextId = 100;
let editingId = null;
let deletingId = null;
let deletingUserId = null;
let editingUserId = null;
let nextUserId = 10;

/* ── Saved deck config ── */
let deckConfig = JSON.parse(localStorage.getItem('zd_deck_config') || 'null') || {
  count: 10,
  rented: 7,
  duration: 'month',
  rateDay: 100,
  rateMonth: 2500,
  lastUpdated: 'Apr 1, 2026'
};

/* ── Items registry ── */
let items = JSON.parse(localStorage.getItem('zd_items') || 'null') || [
  { id:1,  tenant:'Van Claude C. Valeros', room:'204-A', item:'Laptop',            brand:'Dell Inspiron 15',  value:55000, type:'Electronics', serial:'DL-2024-001',   date:'Jan 15, 2026', status:'Active'   },
  { id:2,  tenant:'Aila May Natividad',    room:'102-B', item:'Electric Fan',       brand:'Standard 16"',      value:1500,  type:'Appliance',   serial:'',              date:'Feb 01, 2026', status:'Active'   },
  { id:3,  tenant:'KC Charmelle S. Lagare',room:'305-C', item:'Rice Cooker',        brand:'Kyowa 1.8L',        value:2200,  type:'Appliance',   serial:'KW-RC-2024-77', date:'Dec 20, 2024', status:'Active'   },
  { id:4,  tenant:'Norielle John Buhawe',  room:'210-A', item:'Laptop',             brand:'ASUS ROG G14',      value:75000, type:'Electronics', serial:'ASUS-G14-0081', date:'Jan 20, 2025', status:'Active'   },
  { id:5,  tenant:'Maria Santos',          room:'101-A', item:'Bluetooth Speaker',  brand:'JBL Flip 6',        value:5000,  type:'Electronics', serial:'JBL-F6-2024',   date:'Mar 05, 2026', status:'Pending'  },
  { id:6,  tenant:'Ramon Flores',          room:'302-A', item:'Study Lamp',         brand:'IKEA Tertial',      value:800,   type:'Other',       serial:'',              date:'Feb 28, 2026', status:'Active'   },
  { id:7,  tenant:'Leilani Gomez',         room:'105-B', item:'Mini Fridge',        brand:'Condura 4.5 cu ft', value:12000, type:'Appliance',   serial:'CD-MF-2025-02', date:'Mar 15, 2026', status:'Pending'  },
  { id:8,  tenant:'Gina Reyes',            room:'404-C', item:'Mechanical Keyboard',brand:'Keychron K6',       value:4500,  type:'Electronics', serial:'KC-K6-2023',    date:'Nov 10, 2025', status:'Active'   },
  { id:9,  tenant:'Jose Dela Cruz',        room:'203-B', item:'Clothes Rack',       brand:'Generic',           value:600,   type:'Furniture',   serial:'',              date:'Sep 01, 2025', status:'Inactive' },
  { id:10, tenant:'Maria Santos',          room:'101-A', item:'Tablet',             brand:'iPad Air M1',       value:48000, type:'Electronics', serial:'IPAD-A-2024',   date:'Mar 20, 2026', status:'Pending'  },
];

/* ── Security users ── */
let securityUsers = JSON.parse(localStorage.getItem('zd_security_users') || 'null') || [];

function saveUsers()        { localStorage.setItem('zd_security_users', JSON.stringify(securityUsers)); }
function saveItems()        { localStorage.setItem('zd_items',          JSON.stringify(items));         }
function saveDeckToStorage(){ localStorage.setItem('zd_deck_config',    JSON.stringify(deckConfig));    }

/* ══════════════════════════════════════
   HELPERS
══════════════════════════════════════ */
function fmtPHP(n) {
  if (!n || n === 0) return '—';
  return '₱' + Number(n).toLocaleString('en-PH');
}

function todayLabel() {
  return new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}

function showToast(msg, type = 'success') {
  const t = document.getElementById('admin-toast');
  const icons = {
    success:`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    error:  `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
    warning:`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/></svg>`,
  };
  t.className = `admin-toast ${type}`;
  t.innerHTML = (icons[type] || '') + ' ' + msg;
  t.classList.add('show');
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.remove('show'), 3500);
}

function updateStats() {
  document.getElementById('stat-total').textContent   = items.length;
  document.getElementById('stat-highval').textContent = items.filter(i => i.value >= 10000).length;
  document.getElementById('stat-pending').textContent = items.filter(i => i.status === 'Pending').length;
}

function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ══════════════════════════════════════
   DECK CONFIG
══════════════════════════════════════ */
function updateDeckDisplay() {
  const total  = parseInt(document.getElementById('deck-count').value) || 0;
  const rented = Math.min(deckConfig.rented, total);
  const avail  = Math.max(0, total - rented);
  document.getElementById('chip-rented').textContent = rented + ' rented';
  document.getElementById('chip-avail').textContent  = avail  + ' available';
  const badge = document.getElementById('deck-status-badge');
  badge.textContent = total > 0 ? 'Active' : 'Inactive';
  badge.className   = total > 0 ? 'badge-active' : 'badge-active badge-inactive';
}

function setDuration(type) {
  duration = type;
  document.getElementById('dur-day').classList.toggle('active',   type === 'day');
  document.getElementById('dur-month').classList.toggle('active', type === 'month');
  updateRate();
}

function updateRate() {
  const dayRate   = parseInt(document.getElementById('rate-day-input').value)   || 0;
  const monthRate = parseInt(document.getElementById('rate-month-input').value) || 0;
  const rate  = duration === 'day' ? dayRate : monthRate;
  document.getElementById('rate-label').textContent = duration === 'day' ? 'Per Day' : 'Per Month';
  document.getElementById('rate-value').textContent = '₱' + rate.toLocaleString('en-PH');
}

function saveDeckConfig() {
  deckConfig.count       = parseInt(document.getElementById('deck-count').value)       || 0;
  deckConfig.duration    = duration;
  deckConfig.rateDay     = parseInt(document.getElementById('rate-day-input').value)   || 0;
  deckConfig.rateMonth   = parseInt(document.getElementById('rate-month-input').value) || 0;
  deckConfig.lastUpdated = todayLabel();
  saveDeckToStorage();
  document.getElementById('deck-last-updated').textContent = deckConfig.lastUpdated;
  const saved = document.getElementById('deck-saved');
  saved.classList.add('show');
  setTimeout(() => saved.classList.remove('show'), 2500);
  showToast('Deck configuration saved!', 'success');
}

/* ══════════════════════════════════════
   REGISTRY TABLE
══════════════════════════════════════ */
function renderRegistry() {
  const search  = (document.getElementById('reg-search')?.value || '').toLowerCase();
  const statusF = document.getElementById('reg-status')?.value  || 'all';
  const typeF   = document.getElementById('reg-type')?.value    || 'all';

  const list = items.filter(i => {
    const text = `${i.tenant} ${i.room} ${i.item} ${i.brand}`.toLowerCase();
    return (!search || text.includes(search))
        && (statusF === 'all' || i.status === statusF)
        && (typeF   === 'all' || i.type   === typeF);
  });

  const tbody = document.getElementById('registry-tbody');
  const empty = document.getElementById('registry-empty');
  const info  = document.getElementById('reg-info');

  info.textContent = `Showing ${list.length} of ${items.length} items`;
  if (!list.length) { tbody.innerHTML = ''; empty.style.display = 'block'; return; }
  empty.style.display = 'none';

  const sc = { Active:'status-active', Pending:'status-pending', Inactive:'status-inactive' };

  tbody.innerHTML = list.map(i => `
    <tr>
      <td><div class="t-name">${escHtml(i.tenant)}</div></td>
      <td><span class="room-pill">${escHtml(i.room)}</span></td>
      <td>
        <div class="item-name">${escHtml(i.item)}</div>
        ${i.serial ? `<div class="t-sub">S/N: ${escHtml(i.serial)}</div>` : ''}
      </td>
      <td class="brand-cell">${escHtml(i.brand) || '—'}</td>
      <td style="font-weight:700;color:${i.value >= 10000 ? '#f59e0b' : 'var(--text)'}">
        ${fmtPHP(i.value)}
      </td>
      <td><span style="font-size:0.78rem;font-weight:600;color:var(--text-muted)">${escHtml(i.type)}</span></td>
      <td class="date-cell">${escHtml(i.date)}</td>
      <td><span class="status-pill ${sc[i.status] || ''}">${escHtml(i.status)}</span></td>
      <td>
        <div class="kebab-wrap">
          <button class="kebab-btn" onclick="toggleKebab(${i.id}, event)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>
            </svg>
          </button>
          <div class="kebab-menu" id="km-${i.id}">
            <button class="km-item" onclick="openEditModal(${i.id});closeKebabs()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Edit
            </button>
            <button class="km-item" onclick="toggleStatus(${i.id});closeKebabs()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
              </svg>
              ${i.status === 'Active' ? 'Deactivate' : 'Set Active'}
            </button>
            <div class="km-div"></div>
            <button class="km-item danger" onclick="openDeleteConfirm(${i.id});closeKebabs()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
              </svg>
              Remove
            </button>
          </div>
        </div>
      </td>
    </tr>`).join('');

  updateStats();
}

function filterRegistry() { renderRegistry(); }

function toggleKebab(id, e) {
  e.stopPropagation();
  closeKebabs(id);
  document.getElementById(`km-${id}`)?.classList.toggle('open');
}
function closeKebabs(except) {
  document.querySelectorAll('.kebab-menu.open').forEach(m => {
    if (!except || m.id !== `km-${except}`) m.classList.remove('open');
  });
}

function toggleStatus(id) {
  const i = items.find(x => x.id === id);
  if (!i) return;
  i.status = i.status === 'Active' ? 'Inactive' : 'Active';
  saveItems();
  renderRegistry();
  showToast(`${i.item} status updated to ${i.status}.`, 'success');
}

/* ══════════════════════════════════════
   ADD / EDIT ITEM MODAL
══════════════════════════════════════ */
function openAddModal() {
  editingId = null;
  document.getElementById('item-modal-title').textContent = 'Add New Item';
  document.getElementById('item-modal-sub').textContent   = 'Register an item or appliance for a tenant';
  document.getElementById('item-submit-btn').textContent  = 'Add Item';
  ['f-tenant','f-room','f-item','f-brand','f-serial'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
  document.getElementById('f-value').value  = '';
  document.getElementById('f-type').value   = 'Electronics';
  document.getElementById('f-status').value = 'Active';
  openModal('modal-item');
}

function openEditModal(id) {
  const i = items.find(x => x.id === id);
  if (!i) return;
  editingId = id;
  document.getElementById('item-modal-title').textContent = 'Edit Item';
  document.getElementById('item-modal-sub').textContent   = `Updating record for ${i.tenant}`;
  document.getElementById('item-submit-btn').textContent  = 'Save Changes';
  document.getElementById('f-tenant').value = i.tenant;
  document.getElementById('f-room').value   = i.room;
  document.getElementById('f-item').value   = i.item;
  document.getElementById('f-brand').value  = i.brand;
  document.getElementById('f-value').value  = i.value || '';
  document.getElementById('f-serial').value = i.serial || '';
  document.getElementById('f-type').value   = i.type;
  document.getElementById('f-status').value = i.status;
  openModal('modal-item');
}

function submitItem() {
  const tenant = document.getElementById('f-tenant').value.trim();
  const room   = document.getElementById('f-room').value.trim();
  const item   = document.getElementById('f-item').value.trim();
  if (!tenant) { showToast('Please enter the tenant name.', 'warning'); return; }
  if (!room)   { showToast('Please enter the room number.', 'warning'); return; }
  if (!item)   { showToast('Please enter the item name.', 'warning'); return; }

  if (editingId) {
    const i = items.find(x => x.id === editingId);
    if (!i) return;
    i.tenant = tenant; i.room = room; i.item = item;
    i.brand  = document.getElementById('f-brand').value.trim();
    i.value  = parseInt(document.getElementById('f-value').value) || 0;
    i.serial = document.getElementById('f-serial').value.trim();
    i.type   = document.getElementById('f-type').value;
    i.status = document.getElementById('f-status').value;
    saveItems();
    showToast(`${i.item} updated successfully.`, 'success');
  } else {
    items.push({
      id:     nextId++,
      tenant, room, item,
      brand:  document.getElementById('f-brand').value.trim(),
      value:  parseInt(document.getElementById('f-value').value) || 0,
      serial: document.getElementById('f-serial').value.trim(),
      type:   document.getElementById('f-type').value,
      date:   todayLabel(),
      status: document.getElementById('f-status').value,
    });
    saveItems();
    showToast(`${item} added to registry!`, 'success');
  }
  closeModal('modal-item');
  renderRegistry();
}

/* ══════════════════════════════════════
   DELETE ITEM
══════════════════════════════════════ */
function openDeleteConfirm(id) {
  const i = items.find(x => x.id === id);
  if (!i) return;
  deletingId = id;
  document.getElementById('confirm-item-name').textContent = `"${i.item}"`;
  openModal('modal-confirm');
}

function confirmDelete() {
  const i = items.find(x => x.id === deletingId);
  if (!i) return;
  items = items.filter(x => x.id !== deletingId);
  deletingId = null;
  saveItems();
  closeModal('modal-confirm');
  renderRegistry();
  showToast(`${i.item} removed from registry.`, 'error');
}

/* ══════════════════════════════════════
   USER MANAGEMENT
══════════════════════════════════════ */
const roleMessages = {
  security: 'Security accounts can log in and will be redirected to the Visitor Log page.',
  admin:    'Admin accounts have full access to all admin panels and settings.',
  staff:    'Staff accounts have limited access to manage day-to-day operations.',
};

function switchUserTab(tab) {
  const isAdd = tab === 'add';
  document.getElementById('tab-add-user').classList.toggle('active',    isAdd);
  document.getElementById('tab-manage-user').classList.toggle('active', !isAdd);
  document.getElementById('panel-add-user').style.display    = isAdd ? '' : 'none';
  document.getElementById('panel-manage-user').style.display = isAdd ? 'none' : '';
  if (!isAdd) renderUsers();
}

/* ── ID Upload helpers ── */

// Accepted types for validation
const ACCEPTED_ID_TYPES = ['image/jpeg','image/png','image/webp','image/gif','application/pdf'];
const MAX_ID_SIZE_MB     = 5;

/**
 * Called when user picks a file in the ID upload input.
 * Validates file type & size, then shows a preview.
 * @param {HTMLInputElement} input
 */
function handleIdUpload(input) {
  const file = input.files[0];
  const preview  = document.getElementById('id-preview');
  const previewImg  = document.getElementById('id-preview-img');
  const previewName = document.getElementById('id-preview-name');
  const previewSize = document.getElementById('id-preview-size');
  const previewIcon = document.getElementById('id-preview-icon');
  const dropzone = document.getElementById('id-dropzone');

  if (!file) { resetIdUpload(); return; }

  // Validate type
  if (!ACCEPTED_ID_TYPES.includes(file.type)) {
    showToast('Invalid file type. Please upload JPG, PNG, WEBP, GIF, or PDF.', 'warning');
    input.value = '';
    return;
  }

  // Validate size
  const sizeMB = file.size / (1024 * 1024);
  if (sizeMB > MAX_ID_SIZE_MB) {
    showToast(`File too large. Maximum size is ${MAX_ID_SIZE_MB}MB.`, 'warning');
    input.value = '';
    return;
  }

  // Show preview
  previewName.textContent = file.name;
  previewSize.textContent = sizeMB < 1
    ? (file.size / 1024).toFixed(1) + ' KB'
    : sizeMB.toFixed(1) + ' MB';

  if (file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = e => {
      previewImg.src = e.target.result;
      previewImg.style.display = 'block';
      previewIcon.style.display = 'none';
    };
    reader.readAsDataURL(file);
  } else {
    // PDF — show icon instead
    previewImg.style.display = 'none';
    previewIcon.style.display = 'flex';
  }

  dropzone.classList.add('has-file');
  preview.style.display = 'flex';
}

function resetIdUpload() {
  const input    = document.getElementById('nu-id-upload');
  const preview  = document.getElementById('id-preview');
  const previewImg = document.getElementById('id-preview-img');
  const dropzone = document.getElementById('id-dropzone');
  if (input)    input.value = '';
  if (preview)  preview.style.display = 'none';
  if (previewImg) { previewImg.src = ''; previewImg.style.display = 'none'; }
  if (dropzone) dropzone.classList.remove('has-file');
}

// Drag-and-drop support
function initIdDropzone() {
  const dropzone = document.getElementById('id-dropzone');
  if (!dropzone) return;

  dropzone.addEventListener('dragover', e => {
    e.preventDefault();
    dropzone.classList.add('dragover');
  });
  dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('dragover');
  });
  dropzone.addEventListener('drop', e => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    const input = document.getElementById('nu-id-upload');
    if (e.dataTransfer.files.length) {
      // Assign dropped file to the input
      const dt = new DataTransfer();
      dt.items.add(e.dataTransfer.files[0]);
      input.files = dt.files;
      handleIdUpload(input);
    }
  });
}

/* ── Create User ── */
function createUser() {
  // ── Name fields (fixed: was reading nu-name which no longer exists) ──
  const firstName  = (document.getElementById('nu-firstname')?.value  || '').trim();
  const middleName = (document.getElementById('nu-middlename')?.value || '').trim();
  const lastName   = (document.getElementById('nu-lastname')?.value   || '').trim();
  const username   = (document.getElementById('nu-username')?.value   || '').trim();
  const password   = (document.getElementById('nu-password')?.value   || '');
  const role       = (document.getElementById('nu-role')?.value       || 'security');
  const idInput    = document.getElementById('nu-id-upload');
  const idFile     = idInput?.files[0] || null;

  // Validations
  if (!firstName)  { showToast('Please enter the first name.',  'warning'); return; }
  if (!lastName)   { showToast('Please enter the last name.',   'warning'); return; }
  if (!username)   { showToast('Please enter a username.',      'warning'); return; }
  if (!password)   { showToast('Please enter a password.',      'warning'); return; }
  if (password.length < 6) { showToast('Password must be at least 6 characters.', 'warning'); return; }

  // Username uniqueness
  if (securityUsers.find(u => u.username === username)) {
    showToast('Username already exists. Choose another.', 'warning');
    return;
  }

  // Compose full name
  const name = middleName
    ? `${firstName} ${middleName} ${lastName}`
    : `${firstName} ${lastName}`;

  // Handle ID file — store as base64 so it survives localStorage round-trips
  // (For a real backend you'd upload to a server instead)
  if (idFile) {
    const reader = new FileReader();
    reader.onload = e => {
      _finishCreateUser(name, username, password, role, {
        name:     idFile.name,
        type:     idFile.type,
        dataUrl:  e.target.result,
        sizeMB:   (idFile.size / (1024 * 1024)).toFixed(2),
      });
    };
    reader.readAsDataURL(idFile);
  } else {
    _finishCreateUser(name, username, password, role, null);
  }
}

function _finishCreateUser(name, username, password, role, idData) {
  const newUser = {
    id:       nextUserId++,
    name,
    username,
    password, // In a real system, hash this server-side!
    role,
    idDoc:    idData,   // { name, type, dataUrl, sizeMB } | null
    date:     todayLabel(),
    status:   'active',
  };
  securityUsers.push(newUser);
  saveUsers();

  // Clear form
  ['nu-firstname','nu-middlename','nu-lastname','nu-username','nu-password'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
  const roleEl = document.getElementById('nu-role');
  if (roleEl) roleEl.value = 'security';
  resetIdUpload();

  // Reset role info box
  const box = document.getElementById('role-info-box');
  const txt = document.getElementById('role-info-text');
  if (box) box.className = 'role-info-box security';
  if (txt) txt.textContent = roleMessages['security'];

  const idNote = idData ? ` ID uploaded: ${idData.name}.` : ' No ID uploaded.';
  showToast(`Account "${username}" created!${idNote}`, 'success');

  // Switch to manage tab after a moment so the admin can see the new user
  setTimeout(() => switchUserTab('manage'), 900);
}

/* ── Render Users ── */
function renderUsers() {
  const search     = (document.getElementById('user-search')?.value       || '').toLowerCase();
  const roleFilter = (document.getElementById('user-role-filter')?.value  || 'all');
  const statFilter = (document.getElementById('user-status-filter')?.value|| 'all');

  const list = securityUsers.filter(u => {
    const text = `${u.name} ${u.username} ${u.role}`.toLowerCase();
    return (!search || text.includes(search))
        && (roleFilter === 'all' || u.role   === roleFilter)
        && (statFilter === 'all' || u.status === statFilter);
  });

  const tbody = document.getElementById('users-tbody');
  const empty = document.getElementById('users-empty');
  const info  = document.getElementById('users-info');

  info.textContent = `Showing ${list.length} of ${securityUsers.length} users`;

  if (!list.length) { tbody.innerHTML = ''; empty.style.display = 'block'; return; }
  empty.style.display = 'none';

  const rolePill = { security:'role-security', admin:'role-admin', staff:'role-staff' };
  const statPill = { active:'status-active', inactive:'status-inactive' };

  tbody.innerHTML = list.map(u => {
    const hasId = !!u.idDoc;
    const idBadge = hasId
      ? `<span class="id-badge id-badge-ok" title="ID: ${escHtml(u.idDoc.name)}">
           <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
           ID on file
         </span>`
      : `<span class="id-badge id-badge-none">
           <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
           No ID
         </span>`;

    return `<tr>
      <td>
        <div class="t-name">${escHtml(u.name)}</div>
        ${idBadge}
      </td>
      <td>
        <span style="font-family:monospace;font-size:0.85rem;background:rgba(124,58,237,0.07);
          padding:2px 8px;border-radius:6px;color:var(--primary);font-weight:700">
          ${escHtml(u.username)}
        </span>
      </td>
      <td><span class="role-pill ${rolePill[u.role] || ''}">${escHtml(u.role.charAt(0).toUpperCase() + u.role.slice(1))}</span></td>
      <td class="date-cell">${escHtml(u.date)}</td>
      <td><span class="status-pill ${statPill[u.status] || ''}">${u.status === 'active' ? 'Active' : 'Inactive'}</span></td>
      <td>
        <div class="kebab-wrap">
          <button class="kebab-btn" onclick="toggleKebabUser(${u.id}, event)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>
            </svg>
          </button>
          <div class="kebab-menu" id="kmu-${u.id}">
            <button class="km-item" onclick="openEditUserModal(${u.id});closeKebabsUser()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Edit
            </button>
            ${hasId ? `
            <button class="km-item" onclick="viewIdDoc(${u.id});closeKebabsUser()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
              </svg>
              View ID
            </button>` : ''}
            <button class="km-item" onclick="toggleUserStatus(${u.id});closeKebabsUser()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
              </svg>
              ${u.status === 'active' ? 'Deactivate' : 'Activate'}
            </button>
            <div class="km-div"></div>
            <button class="km-item danger" onclick="openDeleteUserConfirm(${u.id});closeKebabsUser()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
              </svg>
              Delete
            </button>
          </div>
        </div>
      </td>
    </tr>`;
  }).join('');
}

function filterUsers() { renderUsers(); }

/* ── View uploaded ID in a lightbox ── */
function viewIdDoc(id) {
  const u = securityUsers.find(x => x.id === id);
  if (!u || !u.idDoc) return;

  // Build a simple lightbox overlay
  const existing = document.getElementById('id-lightbox');
  if (existing) existing.remove();

  const isPdf = u.idDoc.type === 'application/pdf';
  const content = isPdf
    ? `<iframe src="${u.idDoc.dataUrl}" style="width:100%;height:70vh;border:none;border-radius:8px;"></iframe>`
    : `<img src="${u.idDoc.dataUrl}" alt="ID Document"
         style="max-width:100%;max-height:70vh;border-radius:8px;display:block;margin:auto;"/>`;

  const lb = document.createElement('div');
  lb.id = 'id-lightbox';
  lb.innerHTML = `
    <div class="lb-backdrop" onclick="document.getElementById('id-lightbox').remove()"></div>
    <div class="lb-box">
      <div class="lb-header">
        <div>
          <p class="lb-title">ID Document — ${escHtml(u.name)}</p>
          <p class="lb-sub">${escHtml(u.idDoc.name)} · ${u.idDoc.sizeMB} MB</p>
        </div>
        <button class="lb-close" onclick="document.getElementById('id-lightbox').remove()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
      <div class="lb-body">${content}</div>
      <div class="lb-footer">
        <a class="btn btn-primary" href="${u.idDoc.dataUrl}" download="${escHtml(u.idDoc.name)}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Download
        </a>
      </div>
    </div>`;
  document.body.appendChild(lb);
  // Trigger animation
  requestAnimationFrame(() => lb.classList.add('lb-open'));
}

function toggleKebabUser(id, e) {
  e.stopPropagation();
  closeKebabsUser(id);
  document.getElementById(`kmu-${id}`)?.classList.toggle('open');
}
function closeKebabsUser(except) {
  document.querySelectorAll('[id^="kmu-"].open').forEach(m => {
    if (!except || m.id !== `kmu-${except}`) m.classList.remove('open');
  });
}

function toggleUserStatus(id) {
  const u = securityUsers.find(x => x.id === id);
  if (!u) return;
  u.status = u.status === 'active' ? 'inactive' : 'active';
  saveUsers();
  renderUsers();
  showToast(`${u.name} is now ${u.status}.`, 'success');
}

/* ── Edit User ── */
function openEditUserModal(id) {
  const u = securityUsers.find(x => x.id === id);
  if (!u) return;
  editingUserId = id;
  document.getElementById('eu-name').value     = u.name;
  document.getElementById('eu-username').value = u.username;
  document.getElementById('eu-password').value = '';
  document.getElementById('eu-role').value     = u.role;
  document.getElementById('eu-status').value   = u.status;

  // Show existing ID info in edit modal if present
  const idInfo = document.getElementById('eu-id-current');
  if (idInfo) {
    idInfo.textContent = u.idDoc
      ? `Current ID on file: ${u.idDoc.name} (${u.idDoc.sizeMB} MB)`
      : 'No ID on file.';
  }

  openModal('modal-edit-user');
}

function saveEditUser() {
  const u = securityUsers.find(x => x.id === editingUserId);
  if (!u) return;

  const name     = document.getElementById('eu-name').value.trim();
  const username = document.getElementById('eu-username').value.trim();
  const password = document.getElementById('eu-password').value;

  if (!name)     { showToast('Please enter the full name.', 'warning'); return; }
  if (!username) { showToast('Please enter a username.',    'warning'); return; }

  const dup = securityUsers.find(x => x.username === username && x.id !== editingUserId);
  if (dup) { showToast('Username already taken.', 'warning'); return; }

  u.name     = name;
  u.username = username;
  u.role     = document.getElementById('eu-role').value;
  u.status   = document.getElementById('eu-status').value;
  if (password) u.password = password;

  // Handle new ID upload in edit modal
  const editIdInput = document.getElementById('eu-id-upload');
  const editIdFile  = editIdInput?.files[0];
  if (editIdFile) {
    const reader = new FileReader();
    reader.onload = e => {
      u.idDoc = {
        name:    editIdFile.name,
        type:    editIdFile.type,
        dataUrl: e.target.result,
        sizeMB:  (editIdFile.size / (1024 * 1024)).toFixed(2),
      };
      saveUsers();
      closeModal('modal-edit-user');
      renderUsers();
      showToast(`User "${username}" updated with new ID.`, 'success');
    };
    reader.readAsDataURL(editIdFile);
  } else {
    saveUsers();
    closeModal('modal-edit-user');
    renderUsers();
    showToast(`User "${username}" updated successfully.`, 'success');
  }
}

/* ── Delete User ── */
function openDeleteUserConfirm(id) {
  const u = securityUsers.find(x => x.id === id);
  if (!u) return;
  deletingUserId = id;
  document.getElementById('confirm-user-name').textContent = `"${u.name}"`;
  openModal('modal-confirm-user');
}

function confirmDeleteUser() {
  const u = securityUsers.find(x => x.id === deletingUserId);
  if (!u) return;
  securityUsers = securityUsers.filter(x => x.id !== deletingUserId);
  deletingUserId = null;
  saveUsers();
  closeModal('modal-confirm-user');
  renderUsers();
  showToast(`User "${u.name}" deleted.`, 'error');
}

/* ══════════════════════════════════════
   PASSWORD TOGGLE
══════════════════════════════════════ */
function togglePw(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const isText = input.type === 'text';
  input.type = isText ? 'password' : 'text';
  btn.innerHTML = isText
    ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
         <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
       </svg>`
    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
         <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
         <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
         <line x1="1" y1="1" x2="23" y2="23"/>
       </svg>`;
}

/* ══════════════════════════════════════
   MODAL HELPERS
══════════════════════════════════════ */
function openModal(id) {
  document.getElementById(id).classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal(id) {
  document.getElementById(id).classList.remove('open');
  document.body.style.overflow = '';
}

/* ══════════════════════════════════════
   SIDEBAR OVERLAY
══════════════════════════════════════ */
document.getElementById('overlay')?.addEventListener('click', () => {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('overlay').classList.remove('active');
});

/* ══════════════════════════════════════
   EVENT LISTENERS (DOMContentLoaded)
══════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {

  // Close modals on backdrop click
  document.addEventListener('click', e => {
    if (e.target.classList.contains('modal-overlay')) closeModal(e.target.id);
  });

  // Close kebabs on document click
  document.addEventListener('click', () => { closeKebabs(); closeKebabsUser(); });

  // Role select → update info box
  const roleSelect = document.getElementById('nu-role');
  if (roleSelect) {
    const updateRoleInfo = () => {
      const role = roleSelect.value;
      const box  = document.getElementById('role-info-box');
      const txt  = document.getElementById('role-info-text');
      if (box) box.className = 'role-info-box ' + role;
      if (txt) txt.textContent = roleMessages[role] || '';
    };
    roleSelect.addEventListener('change', updateRoleInfo);
    updateRoleInfo(); // set on load
  }

  // Init drag-and-drop on the dropzone
  initIdDropzone();
});

function handleEditIdUpload(input) {
  const file = input.files[0];
  const label = document.getElementById('eu-id-preview-name');
  if (!file) { if (label) label.textContent = 'JPG, PNG, WEBP, GIF or PDF · max 5 MB'; return; }
 
  const ACCEPTED = ['image/jpeg','image/png','image/webp','image/gif','application/pdf'];
  if (!ACCEPTED.includes(file.type)) {
    showToast('Invalid file type. Please upload JPG, PNG, WEBP, GIF, or PDF.', 'warning');
    input.value = '';
    return;
  }
  const sizeMB = file.size / (1024 * 1024);
  if (sizeMB > 5) {
    showToast('File too large. Maximum size is 5 MB.', 'warning');
    input.value = '';
    return;
  }
  if (label) {
    const sizeStr = sizeMB < 1
      ? (file.size / 1024).toFixed(1) + ' KB'
      : sizeMB.toFixed(1) + ' MB';
    label.textContent = `✓ ${file.name} (${sizeStr})`;
    label.style.color = 'var(--success)';
  }
}

/* ══════════════════════════════════════
   INIT
══════════════════════════════════════ */
(function init() {
  // Restore saved deck config
  document.getElementById('deck-count').value       = deckConfig.count;
  document.getElementById('rate-day-input').value   = deckConfig.rateDay;
  document.getElementById('rate-month-input').value = deckConfig.rateMonth;
  document.getElementById('deck-last-updated').textContent = deckConfig.lastUpdated;
  duration = deckConfig.duration;
  document.getElementById('dur-day').classList.toggle('active',   duration === 'day');
  document.getElementById('dur-month').classList.toggle('active', duration === 'month');

  updateRate();
  updateDeckDisplay();
  renderRegistry();
})();
