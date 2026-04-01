'use strict';

/* ══════════════════════════════════════
   STATE
══════════════════════════════════════ */
let duration = 'month';  // 'day' | 'month'
let nextId = 100;
let editingId = null;
let deletingId = null;

let items = [
  { id:1,  tenant:'Van Claude C. Valeros', room:'204-A', item:'Laptop',       brand:'Dell Inspiron 15',  value:55000, type:'Electronics', serial:'DL-2024-001',   date:'Jan 15, 2026', status:'Active'   },
  { id:2,  tenant:'Aila May Natividad',    room:'102-B', item:'Electric Fan',  brand:'Standard 16"',      value:1500,  type:'Appliance',   serial:'',              date:'Feb 01, 2026', status:'Active'   },
  { id:3,  tenant:'KC Charmelle S. Lagare',room:'305-C', item:'Rice Cooker',   brand:'Kyowa 1.8L',        value:2200,  type:'Appliance',   serial:'KW-RC-2024-77', date:'Dec 20, 2024', status:'Active'   },
  { id:4,  tenant:'Norielle John Buhawe',  room:'210-A', item:'Laptop',        brand:'ASUS ROG G14',      value:75000, type:'Electronics', serial:'ASUS-G14-0081', date:'Jan 20, 2025', status:'Active'   },
  { id:5,  tenant:'Maria Santos',          room:'101-A', item:'Bluetooth Speaker', brand:'JBL Flip 6',   value:5000,  type:'Electronics', serial:'JBL-F6-2024',   date:'Mar 05, 2026', status:'Pending'  },
  { id:6,  tenant:'Ramon Flores',          room:'302-A', item:'Study Lamp',    brand:'IKEA Tertial',      value:800,   type:'Other',       serial:'',              date:'Feb 28, 2026', status:'Active'   },
  { id:7,  tenant:'Leilani Gomez',         room:'105-B', item:'Mini Fridge',   brand:'Condura 4.5 cu ft', value:12000, type:'Appliance',   serial:'CD-MF-2025-02', date:'Mar 15, 2026', status:'Pending'  },
  { id:8,  tenant:'Gina Reyes',            room:'404-C', item:'Mechanical Keyboard', brand:'Keychron K6', value:4500, type:'Electronics', serial:'KC-K6-2023',    date:'Nov 10, 2025', status:'Active'   },
  { id:9,  tenant:'Jose Dela Cruz',        room:'203-B', item:'Clothes Rack',  brand:'Generic',           value:600,   type:'Furniture',   serial:'',              date:'Sep 01, 2025', status:'Inactive' },
  { id:10, tenant:'Maria Santos',          room:'101-A', item:'Tablet',        brand:'iPad Air M1',       value:48000, type:'Electronics', serial:'IPAD-A-2024',   date:'Mar 20, 2026', status:'Pending'  },
];

/* ══════════════════════════════════════
   HELPERS
══════════════════════════════════════ */
function fmtPHP(n) {
  if (!n || n === 0) return '—';
  return '₱' + Number(n).toLocaleString('en-PH');
}

function showToast(msg, type = 'success') {
  const t = document.getElementById('admin-toast');
  const icons = {
    success:`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    error:  `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
    warning:`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/></svg>`,
  };
  t.className = `admin-toast ${type}`;
  t.innerHTML = (icons[type]||'') + ' ' + msg;
  t.classList.add('show');
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.remove('show'), 3500);
}

function updateStats() {
  document.getElementById('stat-total').textContent   = items.length;
  document.getElementById('stat-highval').textContent  = items.filter(i => i.value >= 10000).length;
  document.getElementById('stat-pending').textContent  = items.filter(i => i.status === 'Pending').length;
}

/* ══════════════════════════════════════
   DECK CONFIG
══════════════════════════════════════ */
function updateDeckDisplay() {
  const total  = parseInt(document.getElementById('deck-count').value) || 0;
  const rented = Math.min(7, total);
  const avail  = Math.max(0, total - rented);
  document.getElementById('chip-rented').textContent = rented + ' rented';
  document.getElementById('chip-avail').textContent  = avail  + ' available';
  document.getElementById('deck-status-badge').textContent = total > 0 ? 'Active' : 'Inactive';
  document.getElementById('deck-status-badge').className   = total > 0 ? 'badge-active' : 'badge-active badge-inactive';
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
  const label = duration === 'day' ? 'Per Day' : 'Per Month';
  document.getElementById('rate-label').textContent = label;
  document.getElementById('rate-value').textContent = '₱' + rate.toLocaleString('en-PH');
}

