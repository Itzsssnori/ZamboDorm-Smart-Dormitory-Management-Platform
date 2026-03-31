/* ── HAMBURGER ─────────────────────────────────────────── */
const hamburger = document.getElementById('sidebarHamburger');
const sidebar   = document.getElementById('sidebar');
const overlay   = document.getElementById('overlay');

function openSidebar(){
  sidebar.classList.add('open');
  overlay.classList.add('active');
  hamburger.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeSidebar(){
  sidebar.classList.remove('open');
  overlay.classList.remove('active');
  hamburger.classList.remove('open');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
});
overlay.addEventListener('click', closeSidebar);

/* Close sidebar when a nav link is clicked on mobile */
sidebar.querySelectorAll('.sidebar-item').forEach(item => {
  item.addEventListener('click', () => {
    if(window.innerWidth <= 900) closeSidebar();
  });
});

/* ── DATA ──────────────────────────────────────────────── */
const ICONS = {
  Maintenance: `<svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19.07l-1.41 1.41a2 2 0 0 1-2.83 0l-7.34-7.34a2 2 0 0 1 0-2.83l1.41-1.41a2 2 0 0 1 2.83 0l7.34 7.34a2 2 0 0 1 0 2.83z"/><path d="M14.34 17.66l-1.41-1.41"/></svg>`,
  Water: `<svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C12 2 7 7.58 7 12a5 5 0 0 0 10 0c0-4.42-5-10-5-10z"/></svg>`,
  Laundry: `<svg viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="12" cy="12" r="5"/><path d="M16 8a2 2 0 1 1-4 0"/></svg>`,
  Electrical: `<svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 2 13 12 13 11 22 22 11 12 11 13 2"/></svg>`,
  Plumbing: `<svg viewBox="0 0 24 24" fill="none" stroke="#7c3aed" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
  Cleaning: `<svg viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M9 11V7a3 3 0 0 1 6 0v4"/></svg>`,
  'AC/Aircon': `<svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`,
};

const SR_DATA = [
  { id:'SR-2026-0051', type:'Maintenance', icon:'Maintenance', iconBg:'rgba(239,68,68,0.10)', title:'Maintenance Request',       desc:'Busted fluorescent light in Room 204 — ceiling fixture not working since last week.', status:'pending',     priority:'high',   tenant:'Cedric San Antonio', room:'Room 204-B',       submitted:'Apr 1, 2026 · 8:14 AM',  assignee:null },
  { id:'SR-2026-0050', type:'Water',       icon:'Water',       iconBg:'rgba(59,130,246,0.10)',  title:'Water Delivery Request',   desc:'Water delivery requested for Room 312. Tenant ran out of drinking water supply.',       status:'in-progress', priority:'medium', tenant:'Ramil Magellan',    room:'Room 312-A',       submitted:'Apr 1, 2026 · 7:02 AM',  assignee:'Staff: Jun Reyes' },
  { id:'SR-2026-0049', type:'Laundry',     icon:'Laundry',     iconBg:'rgba(16,185,129,0.10)',  title:'Laundry Request',          desc:'Laundry pickup requested for 2 bags. Items left at the lobby drop-off area.',              status:'completed',   priority:'low',    tenant:'Anas Alon',         room:'Room 067-A',       submitted:'Mar 31, 2026 · 5:30 PM', assignee:'Staff: Maria Cruz' },
  { id:'SR-2026-0048', type:'Electrical',  icon:'Electrical',  iconBg:'rgba(245,158,11,0.10)',  title:'Electrical Issue',         desc:'Power outlet in the study corner is sparking. Tenant says it trips the breaker when used.', status:'pending',     priority:'high',   tenant:'Liza Fernandez',    room:'Room 101-C',       submitted:'Mar 31, 2026 · 3:45 PM', assignee:null },
  { id:'SR-2026-0047', type:'Plumbing',    icon:'Plumbing',    iconBg:'rgba(124,58,237,0.10)',  title:'Plumbing Issue',           desc:'Shower drain is clogged in the shared bathroom on the 3rd floor.',                        status:'in-progress', priority:'medium', tenant:'Ryan Dela Cruz',    room:'Room 305-A',       submitted:'Mar 30, 2026 · 11:20 AM',assignee:'Staff: Pedro Santos' },
  { id:'SR-2026-0046', type:'Cleaning',    icon:'Cleaning',    iconBg:'rgba(16,185,129,0.10)',  title:'Cleaning Request',         desc:'Deep cleaning requested for common area hallway on Floor 2.',                            status:'completed',   priority:'low',    tenant:'Ana Reyes',         room:'Floor 2 Common',   submitted:'Mar 29, 2026 · 9:00 AM', assignee:'Staff: Cleaning Team' },
  { id:'SR-2026-0045', type:'AC/Aircon',   icon:'AC/Aircon',   iconBg:'rgba(59,130,246,0.10)',  title:'Aircon Not Cooling',       desc:'Aircon unit blowing warm air despite being set to 18°C. Possible refrigerant issue.',      status:'cancelled',   priority:'medium', tenant:'Jose Manalo',       room:'Room 219-B',       submitted:'Mar 28, 2026 · 2:15 PM', assignee:null },
];

const STATUS_LABELS = {
  'pending':     { label:'Pending',     cls:'pending' },
  'in-progress': { label:'In Progress', cls:'in-progress' },
  'completed':   { label:'Completed',   cls:'completed' },
  'cancelled':   { label:'Cancelled',   cls:'cancelled' },
};

