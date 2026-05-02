/**
 * USER MANAGER - Handle user data and authentication state
 * Centralized user management across all files (DRY principle)
 */

const UserManager = {
  // Generate unique user ID
  generateUserId() {
    return 'USER-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  },

  // Get all registered users from localStorage
  getAllUsers() {
    const users = localStorage.getItem('zambodorm_all_users');
    return users ? JSON.parse(users) : [];
  },

  // Save all users to localStorage
  saveAllUsers(users) {
    localStorage.setItem('zambodorm_all_users', JSON.stringify(users));
  },

  // Get current user from localStorage
  getUser() {
    const user = localStorage.getItem('zambodorm_user');
    return user ? JSON.parse(user) : null;
  },

  // Set user data (called on account creation/login)
  setUser(userData) {
    // Ensure user has an ID
    if (!userData.id) {
      userData.id = this.generateUserId();
    }
    localStorage.setItem('zambodorm_user', JSON.stringify(userData));
  },

  // Register new user (add to all users list)
  registerUser(userData) {
    const userId = this.generateUserId();
    const userWithId = {
      ...userData,
      id: userId,
      registeredDate: new Date().toISOString()
    };
    
    // Add to all users list
    const allUsers = this.getAllUsers();
    allUsers.push(userWithId);
    this.saveAllUsers(allUsers);
    
    // Set as current user
    this.setUser(userWithId);
    
    return userWithId;
  },

  // Login user (verify credentials)
  loginUser(email, password) {
    const allUsers = this.getAllUsers();
    const user = allUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
      this.setUser(user);
      return user;
    }
    return null;
  },

  // Check if email already exists
  emailExists(email) {
    const allUsers = this.getAllUsers();
    return allUsers.some(u => u.email === email);
  },

  // Get user's display name
  getName() {
    const user = this.getUser();
    return user?.name || 'User';
  },

  // Get user's ID
  getId() {
    const user = this.getUser();
    return user?.id || null;
  },

  // Get user's role
  getRole() {
    const user = this.getUser();
    return user?.role || 'tenant';
  },

  // Get user's initials for avatar
  getInitials() {
    const name = this.getName();
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getUser();
  },

  // Logout with confirmation
  logout() {
    const confirmed = confirm('Are you sure you want to log out?');
    if (confirmed) {
      localStorage.removeItem('zambodorm_user');
      window.location.href = './signin-page.html';
    }
  },

  // Clear user data on logout
  clearUser() {
    localStorage.removeItem('zambodorm_user');
  }
};
