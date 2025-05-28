document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('mealForm');
    const imageInput = document.getElementById('mealImage');
    const imagePreview = document.getElementById('imagePreview');
    const submitButton = document.getElementById('submitButton');
    const clearButton = document.getElementById('clearButton');
    const uploadProgress = document.getElementById('uploadProgress');
    const errorMessage = document.getElementById('errorMessage');
    
    // Maximum file size in bytes (16MB)
    const MAX_FILE_SIZE = 16 * 1024 * 1024;
    
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
        setTimeout(() => {
            errorMessage.classList.add('hidden');
        }, 5000);
    }
    
    function validateFile(file) {
        // Check file size
        if (file.size > MAX_FILE_SIZE) {
            showError('File is too large. Maximum size is 16MB.');
            return false;
        }
        
        // Check file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!validTypes.includes(file.type)) {
            showError('Invalid file type. Only JPG, JPEG, and PNG files are allowed.');
            return false;
        }
        
        return true;
    }
    
    function updateImagePreview(file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.innerHTML = `
                <img src="${e.target.result}" alt="Meal preview" class="preview-image">
                <span class="change-image">Click to change image</span>
            `;
            submitButton.disabled = false;
        };
        reader.readAsDataURL(file);
    }
    
    function clearForm() {
        form.reset();
        imagePreview.innerHTML = `
            <i class="fa-solid fa-camera"></i>
            <p>Click to upload or drag an image here</p>
            <span class="file-requirements">Accepted formats: PNG, JPG, JPEG (max 16MB)</span>
        `;
        submitButton.disabled = true;
        errorMessage.classList.add('hidden');
    }
    
    // Handle drag and drop
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        imagePreview.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
    });
    
    ['dragenter', 'dragover'].forEach(eventName => {
        imagePreview.addEventListener(eventName, () => {
            imagePreview.classList.add('drag-active');
        });
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        imagePreview.addEventListener(eventName, () => {
            imagePreview.classList.remove('drag-active');
        });
    });
    
    imagePreview.addEventListener('drop', (e) => {
        const file = e.dataTransfer.files[0];
        if (file && validateFile(file)) {
            imageInput.files = e.dataTransfer.files;
            updateImagePreview(file);
        }
    });
    
    // Handle click to upload
    imagePreview.addEventListener('click', () => {
        imageInput.click();
    });
    
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && validateFile(file)) {
            updateImagePreview(file);
        } else {
            imageInput.value = '';
        }
    });
    
    // Handle form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        
        try {
            uploadProgress.classList.remove('hidden');
            
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to upload meal');
            }
            
            // Redirect to dashboard on success
            window.location.href = '/dashboard';
            
        } catch (error) {
            showError(error.message);
        } finally {
            uploadProgress.classList.add('hidden');
        }
    });
    
    // Handle clear button
    clearButton.addEventListener('click', clearForm);

    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    menuToggle.addEventListener('click', function() {
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    });
}); 