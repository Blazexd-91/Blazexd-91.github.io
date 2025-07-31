// Performance optimization: Throttle function
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
        
        // Mouse move event with throttling for performance
        document.addEventListener('mousemove', throttle((e) => {
            this.mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            this.mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        }, 16)); // ~60fps
        
        // Start animation loop
        this.animate();
    }
    
    animate() {
        if (!this.isAnimating) {
            this.isAnimating = true;
            this.animationLoop();
        }
    }
    
    animationLoop() {
        // Smooth interpolation for natural movement
        this.sphereX += (this.mouseX * 30 - this.sphereX) * 0.05;
        this.sphereY += (this.mouseY * 30 - this.sphereY) * 0.05;
        
        // Apply transform with hardware acceleration
        this.sphere.style.transform = `translateX(calc(-50% + ${this.sphereX}px)) translateY(${this.sphereY}px)`;
        
        requestAnimationFrame(() => this.animationLoop());
    }
}

// Intersection Observer for scroll-triggered animations
class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.init();
    }
    
    init() {
        // Observe works container
        const worksContainer = document.querySelector('.works-container');
        if (worksContainer) {
            this.observeElement(worksContainer, 'visible');
        }
        
        // Observe project cards with staggered delay
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach((card, index) => {
            this.observeElement(card, 'visible', index * 150);
        });
    }
    
    observeElement(element, className, delay = 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add(className);
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, this.observerOptions);
        
        observer.observe(element);
    }
}

// Enhanced hover effects for project cards
class CardInteractions {
    constructor() {
        this.cards = document.querySelectorAll('.project-card');
        this.init();
    }
    
    init() {
        this.cards.forEach(card => {
            card.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
            card.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
        });
    }
    
    handleMouseEnter(e) {
        const card = e.currentTarget;
        card.style.transform = 'translateY(-15px) scale(1.02)';
        card.style.boxShadow = '0 25px 50px rgba(255, 255, 255, 0.15)';
        card.style.borderColor = 'rgba(255, 255, 255, 0.3)';
    }
    
    handleMouseLeave(e) {
        const card = e.currentTarget;
        card.style.transform = 'translateY(0) scale(1)';
        card.style.boxShadow = '';
        card.style.borderColor = '';
    }
}

// Smooth scroll functionality
class SmoothScroll {
    constructor() {
        this.init();
    }
    
    init() {
        // Add smooth scroll behavior for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// Performance monitoring and optimization
class PerformanceOptimizer {
    constructor() {
        this.init();
    }
    
    init() {
        // Optimize scroll events
        let ticking = false;
        
        const updateScroll = () => {
            // Any scroll-based updates can go here
            ticking = false;
        };
        
        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateScroll);
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', requestTick, { passive: true });
        
        // Preload critical resources
        this.preloadResources();
    }
    
    preloadResources() {
        // Preload Google Fonts for better performance
        const fontLink = document.createElement('link');
        fontLink.rel = 'preload';
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap';
        fontLink.as = 'style';
        document.head.appendChild(fontLink);
    }
}

// Initialize all features when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all classes
    new SphereParallax();
    new ScrollAnimations();
    new CardInteractions();
    new SmoothScroll();
    new PerformanceOptimizer();
    
    // Handle loading screen
    const loadingScreen = document.querySelector('.loading-screen');
    
    // Simulate loading time and hide loading screen
    setTimeout(() => {
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
        document.body.classList.add('loaded');
    }, 1500);
    
    // Add particles effect
    createParticles();
});

// Create floating particles effect
function createParticles() {
    const particlesContainer = document.querySelector('.particles-container');
    if (!particlesContainer) return;
    
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${Math.random() * 10 + 10}s linear infinite;
            animation-delay: ${Math.random() * 5}s;
        `;
        particlesContainer.appendChild(particle);
    }
}

// Add CSS for particles animation
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Fallback for browsers without Intersection Observer
if (!('IntersectionObserver' in window)) {
    // Simple fallback: show all elements after a delay
    setTimeout(() => {
        document.querySelectorAll('.works-container, .project-card').forEach(el => {
            el.classList.add('visible');
        });
    }, 1000);
}

// Enhanced sphere glow effect on scroll
window.addEventListener('scroll', throttle(() => {
    const sphere = document.querySelector('.glowing-sphere');
    if (sphere) {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        sphere.style.transform = `translateX(-50%) translateY(${rate}px)`;
    }
}, 16));

// Navigation scroll effect
window.addEventListener('scroll', throttle(() => {
    const nav = document.querySelector('.navigation');
    if (nav) {
        if (window.scrollY > 100) {
            nav.style.background = 'rgba(0, 0, 0, 0.95)';
            nav.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
        } else {
            nav.style.background = 'rgba(0, 0, 0, 0.8)';
            nav.style.boxShadow = 'none';
        }
    }
}, 16));

// Add click effects to project cards
document.addEventListener('DOMContentLoaded', () => {
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            // Add ripple effect
            const ripple = document.createElement('div');
            ripple.className = 'ripple';
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transform: scale(0);
                animation: ripple-animation 0.6s linear;
                pointer-events: none;
            `;
            
            const rect = card.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = event.clientX - rect.left - size / 2;
            const y = event.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            card.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// Add ripple animation CSS
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Add subtle cursor trail effect
class CursorTrail {
    constructor() {
        this.trail = [];
        this.maxTrailLength = 5;
        this.init();
    }
    
    init() {
        document.addEventListener('mousemove', throttle((e) => {
            this.addPoint(e.clientX, e.clientY);
        }, 32));
    }
    
    addPoint(x, y) {
        this.trail.push({ x, y, timestamp: Date.now() });
        
        if (this.trail.length > this.maxTrailLength) {
            this.trail.shift();
        }
        
        this.updateTrail();
    }
    
    updateTrail() {
        // Remove old trail elements
        document.querySelectorAll('.cursor-trail').forEach(el => el.remove());
        
        // Create new trail elements
        this.trail.forEach((point, index) => {
            const trailElement = document.createElement('div');
            trailElement.className = 'cursor-trail';
            trailElement.style.cssText = `
                position: fixed;
                left: ${point.x}px;
                top: ${point.y}px;
                width: 4px;
                height: 4px;
                background: rgba(255, 255, 255, ${0.3 - index * 0.05});
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                transition: all 0.1s ease;
            `;
            document.body.appendChild(trailElement);
            
            // Remove after animation
            setTimeout(() => {
                if (trailElement.parentNode) {
                    trailElement.parentNode.removeChild(trailElement);
                }
            }, 100);
        });
    }
}

// Initialize cursor trail (optional effect)
// new CursorTrail();