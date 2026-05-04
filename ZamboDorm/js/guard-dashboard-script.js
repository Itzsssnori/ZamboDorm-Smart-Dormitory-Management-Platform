// GUARD DASHBOARD SCRIPT
// Handles real-time updates and dashboard interactions

document.addEventListener('DOMContentLoaded', () => {
  setupUserManager();
  initDashboard();
});

function setupUserManager() {
  if (typeof UserManager !== 'undefined' && UserManager.isAuthenticated()) {
    const name = UserManager.getName();
    const initials = UserManager.getInitials();
    
    const guardNameEl = document.getElementById('guardName');
    const guardAvatarEl = document.getElementById('guardAvatar');
    const welcomeTextEl = document.querySelector('.page-header p');
    
    if (guardNameEl) guardNameEl.textContent = name;
    if (guardAvatarEl) guardAvatarEl.textContent = initials;
    if (welcomeTextEl) {
      welcomeTextEl.textContent = `Welcome back, ${name}. Here's today's overview.`;
    }
    
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.onclick = (e) => {
        e.preventDefault();
        UserManager.logout();
      };
    }
  }
}

function initDashboard() {
  function render() {
    if (typeof getVisitors !== 'function') return;
    
    const visitors = getVisitors();
    const inside = visitors.filter(v => !v.timeOut);
    const today = visitors.filter(v => isToday(v.timeIn));
    const over = inside.filter(v => isOverstay(v));

    const statInside = document.getElementById('stat-inside');
    const statToday = document.getElementById('stat-today');
    const statOver = document.getElementById('stat-over');

    if (statInside) statInside.textContent = inside.length;
    if (statToday) statToday.textContent = today.length;
    if (statOver) statOver.textContent = over.length;

    const bar = document.getElementById('overstay-bar');
    if (bar) {
      if (over.length > 0) {
        bar.classList.add('show');
        const msgEl = document.getElementById('overstay-msg');
        if (msgEl) {
          msgEl.textContent =
            over.length + ' visitor' + (over.length > 1 ? 's are' : ' is') + ' overstaying (3+ hrs): ' +
            over.map(v => visitorFullName(v)).join(', ');
        }
      } else {
        bar.classList.remove('show');
      }
    }

    const wrap = document.getElementById('live-table-wrap');
    if (wrap) {
      if (inside.length === 0) {
        wrap.innerHTML = `<div class="empty-state"><svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg><p>No visitors currently inside</p></div>`;
        return;
      }
      const rows = inside.map(v => {
        const over = isOverstay(v);
        const badge = over
          ? `<span class="badge badge-red"><span class="dot"></span>Overstaying</span>`
          : `<span class="badge badge-green"><span class="dot"></span>Inside</span>`;
        return `<tr>
          <td><strong>${visitorFullName(v)}</strong></td>
          <td>${v.person}</td>
          <td><strong>${v.room}</strong></td>
          <td>${fmtTime(v.timeIn)}</td>
          <td>${durationStr(v)}</td>
          <td>${badge}</td>
        </tr>`;
      }).join('');
      wrap.innerHTML = `<div class="tbl-wrap"><table class="tbl">
        <thead><tr><th>Visitor</th><th>Visiting</th><th>Room</th><th>Time In</th><th>Duration</th><th>Status</th></tr></thead>
        <tbody>${rows}</tbody>
      </table></div>`;
    }
  }

  render();
  setInterval(render, 30000);
}