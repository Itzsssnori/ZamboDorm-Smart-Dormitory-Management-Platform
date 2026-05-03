// ── DATA (from admin-room.js, enriched with multiple photos) ──────────────────
let GALLERY = [
  {id:'100',type:'Double',capacity:2,rate:4500,floor:'1st Floor',wing:'Block A',amenities:['Aircon','Private Bath','Study Desk'],photos:['../images/room/Twin Boys Bedroom Ideas For Small Room_ 7 Smart_...jpeg','../images/room/Shared Bedroom Ideas To Maximize Space And Style.jpeg'],tenants:2,desc:'Fully furnished double room with private bath and aircon on the ground floor.'},
  {id:'101',type:'Double',capacity:2,rate:4500,floor:'1st Floor',wing:'Block A',amenities:['Fan','Shared Bath','Study Desk'],photos:['../images/room/Shared Room Makeover _ Boy & Girl Edition.jpeg'],tenants:1,desc:'Comfortable double room with study desk. Shared bathroom on the floor.'},
  {id:'102',type:'Double',capacity:2,rate:4200,floor:'1st Floor',wing:'Block A',amenities:['Fan','Shared Bath'],photos:['../images/room/IMG_9235.JPG'],tenants:0,desc:'Budget-friendly double room, ideal for students looking for affordable accommodation.'},
  {id:'103',type:'Double',capacity:2,rate:4500,floor:'1st Floor',wing:'Block B',amenities:['Aircon','Private Bath','Study Desk','Wifi'],photos:['../images/room/IMG_9236.WEBP','../images/room/IMG_9237.JPG'],tenants:2,desc:'Premium double room with all amenities including WiFi and private bathroom.'},
  {id:'104',type:'Double',capacity:2,rate:4000,floor:'1st Floor',wing:'Block B',amenities:['Fan','Shared Bath'],photos:['../images/room/IMG_9238.JPG'],tenants:0,desc:'Standard double room, clean and spacious with natural lighting.'},
  {id:'105',type:'Double',capacity:2,rate:4500,floor:'1st Floor',wing:'Block B',amenities:['Aircon','Shared Bath','Study Desk'],photos:['../images/room/IMG_9239.JPG','../images/room/IMG_9240.JPG'],tenants:1,desc:'Modern double room with aircon and study desk. One slot remaining.'},
  {id:'106',type:'Double',capacity:2,rate:4800,floor:'2nd Floor',wing:'Block A',amenities:['Aircon','Private Bath','Study Desk','Wifi','Ref'],photos:['../images/room/IMG_9241.JPG','../images/room/IMG_9242.WEBP'],tenants:2,desc:'Premium deluxe room with refrigerator, WiFi, private bath, and aircon.'},
  {id:'107',type:'Single',capacity:1,rate:3500,floor:'2nd Floor',wing:'Block A',amenities:['Fan','Private Bath'],photos:['../images/room/Small room inspo ✨.jpeg'],tenants:0,desc:'Cozy single room with private bath, perfect for students who value privacy.'},
  {id:'108',type:'Single',capacity:1,rate:3800,floor:'2nd Floor',wing:'Block A',amenities:['Aircon','Shared Bath','Study Desk'],photos:['../images/room/small room.jpeg','../images/room/My dream room by chatgpt.jpeg'],tenants:1,desc:'Single room with aircon and study area. Currently has 1 occupant.'},
  {id:'109',type:'Double',capacity:2,rate:4500,floor:'2nd Floor',wing:'Block B',amenities:['Aircon','Private Bath','Study Desk','Wifi'],photos:['../images/room/IMG_9243.JPG','../images/room/IMG_9244.JPG'],tenants:2,desc:'Well-lit double room on the second floor with complete amenities.'},
  {id:'110',type:'Double',capacity:2,rate:3800,floor:'2nd Floor',wing:'Block B',amenities:['Fan','Shared Bath'],photos:['../images/room/IMG_9245.JPG'],tenants:0,desc:'Affordable double room. Spacious with good ventilation.'},
  {id:'111',type:'Double',capacity:2,rate:4200,floor:'2nd Floor',wing:'Block B',amenities:['Fan','Shared Bath','Study Desk'],photos:['../images/room/Massachusetts One-Month Room Renting Guide.jpeg','../images/room/Quarto infantil.jpeg'],tenants:1,desc:'Double room with study desk. One slot available.'},
];

