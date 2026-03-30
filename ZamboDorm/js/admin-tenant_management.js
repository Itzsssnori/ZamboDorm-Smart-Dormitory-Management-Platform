'use strict';

let tenants = [
  { id:1, firstName:'Aila May',      lastName:'Natividad',  email:'aila@email.com',      phone:'09171234567', room:'102-B', deposit:15000, joinDate:'2025-02-21', status:'active',   occupation:'Student',  school:'WMSU',  emergency:'Maria Natividad – 09181234567' },
  { id:2, firstName:'KC Charmelle',  lastName:'Lagare',     email:'kc@email.com',         phone:'09182345678', room:'305-C', deposit:5000,  joinDate:'2024-12-15', status:'notice',   occupation:'Student',  school:'ADZU',  emergency:'Pedro Lagare – 09192345678' },
  { id:3, firstName:'Norielle John', lastName:'Buhawe',     email:'norielle@email.com',   phone:'09193456789', room:'210-A', deposit:10000, joinDate:'2025-01-20', status:'active',   occupation:'Employee', school:'N/A',   emergency:'Rosa Buhawe – 09203456789' },
  { id:4, firstName:'Al-shariff',     lastName:'Rojas Mateo',     email:'shariff@email.com',       phone:'09204567890', room:'101-A', deposit:8000,  joinDate:'2025-03-01', status:'active',   occupation:'Student',  school:'ZamPen',emergency:'Jose Santos – 09214567890' },
  { id:5, firstName:'Van Claude',        lastName:'Valeros',  email:'vanny@email.com',        phone:'09215678901', room:'203-B', deposit:12000, joinDate:'2025-01-10', status:'inactive', occupation:'Student',  school:'WMSU',  emergency:'Ana Cruz – 09225678901' },
  { id:6, firstName:'Sherwin',          lastName:'Fay',      email:'sherwinlovefay@email.com',        phone:'09226789012', room:'404-C', deposit:7000,  joinDate:'2024-11-05', status:'active',   occupation:'Employee', school:'N/A',   emergency:'Mario Reyes – 09236789012' },
  { id:7, firstName:'Fay',         lastName:'Lim',     email:'faylim@email.com',       phone:'09237890123', room:'302-A', deposit:9000,  joinDate:'2025-02-14', status:'notice',   occupation:'Student',  school:'Ateneo de Zamboanga',emergency:'Lita Flores – 09247890123' },
  { id:8, firstName:'Leilani',       lastName:'rian',      email:'leilani@email.com',     phone:'09248901234', room:'105-B', deposit:11000, joinDate:'2025-03-10', status:'active',   occupation:'Student',  school:'ZamPen',emergency:'Pedro Gomez – 09258901234' },
];

let applications = [
  { id:'A001', firstName:'Juan',  lastName:'dela Cruz', email:'juan@email.com',  phone:'09171112222', room:'Sunrise Residences – Room 201-A', rate:'₱4,500/mo', occupation:'Student',  school:'WMSU', moveIn:'2025-04-15', message:'Hello, I am a 2nd year engineering student looking for a quiet room close to campus. I am a non-smoker and keep a clean space.', appliedDate:'2025-03-28' },
  { id:'A002', firstName:'Ana',   lastName:'Reyes',     email:'ana@email.com',   phone:'09182223333', room:'Block B – Room 305-C',            rate:'₱3,800/mo', occupation:'Employee', school:'N/A',  moveIn:'2025-04-01', message:'I work nearby and need a comfortable long-term stay.',                                                                               appliedDate:'2025-03-27' },
  { id:'A003', firstName:'Carlo', lastName:'Mendoza',   email:'carlo@email.com', phone:'09193334444', room:'Block A – Room 102-B',            rate:'₱4,200/mo', occupation:'Student',  school:'ADZU', moveIn:'2025-05-01', message:'',                                                                                                                                    appliedDate:'2025-03-29' },
];

let nextId = 9, currentPage = 1, PAGE_SIZE = 6, filterStatus = 'all', searchQuery = '', selectedIds = new Set(), pendingDeleteId = null, editingId = null;

