document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const editButton = document.querySelector('.btn-edit');
    const profileContent = document.querySelector('.profile-content');
    const editForm = document.querySelector('.edit-form');
    const cancelButton = document.querySelector('.btn-secondary');
    const saveButton = document.querySelector('.btn-primary');
    const form = document.querySelector('form');
    const otherCheckbox = document.getElementById('edit-other');
    const otherConditionInput = document.getElementById('edit-other-condition');
    const otherConditionText = document.getElementById('edit-other-condition-text');

    // Toggle "Other" condition input visibility
    otherCheckbox.addEventListener('change', function() {
        otherConditionInput.style.display = this.checked ? 'block' : 'none';
        if (!this.checked) {
            otherConditionText.value = '';
        }
    });

    // Fetch and display user data
    async function loadUserData() {
        try {
            const response = await fetch('/api/profile-data');
            if (!response.ok) {
                throw new Error('Failed to fetch profile data');
            }
            const data = await response.json();

            // Update personal information
            updateElement('name', data.name);
            updateElement('email', data.email);
            updateElement('age', data.age);
            updateElement('height', data.height);

            // Update pregnancy information
            updateElement('trimester', getTrimesterText(data.trimester));
            updateElement('due-date', formatDate(data.due_date));
            updateElement('multiple-pregnancies', data.multiple_pregnancies ? 'Yes' : 'No');
            updateElement('medical-conditions', formatMedicalConditions(data.medical_conditions));

            // Update health information
            updateElement('weight', data.weight);
            updateElement('pre-pregnancy-weight', data.pre_pregnancy_weight);
            updateElement('diet-type', formatDietType(data.diet_type));
            updateElement('allergies', data.allergies || 'None');

            // Update form fields
            updateFormField('edit-name', data.name);
            updateFormField('edit-age', data.age);
            updateFormField('edit-height', data.height);
            updateFormField('edit-trimester', data.trimester);
            updateFormField('edit-multiple-pregnancies', data.multiple_pregnancies ? 'yes' : 'no');
            updateFormField('edit-weight', data.weight);
            updateFormField('edit-pre-pregnancy-weight', data.pre_pregnancy_weight);
            updateFormField('edit-diet-type', data.diet_type);
            updateFormField('edit-allergies', data.allergies || '');

            // Update medical conditions checkboxes
            updateMedicalConditionsCheckboxes(data.medical_conditions);

        } catch (error) {
            console.error('Error loading profile data:', error);
            showNotification('Failed to load profile data', 'error');
        }
    }

    // Helper function to update display elements
    function updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value || 'Not specified';
        }
    }

    // Helper function to update form fields
    function updateFormField(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.value = value || '';
        }
    }

    // Helper function to update medical conditions checkboxes
    function updateMedicalConditionsCheckboxes(conditions) {
        if (!conditions) return;
        
        // Reset all checkboxes
        document.querySelectorAll('input[name="medical_conditions"]').forEach(checkbox => {
            checkbox.checked = false;
        });
        otherConditionText.value = '';
        otherConditionInput.style.display = 'none';

        conditions.forEach(condition => {
            if (condition === 'other') {
                otherCheckbox.checked = true;
                otherConditionInput.style.display = 'block';
                otherConditionText.value = condition;
            } else {
                const checkbox = document.getElementById(`edit-${condition}`);
                if (checkbox) {
                    checkbox.checked = true;
                }
            }
        });
    }

    // Helper function to format trimester text
    function getTrimesterText(trimester) {
        const trimesterMap = {
            1: 'First Trimester',
            2: 'Second Trimester',
            3: 'Third Trimester'
        };
        return trimesterMap[trimester] || 'Not specified';
    }

    // Helper function to format date
    function formatDate(dateString) {
        if (!dateString) return 'Not specified';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Helper function to format medical conditions
    function formatMedicalConditions(conditions) {
        if (!conditions || conditions.length === 0) return 'None';
        return conditions.map(condition => 
            condition.charAt(0).toUpperCase() + condition.slice(1)
        ).join(', ');
    }

    // Helper function to format diet type
    function formatDietType(dietType) {
        if (!dietType) return 'Not specified';
        return dietType.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    // Toggle between view and edit modes
    editButton.addEventListener('click', function() {
        profileContent.classList.add('hidden');
        editForm.classList.remove('hidden');
    });

    cancelButton.addEventListener('click', function() {
        profileContent.classList.remove('hidden');
        editForm.classList.add('hidden');
    });

    // Handle form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Disable save button and show loading state
        saveButton.disabled = true;
        saveButton.textContent = 'Saving...';

        try {
            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            // Get medical conditions from checkboxes
            const medicalConditions = Array.from(document.querySelectorAll('input[name="medical_conditions"]:checked'))
                .map(checkbox => {
                    if (checkbox.value === 'other' && otherConditionText.value.trim()) {
                        return otherConditionText.value.trim();
                    }
                    return checkbox.value;
                })
                .filter(condition => condition !== 'other' || otherConditionText.value.trim());

            data.medical_conditions = medicalConditions;

            // Send update request to server
            const response = await fetch('/api/update-profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Failed to update profile');
            }

            const result = await response.json();

            // Reload user data to show updated information
            await loadUserData();

            // Switch back to view mode
            profileContent.classList.remove('hidden');
            editForm.classList.add('hidden');

            // Show success message
            showNotification('Profile updated successfully!', 'success');

        } catch (error) {
            console.error('Error updating profile:', error);
            showNotification('Failed to update profile. Please try again.', 'error');
        } finally {
            // Re-enable save button and restore text
            saveButton.disabled = false;
            saveButton.textContent = 'Save Changes';
        }
    });

    // Function to show notifications
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        // Add notification styles
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.padding = '1rem 2rem';
        notification.style.borderRadius = '5px';
        notification.style.backgroundColor = type === 'success' ? '#4CAF50' : 
                                           type === 'error' ? '#ff4444' : '#2196F3';
        notification.style.color = 'white';
        notification.style.zIndex = '1000';
        notification.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
        notification.style.animation = 'slideIn 0.3s ease-out';

        document.body.appendChild(notification);

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Load user data when the page loads
    loadUserData();
}); 