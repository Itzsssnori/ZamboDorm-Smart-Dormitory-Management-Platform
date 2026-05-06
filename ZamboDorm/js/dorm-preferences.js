(function() {
    'use strict';

    // ── STATE ──
    const state = {
        currentStep: 1,
        totalSteps: 6,
        preferences: {
            location: null,
            roomType: null,
            roommate: null,
            amenities: [],
            bedType: null,
            budget: {
                min: 2000,
                max: 5000
            }
        }
    };

    // ── MAPPINGS ──
    const MAPPINGS = {
        location: {
            campus: 'Near Campus',
            hospital: 'Near Hospital',
            organization: 'Near Organization',
            nearest: 'Nearest Dorm'
        },
        roomType: {
            single: 'Single Room',
            double: 'Double Room',
            deluxe: 'Deluxe Room',
            studio: 'Studio Room'
        },
        roommate: {
            no: 'Alone',
            one: '1 Roommate',
            two: '2 Roommates',
            flexible: 'Flexible'
        },
        bedType: {
            single: 'Single Bed',
            'double-decker': 'Double Decker',
            queen: 'Queen Bed',
            full: 'Full Bed'
        },
        amenities: {
            ac: 'Air Conditioning',
            wifi: 'High-Speed WiFi',
            desk: 'Study Desk',
            storage: 'Storage Cabinet',
            light: 'Natural Light',
            bathroom: 'Private Bathroom'
        }
    };

    // ── DOM ELEMENTS ──
    const elements = {
        steps: document.querySelectorAll('.setup-step'),
        progressFill: document.querySelector('.progress-fill'),
        progressStep: document.querySelector('.progress-step'),
        summary: {
            location: document.getElementById('summary-location'),
            room: document.getElementById('summary-room'),
            bed: document.getElementById('summary-bed'),
            amenities: document.getElementById('summary-amenities'),
            roommate: document.getElementById('summary-roommate'),
            budget: document.getElementById('summary-budget')
        },
        budget: {
            minSlider: document.getElementById('min-budget-slider'),
            maxSlider: document.getElementById('max-budget-slider'),
            minDisplay: document.getElementById('min-budget-display'),
            maxDisplay: document.getElementById('max-budget-display'),
            rangeText: document.getElementById('budget-range-text')
        },
        map: {
            container: document.getElementById('map-container'),
            frame: document.getElementById('map-frame')
        }
    };

    // ── CORE FUNCTIONS ──

    function init() {
        bindEvents();
        updateProgressBar();
        checkRegistrationStatus();
    }

    function bindEvents() {
        // Step 1: Location
        document.querySelectorAll('.selection-card').forEach(card => {
            card.addEventListener('click', () => selectPreference('location', card.dataset.value, card));
        });

        // Step 2: Room Type
        document.querySelectorAll('[data-roomtype]').forEach(card => {
            card.addEventListener('click', () => selectPreference('roomType', card.dataset.roomtype, card));
        });

        // Step 3: Roommate
        document.querySelectorAll('[data-roommate]').forEach(card => {
            card.addEventListener('click', () => selectPreference('roommate', card.dataset.roommate, card));
        });

        // Step 4: Amenities
        document.querySelectorAll('.amenity-card').forEach(card => {
            card.addEventListener('click', () => toggleAmenity(card));
        });

        // Step 5: Bed Type
        document.querySelectorAll('[data-bedtype]').forEach(card => {
            card.addEventListener('click', () => selectPreference('bedType', card.dataset.bedtype, card));
        });

        // Step 6: Budget
        elements.budget.minSlider.addEventListener('input', handleBudgetChange);
        elements.budget.maxSlider.addEventListener('input', handleBudgetChange);

        // Navigation Buttons
        document.getElementById('btn-step1-next').addEventListener('click', () => navigate(1));
        document.getElementById('btn-step2-back').addEventListener('click', () => navigate(-1));
        document.getElementById('btn-step2-next').addEventListener('click', () => navigate(1));
        document.getElementById('btn-step3-back').addEventListener('click', () => navigate(-1));
        document.getElementById('btn-step3-next').addEventListener('click', () => navigate(1));
        document.getElementById('btn-step4-back').addEventListener('click', () => navigate(-1));
        document.getElementById('btn-step4-next').addEventListener('click', () => navigate(1));
        document.getElementById('btn-step5-back').addEventListener('click', () => navigate(-1));
        document.getElementById('btn-step5-next').addEventListener('click', () => navigate(1));
        document.getElementById('btn-step6-back').addEventListener('click', () => navigate(-1));
        document.getElementById('btn-step6-next').addEventListener('click', completeSetup);

        // Map Trigger
        document.getElementById('find-nearest-card').addEventListener('click', showMap);
    }

    function selectPreference(key, value, card) {
        state.preferences[key] = value;
        
        // Update UI
        const siblings = card.parentElement.querySelectorAll('.' + card.classList[0]);
        siblings.forEach(s => s.classList.remove('selected'));
        card.classList.add('selected');

        // Logic-specific overrides
        if (key === 'location' && value !== 'nearest') {
            elements.map.container.style.display = 'none';
        }

        if (key === 'roomType' && value === 'single') {
            state.preferences.roommate = 'no';
        }

        updateSummary();
    }

    function toggleAmenity(card) {
        const value = card.dataset.amenity;
        
        if (!state.preferences.amenities.includes(value)) {
            state.preferences.amenities.push(value);
            card.classList.add('selected');
        } else {
            state.preferences.amenities = state.preferences.amenities.filter(a => a !== value);
            card.classList.remove('selected');
        }
        updateSummary();
    }

    function handleBudgetChange() {
        let min = parseInt(elements.budget.minSlider.value);
        let max = parseInt(elements.budget.maxSlider.value);

        if (min > max) {
            if (this === elements.budget.minSlider) {
                max = min;
                elements.budget.maxSlider.value = max;
            } else {
                min = max;
                elements.budget.minSlider.value = min;
            }
        }

        state.preferences.budget.min = min;
        state.preferences.budget.max = max;

        elements.budget.minDisplay.textContent = `₱${min.toLocaleString()}`;
        elements.budget.maxDisplay.textContent = `₱${max.toLocaleString()}`;
        elements.budget.rangeText.textContent = `₱${min.toLocaleString()} - ₱${max.toLocaleString()}`;
        
        updateSummary();
    }

    function navigate(direction) {
        const nextStep = state.currentStep + direction;

        // Validation
        if (direction > 0 && !validateStep(state.currentStep)) {
            return;
        }

        // Logic for skipping Step 3 if Single Room
        if (state.currentStep === 2 && direction > 0 && state.preferences.roomType === 'single') {
            goToStep(4);
            return;
        }
        if (state.currentStep === 4 && direction < 0 && state.preferences.roomType === 'single') {
            goToStep(2);
            return;
        }

        if (nextStep >= 1 && nextStep <= state.totalSteps) {
            goToStep(nextStep);
        }
    }

    function goToStep(step) {
        elements.steps.forEach(s => s.classList.add('hidden'));
        const targetStep = document.getElementById(`step${step}`);
        if (targetStep) {
            targetStep.classList.remove('hidden');
            state.currentStep = step;
            updateProgressBar();
            scrollToTop();
        }
    }

    function validateStep(step) {
        switch(step) {
            case 1:
                if (!state.preferences.location) return alert('Please select a location preference');
                break;
            case 2:
                if (!state.preferences.roomType) return alert('Please select a room type');
                break;
            case 3:
                if (!state.preferences.roommate) return alert('Please select roommate preference');
                break;
            case 4:
                if (state.preferences.amenities.length === 0) return alert('Please select at least one amenity');
                break;
            case 5:
                if (!state.preferences.bedType) return alert('Please select a bed type');
                break;
        }
        return true;
    }

    function updateProgressBar() {
        const percentage = (state.currentStep / state.totalSteps) * 100;
        elements.progressFill.style.width = `${percentage}%`;
        elements.progressStep.textContent = `Step ${state.currentStep} of ${state.totalSteps}`;
    }

    function updateSummary() {
        const p = state.preferences;
        
        elements.summary.location.textContent = MAPPINGS.location[p.location] || '-';
        elements.summary.room.textContent = MAPPINGS.roomType[p.roomType] || '-';
        elements.summary.bed.textContent = MAPPINGS.bedType[p.bedType] || '-';
        elements.summary.roommate.textContent = MAPPINGS.roommate[p.roommate] || '-';
        elements.summary.amenities.textContent = p.amenities.length > 0 ? `${p.amenities.length} selected` : '0 selected';
        elements.summary.budget.textContent = `₱${p.budget.min.toLocaleString()} - ₱${p.budget.max.toLocaleString()}`;
    }

    function showMap() {
        elements.map.container.style.display = 'block';
<<<<<<< HEAD
        elements.map.frame.innerHTML = `
            <iframe 
                width="100%" height="100%" frameborder="0" style="border:0" 
                src="https://www.google.com/maps/embed/v1/search?key=AIzaSyAUgE8FqNTq5PVj3a-ZpV2sj_kf5IQyVrE&q=dormitory+in+Zamboanga+City&zoom=14" 
                allowfullscreen="" loading="lazy">
            </iframe>`;
=======
        // OpenStreetMap embed — keyless, no external JS dependency.
        // Bounding box covers downtown Zamboanga City; marker pins the centroid.
        elements.map.frame.innerHTML = `
            <iframe
                width="100%" height="100%"
                frameborder="0" style="border:0; display:block;"
                src="https://www.openstreetmap.org/export/embed.html?bbox=122.0500%2C6.9000%2C122.1100%2C6.9450&layer=mapnik&marker=6.9214%2C122.0790"
                loading="lazy"
                title="Demo map of Zamboanga City"
                referrerpolicy="no-referrer-when-downgrade"></iframe>
            <span class="demo-map-badge">Demo Map</span>`;
>>>>>>> 9446a6acac249405797600bdeedfa28d8c7166f4
        setTimeout(() => elements.map.container.scrollIntoView({ behavior: 'smooth' }), 100);
    }

    function scrollToTop() {
        const card = document.querySelector('.setup-card');
        if (card) card.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function checkRegistrationStatus() {
        const params = new URLSearchParams(window.location.search);
        if (params.get('registered') === 'true') {
            const alert = document.getElementById('successAlert');
            const closeBtn = document.getElementById('btn-alert-close');
            
            if (alert) {
                alert.classList.remove('hidden');
                
                // Auto-hide after 5 seconds
                const timer = setTimeout(() => {
                    alert.classList.add('hidden');
                }, 5000);

                if (closeBtn) {
                    closeBtn.addEventListener('click', () => {
                        alert.classList.add('hidden');
                        clearTimeout(timer);
                    });
                }
            }
        }
    }

    function completeSetup() {
        console.log('Final Preferences:', state.preferences);
        alert('Setup complete! Finding your perfect dorm...');
        window.location.href = './dorm-application.html';
    }

    // Initialize
    document.addEventListener('DOMContentLoaded', init);

})();