function ini(f,l){return((f[0]||'')+(l[0]||'')).toUpperCase();}
function fmtDate(s){if(!s)return'—';const d=new Date(s+'T00:00');return d.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});}
function fmtPHP(n){return'₱'+Number(n).toLocaleString('en-PH');}
function cap(s){return s.charAt(0).toUpperCase()+s.slice(1);}

function filtered(){
  return tenants.filter(t=>{
    const full=`${t.firstName} ${t.lastName} ${t.room} ${t.school||''}`.toLowerCase();
    return(!searchQuery||full.includes(searchQuery.toLowerCase()))&&(filterStatus==='all'||t.status===filterStatus);
  });
}

function renderTable(){
  const list=filtered(), totalPages=Math.max(1,Math.ceil(list.length/PAGE_SIZE));
  if(currentPage>totalPages)currentPage=totalPages;
  const slice=list.slice((currentPage-1)*PAGE_SIZE, currentPage*PAGE_SIZE);
  const tbody=document.getElementById('tenant-tbody');
  const empty=document.getElementById('empty-state');

  if(!list.length){tbody.innerHTML='';empty.style.display='block';}
  else{
    empty.style.display='none';
    tbody.innerHTML=slice.map(t=>`
      <tr data-id="${t.id}" class="${selectedIds.has(t.id)?'selected':''}">
        <td><input type="checkbox" class="row-check" data-id="${t.id}" ${selectedIds.has(t.id)?'checked':''} onchange="toggleSelect(${t.id})"></td>
        <td><div class="tenant-name-cell"><div class="tenant-avatar">${ini(t.firstName,t.lastName)}</div><div class="tenant-name-info"><strong>${t.firstName} ${t.lastName}</strong><span>${t.email}</span></div></div></td>
        <td><span class="room-pill">${t.room}</span></td>
        <td><span class="${t.deposit>=10000?'dep-green':'dep-low'}">${fmtPHP(t.deposit)}</span></td>
        <td class="date-cell">${fmtDate(t.joinDate)}</td>
        <td><span class="status-badge status-${t.status}">${cap(t.status)}</span></td>
        <td>
          <div class="actions-cell">
            <button class="act-btn" title="Message" onclick="openContactModal(${t.id},'msg')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></button>
            <button class="act-btn" title="Call" onclick="openContactModal(${t.id},'call')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.63 19 19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.64a16 16 0 0 0 6 6l.95-1.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 15z"/></svg></button>
            <button class="act-btn" title="View" onclick="openViewModal(${t.id})"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button>
            <div class="kebab-wrap">
              <button class="kebab-btn" onclick="toggleKebab(${t.id},event)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg></button>
              <div class="kebab-menu" id="kebab-${t.id}">
                <button class="km-item" onclick="openEditModal(${t.id});closeKebabs()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>Edit</button>
                <button class="km-item" onclick="changeStatus(${t.id},'${t.status==='active'?'notice':'active'}');closeKebabs()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>${t.status==='active'?'Set Notice':'Set Active'}</button>
                <div class="km-div"></div>
                <button class="km-item danger" onclick="openDeleteConfirm(${t.id});closeKebabs()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>Remove</button>
              </div>
            </div>
          </div>
        </td>
      </tr>`).join('');
  }
  renderPagination(list.length,totalPages);
  renderStats();
  renderBulkBar();
}

function renderStats(){
  document.getElementById('stat-total').textContent    = tenants.length;
  document.getElementById('stat-active').textContent   = tenants.filter(t=>t.status==='active').length;
  document.getElementById('stat-notice').textContent   = tenants.filter(t=>t.status==='notice').length;
  document.getElementById('stat-inactive').textContent = tenants.filter(t=>t.status==='inactive').length;
}

