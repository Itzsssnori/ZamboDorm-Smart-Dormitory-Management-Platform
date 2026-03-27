const RATE = 3500;
let currentStep = 1;
let selectedMethod = '';
let selectedMonths = 1;
let uploadedFile = '';

// ── Helpers ──
function showToast(msg, dur = 3000){
  const t = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), dur);
}

function fmtPHP(n){ return '₱' + n.toLocaleString('en-PH'); }

// ── Stepper ──
function updateStepper(step){
  [1,2,3].forEach(i => {
    const c = document.getElementById('sc'+i);
    const l = document.getElementById('sl'+i);
    if(i < step){ c.className = 'step-circle done'; c.innerHTML = '✓'; l.className = 'step-label done'; }
    else if(i === step){ c.className = 'step-circle active'; c.textContent = i; l.className = 'step-label active'; }
    else{ c.className = 'step-circle'; c.textContent = i; l.className = 'step-label'; }
    if(i < 3){
      const line = document.getElementById('line'+i);
      if(line) line.className = 'step-line' + (i < step ? ' done' : '');
    }
  });
}

function goStep(step){
  document.getElementById('step-'+currentStep).style.display = 'none';
  currentStep = step;
  document.getElementById('step-'+currentStep).style.display = '';
  updateStepper(currentStep);
  if(step === 3) buildReview();
  window.scrollTo({top:0, behavior:'smooth'});
}

