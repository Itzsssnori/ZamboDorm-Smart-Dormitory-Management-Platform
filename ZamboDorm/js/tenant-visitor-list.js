/**
 * tenant-visitor-list.js
 * Handles rendering of the visitor registration history for the logged-in tenant.
 */

document.addEventListener('DOMContentLoaded', () => {
  renderVisitorList();
});

function renderVisitorList() {
  const tbody = document.getElementById('visitor-list-body');
  const emptyState = document.getElementById('empty-state');
  const table = document.querySelector('.visitor-table');

  if (!tbody) return;

  // 1. Get active user
  let activeUser = null;
  if (typeof UserManager !== 'undefined') {
    activeUser = UserManager.getUser();
  }

  if (!activeUser) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Please log in to view your visitors.</td></tr>';
    return;
  }

  // 2. Get visitors from localStorage
  const allVisitors = JSON.parse(localStorage.getItem('zambodorm_visitors') || '[]');
  
  // 3. Filter for current tenant
  const myVisitors = allVisitors.filter(v => v.tenantId === activeUser.id);

  if (myVisitors.length === 0) {
    if (table) table.style.display = 'none';
    if (emptyState) emptyState.style.display = 'block';
    return;
  }

  if (table) table.style.display = 'table';
  if (emptyState) emptyState.style.display = 'none';

  // 4. Sort by date (newest first)
  myVisitors.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // 5. Render rows
  tbody.innerHTML = myVisitors.map(v => {
    const statusClass = getStatusClass(v.status);
    const formattedDate = formatDate(v.date, v.time);
    
    return `
      <tr>
        <td style="font-weight:700; color:var(--primary);">${v.id}</td>
        <td>${v.visitorName}</td>
        <td>${formattedDate}</td>
        <td>${v.purpose}</td>
        <td><span class="status-badge ${statusClass}">${v.status}</span></td>
      </tr>
    `;
  }).join('');
}

function getStatusClass(status) {
  if (status.includes('Approved')) return 'status-approved';
  if (status.includes('Denied')) return 'status-denied';
  return 'status-pending';
}

function formatDate(dateStr, timeStr) {
  try {
    const d = new Date(dateStr + 'T00:00:00');
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const datePart = d.toLocaleDateString('en-PH', options);
    
    // Format time
    const [h, m] = timeStr.split(':');
    const hNum = parseInt(h);
    const ampm = hNum >= 12 ? 'PM' : 'AM';
    const h12 = hNum % 12 || 12;
    const timePart = `${h12}:${m} ${ampm}`;
    
    return `${datePart}, ${timePart}`;
  } catch (e) {
    return `${dateStr} ${timeStr}`;
  }
}

// Global function to toggle sidebar (referenced in HTML)
window.toggleSidebar = function() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  if (sidebar) sidebar.classList.toggle('open');
  if (overlay) overlay.classList.toggle('active');
};