function renderPagination(total,totalPages){
  const info=document.getElementById('pagination-info'), ctrls=document.getElementById('pagination-controls');
  const s=Math.min((currentPage-1)*PAGE_SIZE+1,total), e=Math.min(currentPage*PAGE_SIZE,total);
  info.textContent=total===0?'No tenants found':`Showing ${s}–${e} of ${total} tenants`;
  let h=`<button class="page-btn" onclick="goPage(${currentPage-1})" ${currentPage<=1?'disabled':''}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg></button>`;
  for(let i=1;i<=totalPages;i++){
    if(totalPages>7&&i>3&&i<totalPages-1&&Math.abs(i-currentPage)>1){if(i===4||i===totalPages-2)h+=`<span class="page-btn" style="pointer-events:none;border:none;color:var(--text-muted)">…</span>`;continue;}
    h+=`<button class="page-btn ${i===currentPage?'active':''}" onclick="goPage(${i})">${i}</button>`;
  }
  h+=`<button class="page-btn" onclick="goPage(${currentPage+1})" ${currentPage>=totalPages?'disabled':''}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></button>`;
  ctrls.innerHTML=h;
}

function renderBulkBar(){
  const bar=document.getElementById('bulk-bar'),cnt=document.getElementById('bulk-count');
  if(selectedIds.size>0){bar.classList.add('visible');cnt.textContent=`${selectedIds.size} tenant${selectedIds.size>1?'s':''} selected`;}
  else bar.classList.remove('visible');
}

function renderApplicationsBadge(){
  const n=applications.length;
  ['app-badge','apps-count-badge','app-badge-pill'].forEach(id=>{const el=document.getElementById(id);if(el)el.textContent=n;});
  const banner=document.getElementById('applications-banner');
  if(banner)banner.style.display=n>0?'flex':'none';
  const txt=document.getElementById('app-banner-text');
  if(txt)txt.textContent=`${n} pending application${n!==1?'s':''} awaiting your review`;
}

function goPage(n){const t=Math.max(1,Math.ceil(filtered().length/PAGE_SIZE));currentPage=Math.max(1,Math.min(n,t));renderTable();}
function toggleSelect(id){if(selectedIds.has(id))selectedIds.delete(id);else selectedIds.add(id);renderBulkBar();const r=document.querySelector(`tr[data-id="${id}"]`);if(r)r.classList.toggle('selected',selectedIds.has(id));}
function selectAll(cb){const s=filtered().slice((currentPage-1)*PAGE_SIZE,currentPage*PAGE_SIZE);if(cb.checked)s.forEach(t=>selectedIds.add(t.id));else s.forEach(t=>selectedIds.delete(t.id));renderTable();}
function clearSelection(){selectedIds.clear();renderTable();}
function toggleKebab(id,e){e.stopPropagation();closeKebabs(id);const m=document.getElementById(`kebab-${id}`);if(m)m.classList.toggle('open');}
function closeKebabs(x){document.querySelectorAll('.kebab-menu.open').forEach(m=>{if(!x||m.id!==`kebab-${x}`)m.classList.remove('open');});}
document.addEventListener('click',()=>closeKebabs());
function changeStatus(id,s){const t=tenants.find(t=>t.id===id);if(!t)return;t.status=s;renderTable();showToast(`${t.firstName}'s status updated to ${cap(s)}`,'success');}

function openDeleteConfirm(id){const t=tenants.find(t=>t.id===id);if(!t)return;pendingDeleteId=id;document.getElementById('confirm-name').textContent=`${t.firstName} ${t.lastName}`;openModal('modal-confirm');}
function confirmDelete(){if(!pendingDeleteId)return;const t=tenants.find(t=>t.id===pendingDeleteId);tenants=tenants.filter(t=>t.id!==pendingDeleteId);selectedIds.delete(pendingDeleteId);pendingDeleteId=null;closeAllModals();renderTable();showToast(`${t?t.firstName+' '+t.lastName:'Tenant'} removed.`,'error');}