// ── Method selection ──
function selectMethod(el, name){
  document.querySelectorAll('.method-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  selectedMethod = name;
  document.getElementById('btn-next-1').disabled = false;
  
  // Hide all payment forms
  document.getElementById('bank-form').style.display = 'none';
  document.getElementById('card-form').style.display = 'none';
  document.getElementById('cash-form').style.display = 'none';
  document.getElementById('wallet-form').style.display = 'none';
  document.getElementById('proof-form').style.display = 'block';
  
  // Show appropriate form based on method
  if(name === 'Bank Transfer') {
    document.getElementById('bank-form').style.display = 'block';
  } else if(name === 'Debit/Credit Card') {
    document.getElementById('card-form').style.display = 'block';
  } else if(name === 'Cash Payment') {
    document.getElementById('cash-form').style.display = 'block';
    document.getElementById('proof-form').style.display = 'none';
  } else if(name === 'GCash' || name === 'Maya' || name === 'Metrobank') {
    document.getElementById('wallet-form').style.display = 'block';
  }
}

// ── Room tags ──
function addRoom(){
  const room = prompt('Enter room number:');
  if(!room || !room.trim()) return;
  const tags = document.getElementById('room-tags');
  const tag = document.createElement('div');
  tag.className = 'room-tag';
  tag.innerHTML = room.trim() + ' <span class="room-tag-remove" onclick="removeRoom(this)">✕</span>';
  tags.appendChild(tag);
  updateBillForRooms();
}
function removeRoom(el){
  const tags = document.getElementById('room-tags');
  if(tags.children.length <= 1){ showToast('⚠️ At least one room is required.'); return; }
  el.parentElement.remove();
  updateBillForRooms();
}
function getRooms(){
  return [...document.querySelectorAll('.room-tag')].map(t => t.textContent.replace('✕','').trim()).join(', ');
}
function updateBillForRooms(){
  const count = document.querySelectorAll('.room-tag').length;
  const total = RATE * selectedMonths * count;
  document.getElementById('bill-display').textContent = fmtPHP(total);
  document.getElementById('bd-total').textContent = fmtPHP(total) + '.00';
  document.getElementById('bd-duration-label').textContent = 'Total ('+selectedMonths+' month'+(selectedMonths>1?'s':'')+', '+count+' room'+(count>1?'s':'')+')';
}

// ── Duration ──
function selectDur(el, months){
  document.querySelectorAll('.dur-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  selectedMonths = months;
  const count = document.querySelectorAll('.room-tag').length;
  const total = RATE * months * count;
  document.getElementById('bill-display').textContent = fmtPHP(total);
  document.getElementById('bd-total').textContent = fmtPHP(total) + '.00';
  document.getElementById('bd-duration-label').textContent = 'Total ('+months+' month'+(months>1?'s':'')+(count>1?', '+count+' rooms':'')+')';
}

// ── File upload ──
function handleFileUpload(input){
  const file = input.files[0];
  if(!file) return;
  uploadedFile = file.name;
  const box = document.getElementById('upload-box');
  box.classList.add('has-file');
  document.getElementById('upload-label').textContent = 'File uploaded ✓';
  document.getElementById('upload-sub').style.display = 'none';
  document.getElementById('upload-filename').style.display = 'block';
  document.getElementById('upload-filename').textContent = file.name;
}

// ── Build Review ──
function buildReview(){
  const count = document.querySelectorAll('.room-tag').length;
  const total = RATE * selectedMonths * count;
  document.getElementById('rv-method').textContent = selectedMethod || '—';
  document.getElementById('rv-rooms').textContent = getRooms();
  document.getElementById('rv-duration').textContent = selectedMonths + ' month' + (selectedMonths > 1 ? 's' : '') + (count > 1 ? ', ' + count + ' rooms' : '');
  
  // Get reference based on payment method
  let refValue = '—';
  if(selectedMethod === 'Bank Transfer') {
    refValue = document.getElementById('bank-ref').value || '—';
  } else if(selectedMethod === 'Debit/Credit Card') {
    refValue = document.getElementById('card-number').value ? document.getElementById('card-number').value.slice(-4) : '—';
  } else if(selectedMethod === 'Cash Payment') {
    refValue = 'N/A (Cash)';
  } else if(selectedMethod === 'GCash' || selectedMethod === 'Maya' || selectedMethod === 'Metrobank') {
    refValue = document.getElementById('wallet-ref').value || '—';
  }
  
  document.getElementById('rv-ref').textContent = refValue;
  document.getElementById('rv-proof').textContent = uploadedFile || (selectedMethod === 'Cash Payment' ? 'N/A' : 'Not uploaded');
  document.getElementById('rv-total').textContent = fmtPHP(total);
  document.getElementById('confirm-amt').textContent = fmtPHP(total);
}

// ── Confirm ──
function openConfirm(){ document.getElementById('confirm-overlay').classList.add('open'); }
function closeConfirm(){ document.getElementById('confirm-overlay').classList.remove('open'); }
function submitPayment(){
  closeConfirm();
  ['step-1','step-2','step-3','bill-card','stepper'].forEach(id => {
    const el = document.getElementById(id);
    if(el) el.style.display = 'none';
  });
  document.getElementById('success-screen').style.display = 'block';
  window.scrollTo({top:0, behavior:'smooth'});
}

// ── Reset ──
function resetFlow(){
  document.getElementById('success-screen').style.display = 'none';
  ['bill-card','stepper'].forEach(id => document.getElementById(id).style.display = '');
  currentStep = 1;
  selectedMethod = '';
  selectedMonths = 1;
  uploadedFile = '';
  document.querySelectorAll('.method-card').forEach(c => c.classList.remove('selected'));
  document.querySelectorAll('.dur-card').forEach(c => c.classList.remove('selected'));
  document.querySelector('.dur-card[data-months="1"]').classList.add('selected');
  document.getElementById('ref-input').value = '';
  document.getElementById('upload-box').classList.remove('has-file');
  document.getElementById('upload-label').textContent = 'Click to upload screenshot or receipt';
  document.getElementById('upload-sub').style.display = '';
  document.getElementById('upload-filename').style.display = 'none';
  document.getElementById('bill-display').textContent = fmtPHP(RATE);
  document.getElementById('btn-next-1').disabled = true;
  goStep(1);
  updateStepper(1);
}

// ── Back button ──
function handleBack(){
  if(currentStep > 1) goStep(currentStep - 1);
  else openExit();
}

// ── History panel ──
function toggleHistory(){
  const panel = document.getElementById('history-panel');
  panel.style.display = panel.style.display === 'none' ? '' : 'none';
}

// ── Exit dialog ──
function openExit(){
  document.getElementById('exit-overlay').style.display = 'flex';
}

function closeExit(){
  document.getElementById('exit-overlay').style.display = 'none';
}

function confirmExit(){
  // Redirect to payment page
  window.location.href = 'tenant-payment.html';
}
