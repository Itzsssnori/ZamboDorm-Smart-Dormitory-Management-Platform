// ── DATA ──────────────────────────────────────────────────────────────────────
const DORM_IMAGES = [
  'https://images.unsplash.com/photo-1514432324607-2e467f4af445?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1540932239986-a128078c3020?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=600&h=400&fit=crop'
];

const ROOMS = [
  {
    id:'100', type:'Double', capacity:2, rate:4500,
    photo:DORM_IMAGES[0],
    floor:'1st Floor', wing:'Block A',
    amenities:['Aircon','Private Bath','Study Desk'],
    tenants:[
      {id:1,name:'Aila May Natividad',initials:'AN',course:'BS Nursing',year:'3rd Year',school:'WMSU',bed:'Lower Bunk',joinDate:'Feb 21, 2025',status:'active',phone:'09171234567',email:'aila@email.com',deposit:15000},
      {id:2,name:'KC Charmelle Lagare',initials:'KL',course:'BS Education',year:'2nd Year',school:'ADZU',bed:'Upper Bunk',joinDate:'Dec 15, 2024',status:'notice',phone:'09182345678',email:'kc@email.com',deposit:5000},
    ]
  },
  {
    id:'101', type:'Double', capacity:2, rate:4500,
    photo:DORM_IMAGES[1], floor:'1st Floor', wing:'Block A',
    amenities:['Fan','Shared Bath','Study Desk'],
    tenants:[
      {id:3,name:'Norielle John Buhawe',initials:'NB',course:'BS Computer Science',year:'4th Year',school:'WMSU',bed:'Lower Bunk',joinDate:'Jan 20, 2025',status:'active',phone:'09193456789',email:'norielle@email.com',deposit:10000},
    ]
  },
  {
    id:'102', type:'Double', capacity:2, rate:4200,
    photo:DORM_IMAGES[2], floor:'1st Floor', wing:'Block A',
    amenities:['Fan','Shared Bath'],
    tenants:[]
  },
  {
    id:'103', type:'Double', capacity:2, rate:4500,
    photo:DORM_IMAGES[3], floor:'1st Floor', wing:'Block B',
    amenities:['Aircon','Private Bath','Study Desk','Wifi'],
    tenants:[
      {id:4,name:'Maria Santos',initials:'MS',course:'BS Accountancy',year:'3rd Year',school:'ZamPen',bed:'Lower Bunk',joinDate:'Mar 1, 2025',status:'active',phone:'09204567890',email:'maria@email.com',deposit:8000},
      {id:5,name:'Gina Reyes',initials:'GR',course:'BS Tourism',year:'2nd Year',school:'WMSU',bed:'Upper Bunk',joinDate:'Nov 5, 2024',status:'active',phone:'09226789012',email:'gina@email.com',deposit:7000},
    ]
  },
  {
    id:'104', type:'Double', capacity:2, rate:4000,
    photo:DORM_IMAGES[4], floor:'1st Floor', wing:'Block B',
    amenities:['Fan','Shared Bath'],
    tenants:[]
  },
  {
    id:'105', type:'Double', capacity:2, rate:4500,
    photo:DORM_IMAGES[0], floor:'1st Floor', wing:'Block B',
    amenities:['Aircon','Shared Bath','Study Desk'],
    tenants:[
      {id:6,name:'Leilani Gomez',initials:'LG',course:'BS Psychology',year:'1st Year',school:'ZamPen',bed:'Lower Bunk',joinDate:'Mar 10, 2025',status:'active',phone:'09248901234',email:'leilani@email.com',deposit:11000},
    ]
  },
  {
    id:'106', type:'Double', capacity:2, rate:4800,
    photo:DORM_IMAGES[1], floor:'2nd Floor', wing:'Block A',
    amenities:['Aircon','Private Bath','Study Desk','Wifi','Ref'],
    tenants:[
      {id:7,name:'Ramon Flores',initials:'RF',course:'BS Architecture',year:'4th Year',school:'Ateneo de Zamboanga',bed:'Lower Bunk',joinDate:'Feb 14, 2025',status:'active',phone:'09237890123',email:'ramon@email.com',deposit:9000},
      {id:8,name:'Jose Dela Cruz',initials:'JD',course:'BS Engineering',year:'2nd Year',school:'WMSU',bed:'Upper Bunk',joinDate:'Jan 10, 2025',status:'active',phone:'09215678901',email:'jose@email.com',deposit:12000},
    ]
  },
  {
    id:'107', type:'Single', capacity:1, rate:3500,
    photo:DORM_IMAGES[2], floor:'2nd Floor', wing:'Block A',
    amenities:['Fan','Private Bath'],
    tenants:[]
  },
  {
    id:'108', type:'Single', capacity:1, rate:3800,
    photo:DORM_IMAGES[3], floor:'2nd Floor', wing:'Block A',
    amenities:['Aircon','Shared Bath','Study Desk'],
    tenants:[
      {id:9,name:'Sherwin Hernandez',initials:'SH',course:'BS Information Technology',year:'3rd Year',school:'WMSU',bed:'Single Bed',joinDate:'Feb 10, 2025',status:'active',phone:'09171111222',email:'sherwin@email.com',deposit:10000},
    ]
  },
  {
    id:'109', type:'Double', capacity:2, rate:4500,
    photo:DORM_IMAGES[4], floor:'2nd Floor', wing:'Block B',
    amenities:['Aircon','Private Bath','Study Desk','Wifi'],
    tenants:[
      {id:10,name:'Fay Lim',initials:'FL',course:'BS Nursing',year:'3rd Year',school:'ADZU',bed:'Lower Bunk',joinDate:'Aug 1, 2025',status:'active',phone:'09172223334',email:'fay@email.com',deposit:8500},
      {id:11,name:'Ana Cruz',initials:'AC',course:'BS Midwifery',year:'1st Year',school:'WMSU',bed:'Upper Bunk',joinDate:'Mar 5, 2025',status:'active',phone:'09183334445',email:'ana@email.com',deposit:6000},
    ]
  },
  {
    id:'110', type:'Double', capacity:2, rate:3800,
    photo:DORM_IMAGES[0], floor:'2nd Floor', wing:'Block B',
    amenities:['Fan','Shared Bath'],
    tenants:[]
  },
  {
    id:'111', type:'Double', capacity:2, rate:4200,
    photo:DORM_IMAGES[1], floor:'2nd Floor', wing:'Block B',
    amenities:['Fan','Shared Bath','Study Desk'],
    tenants:[
      {id:12,name:'Rosa Buhawe',initials:'RB',course:'BS Social Work',year:'4th Year',school:'WMSU',bed:'Lower Bunk',joinDate:'Sep 12, 2024',status:'notice',phone:'09194445556',email:'rosa@email.com',deposit:4500},
    ]
  },
];

