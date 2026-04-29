let selectedLocation = null;
    let selectedRoomType = null;
    let selectedBedType = null;
    let selectedRoommate = null;
    let selectedAmenities = [];
    let selectedBudgetMin = 2000;
    let selectedBudgetMax = 5000;

    // Track completed steps (for sequential summary display)
    let completedSteps = 0;

    // Auto-populate roommate based on bed type
    const roommateDefaults = {
      'single': 'no',        // Single bed = alone
      'double-decker': 'one', // Bunk bed = 1 roommate
      'queen': 'no',         // Queen bed = alone
      'full': 'no'           // Full bed = alone
    };

    // Mapping constants
    const roommateNames = {
      'no': 'Alone',
      'one': '1 Roommate',
      'two': '2 Roommates',
      'flexible': 'Flexible'
    };

    const amenityNames = {
      'ac': 'Air Conditioning',
      'wifi': 'High-Speed WiFi',
      'desk': 'Study Desk',
      'storage': 'Storage Cabinet',
      'light': 'Natural Light',
      'bathroom': 'Private Bathroom'
    };

    // Location display names mapping
    const locationNames = {
      'campus': 'Near Campus',
      'nearest': 'Find Nearest Dorm'
    };

    const roomTypeNames = {
      'single': 'Single Room',
      'double': 'Double Room',
      'deluxe': 'Deluxe Room',
      'studio': 'Studio Room'
    };

    const bedTypeNames = {
      'single': 'Single Bed',
      'double-decker': 'Double Decker',
      'queen': 'Queen Bed',
      'full': 'Full Bed'
    };

    // Update summary display in real-time (show all selected items)
    function updateSummary() {
      const locationEl = document.getElementById('summary-location');
      const roomEl = document.getElementById('summary-room');
      const bedEl = document.getElementById('summary-bed');
      const amenitiesEl = document.getElementById('summary-amenities');
      const roommateEl = document.getElementById('summary-roommate');
      const budgetEl = document.getElementById('summary-budget');
      
      // Update in real-time as soon as selection is made
      if (selectedLocation) {
        locationEl.textContent = locationNames[selectedLocation];
      }
      
      if (selectedRoomType) {
        roomEl.textContent = roomTypeNames[selectedRoomType];
      }

      if (selectedBedType) {
        bedEl.textContent = bedTypeNames[selectedBedType];
      }

      if (selectedAmenities.length > 0) {
        const amenityText = selectedAmenities.length + ' selected';
        amenitiesEl.textContent = amenityText;
      }

      if (selectedRoommate) {
        const roommateText = roommateNames[selectedRoommate];
        roommateEl.textContent = roommateText;
      }

      // Always show budget range if values are set
      if (selectedBudgetMin !== null && selectedBudgetMax !== null) {
        const budgetText = '₱' + selectedBudgetMin.toLocaleString() + ' - ₱' + selectedBudgetMax.toLocaleString();
        budgetEl.textContent = budgetText;
      }
    }

    // Show success modal on load if coming from registration
    // Scroll to form on page load
    window.addEventListener('load', () => {
      const setupCard = document.querySelector('.setup-card');
      if (setupCard) {
        setupCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    // Helper function to scroll to form
    function scrollToForm() {
      const setupCard = document.querySelector('.setup-card');
      if (setupCard) {
        setTimeout(() => {
          setupCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('registered') === 'true') {
      document.getElementById('successModal').classList.add('show');
      document.getElementById('btn-success-close').addEventListener('click', () => {
        document.getElementById('successModal').classList.remove('show');
      });
    }

    // Location Selection
    document.querySelectorAll('.option-card').forEach(card => {
      card.addEventListener('click', function() {
        document.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
        this.classList.add('selected');
        selectedLocation = this.dataset.location;
        updateSummary();
      });
    });

    // Role Selection removed - Step 2 is now Room Type

    // Room Type Selection
    document.querySelectorAll('[data-roomtype]').forEach(card => {
      card.addEventListener('click', function() {
        document.querySelectorAll('[data-roomtype]').forEach(c => c.classList.remove('selected'));
        this.classList.add('selected');
        selectedRoomType = this.dataset.roomtype;
        updateSummary();
      });
    });

    // Bed Type Selection (with auto roommate population)
    document.querySelectorAll('[data-bedtype]').forEach(card => {
      card.addEventListener('click', function() {
        document.querySelectorAll('[data-bedtype]').forEach(c => c.classList.remove('selected'));
        this.classList.add('selected');
        selectedBedType = this.dataset.bedtype;
        
        // Auto-populate roommate based on bed type
        const autoRoommate = roommateDefaults[selectedBedType];
        if (autoRoommate) {
          selectedRoommate = autoRoommate;
          // Pre-select the auto-roommate option in step 5
          document.querySelectorAll('[data-roommate]').forEach(card => {
            if (card.dataset.roommate === autoRoommate) {
              card.classList.add('selected');
            } else {
              card.classList.remove('selected');
            }
          });
        }
        
        updateSummary();
      });
    });

    // Amenities Selection (multiple)
    document.querySelectorAll('.amenity-checkbox').forEach(checkbox => {
      checkbox.addEventListener('change', function() {
        const amenityId = this.dataset.amenity;
        if (this.checked) {
          if (!selectedAmenities.includes(amenityId)) {
            selectedAmenities.push(amenityId);
          }
          this.closest('.amenity-card').classList.add('selected');
        } else {
          selectedAmenities = selectedAmenities.filter(a => a !== amenityId);
          this.closest('.amenity-card').classList.remove('selected');
        }
        updateSummary();
      });
    });

    // Roommate Selection
    document.querySelectorAll('[data-roommate]').forEach(card => {
      card.addEventListener('click', function() {
        document.querySelectorAll('[data-roommate]').forEach(c => c.classList.remove('selected'));
        this.classList.add('selected');
        selectedRoommate = this.dataset.roommate;
        updateSummary();
      });
    });

    // Budget Range Sliders
    const minBudgetSlider = document.getElementById('min-budget-slider');
    const maxBudgetSlider = document.getElementById('max-budget-slider');
    const minBudgetDisplay = document.getElementById('min-budget-display');
    const maxBudgetDisplay = document.getElementById('max-budget-display');
    const budgetRangeText = document.getElementById('budget-range-text');

    minBudgetSlider.addEventListener('input', function() {
      selectedBudgetMin = parseInt(this.value);
      if (selectedBudgetMin > selectedBudgetMax) {
        selectedBudgetMin = selectedBudgetMax;
        this.value = selectedBudgetMax;
      }
      minBudgetDisplay.textContent = '₱' + selectedBudgetMin.toLocaleString();
      budgetRangeText.textContent = '₱' + selectedBudgetMin.toLocaleString() + ' - ₱' + selectedBudgetMax.toLocaleString();
      updateSummary();
    });

    maxBudgetSlider.addEventListener('input', function() {
      selectedBudgetMax = parseInt(this.value);
      if (selectedBudgetMax < selectedBudgetMin) {
        selectedBudgetMax = selectedBudgetMin;
        this.value = selectedBudgetMin;
      }
      maxBudgetDisplay.textContent = '₱' + selectedBudgetMax.toLocaleString();
      budgetRangeText.textContent = '₱' + selectedBudgetMin.toLocaleString() + ' - ₱' + selectedBudgetMax.toLocaleString();
      updateSummary();
    });

    // Step 1: Location Selection
    const mapContainer = document.getElementById('map-container');
    const mapFrame = document.getElementById('map-frame');
    const findNearestBtn = document.getElementById('find-nearest-card');
    const selectionCards = document.querySelectorAll('.selection-card');

    selectionCards.forEach(card => {
      card.addEventListener('click', () => {
        selectionCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        selectedLocation = card.dataset.value;
        
        // Hide map when selecting campus
        if (selectedLocation === 'campus') {
          mapContainer.style.display = 'none';
        }
      });
    });

    // Logic to show map when "Find Nearest" is clicked
    findNearestBtn.addEventListener('click', () => {
      // Toggle Visibility
      mapContainer.style.display = 'block';
      
      // Embed Google Map centered on Zamboanga City
      mapFrame.innerHTML = `
        <iframe 
          width="100%" 
          height="100%" 
          frameborder="0" 
          style="border:0" 
          src="https://www.google.com/maps/embed/v1/search?key=AIzaSyAUgE8FqNTq5PVj3a-ZpV2sj_kf5IQyVrE&q=dormitory+in+Zamboanga+City&zoom=14" 
          allowfullscreen="" 
          loading="lazy" 
          referrerpolicy="no-referrer-when-downgrade">
        </iframe>`;
        
      // Smooth scroll to map
      mapContainer.scrollIntoView({ behavior: 'smooth' });
      selectedLocation = 'nearest';
    });

    // Step buttons
    document.getElementById('btn-step1-next').addEventListener('click', () => {
      if (!selectedLocation) {
        alert('Please select a location preference');
        return;
      }
      // If map was open, hide it before moving to step 2
      mapContainer.style.display = 'none';
      
      completedSteps = 1;
      updateSummary();
      document.getElementById('step1').style.display = 'none';
      document.getElementById('step2').style.display = 'block';
      updateProgressBar(2);
      scrollToForm();
    });

    document.getElementById('btn-step2-back').addEventListener('click', () => {
      completedSteps = 0;
      document.getElementById('step2').style.display = 'none';
      document.getElementById('step1').style.display = 'block';
      updateProgressBar(1);
      scrollToForm();
    });

    document.getElementById('btn-step2-next').addEventListener('click', () => {
      if (!selectedRoomType) {
        alert('Please select a room type');
        return;
      }
      completedSteps = 2;
      updateSummary();
      
      if (selectedRoomType === 'single') {
        selectedRoommate = 'no'; // Default for single room
        document.getElementById('step2').style.display = 'none';
        document.getElementById('step4').style.display = 'block';
        updateProgressBar(4);
      } else {
        document.getElementById('step2').style.display = 'none';
        document.getElementById('step3').style.display = 'block';
        updateProgressBar(3);
      }
      scrollToForm();
    });

    document.getElementById('btn-step3-back').addEventListener('click', () => {
      completedSteps = 1;
      document.getElementById('step3').style.display = 'none';
      document.getElementById('step2').style.display = 'block';
      updateProgressBar(2);
      scrollToForm();
    });

    document.getElementById('btn-step3-next').addEventListener('click', () => {
      if (!selectedRoommate) {
        alert('Please select a roommate preference');
        return;
      }
      completedSteps = 3;
      updateSummary();
      document.getElementById('step3').style.display = 'none';
      document.getElementById('step4').style.display = 'block';
      updateProgressBar(4);
      scrollToForm();
    });

    document.getElementById('btn-step4-back').addEventListener('click', () => {
      if (selectedRoomType === 'single') {
        completedSteps = 1;
        document.getElementById('step4').style.display = 'none';
        document.getElementById('step2').style.display = 'block';
        updateProgressBar(2);
      } else {
        completedSteps = 2;
        document.getElementById('step4').style.display = 'none';
        document.getElementById('step3').style.display = 'block';
        updateProgressBar(3);
      }
      scrollToForm();
    });

    document.getElementById('btn-step4-next').addEventListener('click', () => {
      if (selectedAmenities.length === 0) {
        alert('Please select at least one amenity');
        return;
      }
      completedSteps = 4;
      updateSummary();
      document.getElementById('step4').style.display = 'none';
      document.getElementById('step5').style.display = 'block';
      updateProgressBar(5);
      scrollToForm();
    });

    document.getElementById('btn-step5-back').addEventListener('click', () => {
      completedSteps = 3;
      document.getElementById('step5').style.display = 'none';
      document.getElementById('step4').style.display = 'block';
      updateProgressBar(4);
      scrollToForm();
    });

    document.getElementById('btn-step5-next').addEventListener('click', () => {
      if (!selectedBedType) {
        alert('Please select a bed type');
        return;
      }
      completedSteps = 5;
      updateSummary();
      document.getElementById('step5').style.display = 'none';
      document.getElementById('step6').style.display = 'block';
      updateProgressBar(6);
      scrollToForm();
    });

    document.getElementById('btn-step6-back').addEventListener('click', () => {
      completedSteps = 4;
      document.getElementById('step6').style.display = 'none';
      document.getElementById('step5').style.display = 'block';
      updateProgressBar(5);
      scrollToForm();
    });

    document.getElementById('btn-step6-next').addEventListener('click', () => {
      completedSteps = 6;
      updateSummary();
      // Save preferences and redirect
      console.log('Location:', selectedLocation, 'Room Type:', selectedRoomType, 'Bed Type:', selectedBedType, 'Amenities:', selectedAmenities, 'Roommate:', selectedRoommate, 'Budget:', selectedBudgetMin + '-' + selectedBudgetMax);
      // TODO: Save to backend, then redirect to dashboard
      alert('Setup complete!');
      window.location.href = './dorm-application.html'; // Redirect to dorm applications
    });

    function updateProgressBar(step) {
      const percentage = (step / 6) * 100;
      document.querySelector('.progress-fill').style.width = percentage + '%';
      document.querySelector('.progress-step').textContent = 'Step ' + step + ' of 6';
    }