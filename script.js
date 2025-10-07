// Global Variables
let currentLanguage = 'en';
let isScrolling = false;

// DOM Elements
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const languageToggle = document.getElementById('language-toggle');
const backToTop = document.getElementById('back-to-top');
const contactForm = document.getElementById('contact-form');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupEventListeners();
    setupScrollAnimations();
    setupSmoothScrolling();
    setupFormValidation();
    setupLanguageToggle();
    setupBackToTop();
    setupNavbarEffects();
}

// Event Listeners Setup
function setupEventListeners() {
    // Hamburger menu toggle
    hamburger.addEventListener('click', toggleMobileMenu);
    
    // Close mobile menu when clicking on nav links
    navMenu.addEventListener('click', (e) => {
        if (e.target.classList.contains('nav-link')) {
            closeMobileMenu();
        }
    });
    
    // Language toggle
    languageToggle.addEventListener('click', toggleLanguage);
    
    // Back to top button
    backToTop.addEventListener('click', scrollToTop);
    
    // Window scroll events
    window.addEventListener('scroll', throttle(handleScroll, 16));
    
    // Window resize events
    window.addEventListener('resize', throttle(handleResize, 250));
    
    // Form submission
    contactForm.addEventListener('submit', handleFormSubmit);
    
    // CTA button click
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', () => {
            document.getElementById('types').scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // Learn more buttons
    const learnMoreBtns = document.querySelectorAll('.learn-more-btn');
    learnMoreBtns.forEach(btn => {
        btn.addEventListener('click', handleLearnMore);
    });
}

// Mobile Menu Functions
function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
    
    // Animate hamburger bars
    const bars = hamburger.querySelectorAll('.bar');
    bars.forEach((bar, index) => {
        if (hamburger.classList.contains('active')) {
            if (index === 0) bar.style.transform = 'rotate(-45deg) translate(-5px, 6px)';
            if (index === 1) bar.style.opacity = '0';
            if (index === 2) bar.style.transform = 'rotate(45deg) translate(-5px, -6px)';
        } else {
            bar.style.transform = 'none';
            bar.style.opacity = '1';
        }
    });
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = hamburger.classList.contains('active') ? 'hidden' : '';
}

function closeMobileMenu() {
    navMenu.classList.remove('active');
    hamburger.classList.remove('active');
    document.body.style.overflow = '';
    
    const bars = hamburger.querySelectorAll('.bar');
    bars.forEach(bar => {
        bar.style.transform = 'none';
        bar.style.opacity = '1';
    });
}

// Language Toggle Functions
function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'mr' : 'en';
    updateLanguage();
    
    // Update button text
    const langText = document.getElementById('lang-text');
    langText.textContent = currentLanguage === 'en' ? 'मराठी' : 'English';
    
    // Add animation effect
    langText.style.transform = 'scale(0.8)';
    setTimeout(() => {
        langText.style.transform = 'scale(1)';
    }, 150);
}

function updateLanguage() {
    const elements = document.querySelectorAll(`[data-${currentLanguage}]`);
    
    elements.forEach(element => {
        const text = element.getAttribute(`data-${currentLanguage}`);
        if (text) {
            // Handle different element types
            if (element.tagName === 'INPUT' && element.type !== 'submit') {
                element.placeholder = text;
            } else if (element.tagName === 'OPTION') {
                element.textContent = text;
            } else {
                element.innerHTML = text;
            }
        }
    });
    
    // Update placeholders for newsletter form
    const newsletterInput = document.querySelector('.newsletter-form input');
    if (newsletterInput) {
        const placeholder = currentLanguage === 'en' ? 'Enter your email' : 'आपला ईमेल टाका';
        newsletterInput.placeholder = placeholder;
    }
    
    // Update form labels
    updateFormLabels();
}

function updateFormLabels() {
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach(group => {
        const label = group.querySelector('label');
        const input = group.querySelector('input, select, textarea');
        
        if (label && input) {
            const labelText = label.getAttribute(`data-${currentLanguage}`);
            if (labelText) {
                label.textContent = labelText;
            }
        }
    });
}

// Scroll Animations
function setupScrollAnimations() {
    const animateElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .slide-in-up');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animateElements.forEach(element => {
        observer.observe(element);
    });
}

