 function render() {
    const visitors = getVisitors();
    const inside = visitors.filter(v => !v.timeOut);
    const today = visitors.filter(v => isToday(v.timeIn));
    const over = inside.filter(v => isOverstay(v));

    document.getElementById('stat-inside').textContent = inside.length;
    document.getElementById('stat-today').textContent = today.length;
    document.getElementById('stat-over').textContent = over.length;

    const bar = document.getElementById('overstay-bar');
    if (over.length > 0) {
      bar.classList.add('show');
      document.getElementById('overstay-msg').textContent =
        over.length + ' visitor' + (over.length > 1 ? 's are' : ' is') + ' overstaying (3+ hrs): ' +
        over.map(v => visitorFullName(v)).join(', ');
    } else {
      bar.classList.remove('show');
    }

    const wrap = document.getElementById('live-table-wrap');
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

  render();
  setInterval(render, 30000);