let currentFilter='all', editingId=null, confirmCallback=null;
let lbPhotos=[], lbIndex=0;
let pendingPhotos=[]; // for add/edit modal
let uploadPending=[]; // for upload modal
window.dormPendingPhotos=[]; // for dorm application photos
window.dormPendingDocuments=[]; // for dorm application documents
let DORM_APPLICATIONS = []; // store dorm applications
let currentDormFilter = 'all'; // track dorm filter

// ── DORM DATA ────────────────────────────────────────────────────────────────
let DORMS = [
  {id:'DORM-001',name:'Prime Student Housing',location:'Downtown Campus, Block 1',admin:'John Doe',amenities:['WiFi','Common Lounge','Laundry','Gym'],totalRooms:6,capacity:12,status:'Approved',photos:['../images/dorm/IMG_9247.PNG'],submittedDate:'2024-01-15',approvalDate:'2024-02-01',desc:'Modern student housing with complete amenities near campus.',roomIds:['100','101','102','103','104','105']},
  {id:'DORM-002',name:'University Residences',location:'Uptown, Block 2',admin:'Maria Garcia',amenities:['WiFi','Cafeteria','Library','Sports Court'],totalRooms:8,capacity:16,status:'Approved',photos:['../images/dorm/IMG_9248.JPG'],submittedDate:'2024-01-20',approvalDate:'2024-02-10',desc:'Spacious residences with academic and recreational facilities.',roomIds:['106','107','108','109','110','111']},
  {id:'DORM-003',name:'Tech Hub Residence',location:'Innovation District',admin:'Carlos Santos',amenities:['WiFi','Study Rooms','PC Lab','Lounge'],totalRooms:4,capacity:8,status:'Approved',photos:['../images/dorm/IMG_9254.JPG'],submittedDate:'2024-01-25',approvalDate:'2024-02-15',desc:'Tech-focused dorm perfect for engineering and IT students.',roomIds:['100','102','104']},
  {id:'DORM-004',name:'North Campus Residences',location:'North Campus, Block A',admin:'Patricia Lee',amenities:['WiFi','Cafeteria','Gym','Basketball Court'],totalRooms:6,capacity:12,status:'Approved',photos:['../images/dorm/IMG_9258.WEBP'],submittedDate:'2024-02-01',approvalDate:'2024-02-20',desc:'Newly renovated dorms with modern amenities and friendly community.',roomIds:['101','103','105','107','109','111']},
  {id:'DORM-005',name:'South Campus Residences',location:'South Campus, Block C',admin:'Michael Chen',amenities:['WiFi','Study Center','Recreation Room','Parking'],totalRooms:5,capacity:10,status:'Approved',photos:['../images/dorm/IMG_9260.WEBP'],submittedDate:'2024-02-05',approvalDate:'2024-02-25',desc:'Comfortable residences with excellent facilities and great location.',roomIds:['102','104','106','108','110']},
];

let currentCategory = 'rooms'; // Track active category

// ── HELPERS ──────────────────────────────────────────────────────────────────
function fmtPHP(n){return '₱'+Number(n).toLocaleString('en-PH');}
function getStatus(r){if(r.tenants===0)return 'empty';if(r.tenants>=r.capacity)return 'full';return 'partial';}

// ── STATS ────────────────────────────────────────────────────────────────────
function renderStats(){
  document.getElementById('s-total').textContent     = GALLERY.length;
  document.getElementById('s-photos').textContent    = GALLERY.reduce((a,r)=>a+r.photos.length,0);
  document.getElementById('s-available').textContent = GALLERY.reduce((a,r)=>a+(r.capacity-r.tenants),0);
  document.getElementById('s-occupied').textContent  = GALLERY.filter(r=>r.tenants>0).length;
}

// ── GALLERY RENDER ────────────────────────────────────────────────────────────
function renderGallery(){
  const query  = document.getElementById('search').value.toLowerCase();
  const sort   = document.getElementById('sort-select').value;
  const grid   = document.getElementById('gallery-grid');

  let list = GALLERY.filter(r=>{
    const st = getStatus(r);
    const mf = currentFilter==='all'||st===currentFilter;
    const ms = !query||r.id.includes(query)||r.wing.toLowerCase().includes(query)||r.type.toLowerCase().includes(query)||r.floor.toLowerCase().includes(query);
    return mf&&ms;
  });

  list.sort((a,b)=>{
    if(sort==='rate-asc')  return a.rate-b.rate;
    if(sort==='rate-desc') return b.rate-a.rate;
    if(sort==='photos')    return b.photos.length-a.photos.length;
    return a.id.localeCompare(b.id,undefined,{numeric:true});
  });

  if(!list.length){
    grid.innerHTML=`<div class="empty-state" style="grid-column:1/-1"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg><h3>No rooms found</h3><p>Try changing your search or filter</p></div>`;
    return;
  }

  grid.innerHTML = list.map(r=>buildCard(r)).join('');
}

