/**
 * user-approval-store.js
 * Shared store for user account creation requests that go through
 * sysadmin approval before being activated.
 *
 * Storage key: "zd_user_requests"
 * Each request object:
 * {
 *   id          : string  (uuid)
 *   firstname   : string
 *   middlename  : string
 *   lastname    : string
 *   username    : string
 *   passwordHash: string  (plain for demo; hash in prod)
 *   role        : "security"|"admin"|"staff"
 *   idFileName  : string|null
 *   idFileData  : string|null  (base64 data URL)
 *   status      : "pending"|"approved"|"rejected"
 *   createdAt   : ISO string
 *   reviewedAt  : ISO string|null
 *   reviewNotes : string
 *   dormitory   : string  (which dorm/admin submitted this)
 * }
 */

const UserApprovalStore = (() => {
  const KEY = 'zd_user_requests';

  function _load() {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
    catch { return []; }
  }

  function _save(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
  }

  function _uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

  return {
    /** Submit a new user creation request from admin side */
    submit(data) {
      const all = _load();
      const entry = {
        id:           _uuid(),
        firstname:    data.firstname   || '',
        middlename:   data.middlename  || '',
        lastname:     data.lastname    || '',
        username:     data.username    || '',
        passwordHash: data.password    || '',
        role:         data.role        || 'security',
        idFileName:   data.idFileName  || null,
        idFileData:   data.idFileData  || null,
        status:       'pending',
        createdAt:    new Date().toISOString(),
        reviewedAt:   null,
        reviewNotes:  '',
        dormitory:    data.dormitory   || 'Unknown Dorm',
      };
      all.push(entry);
      _save(all);
      return entry;
    },

    /** Get all requests (optionally filter by status) */
    getAll(status = null) {
      const all = _load();
      return status ? all.filter(r => r.status === status) : all;
    },

    /** Get pending count */
    getPendingCount() {
      return _load().filter(r => r.status === 'pending').length;
    },

    /** Approve a request */
    approve(id, notes = '') {
      const all = _load();
      const idx = all.findIndex(r => r.id === id);
      if (idx === -1) return null;
      all[idx].status      = 'approved';
      all[idx].reviewedAt  = new Date().toISOString();
      all[idx].reviewNotes = notes;
      _save(all);
      // Also push into the active users list so admin panel shows them
      UserApprovalStore._pushToActiveUsers(all[idx]);
      return all[idx];
    },

    /** Reject a request */
    reject(id, notes = '') {
      const all = _load();
      const idx = all.findIndex(r => r.id === id);
      if (idx === -1) return null;
      all[idx].status      = 'rejected';
      all[idx].reviewedAt  = new Date().toISOString();
      all[idx].reviewNotes = notes;
      _save(all);
      return all[idx];
    },

    /** Internal: push approved user into zd_users so admin pages see them */
    _pushToActiveUsers(req) {
      try {
        const usersKey = 'zd_users';
        const users = JSON.parse(localStorage.getItem(usersKey) || '[]');
        // avoid duplicates
        if (users.find(u => u.username === req.username)) return;
        users.push({
          id:          req.id,
          name:        [req.firstname, req.middlename, req.lastname].filter(Boolean).join(' '),
          username:    req.username,
          password:    req.passwordHash,
          role:        req.role,
          status:      'active',
          dateCreated: req.createdAt,
          idFileName:  req.idFileName,
          idFileData:  req.idFileData,
        });
        localStorage.setItem(usersKey, JSON.stringify(users));
      } catch(e) { console.warn('Could not push to active users:', e); }
    },

    /** Clear all (dev helper) */
    clear() { localStorage.removeItem(KEY); }
  };
})();

// Make available globally
window.UserApprovalStore = UserApprovalStore;