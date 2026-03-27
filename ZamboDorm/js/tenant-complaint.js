// Form state
let currentView = 'category'; // 'category', 'form', or 'review'
let selectedCategory = '';
let formData = {};

// Category configurations
const categoryConfig = {
  electrical: {
    title: 'Electrical Issues',
    subtitle: 'Help us understand your issue better',
    fields: [
      {
        id: 'electrical-issue',
        label: 'What is the specific electrical problem?',
        type: 'select',
        required: true,
        options: [
          { value: 'no-power', label: 'No power in room' },
          { value: 'flickering', label: 'Flickering lights' },
          { value: 'outlet-damaged', label: 'Damaged outlet' },
          { value: 'breaker-trip', label: 'Circuit breaker tripping' },
          { value: 'other-electrical', label: 'Other electrical issue' }
        ]
      },
      {
        id: 'problem-location',
        label: 'Where is the problem located?',
        type: 'select',
        required: true,
        options: [
          { value: 'bedroom', label: 'Bedroom' },
          { value: 'entrance', label: 'Entrance' },
          { value: 'bathroom', label: 'Bathroom' },
          { value: 'common_area', label: 'Common area' },
          { value: 'other', label: 'Other' }
        ]
      },
      {
        id: 'urgency-level',
        label: 'Is this an urgent safety concern?',
        type: 'select',
        required: true,
        options: [
          { value: 'urgent', label: "Yes, it's urgent" },
          { value: 'non-urgent', label: "No, it can wait" },
          { value: 'safety', label: "It's a safety hazard" }
        ]
      },
      {
        id: 'additional-details',
        label: 'Any additional details?',
        type: 'textarea',
        required: false,
        placeholder: 'Provide additional details...'
      }
    ]
  },
  plumbing: {
    title: 'Plumbing Issues',
    subtitle: 'Help us understand your plumbing issue better',
    fields: [
      {
        id: 'plumbing-issue',
        label: 'What is the specific plumbing problem?',
        type: 'select',
        required: true,
        options: [
          { value: 'leak', label: 'Water leak' },
          { value: 'clogged', label: 'Clogged drain' },
          { value: 'low-pressure', label: 'Low water pressure' },
          { value: 'no-water', label: 'No water supply' },
          { value: 'other-plumbing', label: 'Other plumbing issue' }
        ]
      },
      {
        id: 'problem-location',
        label: 'Where is the problem located?',
        type: 'select',
        required: true,
        options: [
          { value: 'bathroom', label: 'Bathroom' },
          { value: 'kitchen', label: 'Kitchen' },
          { value: 'general', label: 'General area' },
          { value: 'other', label: 'Other' }
        ]
      },
      {
        id: 'urgency-level',
        label: 'How urgent is this issue?',
        type: 'select',
        required: true,
        options: [
          { value: 'urgent', label: 'Urgent - water wastage' },
          { value: 'non-urgent', label: 'Can wait a day or two' }
        ]
      },
      {
        id: 'additional-details',
        label: 'Any additional details?',
        type: 'textarea',
        required: false,
        placeholder: 'Describe the issue...'
      }
    ]
  },
  aircon: {
    title: 'Air Conditioning',
    subtitle: 'Help us understand your AC issue better',
    fields: [
      {
        id: 'aircon-issue',
        label: 'What is the specific AC problem?',
        type: 'select',
        required: true,
        options: [
          { value: 'not-cooling', label: 'Not cooling properly' },
          { value: 'leaking', label: 'Unit leaking water' },
          { value: 'noise', label: 'Strange noises' },
          { value: 'not-turning-on', label: 'Not turning on' },
          { value: 'other-ac', label: 'Other AC issue' }
        ]
      },
      {
        id: 'problem-location',
        label: 'Which unit has the problem?',
        type: 'select',
        required: true,
        options: [
          { value: 'main', label: 'Main unit' },
          { value: 'bedroom', label: 'Bedroom unit' },
          { value: 'living', label: 'Living area unit' }
        ]
      },
      {
        id: 'urgency-level',
        label: 'How urgent is this?',
        type: 'select',
        required: true,
        options: [
          { value: 'urgent', label: 'Very hot, needs immediate help' },
          { value: 'non-urgent', label: 'Can wait' }
        ]
      },
      {
        id: 'additional-details',
        label: 'Any additional details?',
        type: 'textarea',
        required: false,
        placeholder: 'Describe the AC issue...'
      }
    ]
  },
  furniture: {
    title: 'Furniture & Fixtures',
    subtitle: 'Help us understand the furniture issue better',
    fields: [
      {
        id: 'furniture-issue',
        label: 'What furniture or fixture is damaged?',
        type: 'select',
        required: true,
        options: [
          { value: 'bed', label: 'Bed/Mattress' },
          { value: 'chair', label: 'Chair' },
          { value: 'table', label: 'Table/Desk' },
          { value: 'cabinet', label: 'Cabinet/Drawer' },
          { value: 'door', label: 'Door/Lock' },
          { value: 'other-furniture', label: 'Other furniture' }
        ]
      },
      {
        id: 'damage-type',
        label: 'Type of damage?',
        type: 'select',
        required: true,
        options: [
          { value: 'broken', label: 'Broken/Not working' },
          { value: 'damaged', label: 'Damaged' },
          { value: 'loose', label: 'Loose/Unstable' },
          { value: 'missing', label: 'Missing parts' }
        ]
      },
      {
        id: 'urgency-level',
        label: 'How urgent is this?',
        type: 'select',
        required: true,
        options: [
          { value: 'urgent', label: 'Safety hazard' },
          { value: 'non-urgent', label: 'Not urgent' }
        ]
      },
      {
        id: 'additional-details',
        label: 'Any additional details?',
        type: 'textarea',
        required: false,
        placeholder: 'Describe the damage...'
      }
    ]
  },
  internet: {
    title: 'Internet/WiFi',
    subtitle: 'Help us understand your connectivity issue better',
    fields: [
      {
        id: 'internet-issue',
        label: 'What is the specific issue?',
        type: 'select',
        required: true,
        options: [
          { value: 'slow', label: 'Slow connection' },
          { value: 'no-signal', label: 'No WiFi signal' },
          { value: 'intermittent', label: 'Intermittent connection' },
          { value: 'no-internet', label: 'No internet at all' },
          { value: 'other-internet', label: 'Other connectivity issue' }
        ]
      },
      {
        id: 'device-count',
        label: 'How many devices are affected?',
        type: 'select',
        required: true,
        options: [
          { value: 'all', label: 'All devices' },
          { value: 'some', label: 'Some devices only' },
          { value: 'one', label: 'One device only' }
        ]
      },
      {
        id: 'urgency-level',
        label: 'How urgent is this?',
        type: 'select',
        required: true,
        options: [
          { value: 'urgent', label: 'Very important, affects work' },
          { value: 'non-urgent', label: 'Can manage without it' }
        ]
      },
      {
        id: 'additional-details',
        label: 'Any additional details?',
        type: 'textarea',
        required: false,
        placeholder: 'Describe the connectivity issue...'
      }
    ]
  },
  cleanliness: {
    title: 'Cleanliness',
    subtitle: 'Help us understand the cleanliness issue better',
    fields: [
      {
        id: 'cleanliness-issue',
        label: 'What is the cleanliness issue?',
        type: 'select',
        required: true,
        options: [
          { value: 'pest', label: 'Pest or insect problem' },
          { value: 'dirty', label: 'Dirty common areas' },
          { value: 'garbage', label: 'Garbage not collected' },
          { value: 'mold', label: 'Mold or bad smell' },
          { value: 'other-clean', label: 'Other cleanliness issue' }
        ]
      },
      {
        id: 'area-affected',
        label: 'Which area is affected?',
        type: 'select',
        required: true,
        options: [
          { value: 'room', label: 'My room' },
          { value: 'hallway', label: 'Hallway' },
          { value: 'bathroom', label: 'Common bathroom' },
          { value: 'common', label: 'Common areas' },
          { value: 'other', label: 'Other' }
        ]
      },
      {
        id: 'severity',
        label: 'How severe is the issue?',
        type: 'select',
        required: true,
        options: [
          { value: 'severe', label: 'Very severe, health hazard' },
          { value: 'moderate', label: 'Moderate, needs attention' },
          { value: 'minor', label: 'Minor issue' }
        ]
      },
      {
        id: 'additional-details',
        label: 'Any additional details?',
        type: 'textarea',
        required: false,
        placeholder: 'Describe the cleanliness issue...'
      }
    ]
  },
  noise: {
    title: 'Noise Complaint',
    subtitle: 'Help us understand the noise issue better',
    fields: [
      {
        id: 'noise-source',
        label: 'What is the source of noise?',
        type: 'select',
        required: true,
        options: [
          { value: 'neighbors', label: 'Noisy neighbors' },
          { value: 'construction', label: 'Construction/Maintenance' },
          { value: 'equipment', label: 'Equipment/Machinery' },
          { value: 'music', label: 'Loud music/sound' },
          { value: 'other-noise', label: 'Other noise source' }
        ]
      },
      {
        id: 'noise-time',
        label: 'When does this happen?',
        type: 'select',
        required: true,
        options: [
          { value: 'night', label: 'Night hours' },
          { value: 'day', label: 'Day hours' },
          { value: 'anytime', label: 'Any time' }
        ]
      },
      {
        id: 'frequency',
        label: 'How often does this happen?',
        type: 'select',
        required: true,
        options: [
          { value: 'daily', label: 'Daily' },
          { value: 'weekly', label: 'Weekly' },
          { value: 'occasional', label: 'Occasionally' }
        ]
      },
      {
        id: 'additional-details',
        label: 'Any additional details?',
        type: 'textarea',
        required: false,
        placeholder: 'Describe the noise issue...'
      }
    ]
  },
  safety: {
    title: 'Safety & Security',
    subtitle: 'Help us understand the safety concern better',
    fields: [
      {
        id: 'safety-issue',
        label: 'What is the safety concern?',
        type: 'select',
        required: true,
        options: [
          { value: 'lock', label: 'Door lock issue' },
          { value: 'window', label: 'Window lock issue' },
          { value: 'suspicious', label: 'Suspicious activity' },
          { value: 'unsafe', label: 'Unsafe conditions' },
          { value: 'other-safety', label: 'Other safety concern' }
        ]
      },
      {
        id: 'location',
        label: 'Where is the issue?',
        type: 'select',
        required: true,
        options: [
          { value: 'room', label: 'My room' },
          { value: 'hallway', label: 'Hallway' },
          { value: 'entrance', label: 'Building entrance' },
          { value: 'common', label: 'Common area' }
        ]
      },
      {
        id: 'urgency-level',
        label: 'How urgent is this?',
        type: 'select',
        required: true,
        options: [
          { value: 'critical', label: 'Critical emergency' },
          { value: 'urgent', label: 'Very urgent' },
          { value: 'important', label: 'Important but not immediate' }
        ]
      },
      {
        id: 'additional-details',
        label: 'Any additional details?',
        type: 'textarea',
        required: false,
        placeholder: 'Describe the safety concern...'
      }
    ]
  },
  other: {
    title: 'Other Issues',
    subtitle: 'Tell us about any other concerns or feedback',
    fields: [
      {
        id: 'issue-description',
        label: 'Describe your issue or feedback',
        type: 'textarea',
        required: true,
        placeholder: 'Tell us what\'s on your mind...'
      },
      {
        id: 'category-other',
        label: 'Category of issue',
        type: 'select',
        required: true,
        options: [
          { value: 'suggestion', label: 'Suggestion/Feedback' },
          { value: 'complaint', label: 'General complaint' },
          { value: 'other', label: 'Other' }
        ]
      },
      {
        id: 'urgency-level',
        label: 'How urgent is this?',
        type: 'select',
        required: true,
        options: [
          { value: 'urgent', label: 'Urgent' },
          { value: 'non-urgent', label: 'Not urgent' }
        ]
      }
    ]
  }
};

