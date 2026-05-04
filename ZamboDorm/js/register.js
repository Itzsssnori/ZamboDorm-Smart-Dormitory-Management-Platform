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
    middlename: document.getElementById('middlename'), // New optional input
    lastname: document.getElementById('lastname'),
    birthday: document.getElementById('birthday'),     // New required input
    phone: document.getElementById('phone'),
    address: document.getElementById('address'),
    password: document.getElementById('password'),
    confirmpassword: document.getElementById('confirmpassword')
  },

  // Error boxes
  errors: {
    // ... your other existing error boxes ...
    boxFirstName: document.getElementById('errorBoxFirstName'),
    boxLastName: document.getElementById('errorBoxLastName'),
    boxBirthday: document.getElementById('errorBoxBirthday'),
    boxEmail: document.getElementById('errorBoxEmail'),
    boxPhone: document.getElementById('errorBoxPhone'),
    boxAddress: document.getElementById('errorBoxAddress'),
    box2: document.getElementById('errorBox2'),
    box3: document.getElementById('errorBox3')
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
    step2Next: document.getElementById('btnStep2Next'),
    btnSendCode: document.getElementById('btnSendCode'),
    step3Back: document.getElementById('btnStep3Back'),
    submit: document.getElementById('submitBtn')
  },

  // Display elements
  displays: {
    pinDisplay: document.getElementById('pinDisplay')
  },

  // UI elements
  ui: {
    card: document.querySelector('.register-card'),
    toast: document.getElementById('toast'),
    pinSection: document.getElementById('pinVerificationSection')
  }
};

// ── UTILITY FUNCTIONS ──
function clearError(errorBox) {
  if (!errorBox) return;
  errorBox.classList.remove('show');
  // Handle the inline style="display: none;" added to the HTML
  errorBox.style.display = 'none'; 
}

function showError(errorBox, message = '') {
  if (!errorBox) return;
  if (message) {
    const msgSpan = errorBox.querySelector('span');
    if (msgSpan) msgSpan.textContent = message;
  }
  errorBox.classList.add('show');
  // Override the inline display:none to make it visible
  errorBox.style.display = 'flex'; 
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
  step1() {
    const { firstname, lastname, birthday, email, phone, address } = DOM.inputs;
    let isValid = true;

    if (!firstname.value.trim()) {
      showError(DOM.errors.boxFirstName);
      isValid = false;
    } else {
      clearError(DOM.errors.boxFirstName);
    }

    if (!lastname.value.trim()) {
      showError(DOM.errors.boxLastName);
      isValid = false;
    } else {
      clearError(DOM.errors.boxLastName);
    }

    if (!birthday.value.trim()) {
      showError(DOM.errors.boxBirthday);
      isValid = false;
    } else {
      clearError(DOM.errors.boxBirthday);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
      showError(DOM.errors.boxEmail);
      isValid = false;
    } else {
      clearError(DOM.errors.boxEmail);
    }

    const phoneValue = phone.value.trim();
    const phoneRegex = /^[0-9+\s()-]+$/;
    if (!phoneValue) {
      showError(DOM.errors.boxPhone, 'Please input your phone number');
      isValid = false;
    } else if (!phoneRegex.test(phoneValue)) {
      showError(DOM.errors.boxPhone, 'Please enter a valid phone number');
      isValid = false;
    } else {
      clearError(DOM.errors.boxPhone);
    }

    const addressValue = address.value.trim();
    if (!addressValue) {
      showError(DOM.errors.boxAddress, 'Please input your address');
      isValid = false;
    } else {
      clearError(DOM.errors.boxAddress);
    }

    return isValid;
  },

  step2() {
    clearError(DOM.errors.box2);
    const pinValue = DOM.inputs.pin.value.trim();

    if (!pinValue) {
      showError(DOM.errors.box2, 'Please enter the verification code');
      return false;
    }

    if (pinValue !== FormState.getPin()) {
      showError(DOM.errors.box2, 'Invalid verification code');
      return false;
    }

    return true;
  },

  step3() {
    clearError(DOM.errors.box3);
    const password = DOM.inputs.password;
    const confirmPassword = DOM.inputs.confirmpassword;

    if (!password.value.trim() || password.value.length < 6) {
      showError(DOM.errors.box3, 'Password must be at least 6 characters');
      return false;
    }
    if (password.value !== confirmPassword.value) {
      showError(DOM.errors.box3, 'Passwords do not match');
      return false;
    }

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
    DOM.inputs.pin.value = '';
    clearError(DOM.errors.box2);
    if (DOM.ui.pinSection) DOM.ui.pinSection.style.display = 'none';
    if (DOM.buttons.btnSendCode) DOM.buttons.btnSendCode.style.display = 'block';
    if (DOM.buttons.step2Next) DOM.buttons.step2Next.style.display = 'none';
  }

  if (stepNum === 1) {
    stopPinRotation();
    DOM.inputs.pin.value = '';
    clearError(DOM.errors.box2);
  }

  if (stepNum === 3) {
    stopPinRotation();
  }

  scrollToCard();
}

