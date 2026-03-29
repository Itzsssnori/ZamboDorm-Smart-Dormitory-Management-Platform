// Tenant My Room - JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
  initializePageFeatures();
});

// Initialize page features
function initializePageFeatures() {
  updateGreetingWithUserName();
  setupMobileNavigation();
  setupInteractiveElements();
  setupResponsiveness();
}

// Update greeting with user's name
function updateGreetingWithUserName() {
  const greetingTitle = document.getElementById('greeting-title');
  if (greetingTitle && UserManager) {
    const userName = UserManager.getName();
    const firstName = userName.split(' ')[0];
    greetingTitle.textContent = `Buen Vida, ${firstName}!`;
  }
}

// Mobile Navigation Toggle
function setupMobileNavigation() {
  const hamburger = document.getElementById('hbg');
  const mobNav = document.getElementById('mob');
  const sidebar = document.getElementById('sidebar');

  if (hamburger) {
    hamburger.addEventListener('click', function() {
      mobNav.classList.toggle('active');
      sidebar.classList.toggle('active');
    });
  }

  // Close mobile nav when clicking links
  const mobLinks = document.querySelectorAll('.mob a');
  mobLinks.forEach(link => {
    link.addEventListener('click', function() {
      mobNav.classList.remove('active');
      sidebar.classList.remove('active');
    });
  });
}

// Setup Interactive Elements
function setupInteractiveElements() {
  // Logout Button
  const logoutButtons = document.querySelectorAll('.btn-signin');
  logoutButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      logout();
    });
  });

  // Pay Now Button
  const payBtn = document.querySelector('.btn-pay');
  if (payBtn) {
    payBtn.addEventListener('click', function(e) {
      e.preventDefault();
      showNotification('Redirecting to payment page...', 'info');
      setTimeout(() => {
        // Redirect to payment page
        window.location.href = './tenant-payment.html';
      }, 500);
    });
  }

  // Service Requests View All
  const viewAllBtn = document.querySelector('.btn-link');
  if (viewAllBtn) {
    viewAllBtn.addEventListener('click', function(e) {
      e.preventDefault();
      showNotification('Loading service requests...', 'info');
    });
  }

  // Contact Roommate
  const contactBtn = document.querySelector('.contact-btn');
  if (contactBtn) {
    contactBtn.addEventListener('click', function(e) {
      e.preventDefault();
      showNotification('Opening message to Fay Lim...', 'info');
    });
  }

  // Announcement Link
  const announcementLink = document.querySelector('.announcement-link');
  if (announcementLink) {
    announcementLink.addEventListener('click', function(e) {
      e.preventDefault();
      showNotification('Loading all announcements...', 'info');
    });
  }
}

// Setup Responsive Behavior
function setupResponsiveness() {
  window.addEventListener('resize', function() {
    const hamburger = document.getElementById('hbg');
    const mobNav = document.getElementById('mob');
    
    if (window.innerWidth > 768 && hamburger) {
      mobNav.classList.remove('active');
    }
  });
}

// Logout Function
function logout() {
  showNotification('Logging out...', 'info');
  setTimeout(() => {
    // Clear any stored session data
    localStorage.clear();
    sessionStorage.clear();
    // Redirect to signin page
    window.location.href = './signin-page.html';
  }, 800);
}

// Notification helper
function showNotification(message, type = 'info') {
  console.log(`[${type.toUpperCase()}] ${message}`);
  
  // You can implement actual notification UI here
  // For now, just log to console
}

// Sidebar active state management
document.addEventListener('DOMContentLoaded', function() {
  const sidebarItems = document.querySelectorAll('.sidebar-item');
  const currentPage = window.location.pathname.split('/').pop();

  sidebarItems.forEach(item => {
    const href = item.getAttribute('href');
    if (href && href.includes(currentPage)) {
      item.classList.add('active');
    }
  });
});

/* ═══════════════════════════════════════
   ANNOUNCEMENTS MODAL FUNCTIONALITY
   ═══════════════════════════════════════ */

