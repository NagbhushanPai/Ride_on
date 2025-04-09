function openBookingModal(cycleId) {
    const cycle = window.cycles.getCycleById(cycleId);
    if (cycle) {
        document.getElementById('booking-cycle-id').value = cycleId;
        document.getElementById('booking-cycle-name').textContent = cycle.name;
        document.getElementById('booking-cycle-type').textContent = window.cycles.capitalizeFirstLetter(cycle.category);
        document.getElementById('booking-cycle-price').textContent = `$${cycle.price}/day`;
        document.getElementById('booking-cycle-image').src = cycle.image;
        window.app.openModal(document.getElementById('booking-modal'));
    }
}

function setupForms() {
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const cycleId = document.getElementById('booking-cycle-id').value;
            const startDate = document.getElementById('booking-start-date').value;
            const endDate = document.getElementById('booking-end-date').value;
            const location = document.getElementById('booking-location').value;
            const accessories = {
                helmet: document.getElementById('helmet').checked,
                lock: document.getElementById('lock').checked,
                basket: document.getElementById('basket').checked,
                lights: document.getElementById('lights').checked
            };

            if (!startDate || !endDate || !location) {
                window.app.showNotification('Please fill all required fields!', 'error');
                return;
            }

            addBooking(cycleId, startDate, endDate, location, accessories);
            closeModal(document.getElementById('booking-modal'));
            displayConfirmation(cycleId, startDate, endDate, location, accessories);
        });
    }
}

function addBooking(cycleId, startDate, endDate, location, accessories) {
    const booking = {
        id: Date.now().toString(),
        cycleId,
        startDate,
        endDate,
        location,
        accessories: Object.keys(accessories).filter(key => accessories[key]),
        status: 'upcoming'
    };
    bookings.push(booking);
    localStorage.setItem('bookings', JSON.stringify(bookings));
    window.app.showNotification('Booking confirmed!', 'success');
}

function displayConfirmation(cycleId, startDate, endDate, location, accessories) {
    const cycle = window.cycles.getCycleById(cycleId);
    document.getElementById('summary-cycle').textContent = `Cycle: ${cycle.name}`;
    document.getElementById('summary-dates').textContent = `Dates: ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}`;
    document.getElementById('summary-location').textContent = `Location: ${location}`;
    document.getElementById('summary-accessories').textContent = `Accessories: ${accessories.helmet ? 'Helmet, ' : ''}${accessories.lock ? 'Lock, ' : ''}${accessories.basket ? 'Basket, ' : ''}${accessories.lights ? 'Lights' : ''}`.replace(/, $/, '');
    window.app.openModal(document.getElementById('confirmation-modal'));
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the mobile menu toggle
    const mobileMenuToggle = document.querySelector('.rb-mobile-menu-toggle');
    const nav = document.querySelector('.rb-nav');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            nav.classList.toggle('rb-nav-active');
            mobileMenuToggle.classList.toggle('rb-active');
        });
    }
    
    // Handle search form submission
    const searchForm = document.querySelector('.rb-search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const pickupLocation = document.getElementById('rb-pickup-location').value;
            const pickupDate = document.getElementById('rb-pickup-date').value;
            const dropoffDate = document.getElementById('rb-dropoff-date').value;
            
            if (!pickupLocation) {
                alert('Please select a pickup location');
                return;
            }
            
            if (!pickupDate) {
                alert('Please select a pickup date and time');
                return;
            }
            
            if (!dropoffDate) {
                alert('Please select a dropoff date and time');
                return;
            }
            
            // Scroll to bike listings
            document.querySelector('.rb-product-section').scrollIntoView({
                behavior: 'smooth'
            });
            
            // Here you would typically filter the bikes based on the search criteria
            console.log('Searching for bikes with criteria:', {
                pickupLocation,
                pickupDate,
                dropoffDate
            });
        });
    }
    
    // Handle filters
    const filterSelects = document.querySelectorAll('.rb-filter-select');
    filterSelects.forEach(select => {
        select.addEventListener('change', function() {
            // Here you would implement the filtering logic
            console.log('Filter changed:', this.id, 'to value:', this.value);
        });
    });
    
    // Book now buttons
    const bookButtons = document.querySelectorAll('.rb-bike-book');
    bookButtons.forEach(button => {
        button.addEventListener('click', function() {
            const cycleId = this.getAttribute('data-cycle-id');
            // Call the existing booking modal function with the cycle ID
            if (typeof openBookingModal === 'function') {
                openBookingModal(cycleId);
            } else {
                console.log('Booking cycle with ID:', cycleId);
                // Fallback if the original booking function isn't available
                const modal = document.getElementById('booking-modal');
                if (modal) {
                    modal.style.display = 'flex';
                }
            }
        });
    });
    
    // Login button
    const loginBtn = document.querySelector('.rb-btn-outline#login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Call the existing login modal function
            if (typeof openUserModal === 'function') {
                openUserModal();
            } else {
                console.log('Opening login modal');
                // Fallback if the original function isn't available
                const modal = document.getElementById('user-modal');
                if (modal) {
                    modal.style.display = 'flex';
                }
            }
        });
    }
    
    // Set current date as minimum dates for the search inputs
    const pickupDateInput = document.getElementById('rb-pickup-date');
    const dropoffDateInput = document.getElementById('rb-dropoff-date');
    
    if (pickupDateInput && dropoffDateInput) {
        const now = new Date();
        const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 16);
        
        pickupDateInput.min = localDateTime;
        dropoffDateInput.min = localDateTime;
        
        // When pickup date changes, ensure dropoff date is not earlier
        pickupDateInput.addEventListener('change', function() {
            if (this.value) {
                dropoffDateInput.min = this.value;
            }
        });
    }
});