document.addEventListener('DOMContentLoaded', function() {
    // Get all play buttons
    const playButtons = document.querySelectorAll('.btn-play');
    const saveButtons = document.querySelectorAll('.btn-save');

    // Handle play button clicks
    playButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.recommendation-card');
            const title = card.querySelector('h3').textContent;
            
            // Show notification
            showNotification(`Starting ${title}...`, 'info');
            
            // Here you would typically integrate with a music player or video player
            // For now, we'll just show a notification
            setTimeout(() => {
                showNotification(`${title} is now playing`, 'success');
            }, 1000);
        });
    });

    // Handle save button clicks
    saveButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.recommendation-card');
            const title = card.querySelector('h3').textContent;
            
            // Toggle save state
            const isSaved = this.classList.toggle('saved');
            
            // Update button text and icon
            if (isSaved) {
                this.innerHTML = '<i class="fas fa-check"></i> Saved';
                showNotification(`${title} saved to your favorites`, 'success');
            } else {
                this.innerHTML = '<i class="fas fa-bookmark"></i> Save';
                showNotification(`${title} removed from favorites`, 'info');
            }
        });
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
}); 