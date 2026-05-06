/**
 * ZamboDorm Chatbot Web Component.
 *
 * Mirrors the <zd-navbar> pattern: define a custom element that renders
 * itself in connectedCallback, then auto-mount one instance per page.
 *
 * Adoption is two lines per page:
 *   <link rel="stylesheet" href="../css/chatbot.css">
 *   <script src="../js/chatbot.js" defer></script>
 *
 * The component will inject itself into <body> on DOMContentLoaded —
 * pages do not need to add a <zd-chatbot> tag manually.
 */

// ─── FAQ Corpus ──────────────────────────────────────────────────────────
// Cross-audience questions distilled from the project's help pages.
// Answers contain authored markup (<strong>, <em>) — they are NOT user
// input, so it's safe to render via innerHTML.
const FAQS = [
  {
    id: 'rent-due',
    category: 'payments',
    question: 'When is rent due each month?',
    answer: `Rent is due on the <strong>7th of every month</strong> by default. The exact day can be configured per dorm by the admin under <strong>Settings → Dorm Configuration</strong>.`
  },
  {
    id: 'payment-methods',
    category: 'payments',
    question: 'What payment methods are accepted?',
    answer: `<strong>GCash</strong>, <strong>Maya</strong>, <strong>bank transfer</strong>, and <strong>cash</strong>. Online payments require uploading proof of payment for admin verification. Cash payments are recorded by admin against an official receipt.`
  },
  {
    id: 'payment-late',
    category: 'payments',
    question: 'What happens if I miss the payment deadline?',
    answer: `A late fee of <strong>₱200 per 5 days overdue</strong> is applied automatically. Admin can waive the fee with a logged reason if a valid grace period was approved.`
  },
  {
    id: 'visiting-hours',
    category: 'visitors',
    question: 'What are the visiting hours?',
    answer: `Default visiting hours are <strong>8:00 AM – 9:00 PM</strong>. Your dorm may have different hours — check the admin's posted rules or <strong>Settings → Dorm Configuration</strong>.`
  },
  {
    id: 'visitor-register',
    category: 'visitors',
    question: 'How do I register a visitor?',
    answer: `Tenants: open <strong>Visitors → Add</strong> and enter the visitor's name, relationship, expected date/time, and ID type. Admin reviews under <strong>Visitor Logs → Pending Approvals</strong>. Visitors must present a valid ID at the front desk.`
  },
  {
    id: 'service-request',
    category: 'services',
    question: 'How do I request a maintenance or repair service?',
    answer: `Open <strong>Request Service</strong> from the sidebar, pick a category (Electrical, Plumbing, etc.), and describe the issue. Admin moves it through <em>Pending → In Progress → Completed</em>, and you'll be notified at each stage.`
  },
  {
    id: 'complaint',
    category: 'services',
    question: 'How do I file a complaint?',
    answer: `Open <strong>Complaints</strong> from the sidebar, pick a category (noise, maintenance, neighbor, etc.), and describe the situation. Reports are submitted anonymously to admin. For urgent issues, contact the front desk directly.`
  },
  {
    id: 'password-change',
    category: 'account',
    question: 'How do I change my password?',
    answer: `Go to <strong>Settings → Privacy &amp; Security → Change Password</strong>. You'll need your current password to confirm the change.`
  },
  {
    id: 'password-forgot',
    category: 'account',
    question: 'I forgot my password — how do I recover my account?',
    answer: `Use the <strong>Forgot password</strong> link on the sign-in page. A reset link will be sent to your registered email. If you no longer have access to that email, contact the front desk.`
  },
  {
    id: 'room-info',
    category: 'rooms',
    question: 'How do I view my room details and lease info?',
    answer: `Open <strong>My Room</strong> from the sidebar. You'll see your room number, floor, lease start and end dates, monthly rate, and included amenities. If anything looks wrong, message the admin.`
  },
  {
    id: 'lease-end',
    category: 'rooms',
    question: 'How do I check out or end my lease?',
    answer: `Tenants request checkout from their account. Admin processes it via <strong>Tenants → End Lease</strong> — settling outstanding balances, logging the room inspection, and refunding or deducting the security deposit. Once confirmed, the room is marked Vacant.`
  },
  {
    id: 'curfew',
    category: 'rules',
    question: 'What is the curfew policy?',
    answer: `The default curfew is <strong>10:00 PM on weekdays</strong>; weekend hours are configured per dorm. The official house rules posted at the front desk are authoritative.`
  }
];

