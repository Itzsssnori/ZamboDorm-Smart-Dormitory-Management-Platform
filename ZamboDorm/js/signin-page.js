// Icon constants
const ICONS = {
  eyeOpen: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>`,
  eyeClosed: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/><line x1="1" y1="1" x2="23" y2="23" stroke-linecap="round" stroke-linejoin="round"/></svg>`
};

// Initialize demo accounts for QA testing
function initializeDemoAccounts() {
  const allUsers = (typeof UserManager !== 'undefined') ? UserManager.getAllUsers() : [];
  
  // Demo accounts template
  const demoAccounts = [
    {
      id: 'USER-DEMO-TENANT-001',
      name: 'Juan dela Cruz',
      email: 'juan.tenant@demo.com',
      password: 'demo123',
      phone: '09123456789',
      address: 'Block 1, Street 1, Zamboanga City',
      birthday: '1990-05-15',
      role: 'tenant',
      authenticated: true,
      registeredDate: new Date().toISOString(),
      isDemoAccount: true
    },
    {
      id: 'USER-DEMO-ADMIN-001',
      name: 'Maria Santos',
      email: 'maria.admin@demo.com',
      password: 'demo123',
      phone: '09234567890',
      address: 'Admin Building, Zamboanga City',
      birthday: '1985-03-22',
      role: 'admin',
      authenticated: true,
      registeredDate: new Date().toISOString(),
      isDemoAccount: true
    },
    {
      id: 'USER-DEMO-SYSADMIN-001',
      name: 'Carlos Rodriguez',
      email: 'carlos.sysadmin@demo.com',
      password: 'demo123',
      phone: '09345678901',
      address: 'System Admin Office, Zamboanga City',
      birthday: '1988-07-10',
      role: 'sysadmin',
      authenticated: true,
      registeredDate: new Date().toISOString(),
      isDemoAccount: true
    }
  ];
  
  // Only add demo accounts if they don't exist
  const demoAccountEmails = demoAccounts.map(acc => acc.email);
  const hasAllDemoAccounts = demoAccountEmails.every(email => 
    allUsers.some(u => u.email === email)
  );
  
  if (!hasAllDemoAccounts) {
    // Filter out duplicate demo accounts
    const uniqueUsers = allUsers.filter(u => !demoAccountEmails.includes(u.email));
    // Add new demo accounts
    const updatedUsers = [...uniqueUsers, ...demoAccounts];
    
    if (typeof UserManager !== 'undefined') {
      UserManager.saveAllUsers(updatedUsers);
    } else {
      localStorage.setItem('zambodorm_all_users', JSON.stringify(updatedUsers));
    }
  }
}

// Render registered users (for development reference only - hidden)
function renderRegisteredUsers() {
  const container = document.querySelector('.signin-card__demo-accounts');
  if (!container) return;
  
  const users = (typeof UserManager !== 'undefined') ? UserManager.getAllUsers() : [];
  
  if (users.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:#999;padding:1rem;">No registered users yet. Create an account to get started.</p>';
    return;
  }
  
  container.innerHTML = users.map(user => `
    <div class="signin-card__demo-item" onclick="fillDemo('${user.email}','${user.password}')">
      <div class="signin-card__demo-role">
        <span class="signin-card__demo-dot signin-card__demo-dot--${user.role.toLowerCase()}"></span>
        <span class="signin-card__demo-role-label">${user.role}</span>
      </div>
      <span class="signin-card__demo-creds">${user.email}</span>
      <span class="signin-card__demo-action">Use →</span>
    </div>
  `).join('');
}

// Utility: Show toast notification
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

// Utility: Fill form with credentials
function fillDemo(email, password) {
  document.getElementById('email').value = email;
  document.getElementById('password').value = password;
  document.getElementById('errorBox').classList.remove('show');
  showToast(`Filled: ${email}`);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  // Initialize demo accounts for QA testing
  initializeDemoAccounts();
  
  // Render all registered users (including demo accounts)
  renderRegisteredUsers();
  
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
    
    // Verify credentials against registered users
    const user = (typeof UserManager !== 'undefined') ? UserManager.loginUser(email, password) : null;
    
    if (!user) {
      // Reset button
      btn.classList.remove('loading');
      btn.disabled = false;
      
      // Show error
      errorBox.innerHTML = '<svg class="signin-card__error-icon" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg><span>Invalid email or password. Please try again or create a new account.</span>';
      errorBox.classList.add('show');
      return;
    }
    
    // Reset button
    btn.classList.remove('loading');
    btn.disabled = false;
    
    showToast('✓ Signed in successfully!');
    
    // Redirect based on user role
    const role = (user.role || 'tenant').toLowerCase();
    if (role === 'sysadmin' || role === 'system admin') {
      window.location.href = './sysadmin-overview.html';
    } else if (role === 'admin' || role === 'landlord') {
      window.location.href = './admin-overview.html';
    } else {
      window.location.href = './tenant-myroom.html';
    }
  });
});
