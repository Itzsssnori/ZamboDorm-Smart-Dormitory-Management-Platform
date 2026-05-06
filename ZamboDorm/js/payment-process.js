const RATE = 3500;
let currentStep = 1;
let selectedMethod = '';
let uploadedFile = '';

// Room state: array of objects
let rooms = [
  { id: Date.now(), number: '067-A', months: 1, deposit: false, subtotal: 3500 }
];

/* ── Toast ── */
function showToast(msg, dur = 3000) {
  const t = document.getElementById('toast');
  const msgEl = document.getElementById('toast-msg');
  if (msgEl) msgEl.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), dur);
}

function fmtPHP(n) { return '₱' + n.toLocaleString('en-PH'); }

/* ── Stepper (5 Steps) ── */
function updateStepper(step) {
  const steps = [
    { id: 1, label: 'Rooms' },
    { id: 2, label: 'Method' },
    { id: 3, label: 'Details' },
    { id: 4, label: 'Proof' },
    { id: 5, label: 'Review' }
  ];

  steps.forEach(s => {
    const i = s.id;
    const c = document.getElementById('sc' + i);
    const l = document.getElementById('sl' + i);
    if (!c || !l) return;

    if (i < step) {
      c.className = 'step-circle done'; c.innerHTML = '✓';
      l.className = 'step-label done';
    } else if (i === step) {
      c.className = 'step-circle active'; c.textContent = i;
      l.className = 'step-label active';
    } else {
      c.className = 'step-circle'; c.textContent = i;
      l.className = 'step-label';
    }

    if (i < 5) {
      const line = document.getElementById('line' + i);
      if (line) line.className = 'step-line' + (i < step ? ' done' : '');
    }
  });
}

