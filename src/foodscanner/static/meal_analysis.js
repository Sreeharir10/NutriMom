// Function to initialize the page with meal analysis data
async function initializeMealAnalysis() {
    try {
        const response = await fetch('/api/meal-analysis');
        const data = await response.json();

        console.log('Data received from /api/meal-analysis:', data); // ADD THIS LINE

        if (data.success) {
            displayFoodItems(data.foods);
            updateNutritionalSummary(data.nutrition_summary);
            displayDetailedNutrients(data.detailed_nutrients);
            displayRecommendations(data.recommendations);
        } else {
            showError('Failed to load meal analysis data: ' + data.message);
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

    if (foods && Array.isArray(foods)) {
        foods.forEach(food => {
            const foodItem = document.createElement('div');
            foodItem.className = 'food-item';
            foodItem.innerHTML = `
                <img src="${food.image || '/static/images/placeholder-food.png'}" alt="${food.name}">
                <h3>${food.name}</h3>
                <p>${food.portion_size || 'Standard Portion'}</p>
                <p>${food.calories || 'N/A'} kcal</p>
            `;
            foodItemsList.appendChild(foodItem);
        });
    } else {
        console.log("No food items to display or 'foods' is not an array:", foods);
        const noItemsMessage = document.createElement('p');
        noItemsMessage.textContent = 'No food items detected in this meal.';
        foodItemsList.appendChild(noItemsMessage);
    }
}

// Update nutritional summary
function updateNutritionalSummary(summary) {
    document.getElementById('totalCalories').textContent = `${summary?.calories || '0'} kcal`;
    document.getElementById('totalProtein').textContent = `${summary?.protein || '0g'}`;
    document.getElementById('totalCarbs').textContent = `${summary?.carbohydrates || '0g'}`;
    document.getElementById('totalFat').textContent = `${summary?.fat || '0g'}`;
}

// Display detailed nutrients with progress bars
function displayDetailedNutrients(nutrients) {
    const nutrientsGrid = document.getElementById('detailedNutrients');
    nutrientsGrid.innerHTML = '';

    if (nutrients && typeof nutrients === 'object') {
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
    } else {
        console.log("No detailed nutrients to display or 'nutrients' is not an object:", nutrients);
        const noNutrientsMessage = document.createElement('p');
        noNutrientsMessage.textContent = 'No detailed nutrient information available.';
        nutrientsGrid.appendChild(noNutrientsMessage);
    }
}

// Display recommendations
function displayRecommendations(recommendations) {
    const recommendationsList = document.getElementById('recommendationsList');
    recommendationsList.innerHTML = '';

    if (recommendations && Array.isArray(recommendations)) {
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
    } else {
        console.log("No recommendations to display or 'recommendations' is not an array:", recommendations);
        const noRecommendationsMessage = document.createElement('p');
        noRecommendationsMessage.textContent = 'No recommendations available for this meal.';
        recommendationsList.appendChild(noRecommendationsMessage);
    }
}

// Show error message
function showError(message) {
    const errorMessageDiv = document.createElement('div');
    errorMessageDiv.className = 'alert alert-danger';
    errorMessageDiv.textContent = message;
    const analysisContainer = document.querySelector('.analysis-container');
    if (analysisContainer) {
        analysisContainer.prepend(errorMessageDiv);
        setTimeout(() => {
            errorMessageDiv.remove();
        }, 5000);
    } else {
        console.error("Analysis container not found to display error:", message);
    }
}

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeMealAnalysis);