let currentTab = 'all';

  function setTab(tab, btn) {
    currentTab = tab;
    document.querySelectorAll('.tab-pill').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    render();
  }

  function clearFilters() {
    document.getElementById('f-search').value = '';
    document.getElementById('f-room').value = '';
    document.getElementById('f-date').value = '';
    render();
  }

  function render() {
    const search = document.getElementById('f-search').value.toLowerCase();
    const roomF = document.getElementById('f-room').value.trim();
    const dateF = document.getElementById('f-date').value;

    let data = getVisitors().filter(v => {
      const fullName = visitorFullName(v).toLowerCase();
      if (search && !fullName.includes(search)) return false;
      if (roomF && !v.room.includes(roomF)) return false;
      if (dateF) {
        const d = new Date(v.timeIn);
        const ds = d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
        if (ds !== dateF) return false;
      }
      if (currentTab === 'today' && !isToday(v.timeIn)) return false;
      if (currentTab === 'inside' && v.timeOut) return false;
      if (currentTab === 'done' && !v.timeOut) return false;
      return true;
    }).slice().reverse();

    const wrap = document.getElementById('logs-wrap');
    if (data.length === 0) {
      wrap.innerHTML = `<div class="empty-state"><svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg><p>No records found</p></div>`;
      return;
    }

    const rows = data.map(v => {
      const over = isOverstay(v);
      const statusBadge = v.timeOut
        ? `<span class="badge badge-gray"><span class="dot"></span>Completed</span>`
        : over
        ? `<span class="badge badge-red"><span class="dot"></span>Overstaying</span>`
        : `<span class="badge badge-green"><span class="dot"></span>Inside</span>`;

      return `<tr>
        <td>
          <div style="font-weight:700;">${visitorFullName(v)}</div>
          ${v.middleInitial ? `<div style="font-size:0.72rem;color:var(--text-muted);">M.I.: ${v.middleInitial}.</div>` : ''}
        </td>
        <td>${v.person}</td>
        <td><strong>${v.room}</strong></td>
        <td>${fmtDateTime(v.timeIn)}</td>
        <td>${v.timeOut ? fmtDateTime(v.timeOut) : '—'}</td>
        <td>${v.purpose}</td>
        <td>${v.idType || '—'}</td>
        <td>${statusBadge}</td>
        <td>
          <button class="btn-edit" onclick="openEdit(${v.id})">Edit Name</button>
        </td>
      </tr>`;
    }).join('');

    wrap.innerHTML = `<div class="tbl-wrap"><table class="tbl" style="min-width:900px;">
      <thead><tr>
        <th>Visitor</th><th>Visiting</th><th>Room</th><th>Time In</th><th>Time Out</th><th>Purpose</th><th>ID</th><th>Status</th><th>Action</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table></div>`;
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

  document.getElementById('edit-modal').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
  });

  render();