const CATEGORY_META = {
  payments: { label: 'Payments',         icon: '💸' },
  visitors: { label: 'Visitors',         icon: '👥' },
  services: { label: 'Help & Repairs',   icon: '🔧' },
  account:  { label: 'Account',          icon: '🔐' },
  rooms:    { label: 'Rooms & Lease',    icon: '🏠' },
  rules:    { label: 'Dorm Rules',       icon: '📋' }
};

// Render order — matches the priority of cross-audience usage.
const CATEGORY_ORDER = ['payments', 'visitors', 'services', 'account', 'rooms', 'rules'];

// ─── Web Component ───────────────────────────────────────────────────────

class ZDChatbot extends HTMLElement {
  constructor() {
    super();
    this._open = false;
    this._onKeydown = this._onKeydown.bind(this);
  }

  connectedCallback() {
    this.render();
    this.attachEventListeners();
  }

  disconnectedCallback() {
    document.removeEventListener('keydown', this._onKeydown);
  }

  // ── Rendering ──────────────────────────────────────────────────────

  render() {
    this.innerHTML = `
      <button class="zd-chatbot-fab" type="button"
              aria-label="Open help assistant"
              aria-expanded="false"
              aria-controls="zd-chatbot-panel">
        <svg class="zd-chatbot-robot" viewBox="0 0 48 48" aria-hidden="true">
          <line x1="24" y1="4" x2="24" y2="9"
                stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
          <circle cx="24" cy="3" r="2" fill="currentColor"/>
          <rect x="9"  y="9"  width="30" height="26" rx="7"
                fill="currentColor" opacity="0.22"/>
          <rect x="11" y="11" width="26" height="22" rx="6"
                fill="currentColor"/>
          <circle cx="19" cy="22" r="3.2" fill="#fff"/>
          <circle cx="29" cy="22" r="3.2" fill="#fff"/>
          <circle cx="20" cy="22" r="1.3" fill="#1e1b4b"/>
          <circle cx="30" cy="22" r="1.3" fill="#1e1b4b"/>
          <path d="M19 28 Q24 31 29 28" stroke="#fff"
                stroke-width="2" stroke-linecap="round" fill="none"/>
          <rect x="6"  y="18" width="3" height="8" rx="1.5" fill="currentColor"/>
          <rect x="39" y="18" width="3" height="8" rx="1.5" fill="currentColor"/>
          <circle cx="14" cy="38" r="2" fill="currentColor"/>
          <circle cx="34" cy="38" r="2" fill="currentColor"/>
        </svg>
      </button>

      <div class="zd-chatbot-panel"
           id="zd-chatbot-panel"
           role="dialog"
           aria-modal="false"
           aria-labelledby="zd-chatbot-title"
           hidden>
        <header class="zd-chatbot-header">
          <div class="zd-chatbot-header-info">
            <span class="zd-chatbot-avatar" aria-hidden="true">🤖</span>
            <div class="zd-chatbot-titleblock">
              <h2 id="zd-chatbot-title" class="zd-chatbot-title">ZamboDorm Helper</h2>
              <p class="zd-chatbot-subtitle">Ask me anything about the dorm</p>
            </div>
          </div>
          <button class="zd-chatbot-close" type="button"
                  aria-label="Close help assistant">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6L18 18M6 18L18 6"
                    stroke="currentColor" stroke-width="2.4"
                    stroke-linecap="round"/>
            </svg>
          </button>
        </header>

        <section class="zd-chatbot-messages" aria-live="polite"></section>
      </div>
    `;

    this._fab      = this.querySelector('.zd-chatbot-fab');
    this._panel    = this.querySelector('.zd-chatbot-panel');
    this._closeBtn = this.querySelector('.zd-chatbot-close');
    this._messages = this.querySelector('.zd-chatbot-messages');

    this._renderInitialState();
  }

  _renderInitialState() {
    this._messages.innerHTML = '';
    this._appendBubble(
      `Hi 👋 I'm the ZamboDorm helper. Pick a topic below to see common answers, or ask another time.`,
      'bot'
    );
    this._appendSuggestions();
  }