function buildCard(r){
  const st = getStatus(r);
  const sbClass = st==='full'?'gsb-full':st==='partial'?'gsb-partial':'gsb-empty';
  const sbLabel = st==='full'?`Occupied (${r.tenants}/${r.capacity})`:st==='partial'?`Partial (${r.tenants}/${r.capacity})`:`Available`;
  const cover   = r.photos[0]||'';
  const amenityHtml = r.amenities.slice(0,4).map(a=>`<span class="g-amenity">${a}</span>`).join('')+(r.amenities.length>4?`<span class="g-amenity">+${r.amenities.length-4}</span>`:'');

  // thumbnail strip (up to 3 extras + "+N more")
  const extras = r.photos.slice(1,4);
  const moreCount = r.photos.length-4;
  const thumbHtml = extras.map((p,i)=>`<div class="g-thumb" onclick="openLightbox('${r.id}',${i+1})"><img src="${p}" alt="Room ${r.id} photo ${i+2}" loading="lazy"/></div>`).join('')
    +(moreCount>0?`<div class="g-thumb-more" onclick="openLightbox('${r.id}',4)">+${moreCount}</div>`:'');

  const dormImages = [
    'https://images.unsplash.com/photo-1514432324607-2e467f4af445?w=500&h=400&fit=crop',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=400&fit=crop',
    'https://images.unsplash.com/photo-1540932239986-a128078c3020?w=500&h=400&fit=crop',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=400&fit=crop',
    'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=500&h=400&fit=crop'
  ];
  const defaultImg = dormImages[parseInt(r.id)|0 % dormImages.length];
  return `
    <div class="g-card" data-id="${r.id}">
      <div class="g-photo" onclick="openLightbox('${r.id}',0)">
        ${cover?`<img src="${cover}" alt="Room ${r.id}" loading="lazy"/>`:
          `<img src="${defaultImg}" alt="Room ${r.id}" loading="lazy" class="g-photo-default"/>`}
        <div class="g-photo-overlay">
          <button class="g-ov-btn" title="View photos" onclick="event.stopPropagation();openLightbox('${r.id}',0)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button>
          <button class="g-ov-btn" title="Upload photos" onclick="event.stopPropagation();openUploadFor('${r.id}')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg></button>
          <button class="g-ov-btn" title="Edit room" onclick="event.stopPropagation();openEditModal('${r.id}')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
        </div>
        <div class="g-room-badge">Room ${r.id}</div>
        <div class="g-status-badge ${sbClass}"><span class="gsb-dot"></span>${sbLabel}</div>
        ${r.photos.length>0?`<div class="g-count-badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>${r.photos.length} photo${r.photos.length!==1?'s':''}</div>`:''}
      </div>
      <div class="g-body" onclick="openRoomDetails('${r.id}')" style="cursor:pointer;transition:background 0.2s;">
        <div class="g-title-row">
          <span class="g-title">${r.floor} · ${r.wing}</span>
          <span class="g-type-tag">${r.type}</span>
        </div>
        <div class="g-meta">
          <span>${fmtPHP(r.rate)}/mo</span><span class="g-meta-sep"></span>
          <span>${r.capacity} bed${r.capacity>1?'s':''}</span><span class="g-meta-sep"></span>
          <span>${r.amenities.length} amenities</span>
        </div>
        <div class="g-amenity-row">${amenityHtml}</div>
      </div>
      ${r.photos.length>1?`<div class="g-thumbs">${thumbHtml}</div>`:''}
      <div class="g-footer">
        <div class="g-rate">${fmtPHP(r.rate)} <span>/month</span></div>
        <div class="g-actions">
          <button class="g-btn ghost" onclick="openUploadFor('${r.id}')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Photos
          </button>
          <button class="g-btn ghost" onclick="openEditModal('${r.id}')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Edit
          </button>
          <button class="g-btn danger" onclick="deleteRoom('${r.id}')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
            Delete
          </button>
        </div>
      </div>
    </div>`;
}

function setFilter(f,el){
  currentFilter=f;
  document.querySelectorAll('.filter-pill').forEach(p=>p.classList.remove('active'));
  el.classList.add('active');
  renderGallery();
}

// ── CATEGORY SWITCHING ──────────────────────────────────────────────────────
function switchCategory(cat, btn){
  currentCategory = cat;
  
  // Update button states
  document.querySelectorAll('.category-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  
  // Update add button text and behavior
  const addBtn = document.getElementById('add-btn-text');
  if(cat === 'rooms'){
    addBtn.textContent = 'Add Room';
  } else {
    addBtn.textContent = 'Add Dorm';
  }
  
  // Hide/show toolbars
  document.getElementById('toolbar-rooms').style.display = cat === 'rooms' ? 'flex' : 'none';
  document.getElementById('toolbar-dorms').style.display = cat === 'dorms' ? 'flex' : 'none';
  
  // Render appropriate gallery
  if(cat === 'rooms'){
    renderGallery();
  } else {
    renderDorms();
  }
}

// ── ADD CURRENT ITEM (Room or Dorm based on category) ────────────────────────
function addCurrentItem(){
  if(currentCategory === 'rooms'){
    openAddModal();
  } else {
    openAddDormModal();
  }
}

// ── DORM GALLERY RENDER ─────────────────────────────────────────────────────
function renderDorms(){
  const query = document.getElementById('search-dorms')?.value.toLowerCase() || '';
  const filter = currentDormFilter || 'all';
  const grid = document.getElementById('gallery-grid');
  
  let list = DORMS.filter(d => {
    const mf = filter === 'all' || d.status.toLowerCase() === filter;
    const ms = !query || d.name.toLowerCase().includes(query) || d.location.toLowerCase().includes(query) || d.admin.toLowerCase().includes(query);
    return mf && ms;
  });
  
  // Sort - newest first by default
  list.sort((a, b) => new Date(b.submittedDate) - new Date(a.submittedDate));
  
  if(!list.length){
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg><h3>No dorms found</h3><p>Try changing your search or filter</p></div>`;
    return;
  }
  
  grid.innerHTML = list.map(d => buildDormCard(d)).join('');
}