function openAddModal(){document.getElementById('add-form').reset();document.querySelectorAll('#add-form .mf-group.error').forEach(g=>g.classList.remove('error'));openModal('modal-add');}
function submitAddTenant(){
  const fields=[['add-firstname','fg-add-firstname'],['add-lastname','fg-add-lastname'],['add-email','fg-add-email'],['add-phone','fg-add-phone'],['add-room','fg-add-room'],['add-deposit','fg-add-deposit'],['add-joindate','fg-add-joindate']];
  let ok=true;
  fields.forEach(([fid,gid])=>{const el=document.getElementById(fid),fg=document.getElementById(gid);fg.classList.remove('error');if(!el.value.trim()){fg.classList.add('error');ok=false;}});
  if(!ok){showToast('Please fill in all required fields.','error');return;}
  const nt={id:nextId++,firstName:document.getElementById('add-firstname').value.trim(),lastName:document.getElementById('add-lastname').value.trim(),email:document.getElementById('add-email').value.trim(),phone:document.getElementById('add-phone').value.trim(),room:document.getElementById('add-room').value.trim(),deposit:parseInt(document.getElementById('add-deposit').value)||0,joinDate:document.getElementById('add-joindate').value,status:document.getElementById('add-status').value||'active',occupation:document.getElementById('add-occupation').value||'',school:document.getElementById('add-school').value.trim()||'N/A',emergency:document.getElementById('add-emergency').value.trim()||''};
  tenants.push(nt);
  currentPage=Math.max(1,Math.ceil(filtered().length/PAGE_SIZE));
  closeAllModals();renderTable();showToast(`${nt.firstName} ${nt.lastName} added successfully!`,'success');
}

function openEditModal(id){
  const t=tenants.find(t=>t.id===id);if(!t)return;editingId=id;
  ['firstname','lastname','email','phone','room','deposit','joindate','status','occupation','school','emergency'].forEach(k=>{
    const el=document.getElementById(`edit-${k}`);if(el)el.value=t[k==='joindate'?'joinDate':k===k?k:k]||'';
  });
  // map keys
  document.getElementById('edit-firstname').value=t.firstName;
  document.getElementById('edit-lastname').value=t.lastName;
  document.getElementById('edit-email').value=t.email;
  document.getElementById('edit-phone').value=t.phone;
  document.getElementById('edit-room').value=t.room;
  document.getElementById('edit-deposit').value=t.deposit;
  document.getElementById('edit-joindate').value=t.joinDate;
  document.getElementById('edit-status').value=t.status;
  document.getElementById('edit-occupation').value=t.occupation||'';
  document.getElementById('edit-school').value=t.school||'';
  document.getElementById('edit-emergency').value=t.emergency||'';
  openModal('modal-edit');
}
function submitEditTenant(){
  if(!editingId)return;const t=tenants.find(t=>t.id===editingId);if(!t)return;
  t.firstName=document.getElementById('edit-firstname').value.trim()||t.firstName;
  t.lastName=document.getElementById('edit-lastname').value.trim()||t.lastName;
  t.email=document.getElementById('edit-email').value.trim()||t.email;
  t.phone=document.getElementById('edit-phone').value.trim()||t.phone;
  t.room=document.getElementById('edit-room').value.trim()||t.room;
  t.deposit=parseInt(document.getElementById('edit-deposit').value)||t.deposit;
  t.joinDate=document.getElementById('edit-joindate').value||t.joinDate;
  t.status=document.getElementById('edit-status').value||t.status;
  t.occupation=document.getElementById('edit-occupation').value;
  t.school=document.getElementById('edit-school').value.trim()||'N/A';
  t.emergency=document.getElementById('edit-emergency').value.trim();
  editingId=null;closeAllModals();renderTable();showToast(`${t.firstName} ${t.lastName}'s info updated.`,'success');
}

function openViewModal(id){
  const t=tenants.find(t=>t.id===id);if(!t)return;
  document.getElementById('view-avatar').textContent=ini(t.firstName,t.lastName);
  document.getElementById('view-name').textContent=`${t.firstName} ${t.lastName}`;
  document.getElementById('view-email').textContent=t.email;
  document.getElementById('view-phone').textContent=t.phone;
  document.getElementById('view-room').textContent=t.room;
  document.getElementById('view-deposit').textContent=fmtPHP(t.deposit);
  document.getElementById('view-joindate').textContent=fmtDate(t.joinDate);
  document.getElementById('view-occupation').textContent=t.occupation||'—';
  document.getElementById('view-school').textContent=t.school||'—';
  document.getElementById('view-emergency').textContent=t.emergency||'—';
  const sb=document.getElementById('view-status');sb.textContent=cap(t.status);sb.className=`status-badge status-${t.status}`;
  document.getElementById('view-msg-btn').onclick=()=>{closeAllModals();openContactModal(id,'msg');};
  document.getElementById('view-call-btn').onclick=()=>{closeAllModals();openContactModal(id,'call');};
  document.getElementById('view-edit-btn').onclick=()=>{closeAllModals();openEditModal(id);};
  openModal('modal-view');
}