// Sample announcements data
const announcements = [
  {
    id: 1,
    title: 'General Dorm Cleaning – Feb 7, 8 AM to 12 PM',
    description: 'There will be a mandatory general cleaning of all common areas including hallways, lobby, and recreational facilities. Please ensure your rooms are tidied up and dispose of any items blocking common areas.',
    date: 'Posted Feb 3, 2026',
    type: 'general'
  },
  {
    id: 2,
    title: 'Water interruption resolved – Unit 2 restored',
    description: 'The water interruption in Unit 2 has been successfully resolved. All facilities are now fully operational. We apologize for any inconvenience caused during the maintenance period.',
    date: 'Posted Jan 28, 2026',
    type: 'maintenance'
  },
  {
    id: 3,
    title: 'Visitor curfew updated: guests must leave by 9 PM',
    description: 'Effective immediately, all visitors must exit the dormitory by 9:00 PM. This policy is being implemented to ensure safety and maintain peaceful living conditions. Please inform your guests accordingly.',
    date: 'Posted Jan 20, 2026',
    type: 'policy'
  },
  {
    id: 4,
    title: 'New WiFi credentials distributed to all tenants',
    description: 'Updated WiFi credentials have been distributed via email. If you haven\'t received them yet, please visit the admin office. The new password will be effective immediately, and all previous credentials will be invalidated.',
    date: 'Posted Jan 15, 2026',
    type: 'general'
  }
];