let activeTab      = 'all';
let searchQuery    = '';
let filterType     = 'all';
let filterPriority = 'all';
let currentRequest = null;

/* ── HELPERS ─────────────────────────────────────────── */
function getFiltered(){
  return SR_DATA.filter(r => {
    const matchTab    = activeTab === 'all' || r.status === activeTab;
    const matchSearch = !searchQuery || [r.title, r.tenant, r.room, r.id].some(v => v.toLowerCase().includes(searchQuery));
    const matchType   = filterType === 'all' || r.type === filterType;
    const matchPri    = filterPriority === 'all' || r.priority === filterPriority;
    return matchTab && matchSearch && matchType && matchPri;
  });
}
function countByStatus(s){ return s === 'all' ? SR_DATA.length : SR_DATA.filter(r => r.status === s).length; }

/* ── RENDER ──────────────────────────────────────────── */
function renderStats(){
  document.getElementById('stat-total').textContent     = SR_DATA.length;
  document.getElementById('stat-pending').textContent   = countByStatus('pending');
  document.getElementById('stat-progress').textContent  = countByStatus('in-progress');
  document.getElementById('stat-completed').textContent = countByStatus('completed');
}
function renderTabCounts(){
  ['all','pending','in-progress','completed','cancelled'].forEach(s => {
    const el = document.getElementById(`tab-count-${s}`);
    if(el) el.textContent = countByStatus(s);
  });
}
function buildCard(r){
  const st = STATUS_LABELS[r.status];
  const iconSvg = ICONS[r.icon] || r.icon;
  return `
    <div class="sr-card" data-id="${r.id}">
      <div class="sr-card-top">
        <div class="sr-card-icon-wrap" style="background:${r.iconBg}">${iconSvg}</div>
        <div class="sr-card-body">
          <div class="sr-card-title-row">
            <span class="sr-card-title">${r.title}</span>
            <span class="priority-badge ${r.priority}">${r.priority}</span>
            <span class="status-badge ${st.cls}">${st.label}</span>
          </div>
          <p class="sr-card-desc">${r.desc}</p>
          <div class="sr-card-meta">
            <span class="sr-meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>${r.tenant}</span>
            <span class="sr-meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>${r.room}</span>
            <span class="sr-meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>${r.submitted}</span>
            <span class="sr-meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>${r.id}</span>
          </div>
          ${r.assignee ? `<div class="sr-assignee"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>Assigned to: <span class="assignee-chip">${r.assignee}</span></div>` : ''}
        </div>
        <div class="sr-card-actions">
          <button class="btn-manage" onclick="openModal('${r.id}')">Manage</button>
        </div>
      </div>
    </div>`;
}
function renderList(){
  const filtered = getFiltered();
  const list  = document.getElementById('sr-list');
  const empty = document.getElementById('sr-empty');
  if(!filtered.length){ list.innerHTML=''; empty.style.display='block'; }
  else { empty.style.display='none'; list.innerHTML=filtered.map(buildCard).join(''); }
}

/* ── MODAL ───────────────────────────────────────────── */
function openModal(id){
  currentRequest = SR_DATA.find(r => r.id === id);
  if(!currentRequest) return;
  const r = currentRequest;
  document.getElementById('modal-id').textContent       = r.id;
  document.getElementById('modal-type').textContent     = `${r.icon} ${r.type}`;
  document.getElementById('modal-tenant').textContent   = r.tenant;
  document.getElementById('modal-room').textContent     = r.room;
  document.getElementById('modal-submitted').textContent= r.submitted;
  document.getElementById('modal-desc').textContent     = r.desc;
  document.getElementById('modal-status').value         = r.status;
  document.getElementById('modal-priority').value       = r.priority;
  document.getElementById('modal-assignee').value       = r.assignee || '';
  document.getElementById('modal-notes').value          = '';
  document.getElementById('sr-modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal(){
  document.getElementById('sr-modal').classList.remove('open');
  document.body.style.overflow = '';
  currentRequest = null;
}
function saveModal(){
  if(!currentRequest) return;
  const idx = SR_DATA.findIndex(r => r.id === currentRequest.id);
  if(idx !== -1){
    SR_DATA[idx].status   = document.getElementById('modal-status').value;
    SR_DATA[idx].priority = document.getElementById('modal-priority').value;
    SR_DATA[idx].assignee = document.getElementById('modal-assignee').value.trim() || null;
  }
  closeModal();
  renderStats(); renderTabCounts(); renderList();
  showToast('Request updated successfully');
}

/* ── TOAST ───────────────────────────────────────────── */
function showToast(msg, dur=3000){
  const t = document.getElementById('sr-toast');
  t.querySelector('span').textContent = msg;
  t.classList.add('show');
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.remove('show'), dur);
}

/* ── INIT ────────────────────────────────────────────── */
renderStats();
renderTabCounts();
renderList();

document.querySelectorAll('.sr-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    activeTab = btn.dataset.tab;
    document.querySelectorAll('.sr-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderList();
  });
});
document.getElementById('sr-search').addEventListener('input', e => { searchQuery = e.target.value.toLowerCase(); renderList(); });
document.getElementById('sr-filter-type').addEventListener('change', e => { filterType = e.target.value; renderList(); });
document.getElementById('sr-filter-priority').addEventListener('change', e => { filterPriority = e.target.value; renderList(); });
document.getElementById('sr-modal').addEventListener('click', e => { if(e.target === document.getElementById('sr-modal')) closeModal(); });
document.addEventListener('keydown', e => { if(e.key === 'Escape') closeModal(); });