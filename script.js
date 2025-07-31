// Performance optimized JavaScript for Blaze's Portfolio

class PortfolioController {
    constructor() {
        this.sphere = document.getElementById('sphere');
        this.projectCards = document.querySelectorAll('[data-reveal]');
        this.mousePosition = { x: 0, y: 0 };
        this.spherePosition = { x: 0, y: 0 };
        this.rafId = null;
        this.isAnimating = false;
        
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupMouseParallax();
        this.setupPerformanceOptimizations();
    }

    // Intersection Observer for scroll-triggered animations
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Staggered animation with 150ms delay between cards
                    setTimeout(() => {
                        entry.target.classList.add('reveal');
                    }, index * 150);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe all project cards
        this.projectCards.forEach(card => {
            observer.observe(card);
        });
    }

    // Mouse parallax effect for the sphere
    setupMouseParallax() {
        let mouseMoveTimeout;

        const handleMouseMove = (e) => {
            // Throttle mouse move events for performance
            clearTimeout(mouseMoveTimeout);
            mouseMoveTimeout = setTimeout(() => {
                this.updateMousePosition(e);
            }, 16); // ~60fps
        };

        document.addEventListener('mousemove', handleMouseMove, { passive: true });
        
        // Start the animation loop
        this.startSphereAnimation();
    }

    updateMousePosition(e) {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        // Calculate mouse position relative to center (-1 to 1)
        this.mousePosition.x = (e.clientX - centerX) / centerX;
        this.mousePosition.y = (e.clientY - centerY) / centerY;
    }

    startSphereAnimation() {
        const animate = () => {
            if (!this.sphere) return;

            // Smooth interpolation for parallax effect
            const lerpFactor = 0.05;
            const maxMovement = 20; // Maximum movement in pixels

            // Calculate target position
            const targetX = this.mousePosition.x * maxMovement;
            const targetY = this.mousePosition.y * maxMovement;

            // Smooth interpolation
            this.spherePosition.x += (targetX - this.spherePosition.x) * lerpFactor;
            this.spherePosition.y += (targetY - this.spherePosition.y) * lerpFactor;

            // Apply transform with hardware acceleration
            this.sphere.style.transform = `translate3d(${this.spherePosition.x}px, ${this.spherePosition.y}px, 0)`;

            this.rafId = requestAnimationFrame(animate);
        };

        animate();
    }

    // Performance optimizations
    setupPerformanceOptimizations() {
        // Preload critical resources
        this.preloadCriticalResources();
        
        // Handle visibility changes for battery optimization
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAnimations();
            } else {
                this.resumeAnimations();
            }
        });

        // Reduce animations on low-end devices
        if (this.isLowEndDevice()) {
            this.reducedMotionFallback();
        }
    }

    preloadCriticalResources() {
        // Preload Google Fonts if not already loaded
        const fontLink = document.createElement('link');
        fontLink.rel = 'preload';
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap';
        fontLink.as = 'style';
        fontLink.onload = function() {
            this.rel = 'stylesheet';
        };
        document.head.appendChild(fontLink);
    }

    pauseAnimations() {
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
        this.isAnimating = false;
    }

    resumeAnimations() {
        if (!this.isAnimating) {
            this.startSphereAnimation();
            this.isAnimating = true;
        }
    }

    isLowEndDevice() {
        // Simple heuristic for low-end device detection
        return navigator.hardwareConcurrency <= 2 || 
               navigator.deviceMemory <= 4 ||
               /Android\s[1-6]\./.test(navigator.userAgent);
    }

    reducedMotionFallback() {
        // Apply reduced motion styles
        document.body.classList.add('reduced-motion');
        
        // Add CSS for reduced motion
        const style = document.createElement('style');
        style.textContent = `
            .reduced-motion .sphere {
                animation: none !important;
                transition: none !important;
            }
            .reduced-motion .project-card {
                transition: opacity 0.3s ease !important;
            }
        `;
        document.head.appendChild(style);
    }
}

// Fallback for browsers without Intersection Observer
if (!('IntersectionObserver' in window)) {
    const fallbackReveal = () => {
        const cards = document.querySelectorAll('[data-reveal]');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('reveal');
            }, index * 150);
        });
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fallbackReveal);
    } else {
        fallbackReveal();
    }
} else {
    // Initialize the portfolio controller when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new PortfolioController();
        });
    } else {
        new PortfolioController();
    }
}

// Error handling for critical functionality
window.addEventListener('error', (e) => {
    console.warn('Portfolio animation error:', e.error);
    // Graceful degradation - ensure content is still visible
    document.querySelectorAll('[data-reveal]').forEach(card => {
        card.classList.add('reveal');
    });
});

// Smooth scroll behavior for better UX
document.documentElement.style.scrollBehavior = 'smooth';