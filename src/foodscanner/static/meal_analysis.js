// Function to initialize the page with meal analysis data
async function initializeMealAnalysis() {
    try {
        const response = await fetch('/api/meal-analysis');
        const data = await response.json();
        
        if (data.success) {
            displayFoodItems(data.foods);
            updateNutritionalSummary(data.nutrition_summary);
            displayDetailedNutrients(data.detailed_nutrients);
            displayRecommendations(data.recommendations);
        } else {
            showError('Failed to load meal analysis data');
        }
    } catch (error) {
        console.error('Error fetching meal analysis:', error);
        showError('An error occurred while loading the analysis');
    }
}

// Display detected food items
function displayFoodItems(foods) {
    const foodItemsList = document.getElementById('foodItemsList');
    foodItemsList.innerHTML = '';

    foods.forEach(food => {
        const foodItem = document.createElement('div');
        foodItem.className = 'food-item';
        foodItem.innerHTML = `
            <img src="${food.image || '/static/images/placeholder-food.png'}" alt="${food.name}">
            <h3>${food.name}</h3>
            <p>${food.portion_size || 'Standard Portion'}</p>
            <p>${food.calories} kcal</p>
        `;
        foodItemsList.appendChild(foodItem);
    });
}

// Update nutritional summary
function updateNutritionalSummary(summary) {
    document.getElementById('totalCalories').textContent = `${summary.calories} kcal`;
    document.getElementById('totalProtein').textContent = `${summary.protein}g`;
    document.getElementById('totalCarbs').textContent = `${summary.carbohydrates}g`;
    document.getElementById('totalFat').textContent = `${summary.fat}g`;
}

// Display detailed nutrients with progress bars
function displayDetailedNutrients(nutrients) {
    const nutrientsGrid = document.getElementById('detailedNutrients');
    nutrientsGrid.innerHTML = '';

    Object.entries(nutrients).forEach(([nutrient, data]) => {
        const percentage = (data.amount / data.daily_value) * 100;
        const nutrientItem = document.createElement('div');
        nutrientItem.className = 'nutrient-item';
        nutrientItem.innerHTML = `
            <h4>${nutrient}</h4>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${Math.min(percentage, 100)}%"></div>
            </div>
            <p>${data.amount}${data.unit} (${percentage.toFixed(1)}% DV)</p>
        `;
        nutrientsGrid.appendChild(nutrientItem);
    });
}

// Display recommendations
function displayRecommendations(recommendations) {
    const recommendationsList = document.getElementById('recommendationsList');
    recommendationsList.innerHTML = '';

    recommendations.forEach(rec => {
        const recItem = document.createElement('div');
        recItem.className = 'recommendation-item';
        recItem.innerHTML = `
            <i class="fas fa-lightbulb"></i>
            <div>
                <h4>${rec.title}</h4>
                <p>${rec.description}</p>
            </div>
        `;
        recommendationsList.appendChild(recItem);
    });
}

// Show error message
function showError(message) {
    const errorMessage = document.createElement('div');
    errorMessage.className = 'alert alert-danger';
    errorMessage.textContent = message;
    document.querySelector('.analysis-container').prepend(errorMessage);
}

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeMealAnalysis);