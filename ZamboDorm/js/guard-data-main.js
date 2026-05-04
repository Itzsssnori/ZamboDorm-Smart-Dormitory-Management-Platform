// ── ZamboDorm Shared Data Store ──
// Uses localStorage to persist visitor data across pages

const RESIDENTS = [
  { name: "Al-shariff Rojas Mateo",room: "101-A" },
  { name: "Norielle John Buhawe", room: "210-A" },
  { name: "Fay Lim",               room: "302-A" },
  { name: "Aila May Natividad",    room: "102-B" },
  { name: "Leilani Rian",          room: "105-B" },
  { name: "Van Claude Valeros",    room: "203-B" },
  { name: "KC Charmelle Lagare",   room: "305-C" },
  { name: "Sherwin Fay",           room: "404-C" },
];

const ID_TYPES = [
  "School ID",
  "PhilSys / National ID",
  "Driver's License",
  "Passport",
  "SSS ID",
  "UMID",
  "Voter's ID",
  "Barangay ID",
  "Company ID",
  "Other",
];

const PURPOSES = [
  "Personal Visit",
  "Delivery / Package",
  "Academic / Tutoring",
  "Maintenance / Repair",
  "Family Visit",
  "Medical Assistance",
  "Official Business",
  "Other",
];

// ── Storage helpers ──
function getVisitors() {
  try { return JSON.parse(localStorage.getItem('zd_visitors') || '[]'); }
  catch { return []; }
}

function saveVisitors(list) {
  localStorage.setItem('zd_visitors', JSON.stringify(list));
}

function addVisitor(v) {
  const list = getVisitors();
  list.push(v);
  saveVisitors(list);
}

function updateVisitor(id, changes) {
  const list = getVisitors();
  const idx = list.findIndex(v => v.id === id);
  if (idx !== -1) { Object.assign(list[idx], changes); saveVisitors(list); }
}

function timeOutVisitor(id) {
  updateVisitor(id, { timeOut: new Date().toISOString() });
}

// ── Utilities ──
function pad(n) { return String(n).padStart(2, '0'); }

function fmtTime(iso) {
  const d = new Date(iso);
  let h = d.getHours(), m = d.getMinutes(), ap = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${pad(h)}:${pad(m)} ${ap}`;
}

function fmtDateTime(iso) {
  const d = new Date(iso);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  let h = d.getHours(), m = d.getMinutes(), ap = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${months[d.getMonth()]} ${d.getDate()} · ${pad(h)}:${pad(m)} ${ap}`;
}

function isToday(iso) {
  const d = new Date(iso), n = new Date();
  return d.getDate() === n.getDate() && d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear();
}

function isOverstay(v) {
  if (v.timeOut) return false;
  return (new Date() - new Date(v.timeIn)) / 3600000 >= 3;
}

function durationStr(v) {
  if (v.timeOut) return '—';
  const mins = Math.floor((new Date() - new Date(v.timeIn)) / 60000);
  if (mins < 60) return mins + 'm';
  return Math.floor(mins / 60) + 'h ' + (mins % 60) + 'm';
}

function visitorFullName(v) {
  return [v.firstName, v.middleInitial ? v.middleInitial + '.' : '', v.lastName].filter(Boolean).join(' ');
}

// ── Clock updater ──
function startClock() {
  function tick() {
    const el = document.getElementById('clock');
    if (!el) return; // Guard against missing element
    const now = new Date();
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    let h = now.getHours(), m = now.getMinutes(), s = now.getSeconds(), ap = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    el.textContent = `${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()} · ${pad(h)}:${pad(m)}:${pad(s)} ${ap}`;
  }
  tick();
  setInterval(tick, 1000);
}

// ── Toast ──
function showToast(msg, isError = false) {
  const t = document.getElementById('toast');
  const tm = document.getElementById('toast-msg');
  if (!t || !tm) return;
  tm.textContent = msg;
  t.className = isError ? 'error' : '';
  void t.offsetWidth;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ── Sidebar active state ──
function setActiveSidebar() {
  const page = location.pathname.split('/').pop() || 'dashboard.html';
  document.querySelectorAll('.sidebar-item[data-page]').forEach(el => {
    el.classList.toggle('active', el.dataset.page === page);
  });
}

// ── Shared navbar/sidebar HTML ──
function renderNav() {
  return `
  <div id="navbar">
    <a class="logo" href="dashboard.html">
      <div class="logo-icon"><svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>
      <span class="logo-text">Zambo<span>Dorm</span></span>
    </a>
    <div id="clock"></div>
    <div class="guard-pill">
      <div class="guard-avatar">GN</div>
      <span class="guard-name">Guard Narvaez</span>
    </div>
    <button class="btn-logout" onclick="handleLogout()">Logout</button>
  </div>`;
}

function renderSidebar() {
  return `
  <nav class="sidebar">
    <a class="sidebar-item" data-page="dashboard.html" href="dashboard.html">
      <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>Dashboard
    </a>
    <a class="sidebar-item" data-page="add-visitor.html" href="add-visitor.html">
      <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>Add Visitor
    </a>
    <a class="sidebar-item" data-page="current-visitors.html" href="current-visitors.html">
      <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>Current Visitors
    </a>
    <a class="sidebar-item" data-page="visitor-logs.html" href="visitor-logs.html">
      <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>Visitor Logs
    </a>
    <div class="sidebar-divider"></div>
    <button class="sidebar-item danger" onclick="handleLogout()">
      <svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>Logout
    </button>
  </nav>`;
}

function handleLogout() {
  if (confirm('Log out from ZamboDorm?')) {
    showToast('Logged out successfully.');
    setTimeout(() => { window.location.href = 'dashboard.html'; }, 1200);
  }
}

// ── Init on load ──
document.addEventListener('DOMContentLoaded', () => {
  // Render navbar if not already in HTML
  const navbar = document.getElementById('navbar');
  if (navbar && navbar.innerHTML.trim() === '') {
    navbar.innerHTML = renderNav();
  }
  // Render sidebar if not already in HTML
  const sidebar = document.querySelector('.sidebar');
  if (!sidebar) {
    const navElement = document.querySelector('nav.sidebar');
    if (!navElement) {
      const appBody = document.querySelector('.app-body');
      if (appBody) {
        const newSidebar = document.createElement('nav');
        newSidebar.innerHTML = renderSidebar();
        appBody.insertBefore(newSidebar, appBody.firstChild);
      }
    }
  }
  startClock();
  setActiveSidebar();
});