// Smooth Scrolling
function setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Form Validation and Submission
function setupFormValidation() {
    const inputs = contactForm.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearFieldError(input));
    });
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';
    
    // Clear previous errors
    clearFieldError(field);
    
    // Required field validation
    if (field.required && !value) {
        errorMessage = currentLanguage === 'en' ? 'This field is required' : 'हे फील्ड आवश्यक आहे';
        isValid = false;
    }
    
    // Specific field validations
    if (value && isValid) {
        switch (fieldName) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    errorMessage = currentLanguage === 'en' ? 'Please enter a valid email address' : 'कृपया वैध ईमेल पत्ता प्रविष्ट करा';
                    isValid = false;
                }
                break;
                
            case 'phone':
                if (value) {
                    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
                    if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
                        errorMessage = currentLanguage === 'en' ? 'Please enter a valid phone number' : 'कृपया वैध फोन नंबर प्रविष्ट करा';
                        isValid = false;
                    }
                }
                break;
                
            case 'name':
                if (value.length < 2) {
                    errorMessage = currentLanguage === 'en' ? 'Name must be at least 2 characters long' : 'नाव किमान २ अक्षरांचे असावे';
                    isValid = false;
                }
                break;
                
            case 'message':
                if (value.length < 10) {
                    errorMessage = currentLanguage === 'en' ? 'Message must be at least 10 characters long' : 'संदेश किमान १० अक्षरांचा असावा';
                    isValid = false;
                }
                break;
        }
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    const errorElement = document.getElementById(`${field.name}-error`);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
    field.style.borderColor = '#dc3545';
}

function clearFieldError(field) {
    const errorElement = document.getElementById(`${field.name}-error`);
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.remove('show');
    }
    field.style.borderColor = '';
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const submitBtn = contactForm.querySelector('.submit-btn');
    const successMessage = document.getElementById('success-message');
    
    // Validate all fields
    const inputs = contactForm.querySelectorAll('input[required], select[required], textarea[required]');
    let isFormValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isFormValid = false;
        }
    });
    
    if (!isFormValid) {
        return;
    }
    
    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Hide loading state
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        
        // Show success message
        successMessage.classList.add('show');
        
        // Reset form
        contactForm.reset();
        
        // Hide success message after 5 seconds
        setTimeout(() => {
            successMessage.classList.remove('show');
        }, 5000);
        
        // Scroll to success message
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
    }, 2000);
}

// Back to Top Button
function setupBackToTop() {
    // Show/hide back to top button based on scroll position
    function toggleBackToTop() {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    }
    
    window.addEventListener('scroll', throttle(toggleBackToTop, 100));
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Navbar Effects
function setupNavbarEffects() {
    let lastScrollTop = 0;
    
    function updateNavbar() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add scrolled class when scrolling down
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide navbar when scrolling down, show when scrolling up
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    }
    
    window.addEventListener('scroll', throttle(updateNavbar, 10));
}

// Scroll Handler
function handleScroll() {
    if (!isScrolling) {
        window.requestAnimationFrame(() => {
            // Handle parallax effects for hero section
            const hero = document.querySelector('.hero');
            const scrolled = window.pageYOffset;
            const heroHeight = hero.offsetHeight;
            
            if (scrolled < heroHeight) {
                const heroImage = hero.querySelector('.hero-image');
                if (heroImage) {
                    heroImage.style.transform = `translateY(${scrolled * 0.5}px)`;
                }
            }
            
            isScrolling = false;
        });
        
        isScrolling = true;
    }
}

// Window Resize Handler
function handleResize() {
    // Close mobile menu on resize
    if (window.innerWidth > 768) {
        closeMobileMenu();
    }
    
    // Recalculate scroll positions
    setupScrollAnimations();
}

// Learn More Button Handler
function handleLearnMore(e) {
    const button = e.target;
    const card = button.closest('.yoga-card');
    const yogaType = card.querySelector('h3').textContent;
    
    // Add click animation
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = '';
    }, 150);
    
    // Show modal or navigate to detailed page (placeholder functionality)
    showYogaDetails(yogaType);
}

function showYogaDetails(yogaType) {
    // Placeholder function - in a real application, this would show a modal or navigate to a detailed page
    const message = currentLanguage === 'en' 
        ? `Learn more about ${yogaType} coming soon!` 
        : `${yogaType} बद्दल अधिक जाणून घेणे लवकरच येत आहे!`;
    
    // Create a simple notification
    showNotification(message);
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(45deg, #4a7c59, #7ba05b);
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        font-family: 'Mulish', sans-serif;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Utility Functions
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add loading animation to hero elements
    const heroElements = document.querySelectorAll('.hero .fade-in');
    heroElements.forEach((element, index) => {
        setTimeout(() => {
            element.classList.add('animate');
        }, index * 200);
    });
    
    // Initialize intersection observer for lazy loading images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
});

// Service Worker Registration (for better performance)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Only register if we have a service worker file
        // navigator.serviceWorker.register('/sw.js');
    });
}

// Error Handling
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    // In production, you might want to send this to an error tracking service
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    // In production, you might want to send this to an error tracking service
});

// Performance Monitoring
if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
            if (entry.entryType === 'navigation') {
                console.log('Page load time:', entry.loadEventEnd - entry.loadEventStart);
            }
        });
    });
    observer.observe({ entryTypes: ['navigation'] });
}

console.log('🧘‍♀️ Yoga Awareness website initialized successfully!');
