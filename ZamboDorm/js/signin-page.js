// Icon constants
const ICONS = {
  eyeOpen: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>`,
  eyeClosed: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/><line x1="1" y1="1" x2="23" y2="23" stroke-linecap="round" stroke-linejoin="round"/></svg>`
};

const DEMO_ACCOUNTS = [
  { email: 'tenant@example.com', password: 'tenant123', role: 'Tenant', type: 'tenant' },
  { email: 'landlord@example.com', password: 'landlord123', role: 'Landlord', type: 'landlord' },
  { email: 'sysadmin@zambodorm.com', password: 'admin123', role: 'System Admin', type: 'sysadmin' }
];

// Render demo accounts
function renderDemoAccounts() {
  const container = document.querySelector('.signin-card__demo-accounts');
  container.innerHTML = DEMO_ACCOUNTS.map(acc => `
    <div class="signin-card__demo-item" onclick="fillDemo('${acc.email}','${acc.password}')">
      <div class="signin-card__demo-role">
        <span class="signin-card__demo-dot signin-card__demo-dot--${acc.type}"></span>
        <span class="signin-card__demo-role-label">${acc.role}</span>
      </div>
      <span class="signin-card__demo-creds">${acc.email} / ${acc.password}</span>
      <span class="signin-card__demo-action">Use →</span>
    </div>
  `).join('');
}

// Utility: Show toast notification
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

// Utility: Fill form with demo credentials
function fillDemo(email, password) {
  document.getElementById('email').value = email;
  document.getElementById('password').value = password;
  document.getElementById('errorBox').classList.remove('show');
  showToast(`Filled: ${email}`);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  renderDemoAccounts();
  
  // Hamburger menu toggle (if exists)
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }
  
  // Password visibility toggle
  const pwToggle = document.getElementById('pwToggle');
  const pwInput = document.getElementById('password');
  if (pwToggle) {
    pwToggle.addEventListener('click', () => {
      const isText = pwInput.type === 'text';
      pwInput.type = isText ? 'password' : 'text';
      pwToggle.innerHTML = isText ? ICONS.eyeClosed : ICONS.eyeOpen;
    });
  }
  
  // Form elements
  const signInForm = document.getElementById('signinForm');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const errorBox = document.getElementById('errorBox');
  
  // Clear error on input
  emailInput.addEventListener('input', () => {
    errorBox.classList.remove('show');
    emailInput.classList.remove('input--error');
  });
  passwordInput.addEventListener('input', () => {
    errorBox.classList.remove('show');
    passwordInput.classList.remove('input--error');
  });
  
  // Form submit handler
  signInForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    
    // Validate and add visual feedback
    let hasError = false;
    if (!email) {
      emailInput.classList.add('input--error');
      hasError = true;
    } else {
      emailInput.classList.remove('input--error');
    }
    
    if (!password) {
      passwordInput.classList.add('input--error');
      hasError = true;
    } else {
      passwordInput.classList.remove('input--error');
    }
    
    if (hasError) {
      errorBox.classList.add('show');
      return;
    }
    
    errorBox.classList.remove('show');
    
    // Submit button state
    const btn = document.getElementById('signinBtn');
    btn.classList.add('loading');
    btn.disabled = true;
    
    // Simulate auth delay
    await new Promise(r => setTimeout(r, 1600));
    
    // Reset button
    btn.classList.remove('loading');
    btn.disabled = false;
    
    showToast('✓ Signed in successfully!');
    
    // Redirect based on account type
    const account = DEMO_ACCOUNTS.find(a => a.email === email);
    if (!account) {
      window.location.href = './tenant-myroom.html';
    } else if (account.type === 'sysadmin') {
      window.location.href = './sysadmin-overview.html';
    } else if (account.type === 'landlord') {
      window.location.href = './admin-overview.html';
    } else {
      window.location.href = './tenant-myroom.html';
    }
  });
});