let currentFilter = 'all';
let currentView   = 'grid';
let activeRoomId  = null;

// ── HELPERS ──────────────────────────────────────────────────────────────────
function getStatus(room){
  if(room.tenants.length === 0) return 'empty';
  if(room.tenants.length >= room.capacity) return 'full';
  return 'partial';
}
function ini(n){ const p=n.split(' '); return ((p[0][0]||'')+(p[p.length-1][0]||'')).toUpperCase(); }
function fmtPHP(n){ return '₱'+Number(n).toLocaleString('en-PH'); }

// ── STATS ─────────────────────────────────────────────────────────────────────
function renderStats(){
  const total    = ROOMS.length;
  const occupied = ROOMS.filter(r=>r.tenants.length>0).length;
  const available= ROOMS.reduce((a,r)=>a+(r.capacity-r.tenants.length),0);
  const tenants  = ROOMS.reduce((a,r)=>a+r.tenants.length,0);
  document.getElementById('s-total').textContent    = total;
  document.getElementById('s-occupied').textContent = occupied;
  document.getElementById('s-available').textContent= available;
  document.getElementById('s-tenants').textContent  = tenants;
}

// ── RENDER ROOMS ─────────────────────────────────────────────────────────────
function renderRooms(){
  const query = document.getElementById('search').value.toLowerCase();
  const grid  = document.getElementById('rooms-grid');
  grid.className = 'rooms-grid' + (currentView==='list'?' list-view':'');

  const filtered = ROOMS.filter(r=>{
    const status = getStatus(r);
    const matchFilter = currentFilter==='all' || status===currentFilter;
    const matchSearch = !query ||
      r.id.includes(query) ||
      r.tenants.some(t=>t.name.toLowerCase().includes(query));
    return matchFilter && matchSearch;
  });

  if(!filtered.length){
    grid.innerHTML=`<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--muted)">
      <div style="font-size:2rem;margin-bottom:.5rem">🔍</div>
      <p style="font-weight:700">No rooms found</p>
    </div>`;
    return;
  }

  grid.innerHTML = filtered.map(r=>buildCard(r)).join('');
}

