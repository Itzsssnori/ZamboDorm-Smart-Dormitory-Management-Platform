function render() {
    const visitors = getVisitors();
    const inside = visitors.filter(v => !v.timeOut);
    const over = inside.filter(v => isOverstay(v));

    const bar = document.getElementById('overstay-bar');
    if (over.length > 0) {
      bar.classList.add('show');
      document.getElementById('overstay-msg').textContent =
        over.length + ' visitor' + (over.length > 1 ? 's are' : ' is') + ' overstaying: ' +
        over.map(v => visitorFullName(v)).join(', ');
    } else {
      bar.classList.remove('show');
    }

    const wrap = document.getElementById('table-wrap');
    if (inside.length === 0) {
      wrap.innerHTML = `<div class="empty-state"><svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg><p>No visitors currently inside</p></div>`;
      return;
    }

    const rows = inside.map(v => {
      const over = isOverstay(v);
      const dur = durationStr(v);
      const badge = over
        ? `<span class="badge badge-red"><span class="dot"></span>Overstaying · ${dur}</span>`
        : `<span class="badge badge-green"><span class="dot"></span>Inside · ${dur}</span>`;
      return `<tr>
        <td>
          <div style="font-weight:700;">${visitorFullName(v)}</div>
          <div style="font-size:0.75rem;color:var(--text-muted);">${v.contact || 'No contact'}</div>
        </td>
        <td>${v.person}</td>
        <td><strong>${v.room}</strong></td>
        <td>${fmtTime(v.timeIn)}</td>
        <td>${v.purpose}</td>
        <td>${badge}</td>
        <td>
          <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
            <button class="btn-edit" onclick="openEdit(${v.id})">Edit</button>
            <button class="btn-timeout" onclick="doTimeout(${v.id})">Time Out</button>
          </div>
        </td>
      </tr>`;
    }).join('');

    wrap.innerHTML = `<div class="tbl-wrap"><table class="tbl">
      <thead><tr>
        <th>Visitor</th><th>Visiting</th><th>Room</th><th>Time In</th><th>Purpose</th><th>Status</th><th>Actions</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table></div>`;
  }

  function doTimeout(id) {
    const visitors = getVisitors();
    const v = visitors.find(x => x.id === id);
    if (!v) return;
    timeOutVisitor(id);
    showToast('✓ ' + visitorFullName(v) + ' timed out.');
    render();
  }

  function openEdit(id) {
    const v = getVisitors().find(x => x.id === id);
    if (!v) return;
    document.getElementById('edit-id').value = id;
    document.getElementById('edit-first').value = v.firstName || '';
    document.getElementById('edit-last').value = v.lastName || '';
    document.getElementById('edit-mi').value = v.middleInitial || '';
    document.getElementById('edit-modal').classList.add('open');
  }

  function closeModal() {
    document.getElementById('edit-modal').classList.remove('open');
  }

  function saveEdit() {
    const id = parseInt(document.getElementById('edit-id').value);
    const first = document.getElementById('edit-first').value.trim();
    const last = document.getElementById('edit-last').value.trim();
    const mi = document.getElementById('edit-mi').value.trim().toUpperCase().replace('.', '');
    if (!first || !last) { showToast('First and last name are required.', true); return; }
    updateVisitor(id, { firstName: first, lastName: last, middleInitial: mi });
    closeModal();
    showToast('✓ Visitor name updated.');
    render();
  }

  // LOGOUT with timeout check
  function handleLogoutWithCheck() {
    const inside = getVisitors().filter(v => !v.timeOut);
    if (inside.length > 0) {
      document.getElementById('pending-count').textContent = inside.length;
      document.getElementById('logout-modal').classList.add('open');
    } else {
      handleLogout();
    }
  }

  function closeLogoutModal() {
    document.getElementById('logout-modal').classList.remove('open');
  }

  function timeoutAllAndLogout() {
    const visitors = getVisitors();
    const now = new Date().toISOString();
    visitors.forEach(v => { if (!v.timeOut) v.timeOut = now; });
    saveVisitors(visitors);
    showToast('All visitors timed out. Logging out…');
    setTimeout(() => { window.location.href = 'dashboard.html'; }, 1500);
  }

  function logoutOnly() {
    closeLogoutModal();
    handleLogout();
  }

  // Close modal on backdrop click
  document.getElementById('edit-modal').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
  });
  document.getElementById('logout-modal').addEventListener('click', function(e) {
    if (e.target === this) closeLogoutModal();
  });

  render();
  setInterval(render, 30000);