// Helper functions
function showToast(msg, dur = 3000) {
  const t = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), dur);
}

// Select category
function selectCategory(el, category) {
  document.querySelectorAll('.category-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  selectedCategory = category;
  
  setTimeout(() => {
    // Build and show form
    buildForm(category);
    currentView = 'form';
    document.getElementById('category-selection-container').style.display = 'none';
    document.getElementById('complaint-form-container').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 300);
}

// Build form dynamically
function buildForm(category) {
  const config = categoryConfig[category];
  document.getElementById('form-title').textContent = config.title;
  document.getElementById('form-subtitle').textContent = config.subtitle;
  
  const fieldsContainer = document.getElementById('form-fields');
  fieldsContainer.innerHTML = '';
  
  config.fields.forEach(field => {
    const group = document.createElement('div');
    group.className = 'form-group';
    
    if (field.type === 'select') {
      group.innerHTML = `
        <label class="form-label">${field.label}</label>
        <select class="form-select" id="${field.id}" ${field.required ? 'required' : ''}>
          <option value="">Select an option</option>
          ${field.options.map(opt => `<option value="${opt.value}">${opt.label}</option>`).join('')}
        </select>
      `;
    } else if (field.type === 'textarea') {
      group.innerHTML = `
        <label class="form-label">${field.label}</label>
        <textarea class="form-textarea" id="${field.id}" placeholder="${field.placeholder}" ${field.required ? 'required' : ''}></textarea>
      `;
    }
    
    fieldsContainer.appendChild(group);
  });
}

// Validate form
function validateForm() {
  const config = categoryConfig[selectedCategory];
  for (let field of config.fields) {
    const element = document.getElementById(field.id);
    if (field.required && !element.value) {
      showToast(`Please fill in: ${field.label}`);
      return false;
    }
  }
  return true;
}

// Review complaint
function reviewComplaint() {
  if (!validateForm()) return;
  
  // Collect form data
  const config = categoryConfig[selectedCategory];
  formData = {};
  config.fields.forEach(field => {
    formData[field.id] = document.getElementById(field.id).value;
  });
  
  // Build review
  buildReview();
  
  // Switch to review view
  currentView = 'review';
  document.getElementById('complaint-form-container').style.display = 'none';
  document.getElementById('review-container').style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Build review display
function buildReview() {
  const config = categoryConfig[selectedCategory];
  const reviewItemsContainer = document.getElementById('review-items');
  reviewItemsContainer.innerHTML = '';
  
  config.fields.forEach(field => {
    const value = formData[field.id];
    let displayValue = value;
    
    if (field.type === 'select') {
      const option = field.options.find(opt => opt.value === value);
      displayValue = option ? option.label : value;
    }
    
    const item = document.createElement('div');
    item.className = 'review-item';
    item.innerHTML = `
      <span class="review-label">${field.label}</span>
      <span class="review-value">${displayValue || '-'}</span>
    `;
    reviewItemsContainer.appendChild(item);
  });
}

// Go back
function goBackToCategories() {
  currentView = 'category';
  document.getElementById('complaint-form-container').style.display = 'none';
  document.getElementById('category-selection-container').style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goBackToForm() {
  currentView = 'form';
  document.getElementById('review-container').style.display = 'none';
  document.getElementById('complaint-form-container').style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Submit complaint
function submitComplaint() {
  document.getElementById('success-overlay').classList.add('show');
}

// Redirect after success
function redirectToRoom() {
  window.location.href = 'tenant-myroom.html';
}