function buildCard(r){
  const status = getStatus(r);
  const pct    = r.capacity>0 ? Math.round(r.tenants.length/r.capacity*100) : 0;
  const sbClass= status==='full'?'rsb-full':status==='partial'?'rsb-partial':'rsb-empty';
  const sbLabel= status==='full'?`Occupied (${r.tenants.length}/${r.capacity})`:status==='partial'?`Occupied (${r.tenants.length}/${r.capacity})`:`Available (0/${r.capacity})`;
  const occClass= status==='full'?'full':status==='partial'?'partial':'empty';

  const tenantSlots = [];
  for(let i=0;i<r.capacity;i++){
    const t = r.tenants[i];
    if(t){
      tenantSlots.push(`
        <div class="tenant-mini">
          <div class="tm-avatar">${t.initials}</div>
          <div class="tm-info">
            <div class="tm-name">${t.name}</div>
            <div class="tm-sub">${t.course} · ${t.school}</div>
          </div>
          <div class="tm-status"><span class="tm-badge ${t.status}">${t.status==='active'?'Active':'On Notice'}</span></div>
        </div>`);
    } else {
      tenantSlots.push(`
        <div class="empty-slot">
          <div class="es-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></div>
          <span class="es-text">Slot available</span>
        </div>`);
    }
  }

  return `
    <div class="room-card" onclick="openModal('${r.id}')">
      <div class="room-photo">
        ${r.photo ? `<img src="${r.photo}" alt="Room ${r.id}" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
        <div class="room-photo-placeholder" style="display:none;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <span>Room ${r.id}</span>
        </div>` : `
        <div class="room-photo-placeholder">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <span>Room ${r.id}</span>
        </div>`}
        <div class="room-num-badge">Room ${r.id}</div>
        <div class="room-status-badge ${sbClass}"><span class="rsb-dot"></span>${sbLabel}</div>
      </div>
      <div class="room-body">
        <div class="room-title-row">
          <span class="room-title">${r.floor} · ${r.wing}</span>
          <span class="room-type-tag">${r.type}</span>
        </div>
        <div class="room-occupancy-bar-wrap">
          <div class="occ-label"><span>Occupancy</span><span>${r.tenants.length}/${r.capacity} beds</span></div>
          <div class="occ-bar"><div class="occ-fill ${occClass}" style="width:${pct}%"></div></div>
        </div>
        <div class="tenant-profiles">${tenantSlots.join('')}</div>
      </div>
      <div class="room-footer">
        <div class="rf-rate">${fmtPHP(r.rate)} <span>/mo</span></div>
        <div class="rf-actions">
          <button class="rf-btn" title="Message tenants" onclick="event.stopPropagation();showToast('💬 Message sent!')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
          </button>
          <button class="rf-btn" title="View details" onclick="event.stopPropagation();openModal('${r.id}')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
        </div>
      </div>
    </div>`;
}

