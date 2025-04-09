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