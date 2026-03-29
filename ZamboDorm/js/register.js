/**
 * ZamboDorm Registration Form Module
 * Handles multi-step account creation with email verification
 */

// ── FORM STATE ──
const FormState = {
  currentStep: 1,
  generatedPin: '728568',

  setStep(step) {
    this.currentStep = step;
  },

  getStep() {
    return this.currentStep;
  },

  setPin(pin) {
    this.generatedPin = pin;
  },

  getPin() {
    return this.generatedPin;
  }
};

// ── DOM ELEMENTS ──
const DOM = {
  // Form inputs
  inputs: {
    email: document.getElementById('email'),
    pin: document.getElementById('pin'),
    firstname: document.getElementById('firstname'),
    lastname: document.getElementById('lastname'),
    phone: document.getElementById('phone'),
    password: document.getElementById('password'),
    confirmpassword: document.getElementById('confirmpassword')
  },

  // Error boxes
  errors: {
    box1: document.getElementById('errorBox1'),
    box2: document.getElementById('errorBox2'),
    box3: document.getElementById('errorBox3'),
    msg2: document.getElementById('verifyErrorMsg'),
    msg3: document.getElementById('detailsErrorMsg')
  },

  // Step containers
  steps: {
    step1: document.getElementById('step1'),
    step2: document.getElementById('step2'),
    step3: document.getElementById('step3'),
    ind1: document.getElementById('step1Ind'),
    ind2: document.getElementById('step2Ind'),
    ind3: document.getElementById('step3Ind')
  },

  // Buttons
  buttons: {
    step1Next: document.getElementById('btnStep1Next'),
    step2Back: document.getElementById('btnStep2Back'),
    step2Next: document.getElementById('btnStep2Next'),
    changeEmail: document.getElementById('changeEmailBtn'),
    submit: document.getElementById('submitBtn')
  },

  // Display elements
  displays: {
    emailDisplay: document.getElementById('emailDisplay'),
    pinDisplay: document.getElementById('pinDisplay')
  },

  // UI elements
  ui: {
    card: document.querySelector('.register-card'),
    toast: document.getElementById('toast')
  }
};

// ── UTILITY FUNCTIONS ──
function clearError(errorBox) {
  errorBox.classList.remove('show');
}

function showError(errorBox, message = '') {
  if (message) {
    const msgSpan = errorBox.querySelector('span');
    if (msgSpan) msgSpan.textContent = message;
  }
  errorBox.classList.add('show');
}