function buildDormCard(d){
  const cover = d.photos?.[0] || '';
  const amenityHtml = d.amenities.slice(0, 3).map(a => `<span class="g-amenity">${a}</span>`).join('') + (d.amenities.length > 3 ? `<span class="g-amenity">+${d.amenities.length - 3}</span>` : '');
  
  const dormImages = [
    'https://images.unsplash.com/photo-1514432324607-2e467f4af445?w=500&h=400&fit=crop',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=400&fit=crop',
    'https://images.unsplash.com/photo-1540932239986-a128078c3020?w=500&h=400&fit=crop',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=400&fit=crop',
    'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=500&h=400&fit=crop'
  ];
  const defaultImg = dormImages[parseInt(d.id.replace(/\D/g, '')) % dormImages.length];
  
  return `
    <div class="g-card">
      <div class="g-photo">
        ${cover ? `<img src="${cover}" alt="${d.name}" loading="lazy"/>` : `<img src="${defaultImg}" alt="${d.name}" loading="lazy" class="g-photo-default"/>`}
        <div class="g-room-badge">${d.status}</div>
      </div>
      <div class="g-body" style="cursor:pointer;" onclick="openDormDetails('${d.id}')">
        <div class="g-title-row">
          <span class="g-title">${d.name}</span>
        </div>
        <div class="g-meta">
          <span>${d.location}</span><span class="g-meta-sep"></span>
          <span>${d.totalRooms} rooms</span><span class="g-meta-sep"></span>
          <span>${d.capacity} beds</span>
        </div>
        <div class="g-amenity-row">${amenityHtml}</div>
      </div>
    </div>`;
}

function openDormDetails(dormId){
  const dorm = DORMS.find(d => d.id === dormId);
  if(!dorm) return;
  
  // Show details in a modal or toast
  alert(`${dorm.name}\n\nLocation: ${dorm.location}\nAdmin: ${dorm.admin}\nCapacity: ${dorm.capacity}\nRooms: ${dorm.totalRooms}\n\n${dorm.desc}`);
}

// ── DORM FILTER ─────────────────────────────────────────────────────────────
function setDormFilter(f, el){
  currentDormFilter = f;
  document.querySelectorAll('#toolbar-dorms .filter-pill').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  renderDorms();
}

// ── ROOM DETAILS MODAL ──────────────────────────────────────────────────────
let currentViewingRoomId = null;