// ── PASSWORD TOGGLE ──
function setupPasswordToggle(toggleBtn, inputField) {
  if (!toggleBtn) return;

  // Set initial icon
  toggleBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
            <line x1="1" y1="1" x2="23" y2="23"/>
          </svg>`;

  toggleBtn.addEventListener('click', () => {
    const isText = inputField.type === 'text';
    inputField.type = isText ? 'password' : 'text';
    toggleBtn.innerHTML = isText
      ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
            <line x1="1" y1="1" x2="23" y2="23"/>
          </svg>`
      : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z"/>
            <circle cx="12" cy="12" r="3"/>
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
  DOM.inputs.firstname.addEventListener('input', () => clearError(DOM.errors.boxFirstName));
  DOM.inputs.lastname.addEventListener('input', () => clearError(DOM.errors.boxLastName));
  DOM.inputs.birthday.addEventListener('input', () => clearError(DOM.errors.boxBirthday));
  DOM.inputs.email.addEventListener('input', () => clearError(DOM.errors.boxEmail));
  DOM.inputs.phone.addEventListener('input', () => clearError(DOM.errors.boxPhone));
  DOM.inputs.address.addEventListener('input', () => clearError(DOM.errors.boxAddress));
}

// ── BUTTON HANDLERS ──
function setupButtonListeners() {
  DOM.buttons.step1Next.addEventListener('click', () => goToStep(2));
  DOM.buttons.step2Next.addEventListener('click', () => goToStep(3));
  if (DOM.buttons.step3Back) DOM.buttons.step3Back.addEventListener('click', () => goToStep(1));

  // Verification Method logic
  if (DOM.buttons.btnSendCode) {
    DOM.buttons.btnSendCode.addEventListener('click', () => {
      const method = document.querySelector('input[name="verify_method"]:checked').value;
      const methodLabel = method === 'email' ? 'Email' : 'Phone';
      
      showToast(`Verification code sent to your ${methodLabel}!`);
      
      // Start PIN logic
      setupPinRotation();
      
      // Show PIN input section
      if (DOM.ui.pinSection) DOM.ui.pinSection.style.display = 'block';
      if (DOM.buttons.btnSendCode) DOM.buttons.btnSendCode.style.display = 'none';
      if (DOM.buttons.step2Next) DOM.buttons.step2Next.style.display = '';
      if (DOM.buttons.step2Next) DOM.buttons.step2Next.classList.remove('hidden');
    });
  }

  DOM.buttons.submit.addEventListener('click', async () => {
    if (!Validation.step3()) return;

    // Show loading state
    DOM.steps.step3.classList.add('loading');
    DOM.buttons.submit.classList.add('loading');
    DOM.buttons.submit.disabled = true;

    // Simulate account creation
    await new Promise(r => setTimeout(r, 2000));

    // Formatted name combining optional middle name
    const firstName = DOM.inputs.firstname.value.trim();
    const middleName = DOM.inputs.middlename.value.trim();
    const lastName = DOM.inputs.lastname.value.trim();
    const fullName = middleName ? `${firstName} ${middleName} ${lastName}` : `${firstName} ${lastName}`;
    const email = DOM.inputs.email.value.trim();
    const password = DOM.inputs.password.value.trim();
    
    // --> NEW: Grab the selected role from the radio buttons
    const selectedRole = document.querySelector('input[name="account_role"]:checked').value;
    
    // Check if email already exists
    const allUsers = (typeof UserManager !== 'undefined') ? UserManager.getAllUsers() : [];
    if (allUsers.some(u => u.email === email)) {
      showError(DOM.errors.box3, 'This email is already registered. Please use a different email or sign in.');
      DOM.steps.step3.classList.remove('loading');
      DOM.buttons.submit.classList.remove('loading');
      DOM.buttons.submit.disabled = false;
      return;
    }
    
    if (typeof UserManager !== 'undefined') {
      // Register new user with the centralized manager
      UserManager.registerUser({
        name: fullName,
        email: email,
        password: password,
        phone: DOM.inputs.phone.value.trim(),
        address: DOM.inputs.address.value.trim(),
        birthday: DOM.inputs.birthday.value,
        role: selectedRole,
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