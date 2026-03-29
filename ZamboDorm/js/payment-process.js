const RATE = 3500;
let currentStep = 1;
let selectedMethod = '';
let selectedMonths = 1;
let uploadedFile = '';

/* ── Toast ── */
function showToast(msg, dur = 3000) {
  const t = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), dur);
}

function fmtPHP(n) { return '₱' + n.toLocaleString('en-PH'); }

/* ── Stepper ── */
function updateStepper(step) {
  [1, 2, 3].forEach(i => {
    const c = document.getElementById('sc' + i);
    const l = document.getElementById('sl' + i);
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
    if (i < 3) {
      const line = document.getElementById('line' + i);
      if (line) line.className = 'step-line' + (i < step ? ' done' : '');
    }
  });
}

function goStep(step) {
  /* Validate before advancing */
  if (step > currentStep) {
    if (!validateStep(currentStep)) return;
  }
  document.getElementById('step-' + currentStep).style.display = 'none';
  currentStep = step;
  document.getElementById('step-' + currentStep).style.display = '';
  updateStepper(currentStep);
  if (step === 3) buildReview();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ── Validation ── */
function validateStep(step) {
  if (step === 1) {
    if (!selectedMethod) {
      showToast('⚠️ Please select a payment method.');
      return false;
    }
    return true;
  }

  if (step === 2) {
    if (selectedMethod === 'Bank Transfer') {
      const bank = document.getElementById('bank-name').value;
      const acct = document.getElementById('bank-account').value.trim();
      const ref  = document.getElementById('bank-ref').value.trim();
      if (!bank)  { showToast('⚠️ Please select your bank.'); document.getElementById('bank-name').focus(); return false; }
      if (!acct)  { showToast('⚠️ Please enter your account number.'); document.getElementById('bank-account').focus(); return false; }
      if (!ref)   { showToast('⚠️ Please enter the reference number.'); document.getElementById('bank-ref').focus(); return false; }
      if (!uploadedFile) { showToast('⚠️ Please upload proof of payment.'); return false; }
    }

    if (selectedMethod === 'Debit/Credit Card') {
      const num    = document.getElementById('card-number').value.trim();
      const holder = document.getElementById('card-holder').value.trim();
      const expiry = document.getElementById('card-expiry').value.trim();
      const cvv    = document.getElementById('card-cvv').value.trim();
      if (!num)    { showToast('⚠️ Please enter your card number.'); document.getElementById('card-number').focus(); return false; }
      if (!holder) { showToast('⚠️ Please enter the cardholder name.'); document.getElementById('card-holder').focus(); return false; }
      if (!expiry) { showToast('⚠️ Please enter the expiry date.'); document.getElementById('card-expiry').focus(); return false; }
      if (!cvv)    { showToast('⚠️ Please enter the CVV.'); document.getElementById('card-cvv').focus(); return false; }
      if (!uploadedFile) { showToast('⚠️ Please upload proof of payment.'); return false; }
    }

    if (selectedMethod === 'GCash' || selectedMethod === 'Maya' || selectedMethod === 'Metrobank') {
      const ref = document.getElementById('wallet-ref').value.trim();
      if (!ref) { showToast('⚠️ Please enter the reference number.'); document.getElementById('wallet-ref').focus(); return false; }
      if (!uploadedFile) { showToast('⚠️ Please upload proof of payment.'); return false; }
    }

    /* Cash payment needs no extra fields */
    return true;
  }

  return true;
}

/* ── Method selection ── */
function selectMethod(el, name) {
  document.querySelectorAll('.method-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  selectedMethod = name;
  document.getElementById('btn-next-1').disabled = false;

  ['bank-form', 'card-form', 'cash-form', 'wallet-form'].forEach(id => {
    document.getElementById(id).style.display = 'none';
  });
  document.getElementById('proof-form').style.display = 'block';

  if (name === 'Bank Transfer')         document.getElementById('bank-form').style.display   = 'block';
  else if (name === 'Debit/Credit Card') document.getElementById('card-form').style.display   = 'block';
  else if (name === 'Cash Payment') {
    document.getElementById('cash-form').style.display  = 'block';
    document.getElementById('proof-form').style.display = 'none';
  } else {
    document.getElementById('wallet-form').style.display = 'block';
  }
}

/* ── Room tags ── */
function addRoom() {
  const room = prompt('Enter room number:');
  if (!room || !room.trim()) return;
  const tags = document.getElementById('room-tags');
  const tag = document.createElement('div');
  tag.className = 'room-tag';
  tag.innerHTML = room.trim() + ' <span class="room-tag-remove" onclick="removeRoom(this)">✕</span>';
  tags.appendChild(tag);
  updateBillForRooms();
}

function removeRoom(el) {
  const tags = document.getElementById('room-tags');
  if (tags.children.length <= 1) { showToast('⚠️ At least one room is required.'); return; }
  el.parentElement.remove();
  updateBillForRooms();
}

function getRooms() {
  return [...document.querySelectorAll('.room-tag')]
    .map(t => t.textContent.replace('✕', '').trim()).join(', ');
}

function updateBillForRooms() {
  const count = document.querySelectorAll('.room-tag').length;
  const total = RATE * selectedMonths * count;
  document.getElementById('bill-display').textContent = fmtPHP(total);
  document.getElementById('bd-total').textContent = fmtPHP(total) + '.00';
  document.getElementById('bd-duration-label').textContent =
    'Total (' + selectedMonths + ' month' + (selectedMonths > 1 ? 's' : '') +
    ', ' + count + ' room' + (count > 1 ? 's' : '') + ')';
}

/* ── Duration ── */
function selectDur(el, months) {
  document.querySelectorAll('.dur-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  selectedMonths = months;
  const count = document.querySelectorAll('.room-tag').length;
  const total = RATE * months * count;
  document.getElementById('bill-display').textContent = fmtPHP(total);
  document.getElementById('bd-total').textContent = fmtPHP(total) + '.00';
  document.getElementById('bd-duration-label').textContent =
    'Total (' + months + ' month' + (months > 1 ? 's' : '') +
    (count > 1 ? ', ' + count + ' rooms' : '') + ')';
}

/* ── File upload ── */
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

/* ── Build Review ── */
function buildReview() {
  const count = document.querySelectorAll('.room-tag').length;
  const total = RATE * selectedMonths * count;

  document.getElementById('rv-method').textContent   = selectedMethod || '—';
  document.getElementById('rv-rooms').textContent    = getRooms();
  document.getElementById('rv-duration').textContent =
    selectedMonths + ' month' + (selectedMonths > 1 ? 's' : '') +
    (count > 1 ? ', ' + count + ' rooms' : '');

  let refValue = '—';
  if (selectedMethod === 'Bank Transfer')
    refValue = document.getElementById('bank-ref').value || '—';
  else if (selectedMethod === 'Debit/Credit Card') {
    const num = document.getElementById('card-number').value;
    refValue = num ? '···· ' + num.replace(/\s/g, '').slice(-4) : '—';
  } else if (selectedMethod === 'Cash Payment')
    refValue = 'N/A (Cash)';
  else
    refValue = document.getElementById('wallet-ref').value || '—';

  document.getElementById('rv-ref').textContent   = refValue;
  document.getElementById('rv-proof').textContent = uploadedFile || (selectedMethod === 'Cash Payment' ? 'N/A' : 'Not uploaded');
  document.getElementById('rv-total').textContent = fmtPHP(total);
  document.getElementById('confirm-amt').textContent = fmtPHP(total);
}

/* ── Confirm dialog ── */
function openConfirm()  { document.getElementById('confirm-overlay').classList.add('open'); }
function closeConfirm() { document.getElementById('confirm-overlay').classList.remove('open'); }

function submitPayment() {
  closeConfirm();
  /* Hide all flow elements */
  ['step-1', 'step-2', 'step-3', 'bill-card', 'stepper'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
  document.getElementById('success-screen').style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ── Reset — fix: hides success screen AND clears all state before rebuilding ── */
function resetFlow() {
  /* Hide success, show flow */
  document.getElementById('success-screen').style.display = 'none';
  ['bill-card', 'stepper'].forEach(id => {
    document.getElementById(id).style.display = '';
  });

  /* Reset state */
  currentStep    = 1;
  selectedMethod = '';
  selectedMonths = 1;
  uploadedFile   = '';

  /* Reset UI */
  document.querySelectorAll('.method-card').forEach(c => c.classList.remove('selected'));
  document.querySelectorAll('.dur-card').forEach(c => c.classList.remove('selected'));
  document.querySelector('.dur-card[data-months="1"]').classList.add('selected');

  /* Clear all form inputs */
  ['bank-name', 'bank-account', 'bank-ref',
   'card-number', 'card-holder', 'card-expiry', 'card-cvv',
   'wallet-ref'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });

  /* Reset upload */
  document.getElementById('upload-box').classList.remove('has-file');
  document.getElementById('upload-label').textContent = 'Click to upload screenshot or receipt';
  document.getElementById('upload-sub').style.display = '';
  document.getElementById('upload-filename').style.display = 'none';
  document.getElementById('upload-filename').textContent = '';
  const fileInput = document.getElementById('file-input');
  if (fileInput) fileInput.value = '';

  /* Reset bill display */
  document.getElementById('bill-display').textContent = fmtPHP(RATE);
  document.getElementById('btn-next-1').disabled = true;

  /* Hide payment-specific forms */
  ['bank-form', 'card-form', 'cash-form', 'wallet-form', 'proof-form'].forEach(id => {
    document.getElementById(id).style.display = 'none';
  });

  /* Show step 1 */
  document.getElementById('step-1').style.display = '';
  document.getElementById('step-2').style.display = 'none';
  document.getElementById('step-3').style.display = 'none';
  currentStep = 1;
  updateStepper(1);
}

/* ── Back button ── */
function handleBack() {
  if (currentStep > 1) goStep(currentStep - 1);
  else openExit();
}

/* ── History panel ── */
function toggleHistory() {
  const panel = document.getElementById('history-panel');
  panel.style.display = panel.style.display === 'none' ? '' : 'none';
}

/* ── Exit dialog ── */
function openExit()  { document.getElementById('exit-overlay').style.display = 'flex'; }
function closeExit() { document.getElementById('exit-overlay').style.display = 'none'; }
function confirmExit() { window.location.href = 'tenant-payment.html'; }