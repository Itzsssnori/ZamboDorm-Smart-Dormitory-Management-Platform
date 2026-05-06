let currentStep = 1;
let selectedService = '';

// ── Helpers ──
function showToast(msg, dur = 3000) {
  const t = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), dur);
}

// ── Stepper ──
function updateStepper(step) {
  [1, 2, 3, 4].forEach(i => {
    const c = document.getElementById('sc' + i);
    const l = document.getElementById('sl' + i);
    if (i < step) {
      c.className = 'step-circle done';
      c.innerHTML = '✓';
      l.className = 'step-label done';
    } else if (i === step) {
      c.className = 'step-circle active';
      c.textContent = i;
      l.className = 'step-label active';
    } else {
      c.className = 'step-circle';
      c.textContent = i;
      l.className = 'step-label';
    }
    if (i < 4) {
      const line = document.getElementById('line' + i);
      if (line) line.className = 'step-line' + (i < step ? ' done' : '');
    }
  });
}

function goStep(step) {
  document.getElementById('step-' + currentStep).style.display = 'none';
  currentStep = step;
  document.getElementById('step-' + currentStep).style.display = '';
  updateStepper(currentStep);
  if (step === 4) buildReview();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Service Selection ──
function selectService(el, name) {
  document.querySelectorAll('.sr-service-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  selectedService = name;

  // Show/hide forms
  if (name === 'water') {
    document.getElementById('water-form').style.display = '';
    document.getElementById('laundry-form').style.display = 'none';
  } else {
    document.getElementById('water-form').style.display = 'none';
    document.getElementById('laundry-form').style.display = '';
  }

  // Auto proceed to next step
  setTimeout(() => goStep(2), 300);
}

// ── Review ──
function buildReview() {
  let service = '';
  let details = '';
  let weight = '';
  let location = '';

  if (selectedService === 'water') {
    const size = document.getElementById('water-size').value;
    const qty = document.getElementById('water-qty').value;
    const deliveryLoc = document.getElementById('water-delivery-location').value;
    service = 'Water Delivery';
    details = `${qty}x ${size === '5gallon' ? '5-Gallon Container' : size === '3gallon' ? '3-Gallon Container' : '1-Gallon Bottle'}`;
    location = deliveryLoc;
    document.getElementById('review-weight-item').style.display = 'none';
  } else {
    const type = document.getElementById('laundry-type').value;
    weight = document.getElementById('laundry-weight').value;
    const pickupLoc = document.getElementById('laundry-pickup-location').value;
    service = 'Laundry Service';
    details = `${type === 'wash-fold' ? 'Wash & Fold' : type === 'wash-iron' ? 'Wash & Iron' : 'Dry Cleaning'}`;
    location = pickupLoc;
    document.getElementById('review-weight-item').style.display = '';
    document.getElementById('review-weight').textContent = `${weight} kg`;
  }

  const room = document.getElementById('room-number').value;
  const contact = document.getElementById('contact-number').value;
  const date = document.getElementById('service-date').value;
  const time = document.getElementById('service-time').value;

  const locationLabel = location === 'room-entrance' ? 'Room Entrance' : 
                        location === 'ground-area' ? 'Ground Area' :
                        location === 'reception-desk' ? 'Reception Desk' :
                        location === 'building-entrance' ? 'Building Entrance' : '-';

  document.getElementById('review-service').textContent = service;
  document.getElementById('review-details').textContent = details;
  document.getElementById('review-location').textContent = locationLabel;
  document.getElementById('review-datetime').textContent = date && time ? `${new Date(date).toLocaleDateString('en-PH')} • ${time}` : '-';
}

// ── Validation ──
function validateStep2() {
  const errorBox = document.getElementById('step-2-error');
  
  if (selectedService === 'water') {
    const sizeField = document.getElementById('water-size');
    const qtyField = document.getElementById('water-qty');
    const locationField = document.getElementById('water-delivery-location');
    
    if (!sizeField.value || !qtyField.value || !locationField.value) {
      errorBox.style.display = 'block';
      return;
    }
  } else {
    const typeField = document.getElementById('laundry-type');
    const weightField = document.getElementById('laundry-weight');
    const locationField = document.getElementById('laundry-pickup-location');
    
    if (!typeField.value || !weightField.value || !locationField.value) {
      errorBox.style.display = 'block';
      return;
    }
  }
  
  errorBox.style.display = 'none';
  goStep(3);
}

function validateStep3() {
  const errorBox = document.getElementById('step-3-error');
  
  const roomField = document.getElementById('room-number');
  const contactField = document.getElementById('contact-number');
  const dateField = document.getElementById('service-date');
  const timeField = document.getElementById('service-time');
  const locationField = document.getElementById('pickup-location');
  
  if (!roomField.value || !contactField.value || !dateField.value || !timeField.value || !locationField.value) {
    errorBox.style.display = 'block';
    return;
  }
  
  errorBox.style.display = 'none';
  goStep(4);
}

// ── Back Button ──
function handleBack() {
  window.location.href = 'tenant-dashboard.html';
}

// ── Submit ──
function submitRequest() {
  // Show success dialog
  document.getElementById('success-overlay').classList.add('show');
}

// ── Success ──
function redirectToDashboard() {
  window.location.href = 'tenant-myroom.html';
}