function openRoomDetails(roomId){
  const room = GALLERY.find(r => r.id === roomId);
  if(!room) return;
  
  currentViewingRoomId = roomId;
  
  // Populate details
  document.getElementById('detail-room-title').textContent = `Room ${room.id}`;
  document.getElementById('detail-room-subtitle').textContent = `${room.floor} • ${room.wing}`;
  document.getElementById('detail-floor').textContent = room.floor || '--';
  document.getElementById('detail-wing').textContent = room.wing || '--';
  document.getElementById('detail-type').textContent = room.type || '--';
  document.getElementById('detail-capacity').textContent = `${room.capacity} bed${room.capacity > 1 ? 's' : ''}`;
  document.getElementById('detail-rate').textContent = fmtPHP(room.rate);
  document.getElementById('detail-occupancy').textContent = `${room.tenants}/${room.capacity} occupied`;
  document.getElementById('detail-description').textContent = room.desc || 'No description available';
  document.getElementById('detail-photo-count').textContent = room.photos.length;
  
  // Amenities
  const amenitiesHtml = room.amenities.map(a => `<span class="g-amenity">${a}</span>`).join('');
  document.getElementById('detail-amenities').innerHTML = amenitiesHtml || '<span style="color:var(--muted);">No amenities listed</span>';
  
  // Photos grid
  const photosGrid = document.getElementById('detail-photos-grid');
  photosGrid.innerHTML = room.photos.map((p, i) => `
    <div style="position:relative;overflow:hidden;border-radius:8px;aspect-ratio:1;cursor:pointer;" onclick="openLightbox('${roomId}',${i})">
      <img src="${p}" alt="Photo ${i+1}" style="width:100%;height:100%;object-fit:cover;"/>
      <div style="position:absolute;inset:0;background:rgba(0,0,0,0);transition:background 0.2s;" class="photo-hover"></div>
    </div>
  `).join('');
  
  // Open modal
  document.getElementById('modal-room-details').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeRoomDetails(){
  document.getElementById('modal-room-details').classList.remove('open');
  document.body.style.overflow = '';
  currentViewingRoomId = null;
}

// ── ADD / EDIT MODAL ─────────────────────────────────────────────────────────
function openAddModal(){
  editingId=null; pendingPhotos=[];
  document.getElementById('modal-room-title').textContent='Add New Room';
  document.getElementById('modal-room-sub').textContent='Fill in room details and upload photos';
  ['f-id','f-floor','f-wing','f-amenities','f-desc'].forEach(id=>document.getElementById(id).value='');
  document.getElementById('f-rate').value='';
  document.getElementById('f-type').value='Double';
  document.getElementById('f-cap').value='2';
  renderPhotoPreview();
  document.getElementById('modal-room').classList.add('open');
  document.body.style.overflow='hidden';
}

function openEditModal(id){
  const r=GALLERY.find(x=>x.id===id);if(!r)return;
  editingId=id; pendingPhotos=[...r.photos];
  document.getElementById('modal-room-title').textContent=`Edit Room ${id}`;
  document.getElementById('modal-room-sub').textContent='Update room details and photos';
  document.getElementById('f-id').value=r.id;
  document.getElementById('f-type').value=r.type;
  document.getElementById('f-floor').value=r.floor;
  document.getElementById('f-wing').value=r.wing;
  document.getElementById('f-rate').value=r.rate;
  document.getElementById('f-cap').value=String(r.capacity);
  document.getElementById('f-amenities').value=r.amenities.join(', ');
  document.getElementById('f-desc').value=r.desc||'';
  renderPhotoPreview();
  document.getElementById('modal-room').classList.add('open');
  document.body.style.overflow='hidden';
}

function closeRoomModal(){
  document.getElementById('modal-room').classList.remove('open');
  document.body.style.overflow='';
  editingId=null; pendingPhotos=[];
}

function renderPhotoPreview(){
  const wrap=document.getElementById('photo-preview');
  wrap.innerHTML=pendingPhotos.map((p,i)=>`
    <div class="up-item">
      <img src="${p}" alt="Photo ${i+1}" loading="lazy"/>
      <button class="up-remove" onclick="removePhoto(${i})"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
    </div>`).join('')
    +`<div class="up-add" onclick="document.getElementById('photo-file-input').click()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg><span>Add Photo</span></div>`;
}

function removePhoto(i){pendingPhotos.splice(i,1);renderPhotoPreview();}

function handlePhotoFiles(input){
  // In a real app, upload to server; here we create object URLs
  [...input.files].forEach(f=>{
    const url=URL.createObjectURL(f);
    pendingPhotos.push(url);
  });
  renderPhotoPreview();
  input.value='';
}

function saveRoom(){
  const id    = document.getElementById('f-id').value.trim();
  const type  = document.getElementById('f-type').value;
  const floor = document.getElementById('f-floor').value.trim();
  const wing  = document.getElementById('f-wing').value.trim();
  const rate  = parseInt(document.getElementById('f-rate').value)||0;
  const cap   = parseInt(document.getElementById('f-cap').value)||2;
  const amen  = document.getElementById('f-amenities').value.split(',').map(s=>s.trim()).filter(Boolean);
  const desc  = document.getElementById('f-desc').value.trim();

  if(!id||!rate){showToast('⚠️ Room number and rate are required.');return;}

  if(editingId){
    const idx=GALLERY.findIndex(r=>r.id===editingId);
    if(idx!==-1){GALLERY[idx]={...GALLERY[idx],id,type,floor,wing,rate,capacity:cap,amenities:amen,desc,photos:pendingPhotos};}
    showToast(`✅ Room ${id} updated!`);
  } else {
    if(GALLERY.find(r=>r.id===id)){showToast(`⚠️ Room ${id} already exists.`);return;}
    GALLERY.push({id,type,capacity:cap,rate,floor,wing,amenities:amen,photos:pendingPhotos,tenants:0,desc});
    showToast(`✅ Room ${id} added!`);
  }
  closeRoomModal();
  renderStats();renderGallery();populateUploadSelect();
}

// ── UPLOAD PHOTOS MODAL ───────────────────────────────────────────────────────
function populateUploadSelect(){
  const sel=document.getElementById('upload-room-select');
  sel.innerHTML=GALLERY.map(r=>`<option value="${r.id}">Room ${r.id} – ${r.floor}, ${r.wing}</option>`).join('');
}

function openUploadModal(){
  uploadPending=[];
  populateUploadSelect();
  document.getElementById('upload-preview').innerHTML='';
  document.getElementById('modal-upload').classList.add('open');
  document.body.style.overflow='hidden';
}

function openUploadFor(id){
  uploadPending=[];
  populateUploadSelect();
  document.getElementById('upload-room-select').value=id;
  document.getElementById('upload-preview').innerHTML='';
  document.getElementById('modal-upload').classList.add('open');
  document.body.style.overflow='hidden';
}

function closeUploadModal(){
  document.getElementById('modal-upload').classList.remove('open');
  document.body.style.overflow=''; uploadPending=[];
}

function renderUploadPreview(){
  const wrap=document.getElementById('upload-preview');
  wrap.innerHTML=uploadPending.map((p,i)=>`
    <div class="up-item">
      <img src="${p}" alt="Upload ${i+1}"/>
      <button class="up-remove" onclick="uploadPending.splice(${i},1);renderUploadPreview()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
    </div>`).join('');
}

function handleUploadFiles(input){
  [...input.files].forEach(f=>uploadPending.push(URL.createObjectURL(f)));
  renderUploadPreview(); input.value='';
}

function handleDrag(e,entering){
  e.preventDefault();
  document.getElementById('upload-drop').classList.toggle('dragover',entering);
}

function handleDrop(e){
  e.preventDefault();
  document.getElementById('upload-drop').classList.remove('dragover');
  [...e.dataTransfer.files].filter(f=>f.type.startsWith('image/')).forEach(f=>uploadPending.push(URL.createObjectURL(f)));
  renderUploadPreview();
}

function saveUploadedPhotos(){
  const id=document.getElementById('upload-room-select').value;
  if(!uploadPending.length){showToast('⚠️ Please select at least one photo.');return;}
  const r=GALLERY.find(x=>x.id===id);
  if(r){r.photos=[...r.photos,...uploadPending];showToast(`✅ ${uploadPending.length} photo${uploadPending.length!==1?'s':''} added to Room ${id}!`);}
  closeUploadModal();
  renderStats();renderGallery();
}

// ── DELETE ─────────────────────────────────────────────────────────────────────
function deleteRoom(id){
  const r=GALLERY.find(x=>x.id===id);
  openConfirm(`Delete Room ${id}?`,`This will permanently remove Room ${id} and all its ${r?r.photos.length:0} photos. This cannot be undone.`,()=>{
    GALLERY=GALLERY.filter(x=>x.id!==id);
    renderStats();renderGallery();populateUploadSelect();
    showToast(`🗑️ Room ${id} deleted.`);
  });
}

// ── LIGHTBOX ──────────────────────────────────────────────────────────────────
function openLightbox(roomId,index){
  const r=GALLERY.find(x=>x.id===roomId);if(!r||!r.photos.length)return;
  lbPhotos=r.photos; lbIndex=index;
  updateLightbox();
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow='hidden';
}
function updateLightbox(){
  document.getElementById('lb-img').src=lbPhotos[lbIndex];
  document.getElementById('lb-caption').textContent=`${lbIndex+1} / ${lbPhotos.length}`;
}
function lbNav(dir){lbIndex=(lbIndex+dir+lbPhotos.length)%lbPhotos.length;updateLightbox();}
function closeLightbox(){document.getElementById('lightbox').classList.remove('open');document.body.style.overflow='';}

// ── DORM LIGHTBOX ─────────────────────────────────────────────────────────────
let dormLbPhotos=[],  dormLbIndex=0;
function openDormLightbox(dormId,index){
  const d=DORMS.find(x=>x.id===dormId);if(!d||!d.photos.length)return;
  dormLbPhotos=d.photos; dormLbIndex=index;
  updateDormLightbox();
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow='hidden';
}
function updateDormLightbox(){
  document.getElementById('lb-img').src=dormLbPhotos[dormLbIndex];
  document.getElementById('lb-caption').textContent=`${dormLbIndex+1} / ${dormLbPhotos.length}`;
  lbPhotos=dormLbPhotos;lbIndex=dormLbIndex;
}

// ── CONFIRM ──────────────────────────────────────────────────────────────────
function openConfirm(title,msg,cb){
  document.getElementById('confirm-title').textContent=title;
  document.getElementById('confirm-msg').textContent=msg;
  confirmCallback=cb;
  document.getElementById('confirm-overlay').classList.add('open');
}
function closeConfirm(){document.getElementById('confirm-overlay').classList.remove('open');}
function confirmOk(){closeConfirm();if(confirmCallback)confirmCallback();}

// ── TOAST ────────────────────────────────────────────────────────────────────
function showToast(msg,dur=3200){
  const t=document.getElementById('toast');
  document.getElementById('toast-msg').textContent=msg;
  t.classList.add('show');clearTimeout(t._t);
  t._t=setTimeout(()=>t.classList.remove('show'),dur);
}

// ── ADD DORM MODAL ───────────────────────────────────────────────────────────
function openAddDormModal(){
  // Auto-fill readonly fields from user data
  const user = UserManager.getUser();
  if(user){
    document.getElementById('d-owner').value = user.name || '';
    document.getElementById('d-email').value = user.email || '';
    document.getElementById('d-phone').value = user.phone || '';
    document.getElementById('d-address').value = user.address || '';
  }
  
  // Clear editable fields
  ['d-name','d-location','d-dorm-phone','d-amenities','d-description'].forEach(id=>document.getElementById(id).value='');
  document.getElementById('d-total-rooms').value='';
  document.getElementById('d-capacity').value='';
  dormPendingPhotos=[];
  dormPendingDocuments=[];
  renderDormPhotoPreview();
  renderDormDocumentsPreview();
  document.getElementById('modal-dorm').classList.add('open');
  document.body.style.overflow='hidden';
}

function closeAddDormModal(){
  document.getElementById('modal-dorm').classList.remove('open');
  document.body.style.overflow='';
  dormPendingPhotos=[];
  dormPendingDocuments=[];
}

function renderDormPhotoPreview(){
  const wrap=document.getElementById('dorm-photo-preview');
  wrap.innerHTML=dormPendingPhotos.map((p,i)=>`
    <div class="up-item">
      <img src="${p}" alt="Dorm Photo ${i+1}" loading="lazy"/>
      <button class="up-remove" onclick="removeDormPhoto(${i})"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
    </div>`).join('')
    +`<div class="up-add" onclick="document.getElementById('dorm-photo-file-input').click()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg><span>Add Photo</span></div>`;
}

function removeDormPhoto(i){
  dormPendingPhotos.splice(i,1);
  renderDormPhotoPreview();
}

function handleDormPhotoFiles(input){
  [...input.files].forEach(f=>{
    const url=URL.createObjectURL(f);
    dormPendingPhotos.push(url);
  });
  renderDormPhotoPreview();
  input.value='';
}

function renderDormDocumentsPreview(){
  const wrap=document.getElementById('dorm-documents-preview');
  wrap.innerHTML=dormPendingDocuments.map((d,i)=>`
    <div class="up-item">
      <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,var(--primary),var(--secondary));border-radius:6px;color:white;font-weight:600;font-size:0.9rem;text-align:center;padding:0.75rem;overflow:hidden;">
        <span style="word-break:break-all;">${d.name.substring(0,20)}${d.name.length>20?'...':''}</span>
      </div>
      <button class="up-remove" onclick="removeDormDocument(${i})"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
    </div>`).join('')
    +`<div class="up-add" onclick="document.getElementById('dorm-documents-file-input').click()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"/><polyline points="13 2 13 9 20 9"/></svg><span>Add Document</span></div>`;
}

function removeDormDocument(i){
  dormPendingDocuments.splice(i,1);
  renderDormDocumentsPreview();
}

function handleDormDocumentFiles(input){
  [...input.files].forEach(f=>{
    dormPendingDocuments.push({
      name: f.name,
      type: f.type,
      size: f.size,
      file: f
    });
  });
  renderDormDocumentsPreview();
  input.value='';
}

function loadDormApplications(){
  const apps = localStorage.getItem('zambodorm_dorm_applications');
  return apps ? JSON.parse(apps) : [];
}

function saveDormApplications(apps){
  localStorage.setItem('zambodorm_dorm_applications', JSON.stringify(apps));
}

function submitDormApplication(){
  const name = document.getElementById('d-name').value.trim();
  const location = document.getElementById('d-location').value.trim();
  const dormPhone = document.getElementById('d-dorm-phone').value.trim();
  const email = document.getElementById('d-email').value.trim();
  const phone = document.getElementById('d-phone').value.trim();
  const owner = document.getElementById('d-owner').value.trim();
  const address = document.getElementById('d-address').value.trim();
  const totalRooms = parseInt(document.getElementById('d-total-rooms').value)||0;
  const capacity = parseInt(document.getElementById('d-capacity').value)||0;
  const amenities = document.getElementById('d-amenities').value.split(',').map(s=>s.trim()).filter(Boolean);
  const description = document.getElementById('d-description').value.trim();

  // Validate required fields
  if(!name||!location||!dormPhone||!totalRooms||!capacity){
    showToast('⚠️ Please fill in all required fields (dorm name, location, phone, rooms, capacity).');
    return;
  }
  
  // Validate documents uploaded
  if(dormPendingDocuments.length === 0){
    showToast('⚠️ Please upload at least one document (permit, proof of ownership, etc.).');
    return;
  }
  
  // Validate photos uploaded
  if(dormPendingPhotos.length === 0){
    showToast('⚠️ Please upload at least one photo of your dorm.');
    return;
  }

  // Format document info for storage
  const documents = dormPendingDocuments.map(d => ({
    name: d.name,
    type: d.type,
    size: d.size
  }));

  // Create application object
  const application = {
    id: 'DORM-' + Date.now(),
    status: 'Pending',
    submittedDate: new Date().toLocaleDateString('en-PH'),
    submittedTime: new Date().toLocaleTimeString('en-PH'),
    dormName: name,
    dormLocation: location,
    dormPhone: dormPhone,
    totalRooms: totalRooms,
    capacity: capacity,
    amenities: amenities,
    description: description,
    photos: dormPendingPhotos,
    documents: documents,
    // Admin info (readonly from account)
    adminName: owner,
    adminEmail: email,
    adminPhone: phone,
    adminAddress: address
  };

  // Load existing apps and add new one
  const apps = loadDormApplications();
  apps.push(application);
  saveDormApplications(apps);
  
  // Also save to sysAdmin pending dorm applications
  const sysAdminDorms = localStorage.getItem('zambodorm_pending_dorms');
  const pendingDorms = sysAdminDorms ? JSON.parse(sysAdminDorms) : [];
  pendingDorms.push(application);
  localStorage.setItem('zambodorm_pending_dorms', JSON.stringify(pendingDorms));
  
  showToast(`✅ Dorm application "${name}" submitted! Awaiting system admin approval.`);
  closeAddDormModal();
  
  // Log for demonstration
  console.log('New Dorm Application:', application);
  console.log('All Applications:', apps);
  console.log('Pending for SysAdmin:', pendingDorms);
}

// ── KEYBOARD ─────────────────────────────────────────────────────────────────
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){closeLightbox();closeConfirm();closeRoomModal();closeUploadModal();closeAddDormModal();}
  if(document.getElementById('lightbox').classList.contains('open')){
    if(e.key==='ArrowLeft')lbNav(-1);
    if(e.key==='ArrowRight')lbNav(1);
  }
});

// ── INIT ─────────────────────────────────────────────────────────────────────
// Load existing dorm applications on page load
const initialDormApps = loadDormApplications();
console.log('Loaded Dorm Applications from Storage:', initialDormApps);

// Initialize counts
document.getElementById('rooms-count').textContent = '(' + GALLERY.length + ')';
document.getElementById('dorms-count').textContent = '(' + DORMS.filter(d => d.status === 'Approved').length + ')';

// Initial render (rooms by default)
renderStats();
renderGallery();
populateUploadSelect();