function openContactModal(id,type){
  const t=tenants.find(t=>t.id===id);if(!t)return;
  const name=`${t.firstName} ${t.lastName}`,isMsg=type==='msg';
  document.getElementById('contact-title').textContent=isMsg?'Send Message':'Call Tenant';
  document.getElementById('contact-subtitle').textContent=isMsg?`Send a message to ${name}`:`Call ${name}`;
  document.getElementById('contact-icon').innerHTML=isMsg?`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.63 19 19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.64a16 16 0 0 0 6 6l.95-1.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 15z"/></svg>`;
  const cb=document.getElementById('contact-body'),sb=document.getElementById('contact-submit-btn');
  if(isMsg){
    cb.innerHTML=`<div style="display:flex;align-items:center;gap:.9rem;padding:1rem;background:rgba(124,58,237,.06);border:1px solid var(--card-border);border-radius:10px;margin-bottom:1.25rem;"><div class="tenant-avatar" style="width:42px;height:42px;font-size:.82rem;">${ini(t.firstName,t.lastName)}</div><div><strong>${name}</strong><br><span style="font-size:.76rem;color:var(--text-muted)">${t.email} · ${t.phone}</span></div></div><div class="mf-group"><label class="mf-label">Message</label><textarea class="mf-textarea" id="contact-msg" placeholder="Type your message…" rows="4"></textarea></div>`;
    sb.textContent='Send Message';sb.style.display='';sb.onclick=()=>{const m=document.getElementById('contact-msg').value.trim();if(!m){showToast('Please enter a message.','error');return;}closeAllModals();showToast(`Message sent to ${name}.`,'success');};
  } else {
    cb.innerHTML=`<div style="text-align:center;padding:1.5rem 0"><div style="width:64px;height:64px;border-radius:50%;background:rgba(16,185,129,.12);display:flex;align-items:center;justify-content:center;margin:0 auto 1rem"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.63 19 19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.64a16 16 0 0 0 6 6l.95-1.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 15z"/></svg></div><h3 style="font-size:1rem;font-weight:800;margin-bottom:.3rem">${name}</h3><p style="font-size:1.1rem;font-weight:800;color:var(--primary);margin-bottom:.2rem">${t.phone}</p><p style="font-size:.8rem;color:var(--text-muted)">Tap the button to call this tenant.</p><a href="tel:${t.phone}" style="display:inline-flex;align-items:center;gap:.5rem;margin-top:1.1rem;padding:.7rem 1.8rem;background:linear-gradient(135deg,var(--success),#059669);color:white;border-radius:10px;text-decoration:none;font-weight:700;font-size:.88rem;box-shadow:0 4px 12px rgba(16,185,129,.3)">📞 Call Now</a></div>`;
    sb.style.display='none';
  }
  openModal('modal-contact');
}

function openApplicationsModal(){renderApplicationsList();openModal('modal-applications');}

function renderApplicationsList(){
  const list=document.getElementById('app-list');
  if(!applications.length){list.innerHTML=`<div style="text-align:center;padding:2.5rem;color:var(--text-muted)"><div style="font-size:2rem;margin-bottom:.4rem">📭</div><p style="font-weight:600">No pending applications</p></div>`;return;}
  list.innerHTML=applications.map(a=>`
    <div class="app-list-item" onclick="openAppDetail('${a.id}')">
      <div class="ali-avatar">${ini(a.firstName,a.lastName)}</div>
      <div class="ali-info"><strong>${a.firstName} ${a.lastName}</strong><span>${a.email} · ${a.phone}</span></div>
      <div class="ali-right"><span class="ali-room">${a.room.split('–')[0].trim()}</span><br><span class="ali-date">${fmtDate(a.appliedDate)}</span></div>
      <div class="ali-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></div>
    </div>`).join('');
}