function goStep(step) {
  if (step > currentStep) {
    if (!validateStep(currentStep)) return;
  }
  
  const currentEl = document.getElementById('step-' + currentStep);
  const nextEl = document.getElementById('step-' + step);
  
  if (currentEl) currentEl.style.display = 'none';
  if (nextEl) nextEl.style.display = '';
  
  currentStep = step;
  updateStepper(currentStep);
  
  if (step === 5) renderBreakdown();

  if (step === 3) {
    ['bank-form', 'card-form', 'cash-form', 'wallet-form'].forEach(id => {
      document.getElementById(id).style.display = 'none';
    });
    if (selectedMethod === 'Bank Transfer') document.getElementById('bank-form').style.display = 'block';
    else if (selectedMethod === 'Debit/Credit Card') document.getElementById('card-form').style.display = 'block';
    else if (selectedMethod === 'Cash Payment') document.getElementById('cash-form').style.display = 'block';
    else document.getElementById('wallet-form').style.display = 'block';
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ── Validation ── */
function validateStep(step) {
  // Step 1: Rooms
  if (step === 1) {
    if (rooms.length === 0) {
      showToast('⚠️ Please add at least one room.');
      return false;
    }
    for (const r of rooms) {
      if (!r.number.trim()) {
        showToast('⚠️ Please enter a room number for all entries.');
        return false;
      }
      if (r.months < 1) {
        showToast('⚠️ Minimum stay is 1 month.');
        return false;
      }
    }
    return true;
  }

  // Step 2: Method
  if (step === 2) {
    if (!selectedMethod) {
      showToast('⚠️ Please select a payment method.');
      return false;
    }
    return true;
  }

  // Step 3: Payment details (bank/card/wallet/cash)
  if (step === 3) {
    if (selectedMethod === 'Bank Transfer') {
      const bank = document.getElementById('bank-name').value;
      const acct = document.getElementById('bank-account').value.trim();
      const ref  = document.getElementById('bank-ref').value.trim();
      if (!bank)  { showToast('⚠️ Please select your bank.'); return false; }
      if (!acct)  { showToast('⚠️ Please enter your account number.'); return false; }
      if (!ref)   { showToast('⚠️ Please enter the reference number.'); return false; }
    }
    if (selectedMethod === 'Debit/Credit Card') {
      const num    = document.getElementById('card-number').value.trim();
      const expiry = document.getElementById('card-expiry').value.trim();
      const cvv    = document.getElementById('card-cvv').value.trim();
      if (!num || !expiry || !cvv) { showToast('⚠️ Please fill in all card details.'); return false; }
    }
    if (['GCash', 'Maya', 'Metrobank'].includes(selectedMethod) || selectedMethod === 'GCash' || selectedMethod === 'Maya') {
      const ref = document.getElementById('wallet-ref').value.trim();
      if (!ref) { showToast('⚠️ Please enter the reference number.'); return false; }
    }
    return true;
  }

  // Step 4: Proof upload
  if (step === 4) {
    if (selectedMethod !== 'Cash Payment' && !uploadedFile) {
      showToast('⚠️ Please upload proof of payment.');
      return false;
    }
    return true;
  }

  return true;
}

/* ── Room Management (Step 1) ── */
function addRoomEntry() {
  rooms.push({ id: Date.now(), number: '', months: 1, deposit: false, subtotal: RATE });
  renderRooms();
}

function removeRoomEntry(id) {
  if (rooms.length <= 1) {
    showToast('⚠️ At least one room is required.');
    return;
  }
  rooms = rooms.filter(r => r.id !== id);
  renderRooms();
  updateGlobalBillDisplay();
}

function updateRoomData(id, field, value) {
  const room = rooms.find(r => r.id === id);
  if (!room) return;

  if (field === 'number') room.number = value;
  if (field === 'months') room.months = parseInt(value) || 0;
  if (field === 'deposit') room.deposit = value;

  // Calculate subtotal
  room.subtotal = (RATE * room.months) + (room.deposit ? RATE : 0);
  
  // Update subtotal in UI without full re-render
  const subEl = document.getElementById(`subtotal-${id}`);
  if (subEl) subEl.textContent = fmtPHP(room.subtotal);
  
  updateGlobalBillDisplay();
}

function renderRooms() {
  const container = document.getElementById('rooms-container');
  if (!container) return;

  container.innerHTML = rooms.map(r => `
    <div class="room-entry-row" id="room-row-${r.id}">
      <div class="room-input-group">
        <label class="form-label">Room Number</label>
        <input type="text" class="form-input" value="${r.number}" 
          oninput="updateRoomData(${r.id}, 'number', this.value)" placeholder="e.g. 067-A">
      </div>
      <div class="room-input-group small">
        <label class="form-label">Months</label>
        <input type="number" class="form-input" value="${r.months}" min="1"
          oninput="updateRoomData(${r.id}, 'months', this.value)">
      </div>
      <div class="room-input-group check">
        <label class="form-label">Deposit?</label>
        <div class="check-wrapper">
          <input type="checkbox" ${r.deposit ? 'checked' : ''} 
            onchange="updateRoomData(${r.id}, 'deposit', this.checked)">
          <span class="check-hint">Add 1mo Deposit</span>
        </div>
      </div>
      <div class="room-subtotal">
        <span class="sub-label">Subtotal</span>
        <span class="sub-val" id="subtotal-${r.id}">${fmtPHP(r.subtotal)}</span>
      </div>
      <button class="room-remove-btn" onclick="removeRoomEntry(${r.id})" title="Remove">✕</button>
    </div>
  `).join('');
  
  updateGlobalBillDisplay();
}

function updateGlobalBillDisplay() {
  const total = rooms.reduce((sum, r) => sum + r.subtotal, 0);
  const billEl = document.getElementById('bill-display');
  if (billEl) billEl.textContent = fmtPHP(total);
  
  const roomCountEl = document.getElementById('bill-rooms-val');
  if (roomCountEl) roomCountEl.textContent = rooms.length;
}

/* ── Method selection (Step 2) ── */
function selectMethod(el, name) {
  document.querySelectorAll('.method-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  selectedMethod = name;
  
  // Auto-next to Step 3 for better UX?
  // goStep(3); 
}

/* ── Breakdown Rendering (Step 3 & 6) ── */
function renderBreakdown() {
  const total = rooms.reduce((sum, r) => sum + r.subtotal, 0);
  
  // Step 3 breakdown
  const bdList = document.getElementById('breakdown-list');
  if (bdList) {
    bdList.innerHTML = rooms.map(r => `
      <div class="breakdown-row">
        <div class="breakdown-label">
          <strong>Room ${r.number || '(Not set)'}</strong>
          <span>${r.months} month${r.months > 1 ? 's' : ''}${r.deposit ? ' + Deposit' : ''}</span>
        </div>
        <span class="breakdown-amt">${fmtPHP(r.subtotal)}</span>
      </div>
    `).join('');
    
    const bdTotal = document.getElementById('bd-total');
    if (bdTotal) bdTotal.textContent = fmtPHP(total);
  }

  // Step 6 review
  const rvRooms = document.getElementById('rv-rooms');
  if (rvRooms) {
    rvRooms.innerHTML = rooms.map(r => `<div>Room ${r.number}: ${r.months}mo${r.deposit ? '+Dep' : ''} (${fmtPHP(r.subtotal)})</div>`).join('');
    document.getElementById('rv-method').textContent = selectedMethod;
    document.getElementById('rv-total').textContent = fmtPHP(total);
    document.getElementById('confirm-amt').textContent = fmtPHP(total);
    
    let ref = 'N/A';
    if (selectedMethod === 'Bank Transfer') ref = document.getElementById('bank-ref').value;
    else if (selectedMethod === 'Debit/Credit Card') ref = 'Card ending in ' + document.getElementById('card-number').value.slice(-4);
    else if (['GCash', 'Maya', 'Metrobank'].includes(selectedMethod)) ref = document.getElementById('wallet-ref').value;
    
    document.getElementById('rv-ref').textContent = ref;
    document.getElementById('rv-proof').textContent = uploadedFile || (selectedMethod === 'Cash Payment' ? 'Cash walk-in' : 'None');
  }
}

/* ── File upload (Step 5) ── */
function handleFileUpload(input) {
  const file = input.files[0];
  if (!file) return;
  uploadedFile = file.name;
  const box = document.getElementById('upload-box');
  box.classList.add('has-file');
  document.getElementById('upload-label').textContent = 'File uploaded ✓';
  document.getElementById('upload-sub').style.display = 'none';
  document.getElementById('upload-filename').style.display = 'block';
  document.getElementById('upload-filename').textContent = file.name;
}

/* ── Submit & Reset ── */
function openConfirm()  { document.getElementById('confirm-overlay').classList.add('open'); }
function closeConfirm() { document.getElementById('confirm-overlay').classList.remove('open'); }

function submitPayment() {
  closeConfirm();
  document.getElementById('stepper').style.display = 'none';
  document.getElementById('bill-card').style.display = 'none';
  document.getElementById('step-5').style.display = 'none';
  document.getElementById('success-screen').style.display = 'block';
}

function resetFlow() {
  location.reload(); // Simplest way to reset the complex state
}

/* ── UI Helpers ── */
function handleBack() {
  if (currentStep > 1) goStep(currentStep - 1);
  else window.location.href = 'tenant-payment.html';
}

function toggleHistory() {
  const panel = document.getElementById('history-panel');
  panel.style.display = panel.style.display === 'none' ? '' : 'none';
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  renderRooms();
  updateStepper(1);
});