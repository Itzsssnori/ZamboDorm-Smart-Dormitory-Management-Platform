// Hamburger
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});
mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

// Form elements
const registerForm = document.getElementById('registerForm');
const emailInput = document.getElementById('email');
const pinInput = document.getElementById('pin');
const fullnameInput = document.getElementById('fullname');
const passwordInput = document.getElementById('password');
const accounttypeInput = document.getElementById('accounttype');

const errorBox1 = document.getElementById('errorBox');
const errorBox2 = document.getElementById('errorBox2');
const errorBox3 = document.getElementById('errorBox3');

const pwToggle = document.getElementById('pwToggle');
const stepIndicators = document.querySelectorAll('.step-indicator');
const formSteps = document.querySelectorAll('.form-step');
const nextButtons = document.querySelectorAll('.btn-next');
const backButtons = document.querySelectorAll('.btn-back');

let currentStep = 1;

// Hide errors on input
emailInput.addEventListener('input', () => errorBox1.classList.remove('show'));
pinInput.addEventListener('input', () => errorBox2.classList.remove('show'));
fullnameInput.addEventListener('input', () => errorBox3.classList.remove('show'));
passwordInput.addEventListener('input', () => errorBox3.classList.remove('show'));
accounttypeInput.addEventListener('input', () => errorBox3.classList.remove('show'));

// Password toggle
pwToggle.addEventListener('click', () => {
  const isText = passwordInput.type === 'text';
  passwordInput.type = isText ? 'password' : 'text';
  pwToggle.innerHTML = isText
    ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
         <path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z"/>
         <circle cx="12" cy="12" r="3"/>
       </svg>`
    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
         <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
         <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
         <line x1="1" y1="1" x2="23" y2="23"/>
       </svg>`;
});

// Validation functions
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function validateStep1() {
  const email = emailInput.value.trim();
  if (!email || !validateEmail(email)) {
    errorBox1.classList.add('show');
    return false;
  }
  errorBox1.classList.remove('show');
  return true;
}

function validateStep2() {
  const pin = pinInput.value.trim();
  if (!pin || pin.length !== 6 || isNaN(pin)) {
    document.getElementById('verifyErrorMsg').textContent = 'Please enter a valid 6-digit code';
    errorBox2.classList.add('show');
    return false;
  }
  // Verify with the generated demo PIN
  if (pin !== window.currentDemoPin && pin !== '123456') {
    document.getElementById('verifyErrorMsg').textContent = `Invalid code. Try the PIN shown above`;
    errorBox2.classList.add('show');
    return false;
  }
  errorBox2.classList.remove('show');
  return true;
}

function validateStep3() {
  const fullname = fullnameInput.value.trim();
  const password = passwordInput.value.trim();
  const accounttype = accounttypeInput.value;

  if (!fullname || !password || !accounttype) {
    document.getElementById('detailsErrorMsg').textContent = 'Please fill in all fields';
    errorBox3.classList.add('show');
    return false;
  }

  if (password.length < 6) {
    document.getElementById('detailsErrorMsg').textContent = 'Password must be at least 6 characters';
    errorBox3.classList.add('show');
    return false;
  }

  errorBox3.classList.remove('show');
  return true;
}

// Demo PIN generation
function generateDemoPin() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Change step
function goToStep(step) {
  // Validate current step before moving forward
  if (step > currentStep) {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
  }

  currentStep = step;

  // Update form steps
  formSteps.forEach(s => s.classList.remove('active'));
  const activeStep = document.querySelector(`[data-step="${step}"]`);
  if (activeStep) {
    activeStep.classList.add('active');
  }

  // Update step indicators
  stepIndicators.forEach(indicator => {
    const indicatorStep = parseInt(indicator.getAttribute('data-step'));
    indicator.classList.toggle('active', indicatorStep <= step);
  });

  // Display email and demo PIN when going to step 2
  if (step === 2) {
    const email = emailInput.value;
    const displayEmailEl = document.getElementById('displayEmail');
    if (displayEmailEl) {
      displayEmailEl.textContent = email;
    }
    
    const demoPin = generateDemoPin();
    const demoPinEl = document.getElementById('demoPinDisplay');
    if (demoPinEl) {
      demoPinEl.textContent = demoPin;
    }
    window.currentDemoPin = demoPin;
    pinInput.value = '';
    errorBox2.classList.remove('show');
  }

  // Reset PIN input when returning to step 1
  if (step === 1) {
    pinInput.value = '';
    errorBox2.classList.remove('show');
  }

  // Scroll to top
  document.querySelector('.register-card').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Next button handlers
nextButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const nextStep = parseInt(btn.getAttribute('data-step')) + 1;
    goToStep(nextStep);
  });
});

// Back button handlers
backButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const prevStep = parseInt(btn.getAttribute('data-step')) - 1;
    goToStep(prevStep);
  });
});

// Change email button
const changeEmailBtn = document.querySelector('.change-email-btn');
if (changeEmailBtn) {
  changeEmailBtn.addEventListener('click', () => {
    goToStep(1);
  });
}

// Form submit
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!validateStep3()) return;

  const submitBtn = document.getElementById('submitBtn');
  submitBtn.classList.add('loading');
  submitBtn.disabled = true;

  // Simulate account creation
  await new Promise(r => setTimeout(r, 2000));

  submitBtn.classList.remove('loading');
  submitBtn.disabled = false;
  showToast('✓ Account created successfully!');

  // Redirect to signin after 2 seconds
  setTimeout(() => {
    window.location.href = './signin-page.html';
  }, 2000);
});

// Toast
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// PIN input - allow only numbers
pinInput.addEventListener('keypress', (e) => {
  if (!/[0-9]/.test(e.key)) {
    e.preventDefault();
  }
});

pinInput.addEventListener('keydown', (e) => {
  // Allow backspace, delete, arrow keys, tab
  const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
  if (!allowedKeys.includes(e.key)) {
    // Only prevent if it's not a number
    if (!/[0-9]/.test(e.key)) {
      e.preventDefault();
    }
  }
});

// PIN input - allow paste of numbers only
pinInput.addEventListener('paste', (e) => {
  e.preventDefault();
  const paste = (e.clipboardData || window.clipboardData).getData('text');
  const cleanedPaste = paste.replace(/\D/g, '').slice(0, 6);
  if (cleanedPaste) {
    pinInput.value = cleanedPaste;
  }
});
