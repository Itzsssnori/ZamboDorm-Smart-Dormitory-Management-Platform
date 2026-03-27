let currentScreen = 'form';

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-' + id).classList.add('active');
  currentScreen = id;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateStepper(step) {
  const s1c = document.getElementById('s1-circle');
  const s2c = document.getElementById('s2-circle');
  const s3c = document.getElementById('s3-circle');
  const s1l = document.getElementById('s1-label');
  const s2l = document.getElementById('s2-label');
  const s3l = document.getElementById('s3-label');
  const line1 = document.getElementById('line1');
  const line2 = document.getElementById('line2');

  const checkSVG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;

  if (step === 2) {
    s1c.className = 'step-circle done'; s1c.innerHTML = checkSVG;
    s2c.className = 'step-circle active'; s2c.textContent = '2';
    s3c.className = 'step-circle pending'; s3c.textContent = '3';
    s1l.className = 'step-label done'; s2l.className = 'step-label active'; s3l.className = 'step-label';
    line1.className = 'step-line done'; line2.className = 'step-line';
  } else if (step === 3) {
    s1c.className = 'step-circle done'; s1c.innerHTML = checkSVG;
    s2c.className = 'step-circle done'; s2c.innerHTML = checkSVG;
    s3c.className = 'step-circle active'; s3c.textContent = '3';
    s1l.className = 'step-label done'; s2l.className = 'step-label done'; s3l.className = 'step-label active';
    line1.className = 'step-line done'; line2.className = 'step-line done';
  }
}

function validate() {
  const fields = [
    { id: 'inp-name', fg: 'fg-name' },
    { id: 'inp-phone', fg: 'fg-phone' },
    { id: 'inp-id', fg: 'fg-id' },
    { id: 'inp-purpose', fg: 'fg-purpose' },
    { id: 'inp-duration', fg: 'fg-duration' },
    { id: 'inp-date', fg: 'fg-date' },
    { id: 'inp-time', fg: 'fg-time' },
  ];
  let valid = true;
  fields.forEach(f => {
    const el = document.getElementById(f.id);
    const fg = document.getElementById(f.fg);
    fg.classList.remove('has-error');
    if (!el.value.trim()) {
      fg.classList.add('has-error');
      valid = false;
    }
  });
  return valid;
}

function reviewInfo() {
  if (!validate()) return;

  const name = document.getElementById('inp-name').value.trim();
  const phone = document.getElementById('inp-phone').value.trim();
  const idNum = document.getElementById('inp-id').value.trim();
  const purpose = document.getElementById('inp-purpose').value;
  const duration = document.getElementById('inp-duration').value;
  const dateVal = document.getElementById('inp-date').value;
  const timeVal = document.getElementById('inp-time').value;

  const dateDisplay = dateVal ? new Date(dateVal + 'T00:00').toLocaleDateString('en-US') : '';
  const timeDisplay = timeVal;

  document.getElementById('rv-name').textContent = name;
  document.getElementById('rv-phone').textContent = phone;
  document.getElementById('rv-id').textContent = idNum;
  document.getElementById('rv-purpose').textContent = purpose;
  document.getElementById('rv-duration').textContent = duration;
  document.getElementById('rv-datetime').textContent = `${dateDisplay} at ${timeDisplay}`;

  updateStepper(3);
  showScreen('review');
}

function editInfo() {
  updateStepper(2);
  showScreen('form');
}

function submitRegistration() {
  const idNum = document.getElementById('inp-id').value.trim();
  document.getElementById('ss-id').textContent = idNum;

  showScreen('success');

  // Toast
  const toast = document.getElementById('toast');
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

function returnToDashboard() {
  // Reset form
  ['inp-name','inp-phone','inp-id','inp-date','inp-time'].forEach(id => {
    document.getElementById(id).value = '';
  });
  ['inp-purpose','inp-duration'].forEach(id => {
    document.getElementById(id).selectedIndex = 0;
  });
  ['fg-name','fg-phone','fg-id','fg-purpose','fg-duration','fg-date','fg-time'].forEach(id => {
    document.getElementById(id).classList.remove('has-error');
  });

  updateStepper(2);
  showScreen('form');
  alert('Returned to dashboard. (Wire this to your dashboard route.)');
}

function goBack() {
  if (currentScreen === 'review') {
    updateStepper(2);
    showScreen('form');
  } else {
    alert('Navigate back to previous page.');
  }
}
