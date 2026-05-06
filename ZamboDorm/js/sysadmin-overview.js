/**
 * SYSADMIN OVERVIEW - Static Analytics & Stats
 * Uses hardcoded data for consistent demonstration.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Static Data (Demo Mode)
    const stats = {
        landlords: 12,
        tenants: 45,
        totalApps: 8,
        pendingApps: 3,
        pendingDorms: 2
    };

    // 2. Initialize Chart.js
    const canvas = document.getElementById('overviewChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Landlords', 'Tenants', 'Applications', 'Pending Apps', 'Pending Dorms'],
            datasets: [{
                label: 'System Totals',
                data: [stats.landlords, stats.tenants, stats.totalApps, stats.pendingApps, stats.pendingDormCount || stats.pendingDorms],
                backgroundColor: [
                    'rgba(124, 58, 237, 0.7)', // Purple (Primary)
                    'rgba(56, 189, 248, 0.7)',  // Blue (Accent)
                    'rgba(16, 185, 129, 0.7)',  // Green (Success)
                    'rgba(245, 158, 11, 0.7)',  // Amber (Warning)
                    'rgba(239, 68, 68, 0.7)'    // Red (Error)
                ],
                borderColor: [
                    '#7c3aed',
                    '#38bdf8',
                    '#10b981',
                    '#f59e0b',
                    '#ef4444'
                ],
                borderWidth: 1,
                borderRadius: 8,
                barThickness: 40
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: '#1e1b4b',
                    titleFont: { family: 'Plus Jakarta Sans', size: 14 },
                    bodyFont: { family: 'Plus Jakarta Sans', size: 13 },
                    padding: 12,
                    cornerRadius: 8,
                    displayColors: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(124, 58, 237, 0.05)',
                        drawBorder: false
                    },
                    ticks: {
                        font: { family: 'Plus Jakarta Sans', size: 12 },
                        color: '#6b7280',
                        stepSize: 10
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: { family: 'Plus Jakarta Sans', weight: '600', size: 12 },
                        color: '#1e1b4b'
                    }
                }
            },
            animation: {
                duration: 1500,
                easing: 'easeInOutQuart'
            }
        }
    });
    
    // 3. Update the summary stat cards to be static
    // Card 1: Properties
    const propertyCountEl = document.querySelector('.stat-card:nth-child(1) .stat-number');
    if (propertyCountEl) {
        propertyCountEl.textContent = '15'; 
    }

    // Card 2: Applications
    const appCountEl = document.querySelector('.stat-card:nth-child(2) .stat-number');
    const appSubEl = document.querySelector('.stat-card:nth-child(2) .stat-sub .badge');
    if (appCountEl) {
        appCountEl.textContent = stats.totalApps; 
    }
    if (appSubEl) {
        appSubEl.textContent = `${stats.pendingApps} Pending`;
    }
});
