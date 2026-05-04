 // ── Data ────────────────────────────────────────────────────────────────
    const STORAGE_KEY = 'zd_announcements';

    const DEFAULT_DATA = [
      {
        id: 1,
        title: 'General Dorm Cleaning – Feb 7, 8 AM to 12 PM',
        body: 'There will be a mandatory general cleaning of all common areas including hallways, lobby, and recreational facilities. Please ensure your rooms are tidied up and dispose of any items blocking common areas.',
        category: 'general',
        pinned: true,
        date: '2026-02-03',
        postedBy: 'Admin'
      },
      {
        id: 2,
        title: 'Water interruption resolved – Unit 2 restored',
        body: 'The water interruption in Unit 2 has been successfully resolved. All facilities are now fully operational. We apologize for any inconvenience caused during the maintenance period.',
        category: 'resolved',
        pinned: false,
        date: '2026-01-28',
        postedBy: 'Admin'
      },
      {
        id: 3,
        title: 'Visitor curfew updated: guests must leave by 9 PM',
        body: 'Effective immediately, all visitors must exit the dormitory by 9:00 PM. This policy is being implemented to ensure safety and maintain peaceful living conditions. Please inform your guests accordingly.',
        category: 'urgent',
        pinned: false,
        date: '2026-01-20',
        postedBy: 'Admin'
      },
      {
        id: 4,
        title: 'New WiFi credentials distributed to all tenants',
        body: 'Updated WiFi credentials have been distributed via email. If you haven\'t received them yet, please visit the admin office. The new password will be effective immediately, and all previous credentials will be invalidated.',
        category: 'info',
        pinned: false,
        date: '2026-01-15',
        postedBy: 'Admin'
      }
    ];

    function loadData() {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        saveData(DEFAULT_DATA);
        return DEFAULT_DATA;
      }
      return JSON.parse(raw);
    }

    function saveData(data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    const announcements = loadData();
    let deleteTargetId = null;

    // Use shared utility functions
    const escHtml = ZDUtils.escapeHtml;
    const formatDate = ZDUtils.formatDate;

    function renderList(list) {
      const container = document.getElementById('announcementsList');
      if (!list.length) {
        container.innerHTML = `
          <div class="empty-state">
            <svg viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="var(--primary)" stroke-width="1.2" stroke-linecap="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <p>No announcements found</p>
            <span>Try adjusting your filters or post a new announcement.</span>
          </div>`;
        return;
      }

      container.innerHTML = list.map((a, i) => {
        const cat = CATEGORY_LABELS[a.category] || CATEGORY_LABELS.general;
        return `
        <div class="announcement-card ${a.pinned ? 'announcement-card--pinned' : ''}"
             style="animation-delay:${i * 0.05}s">
          <div class="card-top">
            <div class="card-top__left">
              <h3 class="card-title">${escHtml(a.title)}</h3>
              <span class="tag ${cat.cls}">${cat.label}</span>
              ${a.pinned ? '<span class="tag tag--pinned">📌 Pinned</span>' : ''}
            </div>
            <div class="card-actions">
              <button class="action-btn" title="Edit" onclick="openEditModal(${a.id})">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
              <button class="action-btn" title="${a.pinned ? 'Unpin' : 'Pin'}" onclick="togglePin(${a.id})">
                <svg viewBox="0 0 24 24" fill="${a.pinned ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
              </button>
              <button class="action-btn action-btn--danger" title="Delete" onclick="openDeleteModal(${a.id})">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                  <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                </svg>
              </button>
            </div>
          </div>
          <p class="card-body">${escHtml(a.body)}</p>
          <div class="card-meta">
            <span class="meta-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              Posted ${formatDate(a.date)}
            </span>
            <span class="meta-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              ${escHtml(a.postedBy)}
            </span>
          </div>
        </div>`;
      }).join('');
    }

    function updateStats() {
      document.getElementById('statTotal').textContent  = announcements.length;
      document.getElementById('statPinned').textContent = announcements.filter(a => a.pinned).length;
      document.getElementById('statInfo').textContent   = announcements.filter(a => a.category === 'info').length;
      document.getElementById('statUrgent').textContent = announcements.filter(a => a.category === 'urgent').length;
    }

    function filterAnnouncements() {
      const q   = document.getElementById('searchInput').value.toLowerCase();
      const cat = document.getElementById('filterCategory').value;
      const sort = document.getElementById('filterSort').value;

      let list = [...announcements];

      if (q)           list = list.filter(a => a.title.toLowerCase().includes(q) || a.body.toLowerCase().includes(q));
      if (cat !== 'all') list = list.filter(a => a.category === cat);

      if (sort === 'newest') list.sort((a, b) => new Date(b.date) - new Date(a.date));
      if (sort === 'oldest') list.sort((a, b) => new Date(a.date) - new Date(b.date));
      if (sort === 'pinned') list.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

      renderList(list);
    }

    // ── Modal helpers ────────────────────────────────────────────────────────
    function openPostModal() {
      document.getElementById('modalTitle').textContent = 'New Announcement';
      document.getElementById('postBtnLabel').textContent = 'Post Announcement';
      document.getElementById('editId').value = '';
      document.getElementById('inputTitle').value = '';
      document.getElementById('inputBody').value = '';
      document.getElementById('inputCategory').value = 'general';
      document.getElementById('inputPinned').checked = false;
      document.getElementById('inputDate').value = new Date().toISOString().split('T')[0];
      updateCharCount(document.getElementById('inputTitle'), 'titleCount', 100);
      updateCharCount(document.getElementById('inputBody'), 'bodyCount', 600);
      document.getElementById('postModal').classList.add('active');
    }

    function openEditModal(id) {
      const a = announcements.find(x => x.id === id);
      if (!a) return;
      document.getElementById('modalTitle').textContent = 'Edit Announcement';
      document.getElementById('postBtnLabel').textContent = 'Save Changes';
      document.getElementById('editId').value = id;
      document.getElementById('inputTitle').value = a.title;
      document.getElementById('inputBody').value = a.body;
      document.getElementById('inputCategory').value = a.category;
      document.getElementById('inputPinned').checked = a.pinned;
      document.getElementById('inputDate').value = a.date;
      updateCharCount(document.getElementById('inputTitle'), 'titleCount', 100);
      updateCharCount(document.getElementById('inputBody'), 'bodyCount', 600);
      document.getElementById('postModal').classList.add('active');
    }

    function closePostModal() {
      document.getElementById('postModal').classList.remove('active');
    }

    function openDeleteModal(id) {
      deleteTargetId = id;
      document.getElementById('deleteModal').classList.add('active');
    }

    function closeDeleteModal() {
      deleteTargetId = null;
      document.getElementById('deleteModal').classList.remove('active');
    }

    function handleOverlayClick(e, modalId) {
      if (e.target.id === modalId) {
        document.getElementById(modalId).classList.remove('active');
        if (modalId === 'deleteModal') deleteTargetId = null;
      }
    }

    // ── CRUD ─────────────────────────────────────────────────────────────────
    function saveAnnouncement() {
      const title    = document.getElementById('inputTitle').value.trim();
      const body     = document.getElementById('inputBody').value.trim();
      const category = document.getElementById('inputCategory').value;
      const pinned   = document.getElementById('inputPinned').checked;
      const date     = document.getElementById('inputDate').value || new Date().toISOString().split('T')[0];
      const editId   = document.getElementById('editId').value;

      if (!title) { shake('inputTitle'); return; }
      if (!body)  { shake('inputBody');  return; }

      if (editId) {
        const idx = announcements.findIndex(a => a.id === parseInt(editId));
        if (idx !== -1) {
          announcements[idx] = { ...announcements[idx], title, body, category, pinned, date };
          ZDUtils.showToast('Announcement updated!');
        }
      } else {
        const newId = announcements.length ? Math.max(...announcements.map(a => a.id)) + 1 : 1;
        announcements.unshift({ id: newId, title, body, category, pinned, date, postedBy: 'Admin' });
        ZDUtils.showToast('Announcement posted!');
      }

      saveData(announcements);
      updateStats();
      filterAnnouncements();
      closePostModal();
    }

    function confirmDelete() {
      if (deleteTargetId === null) return;
      announcements = announcements.filter(a => a.id !== deleteTargetId);
      saveData(announcements);
      updateStats();
      filterAnnouncements();
      closeDeleteModal();
      ZDUtils.showToast('Announcement deleted.');
    }

    function togglePin(id) {
      const a = announcements.find(x => x.id === id);
      if (!a) return;
      a.pinned = !a.pinned;
      saveData(announcements);
      updateStats();
      filterAnnouncements();
      ZDUtils.showToast(a.pinned ? 'Announcement pinned.' : 'Announcement unpinned.');
    }

    // ── Helpers ──────────────────────────────────────────────────────────────
    function updateCharCount(el, countId, max) {
      const len = el.value.length;
      const span = document.getElementById(countId);
      span.textContent = `${len} / ${max}`;
      span.className = 'char-count' + (len > max * 0.9 ? (len >= max ? ' over' : ' warn') : '');
    }

    function shake(inputId) {
      const el = document.getElementById(inputId);
      el.style.borderColor = 'var(--danger)';
      el.style.animation = 'none';
      el.focus();
      setTimeout(() => { el.style.borderColor = ''; }, 1500);
    }

    // ── Init ─────────────────────────────────────────────────────────────────
    updateStats();
    filterAnnouncements();