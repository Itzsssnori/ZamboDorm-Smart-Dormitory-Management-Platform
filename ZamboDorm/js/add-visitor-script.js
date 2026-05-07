  // Populate dropdowns
  function populateDropdowns() {
    const personSel = document.getElementById('f-person');
    RESIDENTS.forEach(r => {
      const opt = document.createElement('option');
      opt.value = r.name + '|' + r.room;
      opt.textContent = r.name;
      personSel.appendChild(opt);
    });

    const purposeSel = document.getElementById('f-purpose');
    PURPOSES.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p; opt.textContent = p;
      purposeSel.appendChild(opt);
    });

    const idSel = document.getElementById('f-id');
    ID_TYPES.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t; opt.textContent = t;
      idSel.appendChild(opt);
    });
  }

  function autoFillRoom() {
    const val = document.getElementById('f-person').value;
    document.getElementById('f-room').value = val ? val.split('|')[1] : '';
  }

  function updateTimeIn() {
    const now = new Date();
    const h = now.getHours(), m = now.getMinutes(), s = now.getSeconds();
    const ap = h >= 12 ? 'PM' : 'AM';
    const hh = h % 12 || 12;
    document.getElementById('f-timein').value =
      [hh, m, s].map(n => String(n).padStart(2, '0')).join(':') + ' ' + ap;
  }

  function submitVisitor() {
    const last = document.getElementById('f-last').value.trim();
    const first = document.getElementById('f-first').value.trim();
    const mi = document.getElementById('f-mi').value.trim().toUpperCase().replace('.', '');
    const contact = document.getElementById('f-contact').value.trim();
    const personVal = document.getElementById('f-person').value;
    const purpose = document.getElementById('f-purpose').value;
    const idType = document.getElementById('f-id').value;

    if (!first) { showToast('Please enter the visitor\'s first name.', true); return; }
    if (!last)  { showToast('Please enter the visitor\'s last name.', true); return; }
    if (!personVal) { showToast('Please select the person to visit.', true); return; }
    if (!purpose) { showToast('Please select a purpose of visit.', true); return; }

    const parts = personVal.split('|');
    addVisitor({
      id: Date.now(),
      lastName: last,
      firstName: first,
      middleInitial: mi,
      contact,
      person: parts[0],
      room: parts[1],
      purpose,
      idType,
      timeIn: new Date().toISOString(),
      timeOut: null
    });

    // Clear form
    ['f-last','f-first','f-mi','f-contact','f-room'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('f-person').value = '';
    document.getElementById('f-purpose').value = '';
    document.getElementById('f-id').value = '';

    showToast('✓ ' + first + ' ' + last + ' timed in successfully!');
  }

  populateDropdowns();
  updateTimeIn();
  setInterval(updateTimeIn, 1000);

  // Real-time validation for contact number
  const contactInput = document.getElementById('f-contact');
  if (contactInput) {
    contactInput.addEventListener('input', function() {
      // Check if value contains any alphabetical characters
      const hasLetter = /[a-zA-Z]/.test(this.value);
      if (hasLetter) {
        this.classList.add('error');
      } else {
        this.classList.remove('error');
      }
    });
  }