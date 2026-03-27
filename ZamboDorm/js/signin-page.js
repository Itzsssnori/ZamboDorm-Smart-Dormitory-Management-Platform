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

// Password toggle
const pwToggle = document.getElementById('pwToggle');
const pwInput = document.getElementById('password');
pwToggle.addEventListener('click', () => {
  const isText = pwInput.type === 'text';
  pwInput.type = isText ? 'password' : 'text';
  pwToggle.innerHTML = isText
    ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
         <path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z"/>
         <circle cx="12" cy="12" r="3"/>
       </svg>`
    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
         <path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z"/>
         <circle cx="12" cy="12" r="3"/>
         <line x1="1" y1="1" x2="23" y2="23" stroke-linecap="round" stroke-linejoin="round"/>
       </svg>`;
});

// Error handling
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const errorBox = document.getElementById('errorBox');

function hideError() {
  errorBox.classList.remove('show');
}

emailInput.addEventListener('input', hideError);
passwordInput.addEventListener('input', hideError);

// Demo fill
function fillDemo(email, password) {
  document.getElementById('email').value = email;
  document.getElementById('password').value = password;
  hideError();
  showToast(`Filled: ${email}`);
}

// Toast
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

// Form submit
document.getElementById('signinForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  
  // Check if fields are empty
  if (!email || !password) {
    errorBox.classList.add('show');
    return;
  }
  
  errorBox.classList.remove('show');
  const btn = document.getElementById('signinBtn');
  btn.classList.add('loading');
  btn.disabled = true;
  // Simulate auth
  await new Promise(r => setTimeout(r, 1600));
  btn.classList.remove('loading');
  btn.disabled = false;
  showToast('✓ Signed in successfully!');
  
  // Redirect based on account type
  if (email === 'sysadmin@zambodorm.com') {
    // Admin account - redirect to admin overview
    window.location.href = './admin-overview.html';
  } else if (email === 'landlord@example.com') {
    // Landlord account - redirect to admin overview
    window.location.href = './admin-overview.html';
  } else if (email === 'tenant@example.com') {
    // Tenant account - redirect to tenant myroom
    window.location.href = './tenant-myroom.html';
  } else {
    // Default redirect for other accounts
    window.location.href = './tenant-myroom.html';
  }
});