// ── MODAL ─────────────────────────────────────────────────────────────────────
function openModal(id){
  const r = ROOMS.find(x=>x.id===id);
  if(!r) return;
  activeRoomId = id;
  const status = getStatus(r);
  const sbLabel = status==='full'?`Occupied (${r.tenants.length}/${r.capacity})`:status==='partial'?`Partially Occupied (${r.tenants.length}/${r.capacity})`:`Available (0/${r.capacity})`;

  document.getElementById('modal-title').textContent = `Room ${r.id}`;
  document.getElementById('modal-sub').textContent   = `${r.floor} · ${r.wing} · ${r.type} Room`;

  const tenantCards = [];
  for(let i=0;i<r.capacity;i++){
    const t = r.tenants[i];
    if(t){
      tenantCards.push(`
        <div class="tenant-profile-card">
          <div class="tp-avatar">${t.initials}</div>
          <div class="tp-body">
            <div class="tp-name-row">
              <span class="tp-name">${t.name}</span>
              <span class="tp-status-badge ${t.status}">${t.status==='active'?'Active':'On Notice'}</span>
            </div>
            <div class="tp-meta">${t.course} · ${t.year} · ${t.school}</div>
            <div class="tp-details">
              <div class="tp-det"><div class="tp-det-label">Bed</div><div class="tp-det-val">${t.bed}</div></div>
              <div class="tp-det"><div class="tp-det-label">Join Date</div><div class="tp-det-val">${t.joinDate}</div></div>
              <div class="tp-det"><div class="tp-det-label">Phone</div><div class="tp-det-val">${t.phone}</div></div>
              <div class="tp-det"><div class="tp-det-label">Deposit</div><div class="tp-det-val">${fmtPHP(t.deposit)}</div></div>
            </div>
          </div>
        </div>`);
    } else {
      tenantCards.push(`
        <div class="modal-empty-slot">
          <div class="mes-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></div>
          <div class="mes-text">
            <strong>Slot Available</strong>
            <span>This bed is currently unoccupied</span>
          </div>
        </div>`);
    }
  }

  const amenityTags = r.amenities.map(a=>`<span style="display:inline-flex;align-items:center;gap:4px;background:var(--vsoft);color:var(--v);font-size:.72rem;font-weight:700;padding:.22rem .6rem;border-radius:6px;">${a}</span>`).join('');

  document.getElementById('modal-body').innerHTML = `
    <div class="modal-room-photo">
      <div class="modal-room-photo-placeholder">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        <span>Room ${r.id} · ${r.type}</span>
      </div>
      <div class="modal-room-num">Room ${r.id}</div>
    </div>

    <div class="modal-info-grid">
      <div class="mig-item"><div class="mig-label">Status</div><div class="mig-val v">${sbLabel}</div></div>
      <div class="mig-item"><div class="mig-label">Monthly Rate</div><div class="mig-val v">${fmtPHP(r.rate)}</div></div>
      <div class="mig-item"><div class="mig-label">Capacity</div><div class="mig-val">${r.capacity} bed${r.capacity>1?'s':''}</div></div>
      <div class="mig-item"><div class="mig-label">Floor</div><div class="mig-val">${r.floor}</div></div>
      <div class="mig-item"><div class="mig-label">Wing</div><div class="mig-val">${r.wing}</div></div>
      <div class="mig-item"><div class="mig-label">Room Type</div><div class="mig-val">${r.type}</div></div>
    </div>

    <div style="margin-bottom:1.25rem;">
      <div class="modal-section-title">Amenities</div>
      <div style="display:flex;flex-wrap:wrap;gap:.4rem;">${amenityTags}</div>
    </div>

    <div class="modal-section-title">Tenants (${r.tenants.length}/${r.capacity})</div>
    ${tenantCards.join('')}
  `;

  document.getElementById('room-modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(){
  document.getElementById('room-modal').classList.remove('open');
  document.body.style.overflow = '';
  activeRoomId = null;
}

// ── FILTER / VIEW ─────────────────────────────────────────────────────────────
function setFilter(f, el){
  currentFilter = f;
  document.querySelectorAll('.filter-pill').forEach(p=>p.classList.remove('active'));
  el.classList.add('active');
  renderRooms();
}

function setView(v, el){
  currentView = v;
  document.querySelectorAll('.vt-btn').forEach(b=>b.classList.remove('active'));
  el.classList.add('active');
  renderRooms();
}

// ── TOAST ─────────────────────────────────────────────────────────────────────
function showToast(msg, dur=3000){
  const t = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  t.classList.add('show');
  clearTimeout(t._t);
  t._t = setTimeout(()=>t.classList.remove('show'), dur);
}

// ── SIDEBAR MOBILE ────────────────────────────────────────────────────────────
function toggleSidebar(){
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('overlay').classList.toggle('active');
}

// ── MODAL CLOSE ON OVERLAY CLICK ─────────────────────────────────────────────
document.getElementById('room-modal').addEventListener('click', function(e){
  if(e.target === this) closeModal();
});

// ── INIT ──────────────────────────────────────────────────────────────────────
renderStats();
renderRooms();