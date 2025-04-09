// Initialize cycles page
function initializeCyclesPage() {
    setupFilters();
    loadAllCycles();
    setupEventListeners();
}

function setupEventListeners() {
    const browseBtn = document.querySelector('.primary-btn[href="#cycle-catalog"]');
    if (browseBtn) {
        browseBtn.addEventListener('click', () => {
            document.getElementById('cycle-catalog').scrollIntoView({ behavior: 'smooth' });
        });
    }
}

function loadAllCycles() {
    const cycles = window.cycles.CYCLES_DATA; // Use the static data
    displayCycles(cycles);
}

function applyFilters() {
    const cycleType = document.getElementById('cycle-type').value;
    const cycleSize = document.getElementById('cycle-size').value;
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    const sortBy = document.getElementById('sort-by').value;

    let filteredCycles = [...window.cycles.CYCLES_DATA];

    // Filter by cycle type
    if (cycleType !== 'all') {
        filteredCycles = filteredCycles.filter(cycle => cycle.category === cycleType);
    }

    // Filter by size (simplified mapping)
    if (cycleSize !== 'all') {
        const sizeMap = {
            small: [24, 26],
            medium: [27, 28],
            large: [29],
            xlarge: [29]
        };
        filteredCycles = filteredCycles.filter(cycle => sizeMap[cycleSize].includes(cycle.wheelSize));
    }

    // Filter by date availability (basic check)
    if (startDate && endDate) {
        filteredCycles = filteredCycles.filter(cycle => {
            return !bookings.some(b => b.cycleId === cycle.id &&
                ((new Date(startDate) >= new Date(b.startDate) && new Date(startDate) <= new Date(b.endDate)) ||
                 (new Date(endDate) >= new Date(b.startDate) && new Date(endDate) <= new Date(b.endDate))));
        });
    }

    // Sort cycles
    filteredCycles.sort((a, b) => {
        switch (sortBy) {
            case 'price-low': return a.price - b.price;
            case 'price-high': return b.price - a.price;
            case 'rating': return b.rating - a.rating;
            default: return 0;
        }
    });

    displayCycles(filteredCycles);
}

function displayCycles(cycles) {
    const cyclesGrid = document.getElementById('cycles-container');
    if (!cyclesGrid) return;

    if (cycles.length === 0) {
        cyclesGrid.innerHTML = '<p class="no-results">No cycles match your criteria. Try adjusting your filters.</p>';
        return;
    }

    cyclesGrid.innerHTML = cycles.map(cycle => createCycleCard(cycle)).join('');
    setupBookButtons();
}

function setupBookButtons() {
    const bookButtons = document.querySelectorAll('.book-now');
    bookButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const cycleId = button.dataset.cycleId;
            openBookingModal(cycleId);
        });
    });
}

// Call initialization
document.addEventListener('DOMContentLoaded', initializeCyclesPage);