function showToast(msg) {
  const toast = DOM.ui.toast || createToast();
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

function createToast() {
  const toast = document.createElement('div');
  toast.className = 'toast';
  document.body.appendChild(toast);
  return toast;
}

function scrollToCard() {
  DOM.ui.card.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ── INPUT VALIDATION ──
const Validation = {
  email(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },

  step1() {
    const email = DOM.inputs.email.value.trim();
    if (!email || !this.email(email)) {
      showError(DOM.errors.box1);
      return false;
    }
    clearError(DOM.errors.box1);
    return true;
  },

  step2() {
    const pin = DOM.inputs.pin.value.trim();
    if (!pin || pin.length !== 6 || isNaN(pin)) {
      DOM.errors.msg2.textContent = 'Please enter a valid 6-digit code';
      showError(DOM.errors.box2);
      return false;
    }
    if (pin !== FormState.getPin()) {
      DOM.errors.msg2.textContent = 'Invalid code. Try the PIN shown above';
      showError(DOM.errors.box2);
      return false;
    }
    clearError(DOM.errors.box2);
    return true;
  },

  step3() {
    const { firstname, lastname, phone, password, confirmpassword } = DOM.inputs;
    const values = {
      firstname: firstname.value.trim(),
      lastname: lastname.value.trim(),
      phone: phone.value.trim(),
      password: password.value.trim(),
      confirmpassword: confirmpassword.value.trim()
    };

    if (!values.firstname || !values.lastname || !values.phone || !values.password || !values.confirmpassword) {
      DOM.errors.msg3.textContent = 'Please fill in all fields';
      showError(DOM.errors.box3);
      return false;
    }

    if (values.password.length < 6) {
      DOM.errors.msg3.textContent = 'Password must be at least 6 characters';
      showError(DOM.errors.box3);
      return false;
    }

    if (values.password !== values.confirmpassword) {
      DOM.errors.msg3.textContent = 'Passwords do not match';
      showError(DOM.errors.box3);
      return false;
    }

    clearError(DOM.errors.box3);
    return true;
  }
};

// ── STEP MANAGEMENT ──
function updateStepDisplay(stepNum) {
  // Hide all steps
  DOM.steps.step1.classList.remove('active');
  DOM.steps.step2.classList.remove('active');
  DOM.steps.step3.classList.remove('active');

  // Show active step
  DOM.steps[`step${stepNum}`].classList.add('active');

  // Update indicators
  DOM.steps.ind1.classList.toggle('active', stepNum >= 1);
  DOM.steps.ind2.classList.toggle('active', stepNum >= 2);
  DOM.steps.ind3.classList.toggle('active', stepNum >= 3);
}

function goToStep(stepNum) {
  // Validate current step before advancing
  const currentStep = FormState.getStep();
  if (stepNum > currentStep) {
    if (currentStep === 1 && !Validation.step1()) return;
    if (currentStep === 2 && !Validation.step2()) return;
  }

  FormState.setStep(stepNum);
  updateStepDisplay(stepNum);

  // Step-specific logic
  if (stepNum === 2) {
    DOM.displays.emailDisplay.textContent = DOM.inputs.email.value;
    DOM.inputs.pin.value = '';
    clearError(DOM.errors.box2);
    setupPinRotation(); // Start PIN rotation on step 2
  }

  if (stepNum === 1) {
    stopPinRotation(); // Stop PIN rotation when leaving step 2
    DOM.inputs.pin.value = '';
    clearError(DOM.errors.box2);
  }

  if (stepNum === 3) {
    stopPinRotation(); // Stop PIN rotation when on step 3
  }

  scrollToCard();
}

// ── PASSWORD TOGGLE ──
function setupPasswordToggle(toggleBtn, inputField) {
  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    const isText = inputField.type === 'text';
    inputField.type = isText ? 'password' : 'text';
    toggleBtn.innerHTML = isText
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
}

// ── GENERATE RANDOM PIN ──
function generateRandomPin() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

let pinRotationInterval; // Store interval ID for cleanup

function setupPinRotation() {
  // Clear any existing interval
  if (pinRotationInterval) clearInterval(pinRotationInterval);

  // Generate initial random PIN
  const newPin = generateRandomPin();
  DOM.displays.pinDisplay.textContent = newPin;
  FormState.setPin(newPin);

  // Rotate PIN every 60 seconds (1 minute)
  pinRotationInterval = setInterval(() => {
    const updatedPin = generateRandomPin();
    DOM.displays.pinDisplay.textContent = updatedPin;
    FormState.setPin(updatedPin);
  }, 60000); // 60000ms = 1 minute
}

function stopPinRotation() {
  if (pinRotationInterval) {
    clearInterval(pinRotationInterval);
    pinRotationInterval = null;
  }
}

// ── PIN INPUT RESTRICTIONS ──
function setupPinInput() {
  const pin = DOM.inputs.pin;

  // Numbers only on keypress
  pin.addEventListener('keypress', (e) => {
    if (!/[0-9]/.test(e.key)) e.preventDefault();
  });

  // Allow navigation keys on keydown
  pin.addEventListener('keydown', (e) => {
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
    if (!allowedKeys.includes(e.key) && !/[0-9]/.test(e.key)) {
      e.preventDefault();
    }
  });

  // Allow paste of numbers only
  pin.addEventListener('paste', (e) => {
    e.preventDefault();
    const paste = (e.clipboardData || window.clipboardData).getData('text');
    const cleanedPaste = paste.replace(/\D/g, '').slice(0, 6);
    if (cleanedPaste) pin.value = cleanedPaste;
  });
}

// ── AUTO-HIDE ERRORS ──
function setupInputListeners() {
  DOM.inputs.email.addEventListener('input', () => clearError(DOM.errors.box1));
  DOM.inputs.pin.addEventListener('input', () => clearError(DOM.errors.box2));
  DOM.inputs.firstname.addEventListener('input', () => clearError(DOM.errors.box3));
  DOM.inputs.lastname.addEventListener('input', () => clearError(DOM.errors.box3));
  DOM.inputs.phone.addEventListener('input', () => clearError(DOM.errors.box3));
  DOM.inputs.password.addEventListener('input', () => clearError(DOM.errors.box3));
  DOM.inputs.confirmpassword.addEventListener('input', () => clearError(DOM.errors.box3));
}

// ── BUTTON HANDLERS ──
function setupButtonListeners() {
  DOM.buttons.step1Next.addEventListener('click', () => goToStep(2));
  DOM.buttons.step2Back.addEventListener('click', () => goToStep(1));
  DOM.buttons.step2Next.addEventListener('click', () => goToStep(3));
  DOM.buttons.changeEmail.addEventListener('click', () => goToStep(1));

  DOM.buttons.submit.addEventListener('click', async () => {
    if (!Validation.step3()) return;

    // Show loading state
    DOM.steps.step3.classList.add('loading');
    DOM.buttons.submit.classList.add('loading');
    DOM.buttons.submit.disabled = true;

    // Simulate account creation
    await new Promise(r => setTimeout(r, 2000));

    // Save user data to localStorage before redirecting
    const firstName = DOM.inputs.firstname.value.trim();
    const lastName = DOM.inputs.lastname.value.trim();
    const fullName = `${firstName} ${lastName}`;
    
    if (typeof UserManager !== 'undefined') {
      UserManager.setUser({
        name: fullName,
        email: DOM.inputs.email.value.trim(),
        phone: DOM.inputs.phone.value.trim(),
        authenticated: true
      });
    }

    // Redirect after loading completes
    window.location.href = './dorm-preferences.html?registered=true';
  });
}

// ── INITIALIZATION ──
function init() {
  setupInputListeners();
  setupPasswordToggle(document.getElementById('pwToggle'), DOM.inputs.password);
  setupPasswordToggle(document.getElementById('pwToggle2'), DOM.inputs.confirmpassword);
  setupPinInput();
  setupButtonListeners();
}

// Start initialization when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
