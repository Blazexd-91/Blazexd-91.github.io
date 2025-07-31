/* Blaze's Portfolio – Interactive Script
   Technology: Vanilla JS
   Features:
   1. Mouse-parallax glowing sphere with smooth interpolation (requestAnimationFrame).
   2. Scroll-triggered reveal of works section & staggered project cards (IntersectionObserver).
   3. Graceful fallback for browsers without IntersectionObserver (throttled scroll listener).
*/

// UTILITIES -------------------------------------------------------------
// Linear interpolation helper
const lerp = (a, b, n) => a + (b - a) * n;

// Throttle helper to limit execution rate of handlers
function throttle(fn, limit = 100) {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      fn.apply(this, args);
    }
  };
}

// DOM READY -------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  /* -------------------------------------------------------------------
   * 1. Parallax Glowing Sphere
   * ------------------------------------------------------------------*/
  const sphere = document.querySelector('.glowing-sphere');
  if (sphere) {
    let targetX = 0,
      targetY = 0,
      currentX = 0,
      currentY = 0;

    // Capture mouse position relative to viewport centre
    window.addEventListener(
      'mousemove',
      throttle((e) => {
        const { innerWidth: w, innerHeight: h } = window;
        targetX = (e.clientX - w / 2) / w; // -0.5 → 0.5
        targetY = (e.clientY - h / 2) / h; // -0.5 → 0.5
      }, 16) // ~60fps
    );

    function animateSphere() {
      currentX = lerp(currentX, targetX, 0.1);
      currentY = lerp(currentY, targetY, 0.1);

      const maxTranslate = 40; // px – intensity of parallax
      const translateX = currentX * maxTranslate;
      const translateY = currentY * maxTranslate;

      // Preserve original centre-shift of -50% on X axis
      sphere.style.transform = `translateX(calc(-50% + ${translateX}px)) translateY(${translateY}px)`;

      requestAnimationFrame(animateSphere);
    }
    requestAnimationFrame(animateSphere);
  }

  /* -------------------------------------------------------------------
   * 2. Scroll-Triggered Animations (Works section & cards)
   * ------------------------------------------------------------------*/
  const worksContainer = document.querySelector('.works-container');
  const projectCards = document.querySelectorAll('.project-card');

  if (!worksContainer || projectCards.length === 0) return; // Nothing to do

  const revealCards = () => {
    projectCards.forEach((card, idx) => {
      setTimeout(() => card.classList.add('visible'), idx * 150);
    });
  };

  // IntersectionObserver preferred path
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            worksContainer.classList.add('visible');
            revealCards();
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(worksContainer);
  } else {
    // Fallback – throttle scroll listener
    const onScroll = throttle(() => {
      const rect = worksContainer.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.8) {
        worksContainer.classList.add('visible');
        revealCards();
        window.removeEventListener('scroll', onScroll);
      }
    }, 100);

    window.addEventListener('scroll', onScroll);
    // Trigger check in case section is already in view on load
    onScroll();
  }
});