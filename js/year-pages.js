/**
 * Year Pages Shared Functionality
 * Implements staggered fade-in animations and 3D tilt effects for subject cards
 * Requirements: 2.1, 2.2
 */

/**
 * Initialize staggered fade-in animations for subject cards
 * Each card gets an incrementing animation delay for a cascading effect
 */
function initStaggeredAnimations() {
  const subjectCards = document.querySelectorAll('.subject-card');
  
  // Apply staggered animation delays
  subjectCards.forEach((card, index) => {
    // Each card gets a 0.1s delay increment (100ms)
    const delay = (index + 1) * 0.1;
    card.style.animationDelay = `${delay}s`;
  });
}

/**
 * Initialize 3D tilt effect based on mouse position
 * Creates a dynamic perspective transform that follows the cursor
 */
function init3DTiltEffect() {
  const subjectCards = document.querySelectorAll('.subject-card');
  
  subjectCards.forEach(card => {
    // Mouse move handler for 3D tilt
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Calculate rotation based on distance from center
      // Divide by 10 to make the effect subtle
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      
      // Apply 3D transform with perspective
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });
    
    // Reset transform when mouse leaves
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/**
 * Initialize all year page functionality
 * Call this when the DOM is ready
 */
function initYearPages() {
  initStaggeredAnimations();
  init3DTiltEffect();
}

// Initialize when DOM is fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initYearPages);
} else {
  // DOM is already loaded
  initYearPages();
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initStaggeredAnimations,
    init3DTiltEffect,
    initYearPages
  };
}

// Make functions available globally for browser and testing
if (typeof window !== 'undefined') {
  window.initStaggeredAnimations = initStaggeredAnimations;
  window.init3DTiltEffect = init3DTiltEffect;
  window.initYearPages = initYearPages;
}
