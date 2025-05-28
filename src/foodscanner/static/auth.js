document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const authForms = document.querySelectorAll('.auth-form');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    // Check if we should show signup tab based on URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('tab') === 'signup') {
        document.querySelector('[data-tab="signup"]').click();
    }

    // Handle tab switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all tabs and forms
            tabBtns.forEach(b => b.classList.remove('active'));
            authForms.forEach(f => f.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding form
            this.classList.add('active');
            const targetForm = document.getElementById(`${this.dataset.tab}-form`);
            if (targetForm) {
                targetForm.classList.add('active');
            }
        });
    });

    // Handle login form submission
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Logging in...';

        try {
            const formData = {
                username: this.querySelector('#username').value,
                password: this.querySelector('#password').value
            };

            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                // Successful login
                showNotification('Login successful! Redirecting...', 'success');
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 1000);
            } else {
                // Login failed
                showNotification(data.message || 'Login failed. Please try again.', 'error');
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        } catch (error) {
            console.error('Login error:', error);
            showNotification('An error occurred. Please try again.', 'error');
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    });

    // Function to show notifications
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 25px',
            borderRadius: '5px',
            backgroundColor: type === 'success' ? '#4CAF50' : 
                           type === 'error' ? '#f44336' : '#2196F3',
            color: 'white',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            zIndex: '1000',
            animation: 'slideIn 0.3s ease-out'
        });

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
        `;
        document.head.appendChild(style);

        document.body.appendChild(notification);

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Carousel functionality
    const slides = document.querySelectorAll('.carousel-slide');
    const progressBar = document.querySelector('.progress-bar');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');
    let currentSlide = 0;

    function updateCarousel() {
        // Update slides
        slides.forEach((slide, index) => {
            if (index === currentSlide) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });

        // Update progress bar
        const progress = ((currentSlide + 1) / slides.length) * 100;
        progressBar.style.width = `${progress}%`;

        // Update buttons
        prevBtn.disabled = currentSlide === 0;
        nextBtn.style.display = currentSlide === slides.length - 1 ? 'none' : 'block';
        submitBtn.style.display = currentSlide === slides.length - 1 ? 'block' : 'none';
    }

    function resetCarousel() {
        currentSlide = 0;
        updateCarousel();
    }

    function validateCurrentSlide() {
        const currentSlideElement = slides[currentSlide];
        const inputs = currentSlideElement.querySelectorAll('input[required], select[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value) {
                isValid = false;
                input.classList.add('error');
            } else {
                input.classList.remove('error');
            }
        });

        return isValid;
    }

    // Event listeners for carousel navigation
    prevBtn.addEventListener('click', () => {
        if (currentSlide > 0) {
            currentSlide--;
            updateCarousel();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (validateCurrentSlide()) {
            currentSlide++;
            updateCarousel();
        }
    });

    // Handle "Other" medical condition
    const otherConditionCheckbox = document.getElementById('other_condition');
    const otherConditionInput = document.getElementById('other_condition_input');
    const otherConditionText = document.getElementById('other_condition_text');

    otherConditionCheckbox.addEventListener('change', () => {
        otherConditionInput.style.display = otherConditionCheckbox.checked ? 'block' : 'none';
        if (!otherConditionCheckbox.checked) {
            otherConditionText.value = '';
        }
    });

    // Form validation function
    function validateForm(formData) {
        const errors = [];
        
        // Basic info validation
        if (!formData.name?.trim()) errors.push('Name is required');
        if (!formData.email?.trim()) errors.push('Email is required');
        if (!formData.password?.trim()) errors.push('Password is required');
        if (formData.password?.length < 8) errors.push('Password must be at least 8 characters');
        
        // Physical info validation
        if (!formData.height || formData.height <= 0) errors.push('Valid height is required');
        if (!formData.weight || formData.weight <= 0) errors.push('Valid weight is required');
        if (!formData.pre_pregnancy_weight || formData.pre_pregnancy_weight <= 0) errors.push('Valid pre-pregnancy weight is required');
        if (!formData.age || formData.age <= 0) errors.push('Valid age is required');
        
        // Pregnancy info validation
        if (!formData.trimester) errors.push('Trimester is required');
        if (!formData.multiple_pregnancies) errors.push('Multiple pregnancies status is required');
        
        // Dietary preferences validation
        if (!formData.diet_type) errors.push('Diet type is required');
        
        return errors;
    }

    // Update form submission to include validation
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!validateCurrentSlide()) {
            return;
        }

        // Collect medical conditions
        const medicalConditions = [];
        document.querySelectorAll('input[name="medical_conditions"]:checked').forEach(checkbox => {
            if (checkbox.value === 'other' && otherConditionText.value.trim()) {
                medicalConditions.push(otherConditionText.value.trim());
            } else if (checkbox.value !== 'other') {
                medicalConditions.push(checkbox.value);
            }
        });

        // Collect all form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            password: document.getElementById('signup-password').value,
            height: parseFloat(document.getElementById('height').value),
            weight: parseFloat(document.getElementById('weight').value),
            pre_pregnancy_weight: parseFloat(document.getElementById('pre-pregnancy-weight').value),
            age: parseInt(document.getElementById('age').value),
            trimester: parseInt(document.getElementById('trimester').value),
            multiple_pregnancies: document.getElementById('multiple-pregnancies').value,
            medical_conditions: medicalConditions,
            diet_type: document.getElementById('diet-type').value,
            allergies: document.getElementById('allergies').value
        };

        // Validate form data
        const errors = validateForm(formData);
        if (errors.length > 0) {
            alert('Please correct the following errors:\n' + errors.join('\n'));
            return;
        }

        try {
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            
            if (data.success) {
                window.location.href = '/dashboard';
            } else {
                alert(data.message || 'An error occurred during signup');
            }
        } catch (error) {
            console.error('Signup error:', error);
            alert('An error occurred during signup. Please try again.');
        }
    });

    // Add visual feedback for required fields
    const requiredFields = document.querySelectorAll('input[required], select[required]');
    requiredFields.forEach(field => {
        field.addEventListener('blur', () => {
            if (!field.value.trim()) {
                field.classList.add('error');
                field.parentElement.classList.add('error');
            } else {
                field.classList.remove('error');
                field.parentElement.classList.remove('error');
            }
        });
    });

    // Initialize carousel
    updateCarousel();
}); 