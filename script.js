// Performance optimization utilities
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Mouse parallax for the glowing sphere
class SphereParallax {
    constructor() {
        this.sphere = document.querySelector('.glowing-sphere');
        this.mouseX = 0;
        this.mouseY = 0;
        this.sphereX = 0;
        this.sphereY = 0;
        this.isAnimating = false;
        
        this.init();
    }
    
    init() {
        if (!this.sphere) return;
        
        // Get sphere position
        const rect = this.sphere.getBoundingClientRect();
        this.sphereX = rect.left + rect.width / 2;
        this.sphereY = rect.top + rect.height / 2;
        
        // Add event listeners
        document.addEventListener('mousemove', throttle(this.handleMouseMove.bind(this), 16));
        this.animate();
    }
    
    handleMouseMove(e) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
    }
    
    animate() {
        if (!this.isAnimating) {
            this.isAnimating = true;
            this.updateSpherePosition();
        }
        
        requestAnimationFrame(() => {
            this.isAnimating = false;
            this.animate();
        });
    }
    
    updateSpherePosition() {
        if (!this.sphere) return;
        
        // Calculate distance from center
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        // Calculate movement (subtle effect)
        const moveX = (this.mouseX - centerX) * 0.02;
        const moveY = (this.mouseY - centerY) * 0.02;
        
        // Apply smooth interpolation
        const currentX = parseFloat(this.sphere.style.transform.replace(/[^\d.-]/g, '')) || 0;
        const currentY = parseFloat(this.sphere.style.transform.replace(/[^\d.-]/g, '')) || 0;
        
        const targetX = currentX + (moveX - currentX) * 0.1;
        const targetY = currentY + (moveY - currentY) * 0.1;
        
        this.sphere.style.transform = `translateX(calc(-50% + ${targetX}px)) translateY(${targetY}px)`;
    }
}

// Scroll-triggered animations
class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.init();
    }
    
    init() {
        // Initialize Intersection Observer
        this.observer = new IntersectionObserver(this.handleIntersection.bind(this), this.observerOptions);
        
        // Observe elements
        this.observeElements();
        
        // Fallback for browsers without Intersection Observer
        if (!window.IntersectionObserver) {
            this.fallbackAnimation();
        }
    }
    
    observeElements() {
        // Observe works container
        const worksContainer = document.querySelector('.works-container');
        if (worksContainer) {
            this.observer.observe(worksContainer);
        }
        
        // Observe project cards with staggered delay
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach((card, index) => {
            this.observer.observe(card);
            // Add data attribute for staggered animation
            card.setAttribute('data-delay', index * 150);
        });
    }
    
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                if (element.classList.contains('works-container')) {
                    element.classList.add('visible');
                } else if (element.classList.contains('project-card')) {
                    const delay = parseInt(element.getAttribute('data-delay')) || 0;
                    setTimeout(() => {
                        element.classList.add('visible');
                    }, delay);
                }
                
                // Unobserve after animation
                this.observer.unobserve(element);
            }
        });
    }
    
    fallbackAnimation() {
        // Simple fallback animation for older browsers
        setTimeout(() => {
            const worksContainer = document.querySelector('.works-container');
            if (worksContainer) {
                worksContainer.classList.add('visible');
            }
            
            const projectCards = document.querySelectorAll('.project-card');
            projectCards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('visible');
                }, index * 200);
            });
        }, 1000);
    }
}

// Enhanced hover effects for project cards
class EnhancedHoverEffects {
    constructor() {
        this.init();
    }
    
    init() {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            card.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
            card.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
        });
    }
    
    handleMouseEnter(e) {
        const card = e.currentTarget;
        
        // Enhanced glow effect
        card.style.boxShadow = `
            0 20px 40px rgba(255, 255, 255, 0.15),
            0 0 60px rgba(255, 255, 255, 0.1),
            0 0 100px rgba(255, 255, 255, 0.05)
        `;
        
        // Add subtle scale effect
        card.style.transform = 'translateY(-15px) scale(1.02)';
        
        // Enhanced border glow
        card.style.borderColor = 'rgba(255, 255, 255, 0.3)';
    }
    
    handleMouseLeave(e) {
        const card = e.currentTarget;
        
        // Reset effects
        card.style.boxShadow = '';
        card.style.transform = '';
        card.style.borderColor = '';
    }
}

// Performance monitoring
class PerformanceMonitor {
    constructor() {
        this.init();
    }
    
    init() {
        // Monitor frame rate
        this.lastTime = performance.now();
        this.frameCount = 0;
        
        this.monitorPerformance();
    }
    
    monitorPerformance() {
        const currentTime = performance.now();
        this.frameCount++;
        
        if (currentTime - this.lastTime >= 1000) {
            const fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
            
            // Log performance (can be removed in production)
            if (fps < 30) {
                console.warn(`Low FPS detected: ${fps}`);
            }
            
            this.frameCount = 0;
            this.lastTime = currentTime;
        }
        
        requestAnimationFrame(() => this.monitorPerformance());
    }
}

// Initialize all features when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all classes
    new SphereParallax();
    new ScrollAnimations();
    new EnhancedHoverEffects();
    new PerformanceMonitor();
    
    // Add loading animation completion
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 500);
});

// Smooth scroll for navigation (if added later)
function smoothScrollTo(element) {
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Handle window resize for responsive sphere positioning
window.addEventListener('resize', throttle(() => {
    // Recalculate sphere position on resize
    const sphere = document.querySelector('.glowing-sphere');
    if (sphere) {
        sphere.style.transform = 'translateX(-50%)';
    }
}, 250));

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
});

// Preload critical resources
function preloadResources() {
    // Preload Google Fonts
    const fontLink = document.createElement('link');
    fontLink.rel = 'preload';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap';
    fontLink.as = 'style';
    document.head.appendChild(fontLink);
}

// Initialize preloading
preloadResources();