function saveDeckConfig() {
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

  let list = items.filter(i => {
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

  const statusClass = { Active:'status-active', Pending:'status-pending', Inactive:'status-inactive' };

  tbody.innerHTML = list.map(i => `
    <tr>
      <td><div class="t-name">${i.tenant}</div></td>
      <td><span class="room-pill">${i.room}</span></td>
      <td><div class="item-name">${i.item}</div>${i.serial ? `<div class="t-sub">S/N: ${i.serial}</div>` : ''}</td>
      <td class="brand-cell">${i.brand || '—'}</td>
      <td style="font-weight:700;color:${i.value>=10000?'#f59e0b':'var(--text)'}">${fmtPHP(i.value)}</td>
      <td><span style="font-size:0.78rem;font-weight:600;color:var(--text-muted)">${i.type}</span></td>
      <td class="date-cell">${i.date}</td>
      <td><span class="status-pill ${statusClass[i.status]||''}">${i.status}</span></td>
      <td>
        <div class="kebab-wrap">
          <button class="kebab-btn" onclick="toggleKebab(${i.id},event)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>
          </button>
          <div class="kebab-menu" id="km-${i.id}">
            <button class="km-item" onclick="openEditModal(${i.id});closeKebabs()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              Edit
            </button>
            <button class="km-item" onclick="toggleStatus(${i.id});closeKebabs()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
              ${i.status === 'Active' ? 'Deactivate' : 'Set Active'}
            </button>
            <div class="km-div"></div>
            <button class="km-item danger" onclick="openDeleteConfirm(${i.id});closeKebabs()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
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
document.addEventListener('click', () => closeKebabs());

function toggleStatus(id) {
  const i = items.find(x => x.id === id);
  if (!i) return;
  i.status = i.status === 'Active' ? 'Inactive' : 'Active';
  renderRegistry();
  showToast(`${i.item} status updated to ${i.status}.`, 'success');
}

/* ══════════════════════════════════════
   ADD / EDIT MODAL
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
  if (!tenant) { showToast('⚠️ Please enter the tenant name.', 'warning'); return; }
  if (!room)   { showToast('⚠️ Please enter the room number.', 'warning'); return; }
  if (!item)   { showToast('⚠️ Please enter the item name.', 'warning'); return; }

  const today = new Date().toLocaleDateString('en-US', { month:'short', day:'2-digit', year:'numeric' });

  if (editingId) {
    const i = items.find(x => x.id === editingId);
    if (!i) return;
    i.tenant = tenant; i.room = room; i.item = item;
    i.brand  = document.getElementById('f-brand').value.trim();
    i.value  = parseInt(document.getElementById('f-value').value) || 0;
    i.serial = document.getElementById('f-serial').value.trim();
    i.type   = document.getElementById('f-type').value;
    i.status = document.getElementById('f-status').value;
    showToast(`${i.item} updated successfully.`, 'success');
  } else {
    items.push({
      id:     nextId++,
      tenant, room, item,
      brand:  document.getElementById('f-brand').value.trim(),
      value:  parseInt(document.getElementById('f-value').value) || 0,
      serial: document.getElementById('f-serial').value.trim(),
      type:   document.getElementById('f-type').value,
      date:   today,
      status: document.getElementById('f-status').value,
    });
    showToast(`${item} added to registry!`, 'success');
  }
  closeModal('modal-item');
  renderRegistry();
}

/* ══════════════════════════════════════
   DELETE
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
  closeModal('modal-confirm');
  renderRegistry();
  showToast(`${i.item} removed from registry.`, 'error');
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
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) closeModal(e.target.id);
});

/* ══════════════════════════════════════
   SIDEBAR OVERLAY
══════════════════════════════════════ */
document.getElementById('overlay')?.addEventListener('click', () => {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('overlay').classList.remove('active');
});

/* ══════════════════════════════════════
   INIT
══════════════════════════════════════ */
updateRate();
updateDeckDisplay();
renderRegistry();