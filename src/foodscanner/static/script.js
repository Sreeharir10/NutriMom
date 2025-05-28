// Update current year in footer
document.getElementById('current-year').textContent = new Date().getFullYear();

// Mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('show');
  });
}

// Tabs functionality
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Remove active class from all buttons and panes
    tabBtns.forEach(b => b.classList.remove('active'));
    tabPanes.forEach(p => p.classList.remove('active'));
    
    // Add active class to clicked button and corresponding pane
    btn.classList.add('active');
    const tabId = btn.getAttribute('data-tab');
    document.getElementById(tabId).classList.add('active');
  });
});

// Favorite button functionality
const favoriteBtns = document.querySelectorAll('.favorite-btn');
favoriteBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    btn.classList.toggle('active');
    
    // Toggle heart icon
    const icon = btn.querySelector('i');
    if (btn.classList.contains('active')) {
      icon.classList.remove('fa-regular');
      icon.classList.add('fa-solid');
      icon.style.color = '#e11d48';
    } else {
      icon.classList.remove('fa-solid');
      icon.classList.add('fa-regular');
      icon.style.color = '';
    }
  });
});

// Add to meal plan button functionality
const addBtns = document.querySelectorAll('.add-btn');
addBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    btn.classList.toggle('added');
    
    if (btn.classList.contains('added')) {
      btn.innerHTML = '<i class="fa-solid fa-check"></i> Added to Plan';
    } else {
      btn.innerHTML = '<i class="fa-solid fa-plus"></i> Add to Meal Plan';
    }
  });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 70, // Adjust for navbar height
        behavior: 'smooth'
      });
      
      // Close mobile menu if open
      if (navLinks.classList.contains('show')) {
        navLinks.classList.remove('show');
      }
    }
  });
});

// Add mobile menu styles
document.head.insertAdjacentHTML('beforeend', `
  <style>
    @media (max-width: 768px) {
      .nav-links {
        position: fixed;
        top: 0;
        right: -100%;
        width: 70%;
        height: 100vh;
        background-color: white;
        flex-direction: column;
        align-items: flex-start;
        padding: 5rem 2rem 2rem;
        transition: right 0.3s ease;
        box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
        z-index: 99;
      }
      
      .nav-links.show {
        right: 0;
      }
      
      .nav-links li {
        margin-bottom: 1.5rem;
      }
      
      .menu-toggle {
        position: relative;
        z-index: 100;
      }
    }
  </style>
`);

// Intersection Observer for animations
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
    }
  });
}, observerOptions);

// Add animation classes and observe elements
document.head.insertAdjacentHTML('beforeend', `
  <style>
    .feature-card, .recommendation-card, .food-card, .testimonial-card, .hero-content, .hero-image, .cta-content, .cta-images {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .animate-in {
      opacity: 1;
      transform: translateY(0);
    }
    
    .hero-content, .cta-content {
      transition-delay: 0.2s;
    }
    
    .hero-image, .cta-images {
      transition-delay: 0.4s;
    }
  </style>
`);

// Observe elements
document.querySelectorAll('.feature-card, .recommendation-card, .food-card, .testimonial-card, .hero-content, .hero-image, .cta-content, .cta-images').forEach(el => {
  observer.observe(el);
});

// Add 'active' class initially to elements in the viewport
window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.feature-card, .recommendation-card, .food-card, .testimonial-card, .hero-content, .hero-image, .cta-content, .cta-images').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
      el.classList.add('animate-in');
    }
  });
});

// Fix for Profile.tsx build error 
// Not applicable in standalone HTML/CSS/JS version
