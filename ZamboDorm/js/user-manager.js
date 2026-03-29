/**
 * USER MANAGER - Handle user data and authentication state
 * Centralized user management across all files (DRY principle)
 */

const UserManager = {
  // Get current user from localStorage
  getUser() {
    const user = localStorage.getItem('zambodorm_user');
    return user ? JSON.parse(user) : null;
  },

  // Set user data (called on account creation/login)
  setUser(userData) {
    localStorage.setItem('zambodorm_user', JSON.stringify(userData));
  },

  // Get user's display name
  getName() {
    const user = this.getUser();
    return user?.name || 'User';
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