function openAppDetail(appId){
  const a=applications.find(a=>a.id===appId);if(!a)return;
  document.getElementById('appd-avatar').textContent=ini(a.firstName,a.lastName);
  document.getElementById('appd-name').textContent=`${a.firstName} ${a.lastName}`;
  document.getElementById('appd-meta').textContent=`${a.email} · Applied ${fmtDate(a.appliedDate)}`;
  document.getElementById('appd-room').textContent=a.room;
  document.getElementById('appd-rate').textContent=a.rate;
  document.getElementById('appd-phone').textContent=a.phone;
  document.getElementById('appd-occupation').textContent=a.occupation;
  document.getElementById('appd-school').textContent=a.school||'—';
  document.getElementById('appd-movein').textContent=fmtDate(a.moveIn);
  document.getElementById('appd-applied').textContent=fmtDate(a.appliedDate);
  const mb=document.getElementById('appd-message-box');
  if(a.message){mb.style.display='block';document.getElementById('appd-message').textContent=a.message;}else mb.style.display='none';
  document.getElementById('appd-msg-btn').onclick=()=>showToast(`Message sent to ${a.firstName} ${a.lastName}.`,'success');
  document.getElementById('appd-call-btn').onclick=()=>showToast(`Calling ${a.firstName} at ${a.phone}…`,'success');
  document.getElementById('appd-approve-btn').onclick=()=>approveApplication(appId);
  document.getElementById('appd-reject-btn').onclick=()=>rejectApplication(appId);
  openModal('modal-app-detail');
}

function approveApplication(appId){
  const a=applications.find(a=>a.id===appId);if(!a)return;
  tenants.push({id:nextId++,firstName:a.firstName,lastName:a.lastName,email:a.email,phone:a.phone,room:a.room.split('–').pop().trim().replace('Room ','').trim()||'—',deposit:0,joinDate:a.moveIn,status:'active',occupation:a.occupation,school:a.school||'N/A',emergency:'—'});
  applications=applications.filter(ap=>ap.id!==appId);
  currentPage=Math.max(1,Math.ceil(filtered().length/PAGE_SIZE));
  closeAllModals();renderTable();renderApplicationsBadge();
  showToast(`${a.firstName} ${a.lastName} approved and added as tenant!`,'success');
}

function rejectApplication(appId){
  const a=applications.find(a=>a.id===appId);if(!a)return;
  applications=applications.filter(ap=>ap.id!==appId);
  closeAllModals();renderApplicationsBadge();
  showToast(`Application from ${a.firstName} ${a.lastName} rejected.`,'error');
}

function openModal(id){closeAllModals();document.getElementById(id).classList.add('open');document.body.style.overflow='hidden';}
function closeAllModals(){document.querySelectorAll('.modal-overlay').forEach(m=>m.classList.remove('open'));document.body.style.overflow='';const sb=document.getElementById('contact-submit-btn');if(sb)sb.style.display='';}
document.addEventListener('click',e=>{if(e.target.classList.contains('modal-overlay'))closeAllModals();});

function showToast(msg,type='success'){
  const t=document.getElementById('admin-toast');
  const icons={success:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,error:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,warning:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/></svg>`};
  t.className=`admin-toast ${type}`;t.innerHTML=icons[type]+' '+msg;t.classList.add('show');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('show'),3500);
}

function bulkDeactivate(){let c=0;selectedIds.forEach(id=>{const t=tenants.find(t=>t.id===id);if(t){t.status='notice';c++;}});selectedIds.clear();renderTable();showToast(`${c} tenant${c>1?'s':''} set to Notice.`,'warning');}
function bulkDelete(){const c=selectedIds.size;tenants=tenants.filter(t=>!selectedIds.has(t.id));selectedIds.clear();renderTable();showToast(`${c} tenant${c>1?'s':''} removed.`,'error');}

document.getElementById('tm-search').addEventListener('input',e=>{searchQuery=e.target.value;currentPage=1;renderTable();});
document.getElementById('status-filter').addEventListener('change',e=>{filterStatus=e.target.value;currentPage=1;renderTable();});

renderTable();
renderApplicationsBadge();