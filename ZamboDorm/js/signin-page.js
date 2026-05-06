'use strict';

const ICONS = {
  eyeOpen:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>`,
  eyeClosed: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/><line x1="1" y1="1" x2="23" y2="23" stroke-linecap="round" stroke-linejoin="round"/></svg>`
};

const HARDCODED_DEMO_EMAILS = [
  'juan.tenant@demo.com',
  'maria.admin@demo.com',
  'carlos.sysadmin@demo.com',
  'pedro.security@demo.com',
];

function initializeDemoAccounts() {
  const allUsers = (typeof UserManager !== 'undefined') ? UserManager.getAllUsers() : [];

  const demoAccounts = [
    { id:'USER-DEMO-TENANT-001',   name:'Juan dela Cruz',    email:'juan.tenant@demo.com',     password:'demo123', role:'tenant',   phone:'09123456789', address:'Block 1, Zamboanga City',       birthday:'1990-05-15', authenticated:true, registeredDate:new Date().toISOString(), isDemoAccount:true },
    { id:'USER-DEMO-ADMIN-001',    name:'Maria Santos',      email:'maria.admin@demo.com',      password:'demo123', role:'admin',    phone:'09234567890', address:'Admin Building, Zamboanga City', birthday:'1985-03-22', authenticated:true, registeredDate:new Date().toISOString(), isDemoAccount:true },
    { id:'USER-DEMO-SYSADMIN-001', name:'Carlos Rodriguez',  email:'carlos.sysadmin@demo.com',  password:'demo123', role:'sysadmin', phone:'09345678901', address:'System Admin Office',            birthday:'1988-07-10', authenticated:true, registeredDate:new Date().toISOString(), isDemoAccount:true },
    { id:'USER-DEMO-SECURITY-001', name:'Pedro Reyes',       email:'pedro.security@demo.com',   password:'demo123', role:'security', phone:'09456789012', address:'Guard House, Zamboanga City',   birthday:'1992-11-05', authenticated:true, registeredDate:new Date().toISOString(), isDemoAccount:true },
  ];

  const demoEmails = demoAccounts.map(a => a.email);
  const hasAll = demoEmails.every(e => allUsers.some(u => u.email === e));
  if (!hasAll) {
    const unique  = allUsers.filter(u => !demoEmails.includes(u.email));
    const updated = [...unique, ...demoAccounts];
    if (typeof UserManager !== 'undefined') UserManager.saveAllUsers(updated);
    else localStorage.setItem('zambodorm_all_users', JSON.stringify(updated));
  }

  syncSecurityUsersFromAdminSettings();
}

function syncSecurityUsersFromAdminSettings() {
  const zdUsers = JSON.parse(localStorage.getItem('zd_security_users') || '[]');
  if (!zdUsers.length) return;

  const allUsers = (typeof UserManager !== 'undefined')
    ? UserManager.getAllUsers()
    : JSON.parse(localStorage.getItem('zambodorm_all_users') || '[]');

  let changed = false;
  zdUsers.forEach(u => {
    if (u.status === 'inactive') return;
    const existing = allUsers.find(x => x.email === u.username || x.zdId === u.id);
    if (!existing) {
      allUsers.push({ id:`USER-SEC-${u.id}`, zdId:u.id, name:u.name, email:u.username, password:u.password, role:u.role||'security', authenticated:true, registeredDate:new Date().toISOString(), isDemoAccount:false });
      changed = true;
    } else if (existing.password !== u.password || existing.role !== u.role) {
      existing.password = u.password;
      existing.role = u.role;
      changed = true;
    }
  });

  if (changed) {
    if (typeof UserManager !== 'undefined') UserManager.saveAllUsers(allUsers);
    else localStorage.setItem('zambodorm_all_users', JSON.stringify(allUsers));
  }
}

