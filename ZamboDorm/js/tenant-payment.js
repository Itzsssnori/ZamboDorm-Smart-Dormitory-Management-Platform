// Tenant Payment Page - JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
  initializePaymentPage();
});

// Initialize page features
function initializePaymentPage() {
  setupMobileNavigation();
  renderPaymentHistory();
  setupInteractiveElements();
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

  // Close sidebar when window resizes
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      mobNav.classList.remove('active');
      sidebar.classList.remove('active');
    }
  });
}

// Payment history data
const paymentHistory = [
  {
    id: 1,
    month: 'February 2026',
    status: 'due-soon',
    amount: 4500,
    dueDate: 'Feb 7, 2026',
    paidDate: null,
    receipt: null
  },
  {
    id: 2,
    month: 'January 2026',
    status: 'paid',
    amount: 4500,
    dueDate: 'Jan 7, 2026',
    paidDate: 'Jan 5, 2026 · GCash',
    receipt: 'RCP-2026-0245'
  },
  {
    id: 3,
    month: 'December 2025',
    status: 'paid',
    amount: 4500,
    dueDate: 'Dec 7, 2025',
    paidDate: 'Dec 3, 2025 · GCash',
    receipt: 'RCP-2025-0890'
  },
  {
    id: 4,
    month: 'November 2025',
    status: 'paid',
    amount: 4500,
    dueDate: 'Nov 7, 2025',
    paidDate: 'Nov 4, 2025 · Cash',
    receipt: 'RCP-2025-0823'
  }
];

// Render Payment History
function renderPaymentHistory() {
  const historyContent = document.getElementById('paymentHistoryContent');
  if (!historyContent) return;

  historyContent.innerHTML = '';

  paymentHistory.forEach(payment => {
    const statusClass = payment.status === 'paid' ? 'paid' : 'due-soon';
    const statusText = payment.status === 'paid' ? '✓ Paid' : 'Due Soon';
    const paymentHTML = `
      <div class="payment-history-item">
        <div class="payment-history-item-header">
          <div>
            <div class="payment-history-title">${payment.month}</div>
            <div class="payment-history-date">${payment.paidDate ? 'Paid ' + payment.paidDate : 'Due: ' + payment.dueDate}</div>
          </div>
          <span class="payment-history-status ${statusClass}">${statusText}</span>
        </div>
        <div class="payment-history-amount">₱${payment.amount.toLocaleString('en-PH')}</div>
      </div>
    `;
    historyContent.innerHTML += paymentHTML;
  });
}

// Setup Interactive Elements
function setupInteractiveElements() {
  // Pay Now Button in Alert
  const payNowBtn = document.querySelector('.btn-pay-now');
  if (payNowBtn) {
    payNowBtn.addEventListener('click', function(e) {
      e.preventDefault();
      // Navigate to payment processing page
      window.location.href = './payment-process.html';
    });
  }

  // Ensure Payments link is active
  const paymentLink = document.querySelector('a[href="tenant-payment.html"]');
  if (paymentLink && !paymentLink.classList.contains('active')) {
    paymentLink.classList.add('active');
  }
}

// Notification helper
function showNotification(message, type = 'info') {
  console.log(`[${type.toUpperCase()}] ${message}`);
  
  // Create a simple notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
    color: white;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.9rem;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 1000;
    animation: slideIn 0.3s ease;
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateY(10px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