  _appendBubble(html, type = 'bot') {
    const bubble = document.createElement('div');
    bubble.className = `zd-chatbot-bubble zd-chatbot-bubble--${type}`;
    bubble.innerHTML = html;
    this._messages.appendChild(bubble);
    this._scrollToBottom();
    return bubble;
  }

  _appendSuggestions() {
    const grouped = FAQS.reduce((acc, faq) => {
      (acc[faq.category] ||= []).push(faq);
      return acc;
    }, {});

    const wrapper = document.createElement('div');
    wrapper.className = 'zd-chatbot-suggestions';

    for (const cat of CATEGORY_ORDER) {
      const items = grouped[cat];
      if (!items || items.length === 0) continue;
      const meta = CATEGORY_META[cat];

      const group = document.createElement('div');
      group.className = 'zd-chatbot-suggestion-group';
      group.innerHTML = `
        <div class="zd-chatbot-suggestion-label">
          <span class="zd-chatbot-suggestion-icon" aria-hidden="true">${meta.icon}</span>
          ${meta.label}
        </div>
        <div class="zd-chatbot-suggestion-list">
          ${items.map(f => `
            <button class="zd-chatbot-suggestion" type="button"
                    data-faq-id="${f.id}">${f.question}</button>
          `).join('')}
        </div>
      `;
      wrapper.appendChild(group);
    }

    this._messages.appendChild(wrapper);
    this._scrollToBottom();
    return wrapper;
  }

  _appendBackButton() {
    const back = document.createElement('button');
    back.type = 'button';
    back.className = 'zd-chatbot-back';
    back.innerHTML = `<span aria-hidden="true">←</span> Back to FAQs`;
    this._messages.appendChild(back);
    this._scrollToBottom();
    return back;
  }

  // ── Click flow ─────────────────────────────────────────────────────

  _handleFAQClick(faqId) {
    const faq = FAQS.find(f => f.id === faqId);
    if (!faq) return;

    // Drop the suggestions block + any leftover back button so the
    // conversation reads naturally as it grows.
    this._messages.querySelectorAll('.zd-chatbot-suggestions, .zd-chatbot-back')
      .forEach(el => el.remove());

    this._appendBubble(faq.question, 'user');
    this._appendBubble(faq.answer, 'bot');
    this._appendBackButton();
  }

  _handleBackToFAQs() {
    const back = this._messages.querySelector('.zd-chatbot-back');
    if (back) back.remove();
    this._appendBubble(`Sure — what else can I help with?`, 'bot');
    this._appendSuggestions();
  }

  _scrollToBottom() {
    this._messages.scrollTop = this._messages.scrollHeight;
  }

  // ── Event wiring ───────────────────────────────────────────────────

  attachEventListeners() {
    this._fab.addEventListener('click', () => this.toggle());
    this._closeBtn.addEventListener('click', () => this.close());
    document.addEventListener('keydown', this._onKeydown);

    // Event delegation: catches FAQ chips and the Back button as they
    // are appended/removed dynamically without re-binding listeners.
    this._messages.addEventListener('click', (e) => {
      const chip = e.target.closest('.zd-chatbot-suggestion');
      if (chip) {
        this._handleFAQClick(chip.dataset.faqId);
        return;
      }
      const back = e.target.closest('.zd-chatbot-back');
      if (back) {
        this._handleBackToFAQs();
      }
    });
  }

  _onKeydown(e) {
    if (e.key === 'Escape' && this._open) {
      this.close();
      this._fab.focus();
    }
  }

  // ── Open/close state ───────────────────────────────────────────────

  toggle() { this._open ? this.close() : this.open(); }

  open() {
    this._open = true;
    this._panel.hidden = false;
    this.classList.add('is-open');
    this._fab.setAttribute('aria-expanded', 'true');
    requestAnimationFrame(() => this._closeBtn.focus());
  }

  close() {
    this._open = false;
    this._panel.hidden = true;
    this.classList.remove('is-open');
    this._fab.setAttribute('aria-expanded', 'false');
  }
}

customElements.define('zd-chatbot', ZDChatbot);

// Auto-mount one instance per page so adopting pages don't need
// to remember to drop a <zd-chatbot> tag in their markup.
function mountZDChatbot() {
  if (!document.querySelector('zd-chatbot')) {
    document.body.appendChild(document.createElement('zd-chatbot'));
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountZDChatbot);
} else {
  mountZDChatbot();
}
