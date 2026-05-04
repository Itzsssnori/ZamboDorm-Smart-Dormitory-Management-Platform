/**
 * ZamboDorm Shared Utilities
 * Centralized helper functions used across various modules.
 */

const ZDUtils = {
  /**
   * Escapes HTML characters to prevent XSS.
   * @param {string} str - The string to escape.
   * @returns {string} - The escaped string.
   */
  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },

  /**
   * Formats a date string to a human-readable format (en-PH).
   * @param {string} dateStr - The ISO date string (YYYY-MM-DD).
   * @returns {string} - Formatted date.
   */
  formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    // Append T00:00:00 to avoid timezone shifts for date-only strings
    const d = new Date(dateStr.includes('T') ? dateStr : dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
  },

  /**
   * Shows a toast notification.
   * @param {string} msg - The message to display.
   * @param {number} dur - Duration in ms.
   */
  showToast(msg, dur = 3000) {
    let toast = document.getElementById('toast');
    let msgSpan = document.getElementById('toast-msg');
    
    // Fallback if toast elements don't exist
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.className = 'toast';
      msgSpan = document.createElement('span');
      msgSpan.id = 'toast-msg';
      toast.appendChild(msgSpan);
      document.body.appendChild(toast);
    }

    msgSpan.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), dur);
  }
};

// Export if in a module environment, otherwise attach to window
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ZDUtils;
} else {
  window.ZDUtils = ZDUtils;
}
