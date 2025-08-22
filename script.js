// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Update ARIA attributes for accessibility
    const isExpanded = navMenu.classList.contains('active');
    hamburger.setAttribute('aria-expanded', isExpanded);
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
}));

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
    }
});

// Touch-friendly mobile navigation
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', (e) => {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const swipeDistance = touchEndY - touchStartY;
    
    // Swipe down to close mobile menu
    if (swipeDistance > swipeThreshold && navMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
    }
}

// Smooth scrolling for navigation links with mobile optimization
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            // Close mobile menu before scrolling
            if (navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
            
            // Mobile-optimized scrolling
            const isMobile = window.innerWidth <= 768;
            const offset = isMobile ? 80 : 100;
            
            const targetPosition = target.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background change on scroll with mobile optimization
let ticking = false;
function updateNavbar() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(updateNavbar);
        ticking = true;
    }
});

// Contact form handling with mobile optimization
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const company = formData.get('company');
        const message = formData.get('message');
        
        // Basic validation
        if (!name || !email || !message) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }
        
        // Simulate form submission
        showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
        
        // Reset form
        this.reset();
        
        // In a real application, you would send this data to your server
        console.log('Form submitted:', { name, email, company, message });
    });
}

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Mobile-optimized notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" aria-label="Close notification">&times;</button>
        </div>
    `;
    
    // Mobile-optimized positioning
    const isMobile = window.innerWidth <= 768;
    const topPosition = isMobile ? '80px' : '100px';
    const rightPosition = isMobile ? '10px' : '20px';
    const leftPosition = isMobile ? '10px' : 'auto';
    const maxWidth = isMobile ? 'calc(100vw - 20px)' : '400px';
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: ${topPosition};
        right: ${rightPosition};
        left: ${leftPosition};
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        max-width: ${maxWidth};
        animation: slideIn 0.3s ease;
    `;
    
    // Add animation keyframes
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Mobile-optimized intersection observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation with mobile performance optimization
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.service-card, .feature-item, .stat, .tech-item');
    
    // Reduce animations on mobile for better performance
    const isMobile = window.innerWidth <= 768;
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        
        if (!isMobile) {
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        } else {
            // Immediate animation on mobile for better performance
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 100);
        }
    });
});

// Mobile-optimized parallax effect
let parallaxTicking = false;
function updateParallax() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero && window.innerWidth > 768) { // Only on desktop
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
    parallaxTicking = false;
}

window.addEventListener('scroll', () => {
    if (!parallaxTicking) {
        requestAnimationFrame(updateParallax);
        parallaxTicking = true;
    }
});

// Mobile-optimized loading animation
function addLoadingAnimation() {
    const serviceCards = document.querySelectorAll('.service-card');
    const isMobile = window.innerWidth <= 768;
    
    if (!isMobile) {
        serviceCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
        });
    }
}

// Initialize loading animations
document.addEventListener('DOMContentLoaded', addLoadingAnimation);

// Mobile-optimized hover effects
document.addEventListener('DOMContentLoaded', () => {
    const isMobile = window.innerWidth <= 768;
    
    if (!isMobile) {
        // Add hover effect to buttons
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px) scale(1.02)';
            });
            
            button.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
        
        // Add hover effect to service cards
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    }
});

// Mobile-optimized counter animation
function animateCounters() {
    const counters = document.querySelectorAll('.stat h3');
    const speed = window.innerWidth <= 768 ? 100 : 200; // Faster on mobile
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent);
        const increment = target / speed;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current) + (counter.textContent.includes('+') ? '+' : '');
                setTimeout(updateCounter, 1);
            } else {
                counter.textContent = target + (counter.textContent.includes('+') ? '+' : '');
            }
        };
        
        updateCounter();
    });
}

// Trigger counter animation when stats section is visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

// Observe stats section
document.addEventListener('DOMContentLoaded', () => {
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
});

// Mobile-optimized typing effect
function typeWriterHTML(element, speed = 100) {
    const originalHTML = element.innerHTML;
    element.innerHTML = '';
    
    // Split the HTML into text and HTML tags
    const textContent = element.textContent || element.innerText || '';
    let currentText = '';
    let i = 0;
    
    function type() {
        if (i < textContent.length) {
            currentText += textContent.charAt(i);
            // Reconstruct the HTML with the current text
            element.innerHTML = originalHTML.replace(textContent, currentText);
            i++;
            setTimeout(type, speed);
        } else {
            // Ensure final HTML is correct
            element.innerHTML = originalHTML;
        }
    }
    
    type();
}

// Initialize typing effect when page loads (only on desktop)
document.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle && window.innerWidth > 768) {
        setTimeout(() => {
            typeWriterHTML(heroTitle, 50);
        }, 500);
    }
});

// Mobile-optimized scroll progress indicator
function addScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        z-index: 10001;
        transition: width 0.1s ease;
    `;
    
    document.body.appendChild(progressBar);
    
    let scrollTicking = false;
    function updateScrollProgress() {
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = scrolled + '%';
        scrollTicking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            requestAnimationFrame(updateScrollProgress);
            scrollTicking = true;
        }
    });
}

// Initialize scroll progress
document.addEventListener('DOMContentLoaded', addScrollProgress);

// Mobile performance optimization: Reduce animations on low-end devices
function detectLowEndDevice() {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const isLowEnd = connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');
    
    if (isLowEnd || navigator.hardwareConcurrency <= 4) {
        document.body.classList.add('low-end-device');
        
        // Disable complex animations
        const style = document.createElement('style');
        style.textContent = `
            .low-end-device .ai-animation,
            .low-end-device .ai-brain,
            .low-end-device .node,
            .low-end-device .connection,
            .low-end-device .neural-path,
            .low-end-device .data-flow {
                animation: none !important;
            }
            
            .low-end-device .service-card,
            .low-end-device .feature-item {
                transition: none !important;
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize device detection
document.addEventListener('DOMContentLoaded', detectLowEndDevice);

// Mobile touch gesture support
let touchStartX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    
    const deltaX = touchEndX - touchStartX;
    
    // Horizontal swipe detection
    if (Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
            // Swipe right - could be used for navigation
            console.log('Swipe right detected');
        } else {
            // Swipe left - could be used for navigation
            console.log('Swipe left detected');
        }
    }
});

// Mobile viewport height fix for mobile browsers
function setMobileViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Set initial viewport height
setMobileViewportHeight();

// Update on resize and orientation change
window.addEventListener('resize', setMobileViewportHeight);
window.addEventListener('orientationchange', () => {
    setTimeout(setMobileViewportHeight, 100);
});