// Open Announcements Modal
function openNoticesModal() {
  const modal = document.getElementById('noticesModal');
  const announcementList = document.getElementById('announcementList');
  
  announcementList.innerHTML = '';
  
  announcements.forEach(announcement => {
    const announcementHTML = `
      <div class="announcement-item">
        <div class="announcement-item-header">
          <h3 class="announcement-item-title">${announcement.title}</h3>
          <span class="announcement-item-date">${announcement.date}</span>
        </div>
        <p class="announcement-item-body">${announcement.description}</p>
      </div>
    `;
    announcementList.innerHTML += announcementHTML;
  });
  
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Close Announcements Modal
function closeNoticesModal() {
  const modal = document.getElementById('noticesModal');
  modal.classList.remove('active');
  document.body.style.overflow = 'auto';
}

/* ═══════════════════════════════════════
   ADD ITEM MODAL FUNCTIONALITY
   ═══════════════════════════════════════ */

// Open Add Item Modal
function openAddItemModal(e) {
  if (e) e.preventDefault();
  const modal = document.getElementById('addItemModal');
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  // Set today's date as default
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('itemDate').value = today;
}

// Close Add Item Modal
function closeAddItemModal(e) {
  if (e && e.target !== e.currentTarget) return;
  const modal = document.getElementById('addItemModal');
  modal.classList.remove('active');
  document.body.style.overflow = 'auto';
  document.getElementById('addItemForm').reset();
}

// Submit Add Item
function submitAddItem(e) {
  e.preventDefault();
  
  const itemName = document.getElementById('itemName').value;
  const itemBrand = document.getElementById('itemBrand').value;
  const itemQuantity = document.getElementById('itemQuantity').value;
  const itemDate = document.getElementById('itemDate').value;
  
  // Format date
  const dateObj = new Date(itemDate);
  const formattedDate = dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  
  // Get current item count
  const itemsList = document.querySelector('.items-list');
  const currentItems = itemsList.querySelectorAll('.item-row').length;
  const newNumber = currentItems + 1;
  
  // Create new item element
  const itemHTML = `
    <div class="item-row">
      <span class="item-number">${newNumber}</span>
      <span class="item-name">${itemName} (${itemBrand})</span>
      <span class="item-date">${itemQuantity}pc · ${formattedDate}</span>
      <button class="item-delete" onclick="deleteItem(this)">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
      </button>
    </div>
  `;
  
  itemsList.innerHTML += itemHTML;
  
  // Close modal and show success message
  closeAddItemModal();
  showNotification(`${itemName} added successfully!`, 'success');
}

// Delete Item
function deleteItem(button) {
  button.closest('.item-row').remove();
  
  // Re-number items
  const itemsList = document.querySelector('.items-list');
  const items = itemsList.querySelectorAll('.item-row');
  items.forEach((item, index) => {
    item.querySelector('.item-number').textContent = index + 1;
  });
  
  showNotification('Item removed', 'info');
}

/* ═══════════════════════════════════════
   PAYMENT HISTORY MODAL FUNCTIONALITY
   ═══════════════════════════════════════ */

// Payment history data
const paymentHistory = [
  {
    id: 1,
    month: 'February 2026',
    status: 'paid',
    amount: 4500,
    dueDate: 'Feb 7, 2026',
    paidDate: 'Feb 5, 2026',
    receipt: 'RCP-2026-0245'
  },
  {
    id: 2,
    month: 'January 2026',
    status: 'paid',
    amount: 4500,
    dueDate: 'Jan 7, 2026',
    paidDate: 'Jan 5, 2026',
    receipt: 'RCP-2026-0192'
  },
  {
    id: 3,
    month: 'December 2025',
    status: 'paid',
    amount: 4500,
    dueDate: 'Dec 7, 2025',
    paidDate: 'Dec 3, 2025',
    receipt: 'RCP-2025-0890'
  },
  {
    id: 4,
    month: 'November 2025',
    status: 'paid',
    amount: 4500,
    dueDate: 'Nov 7, 2025',
    paidDate: 'Nov 6, 2025',
    receipt: 'RCP-2025-0823'
  },
  {
    id: 5,
    month: 'October 2025',
    status: 'paid',
    amount: 4500,
    dueDate: 'Oct 7, 2025',
    paidDate: 'Oct 5, 2025',
    receipt: 'RCP-2025-0756'
  }
];

// Open Payment History Modal
function openPaymentHistoryModal(e) {
  if (e) e.preventDefault();
  const modal = document.getElementById('paymentHistoryModal');
  const historyList = document.getElementById('paymentHistoryList');
  
  historyList.innerHTML = '';
  
  paymentHistory.forEach(payment => {
    const statusClass = payment.status === 'paid' ? 'paid' : 'pending';
    const statusText = payment.status === 'paid' ? 'Paid' : 'Pending';
    
    const paymentHTML = `
      <div class="payment-history-item">
        <div class="payment-history-item-header">
          <div>
            <div class="payment-history-description">${payment.month}</div>
            <div class="payment-history-date">Due: ${payment.dueDate}</div>
          </div>
          <span class="payment-history-status ${statusClass}">${statusText}</span>
        </div>
        <div class="payment-history-details">
          <div class="payment-history-detail-row">
            <span class="payment-history-label">Paid Date</span>
            <span class="payment-history-value">${payment.paidDate}</span>
          </div>
          <div class="payment-history-detail-row">
            <span class="payment-history-label">Receipt #</span>
            <span class="payment-history-value">${payment.receipt}</span>
          </div>
          <div class="payment-history-detail-row" style="grid-column: 1 / -1;">
            <span class="payment-history-label">Amount</span>
            <span class="payment-history-amount">₱${payment.amount.toLocaleString()}</span>
          </div>
        </div>
      </div>
    `;
    
    historyList.innerHTML += paymentHTML;
  });
  
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Close Payment History Modal
function closePaymentHistoryModal(e) {
  if (e && e.target !== e.currentTarget) return;
  const modal = document.getElementById('paymentHistoryModal');
  modal.classList.remove('active');
  document.body.style.overflow = 'auto';
}

/* ═══════════════════════════════════════
   MESSAGE ROOMMATE MODAL FUNCTIONALITY
   ═══════════════════════════════════════ */

// Open Message Modal
function openMessageModal() {
  const modal = document.getElementById('messageModal');
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Close Message Modal
function closeMessageModal(e) {
  if (e && e.target !== e.currentTarget) return;
  const modal = document.getElementById('messageModal');
  modal.classList.remove('active');
  document.body.style.overflow = 'auto';
  document.getElementById('messageForm').reset();
}

// Submit Message
function submitMessage(e) {
  e.preventDefault();
  
  const subject = document.getElementById('messageSubject').value;
  const body = document.getElementById('messageBody').value;
  
  // In a real app, this would send to server
  console.log('Message sent to Ivan:', { subject, body });
  
  closeMessageModal();
  showNotification('Message sent to Ivan successfully!', 'success');
}

/* ═══════════════════════════════════════
   PAYMENT REDIRECT
   ═══════════════════════════════════════ */

function redirectToPayment() {
  // This would typically redirect to the payment page
  window.location.href = './tenant-payment.html';
}

/* ═══════════════════════════════════════
   KEYBOARD & MODAL MANAGEMENT
   ═══════════════════════════════════════ */

// Close modals with Escape key
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    closeNoticesModal();
    closeAddItemModal();
    closePaymentHistoryModal();
    closeMessageModal();
  }
});

// Update the announcement link to open modal
document.addEventListener('DOMContentLoaded', function() {
  const announcementLink = document.querySelector('.announcement-link');
  if (announcementLink) {
    announcementLink.addEventListener('click', function(e) {
      e.preventDefault();
      openNoticesModal();
    });
  }
});
