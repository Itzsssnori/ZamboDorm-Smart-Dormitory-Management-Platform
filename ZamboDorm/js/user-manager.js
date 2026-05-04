/**
 * USER MANAGER - Centralized Auth Logic
 * Handles persistence using 'zambodorm_users' and 'active_user'
 */

const UserManager = {
  // Constants for localStorage keys
  KEYS: {
    USERS: 'zambodorm_users',
    ACTIVE: 'active_user'
  },

  // Get all registered users
  getAllUsers() {
    try {
      const users = localStorage.getItem(this.KEYS.USERS);
      return users ? JSON.parse(users) : [];
    } catch (e) {
      console.error("Error reading users from localStorage", e);
      return [];
    }
  },

  // Save all users
  saveAllUsers(users) {
    localStorage.setItem(this.KEYS.USERS, JSON.stringify(users));
  },

  // Get current session user
  getUser() {
    try {
      const user = localStorage.getItem(this.KEYS.ACTIVE);
      return user ? JSON.parse(user) : null;
    } catch (e) {
      console.error("Error reading active session", e);
      return null;
    }
  },

  // Set current session user
  setUser(userData) {
    if (userData) {
      localStorage.setItem(this.KEYS.ACTIVE, JSON.stringify(userData));
    }
  },

  // Register a new user
  registerUser(userData) {
    const allUsers = this.getAllUsers();
    
    // Ensure ID and registration date
    const newUser = {
      ...userData,
      id: userData.id || 'USER-' + Date.now(),
      registeredDate: new Date().toISOString()
    };
    
    allUsers.push(newUser);
    this.saveAllUsers(allUsers);
    
    // Auto-login after registration
    this.setUser(newUser);
    return newUser;
  },

  // Login verification
  loginUser(emailOrUsername, password) {
    const allUsers = this.getAllUsers();
    // Check against email OR name (username)
    const user = allUsers.find(u => 
      (u.email === emailOrUsername || u.name === emailOrUsername) && 
      u.password === password
    );
    
    if (user) {
      this.setUser(user);
      return user;
    }
    return null;
  },

  // Auth checks
  isAuthenticated() {
    return !!this.getUser();
  },

  getName() {
    return this.getUser()?.name || 'User';
  },

  getRole() {
    return this.getUser()?.role || 'tenant';
  },

  getInitials() {
    const name = this.getName();
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  },

  logout() {
    localStorage.removeItem(this.KEYS.ACTIVE);
    window.location.href = (window.location.pathname.includes('/html/')) ? './signin-page.html' : 'html/signin-page.html';
  },

  // Helper to sync common greeting elements across different dashboards
  updatePageGreetings() {
    if (!this.isAuthenticated()) return;
    
    const name = this.getName();
    const firstName = name.split(' ')[0];
    
    // Update elements by ID
    const greetingTitle = document.getElementById('greeting-title');
    const guardName = document.getElementById('guardName');
    
    if (greetingTitle) greetingTitle.textContent = `Buen Vida, ${firstName}!`;
    if (guardName) guardName.textContent = name;
    
    // Update elements by selectors (common patterns)
    const welcomeSub = document.querySelector('.greeting-subtitle');
    if (welcomeSub && welcomeSub.textContent.includes('Welcome')) {
      welcomeSub.textContent = `Welcome back, ${firstName}!`;
    }
    
    const headerPara = document.querySelector('.page-header p');
    if (headerPara && headerPara.textContent.includes('Welcome back')) {
      headerPara.textContent = `Welcome back, ${name}! Here's what's happening today in ZamboDorm.`;
    }

    const sysSub = document.querySelector('.page-subtitle');
    if (sysSub && sysSub.textContent.includes('Welcome back')) {
      sysSub.textContent = `Welcome back, ${name}! Here's what's happening across the system.`;
    }
  }
};