// Only renders accounts created via Admin Settings (not the hardcoded 4)
function renderRegisteredUsers() {
  const container = document.getElementById('dynamic-accounts');
  if (!container) return;

  const zdUsers = JSON.parse(localStorage.getItem('zd_security_users') || '[]');
  const extra   = zdUsers.filter(u => u.status === 'active' && !HARDCODED_DEMO_EMAILS.includes(u.username));

  if (!extra.length) { container.innerHTML = ''; return; }

  const roleConfig = {
    security: { label:'Security Guard', dot:'security' },
    admin:    { label:'Admin',          dot:'admin'    },
    staff:    { label:'Staff',          dot:'staff'    },
  };

  container.innerHTML = extra.map(u => {
    const cfg = roleConfig[u.role] || { label:u.role, dot:'staff' };
    return `
      <div class="signin-card__demo-item" onclick="fillDemo('${esc(u.username)}','${esc(u.password)}')">
        <div class="signin-card__demo-role">
          <span class="signin-card__demo-dot signin-card__demo-dot--${cfg.dot}"></span>
          <span class="signin-card__demo-role-label">${cfg.label} · ${esc(u.name)}</span>
        </div>
        <span class="signin-card__demo-creds">${esc(u.username)}</span>
        <span class="signin-card__demo-action">Use →</span>
      </div>`;
  }).join('');
}

function esc(str) {
  return String(str||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

function fillDemo(email, password) {
  document.getElementById('email').value    = email;
  document.getElementById('password').value = password;
  document.getElementById('errorBox').classList.remove('show');
  showToast(`Filled: ${email}`);
}

function redirectByRole(role) {
  const r = (role||'tenant').toLowerCase();
  if      (r === 'sysadmin' || r === 'system admin') window.location.href = './sysadmin-overview.html';
  else if (r === 'admin'    || r === 'landlord')      window.location.href = './admin-overview.html';
  else if (r === 'security' || r === 'guard')         window.location.href = './guard-dashboard.html';
  else                                                 window.location.href = './tenant-myroom.html';
}

document.addEventListener('DOMContentLoaded', () => {
  initializeDemoAccounts();
  renderRegisteredUsers();

  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => { hamburger.classList.toggle('open'); mobileMenu.classList.toggle('open'); });
    mobileMenu.querySelectorAll('a').forEach(l => l.addEventListener('click', () => { hamburger.classList.remove('open'); mobileMenu.classList.remove('open'); }));
  }

  const pwToggle = document.getElementById('pwToggle');
  const pwInput  = document.getElementById('password');
  if (pwToggle) {
    pwToggle.addEventListener('click', () => {
      const isText = pwInput.type === 'text';
      pwInput.type = isText ? 'password' : 'text';
      pwToggle.innerHTML = isText ? ICONS.eyeClosed : ICONS.eyeOpen;
    });
  }

  const signInForm    = document.getElementById('signinForm');
  const emailInput    = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const errorBox      = document.getElementById('errorBox');

  emailInput.addEventListener('input',    () => { errorBox.classList.remove('show'); emailInput.classList.remove('input--error'); });
  passwordInput.addEventListener('input', () => { errorBox.classList.remove('show'); passwordInput.classList.remove('input--error'); });

  signInForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email    = emailInput.value.trim();
    const password = passwordInput.value.trim();

    let hasError = false;
    if (!email)    { emailInput.classList.add('input--error');    hasError = true; } else emailInput.classList.remove('input--error');
    if (!password) { passwordInput.classList.add('input--error'); hasError = true; } else passwordInput.classList.remove('input--error');
    if (hasError)  { errorBox.classList.add('show'); return; }
    errorBox.classList.remove('show');

    const btn = document.getElementById('signinBtn');
    btn.classList.add('loading');
    btn.disabled = true;

    await new Promise(r => setTimeout(r, 1200));

    // Primary auth via UserManager
    let user = (typeof UserManager !== 'undefined') ? UserManager.loginUser(email, password) : null;

    // Fallback: zd_security_users by username (accounts created in Admin Settings)
    if (!user) {
      const zdUsers = JSON.parse(localStorage.getItem('zd_security_users') || '[]');
      const match   = zdUsers.find(u => u.username === email && u.password === password && u.status === 'active');
      if (match) user = { name: match.name, role: match.role || 'security' };
    }

    btn.classList.remove('loading');
    btn.disabled = false;

    if (!user) {
      errorBox.innerHTML = `<svg class="signin-card__error-icon" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg><span>Invalid credentials. Please try again.</span>`;
      errorBox.classList.add('show');
      return;
    }

    showToast('✓ Signed in successfully!');
    setTimeout(() => redirectByRole(user.role), 400);
  });
});
