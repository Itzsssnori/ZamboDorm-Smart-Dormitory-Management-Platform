// Initialize user data on page load
document.addEventListener('DOMContentLoaded', initializeUserData);

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('overlay').classList.toggle('active');
}

// Initialize user profile data from localStorage or user-manager
function initializeUserData() {
  const userData = getCurrentUser();
  
  if (userData) {
    populateProfileBadge(userData);
    populateFormFields(userData);
    updateAvatarDisplay(userData);
  }
}

// Get current user from user-manager or localStorage
function getCurrentUser() {
  // Try UserManager first
  if (typeof UserManager !== 'undefined' && UserManager.getUser) {
    return UserManager.getUser();
  }
  
  // Fallback to localStorage
  const stored = localStorage.getItem('user');
  return stored ? JSON.parse(stored) : null;
}

// Populate profile badge with user data
function populateProfileBadge(userData) {
  const { name, email, phone, role, registeredDate } = userData;
  const initials = getInitials(name || 'Guest');
  
  document.getElementById('profileAvatar').textContent = initials;
  document.getElementById('profileName').textContent = name || 'Guest';
  document.getElementById('profileEmail').textContent = email || 'Not signed in';
  
  // Update role display if element exists
  if (document.getElementById('profileRole')) {
    document.getElementById('profileRole').textContent = role ? role.charAt(0).toUpperCase() + role.slice(1) : 'User';
  }
  
  // Update room display if element exists
  if (document.getElementById('profileRoom')) {
    document.getElementById('profileRoom').textContent = '--';
  }
}

// Populate form fields with user data
function populateFormFields(userData) {
  const { name, email, phone, address, birthday } = userData;
  
  // Extract first and last name from full name
  const nameParts = (name || '').split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';
  
  // Populate form fields
  const firstNameEl = document.getElementById('firstName');
  const lastNameEl = document.getElementById('lastName');
  const emailEl = document.getElementById('emailAddress');
  const phoneEl = document.getElementById('phoneNumber');
  const addressEl = document.getElementById('address');
  const birthdayEl = document.getElementById('birthday');
  
  if (firstNameEl) firstNameEl.value = firstName;
  if (lastNameEl) lastNameEl.value = lastName;
  if (emailEl) emailEl.value = email || '';
  if (phoneEl) phoneEl.value = phone || '';
  if (addressEl) addressEl.value = address || '';
  if (birthdayEl) birthdayEl.value = birthday || '';
}

// Update avatar display
function updateAvatarDisplay(userData) {
  const { firstName, lastName } = userData;
  const name = `${firstName || ''} ${lastName || ''}`.trim();
  const initials = getInitials(name);
  document.getElementById('avatarPreview').textContent = initials;
}

// Get initials from name
function getInitials(name) {
  return name
    .split(' ')
    .slice(0, 2)
    .map(n => n.charAt(0).toUpperCase())
    .join('');
}

// Tabs functionality
function switchTab(id, btn) {
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + id).classList.add('active');
  btn.classList.add('active');
}

// Toast notification
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> ' + msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// Password strength checker
function checkPw(val) {
  const bars = [
    document.getElementById('bar1'),
    document.getElementById('bar2'),
    document.getElementById('bar3'),
    document.getElementById('bar4')
  ];
  const hint = document.getElementById('pw-hint');
  
  bars.forEach(b => { b.className = 'pw-bar'; });
  
  let score = 0;
  if (val.length >= 8) score++;
  if (/[A-Z]/.test(val)) score++;
  if (/[0-9]/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;
  
  const strengthClass = score <= 1 ? 'weak' : score <= 2 ? 'medium' : 'strong';
  const labels = ['Weak', 'Weak', 'Medium', 'Strong', 'Strong'];
  
  hint.textContent = val.length ? `Strength: ${labels[score]}` : 'Use letters, numbers & symbols for a stronger password';
  
  for (let i = 0; i < score; i++) {
    bars[i].classList.add(strengthClass);
  }
}

// Avatar upload handler
document.addEventListener('DOMContentLoaded', function() {
  const avatarUpload = document.getElementById('avatarUpload');
  if (avatarUpload) {
    avatarUpload.addEventListener('change', function(e) {
      if (this.files && this.files[0]) {
        const reader = new FileReader();
        reader.onload = function(event) {
          localStorage.setItem('userAvatar', event.target.result);
          showToast('Profile photo updated!');
        };
        reader.readAsDataURL(this.files[0]);
      }
    });
  }
});

// Save profile changes
function saveProfileChanges() {
  const firstNameEl = document.getElementById('firstName');
  const lastNameEl = document.getElementById('lastName');
  const emailEl = document.getElementById('emailAddress');
  const phoneEl = document.getElementById('phoneNumber');
  const emergencyContactEl = document.getElementById('emergencyContact');
  
  // Check if form is valid
  if (!firstNameEl.value.trim()) {
    showToast('First name is required!');
    firstNameEl.focus();
    return;
  }
  if (!lastNameEl.value.trim()) {
    showToast('Last name is required!');
    lastNameEl.focus();
    return;
  }
  if (!emailEl.value.trim()) {
    showToast('Email is required!');
    emailEl.focus();
    return;
  }
  if (!phoneEl.value.trim()) {
    showToast('Phone number is required!');
    phoneEl.focus();
    return;
  }
  if (!emergencyContactEl.value.trim()) {
    showToast('Emergency contact is required!');
    emergencyContactEl.focus();
    return;
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailEl.value)) {
    showToast('Please enter a valid email address!');
    emailEl.focus();
    return;
  }
  
  const userData = {
    firstName: firstNameEl.value,
    lastName: lastNameEl.value,
    email: emailEl.value,
    phone: phoneEl.value,
    emergencyContact: emergencyContactEl.value
  };
  
  localStorage.setItem('user', JSON.stringify({
    ...getCurrentUser(),
    ...userData
  }));
  
  showToast('Profile updated successfully!');
}

// Discard changes
function discardChanges() {
  initializeUserData();
  showToast('Changes discarded.');
}

// Update password with validation
function updatePassword() {
  const currentPwEl = document.querySelector('input[placeholder="Enter current password"]');
  const newPwEl = document.getElementById('newpw');
  const confirmPwEl = document.querySelector('div.form-group .form-input[type="password"]:last-of-type');
  
  // Get all password inputs more reliably
  const passwordInputs = Array.from(document.querySelectorAll('input[type="password"]'));
  if (passwordInputs.length >= 3) {
    const currentPw = passwordInputs[0].value;
    const newPw = passwordInputs[1].value;
    const confirmPw = passwordInputs[2].value;
    
    // Validation
    if (!currentPw.trim()) {
      showToast('Current password is required!');
      return;
    }
    if (!newPw.trim()) {
      showToast('New password is required!');
      return;
    }
    if (!confirmPw.trim()) {
      showToast('Please confirm your password!');
      return;
    }
    if (newPw.length < 8) {
      showToast('Password must be at least 8 characters!');
      return;
    }
    if (newPw !== confirmPw) {
      showToast('Passwords do not match!');
      return;
    }
    
    // Success
    showToast('Password changed successfully!');
    // Clear fields
    passwordInputs.forEach(input => input.value = '');
  }
}
