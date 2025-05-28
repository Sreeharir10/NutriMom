// Fetch user data from the server
async function fetchUserData() {
    try {
        const response = await fetch('/api/user-data');
        const data = await response.json();
        updateDashboard(data);
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}

// Update dashboard with user data
function updateDashboard(data) {
    // Update user name
    document.getElementById('user-name').textContent = data.name;

    // Update trimester information
    const trimesterProgress = document.getElementById('trimester-progress');
    const trimesterText = document.getElementById('trimester-text');
    const trimesterPercentage = (data.trimester / 3) * 100;
    trimesterProgress.style.width = `${trimesterPercentage}%`;
    trimesterText.textContent = `${data.trimester}${getOrdinalSuffix(data.trimester)} Trimester`;

    // Update countdown
    updateCountdown(data.dueDate);

    // Update stats
    updateStats(data);
}

// Update countdown timer
function updateCountdown(dueDate) {
    const due = new Date(dueDate);
    
    function updateTimer() {
        const now = new Date();
        const diff = due - now;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    }

    updateTimer();
    setInterval(updateTimer, 60000); // Update every minute
}

// Update stats with user data
function updateStats(data) {
    // Update calories
    const caloriesProgress = document.getElementById('calories-progress');
    const caloriesPercentage = (data.caloriesConsumed / data.caloriesTarget) * 100;
    caloriesProgress.style.width = `${caloriesPercentage}%`;
    document.getElementById('calories-consumed').textContent = data.caloriesConsumed;

    // Update water intake
    const waterProgress = document.getElementById('water-progress');
    const waterPercentage = (data.waterConsumed / data.waterTarget) * 100;
    waterProgress.style.width = `${waterPercentage}%`;
    document.getElementById('water-consumed').textContent = data.waterConsumed;

    // Update weight
    document.getElementById('current-weight').textContent = data.currentWeight;
    const weightChange = data.currentWeight - data.prePregnancyWeight;
    const weightChangeElement = document.getElementById('weight-change');
    weightChangeElement.textContent = `${weightChange > 0 ? '+' : ''}${weightChange.toFixed(1)} kg`;
    weightChangeElement.style.color = weightChange > 0 ? '#4CAF50' : '#ff4444';

    // Update meals logged
    document.getElementById('meals-logged').textContent = data.mealsLogged;

    // Update nutrients
    updateNutrients(data.nutrients);
}

// Update nutrient progress bars
function updateNutrients(nutrients) {
    // Protein
    const proteinProgress = document.getElementById('protein-progress');
    const proteinPercentage = (nutrients.protein / 75) * 100;
    proteinProgress.style.width = `${proteinPercentage}%`;
    document.getElementById('protein-consumed').textContent = nutrients.protein;

    // Carbs
    const carbsProgress = document.getElementById('carbs-progress');
    const carbsPercentage = (nutrients.carbs / 275) * 100;
    carbsProgress.style.width = `${carbsPercentage}%`;
    document.getElementById('carbs-consumed').textContent = nutrients.carbs;

    // Fat
    const fatProgress = document.getElementById('fat-progress');
    const fatPercentage = (nutrients.fat / 73) * 100;
    fatProgress.style.width = `${fatPercentage}%`;
    document.getElementById('fat-consumed').textContent = nutrients.fat;

    // Folic Acid
    const folicProgress = document.getElementById('folic-progress');
    const folicPercentage = (nutrients.folic / 600) * 100;
    folicProgress.style.width = `${folicPercentage}%`;
    document.getElementById('folic-consumed').textContent = nutrients.folic;
}

// Helper function to get ordinal suffix
function getOrdinalSuffix(n) {
    const j = n % 10;
    const k = n % 100;
    if (j == 1 && k != 11) return 'st';
    if (j == 2 && k != 12) return 'nd';
    if (j == 3 && k != 13) return 'rd';
    return 'th';
}

// Handle Log Food button click
document.querySelector('.btn-log-food').addEventListener('click', () => {
    // TODO: Implement food logging functionality
    alert('Food logging feature coming soon!');
});

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    let waterConsumed = 0;
    const waterTarget = 2.5; // 2.5L daily target

    // Function to update water display
    function updateWaterDisplay() {
        const waterConsumedElement = document.getElementById('water-consumed');
        const waterProgress = document.getElementById('water-progress');
        
        waterConsumedElement.textContent = waterConsumed.toFixed(2);
        const progressPercentage = (waterConsumed / waterTarget) * 100;
        waterProgress.style.width = `${Math.min(progressPercentage, 100)}%`;
        
        // Save to localStorage
        localStorage.setItem('waterConsumed', waterConsumed);
        localStorage.setItem('waterDate', new Date().toDateString());
    }

    // Function to add water
    window.addWater = function(amount) {
        waterConsumed = Math.max(0, waterConsumed + amount);
        updateWaterDisplay();
    };

    // Load saved water consumption
    function loadWaterConsumption() {
        const savedDate = localStorage.getItem('waterDate');
        const today = new Date().toDateString();
        
        if (savedDate === today) {
            waterConsumed = parseFloat(localStorage.getItem('waterConsumed')) || 0;
        } else {
            waterConsumed = 0;
            localStorage.setItem('waterDate', today);
        }
        updateWaterDisplay();
    }

    // Function to update due date display
    function updateDueDateDisplay(dueDate) {
        const startDate = new Date(dueDate);
        startDate.setDate(startDate.getDate() - 280); // Subtract 280 days to get start date
        const today = new Date();
        
        // Calculate days passed
        const daysPassed = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
        const totalDays = 280;
        const daysRemaining = totalDays - daysPassed;
        
        // Update the display
        document.getElementById('days-passed').textContent = Math.max(0, Math.min(daysPassed, totalDays));
        document.getElementById('total-days').textContent = totalDays;
        document.getElementById('due-date').textContent = new Date(dueDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Update trimester progress
        const trimesterProgress = document.getElementById('trimester-progress');
        const progressPercentage = (daysPassed / totalDays) * 100;
        trimesterProgress.style.width = `${Math.min(progressPercentage, 100)}%`;
    }

    // Fetch user data and update dashboard
    async function fetchUserData() {
        try {
            const response = await fetch('/api/user-data');
            const data = await response.json();
            
            // Update user name
            document.getElementById('user-name').textContent = data.name;
            
            // Update due date
            updateDueDateDisplay(data.dueDate);
            
            // Update weight information
            document.getElementById('current-weight').textContent = data.currentWeight;
            const weightChange = data.currentWeight - data.prePregnancyWeight;
            document.getElementById('weight-change').textContent = 
                `${weightChange >= 0 ? '+' : ''}${weightChange.toFixed(1)} kg`;
            
            // Update meals logged
            document.getElementById('meals-logged').textContent = data.mealsLogged;
            
            // Update calories
            document.getElementById('calories-consumed').textContent = data.caloriesConsumed;
            document.getElementById('calories-target').textContent = data.caloriesTarget;
            const caloriesProgress = (data.caloriesConsumed / data.caloriesTarget) * 100;
            document.getElementById('calories-progress').style.width = `${Math.min(caloriesProgress, 100)}%`;
            
            // Update nutrients
            updateNutrientProgress('protein', data.nutrients.protein, 75);
            updateNutrientProgress('carbs', data.nutrients.carbs, 275);
            updateNutrientProgress('fat', data.nutrients.fat, 73);
            updateNutrientProgress('folic', data.nutrients.folic, 600);
            
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }

    // Helper function to update nutrient progress
    function updateNutrientProgress(nutrient, value, target) {
        document.getElementById(`${nutrient}-consumed`).textContent = value;
        const progress = (value / target) * 100;
        document.getElementById(`${nutrient}-progress`).style.width = `${Math.min(progress, 100)}%`;
    }

    // Initialize
    loadWaterConsumption();
    fetchUserData();
    
    // Refresh data every minute
    setInterval(fetchUserData, 60000);
}); 