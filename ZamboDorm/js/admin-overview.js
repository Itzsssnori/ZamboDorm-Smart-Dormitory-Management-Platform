/* admin-overview.js — ZamboDorm Admin Dashboard */

/* ── Sidebar toggle ── */
function toggleSidebar() {
  const sb = document.getElementById('sidebar');
  const ov = document.getElementById('overlay');
  sb.classList.toggle('open');
  if (ov) ov.classList.toggle('active');
}

/* ── Revenue data by period ── */
const revenueData = {
  '6m': {
    labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    values: [42000, 48500, 35000, 52000, 45000, 49500],
  },
  '3m': {
    labels: ['Jan', 'Feb', 'Mar'],
    values: [52000, 45000, 49500],
  },
  '1y': {
    labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    values: [38000, 41000, 43500, 40000, 44000, 46000, 42000, 48500, 35000, 52000, 45000, 49500],
  },
};

let activePeriod = '6m';

/* ── Tooltip ── */
const tooltip = document.createElement('div');
tooltip.className = 'chart-tooltip';
document.body.appendChild(tooltip);

function showTooltip(e, text) {
  tooltip.textContent = text;
  tooltip.classList.add('visible');
  moveTooltip(e);
}
function moveTooltip(e) {
  tooltip.style.left = (e.clientX + 14) + 'px';
  tooltip.style.top  = (e.clientY - 36) + 'px';
}
function hideTooltip() {
  tooltip.classList.remove('visible');
}

/* ── Draw bar chart ── */
function drawBarChart(period) {
  const data   = revenueData[period];
  const svg    = document.getElementById('bar-svg');
  const W      = svg.viewBox.baseVal.width  || 520;
  const H      = svg.viewBox.baseVal.height || 200;
  const padL   = 52, padR = 16, padT = 16, padB = 40;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;
  const n      = data.values.length;
  const maxVal = Math.max(...data.values) * 1.12;
  const barW   = Math.floor((chartW / n) * 0.55);
  const gap    = chartW / n;

  /* Y-axis gridlines & labels */
  const steps = 4;
  let gridHTML = '';
  for (let i = 0; i <= steps; i++) {
    const y   = padT + chartH - (chartH * i / steps);
    const val = Math.round((maxVal * i / steps) / 1000);
    gridHTML += `
      <line x1="${padL}" y1="${y}" x2="${W - padR}" y2="${y}"
            stroke="rgba(124,58,237,0.07)" stroke-width="1"/>
      <text x="${padL - 8}" y="${y + 4}" text-anchor="end"
            font-family="var(--font)" font-size="11" fill="#9ca3af">${val}k</text>`;
  }

  /* Bars */
  let barsHTML = '';
  data.values.forEach((val, i) => {
    const x       = padL + gap * i + gap / 2 - barW / 2;
    const barH    = (val / maxVal) * chartH;
    const y       = padT + chartH - barH;
    const gradId  = `barGrad${i}`;
    const fmtVal  = '₱' + val.toLocaleString('en-PH');

    barsHTML += `
      <defs>
        <linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stop-color="#7c3aed"/>
          <stop offset="100%" stop-color="#8b0000"/>
        </linearGradient>
      </defs>
      <rect class="bar-rect" x="${x}" y="${y}" width="${barW}" height="${barH}"
            rx="5" fill="url(#${gradId})"
            data-label="${data.labels[i]}" data-val="${fmtVal}"
            onmouseenter="showTooltip(event,'${data.labels[i]}: ${fmtVal}')"
            onmousemove="moveTooltip(event)"
            onmouseleave="hideTooltip()"/>
      <text x="${x + barW / 2}" y="${padT + chartH + 18}" text-anchor="middle"
            font-family="var(--font)" font-size="12" fill="#6b7280" font-weight="600">
        ${data.labels[i]}
      </text>`;
  });

  svg.innerHTML = gridHTML + barsHTML;
}

/* ── Period buttons ── */
function setPeriod(period) {
  activePeriod = period;
  document.querySelectorAll('.period-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.period === period);
  });
  drawBarChart(period);
}

/* ── Draw donut chart ── */
function drawDonut() {
  const occupied   = 75;
  const vacant     = 25;
  const cx = 80, cy = 80, r = 58, strokeW = 18;
  const circ = 2 * Math.PI * r;

  const occupiedDash = (occupied / 100) * circ;
  const vacantDash   = (vacant   / 100) * circ;
  const gap          = 3;

  /* Start from top (-90 deg) */
  const rotateOccupied = -90;
  const rotateVacant   = rotateOccupied + (occupied / 100) * 360 + (gap / circ * 360);

  document.getElementById('donut-svg').innerHTML = `
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none"
            stroke="#f0edff" stroke-width="${strokeW}"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none"
            stroke="url(#donutGrad)" stroke-width="${strokeW}"
            stroke-dasharray="${occupiedDash - gap} ${circ - occupiedDash + gap}"
            stroke-dashoffset="${circ * 0.25}"
            stroke-linecap="round"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none"
            stroke="#e5e7eb" stroke-width="${strokeW}"
            stroke-dasharray="${vacantDash - gap} ${circ - vacantDash + gap}"
            stroke-dashoffset="${circ * 0.25 - occupiedDash}"
            stroke-linecap="round"/>
    <defs>
      <linearGradient id="donutGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%"   stop-color="#7c3aed"/>
        <stop offset="100%" stop-color="#8b0000"/>
      </linearGradient>
    </defs>
    <text x="${cx}" y="${cy - 8}" text-anchor="middle"
          font-family="var(--font)" font-size="22" font-weight="800" fill="#1e1b4b">
      ${occupied}%
    </text>
    <text x="${cx}" y="${cy + 14}" text-anchor="middle"
          font-family="var(--font)" font-size="11" font-weight="600" fill="#6b7280">
      Occupied
    </text>`;
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', () => {
  drawBarChart(activePeriod);
  drawDonut();

  /* Period buttons */
  document.querySelectorAll('.period-btn').forEach(btn => {
    btn.addEventListener('click', () => setPeriod(btn.dataset.period));
  });

  /* Sidebar overlay */
  const overlay = document.getElementById('overlay');
  if (overlay) {
    overlay.addEventListener('click', () => {
      document.getElementById('sidebar').classList.remove('open');
      overlay.classList.remove('active');
    });
  }
});