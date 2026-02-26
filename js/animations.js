/**
 * Scroll Animations using IntersectionObserver
 * Elements with the class .scroll-animate will fade in when scrolling into view
 */

document.addEventListener('DOMContentLoaded', () => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
        // If reduced motion is preferred, immediately show all elements
        document.querySelectorAll('.scroll-animate').forEach(el => {
            el.classList.add('is-visible');
        });
        return;
    }

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px', // Trigger slightly before the element enters the viewport
        threshold: 0.1 // Trigger when 10% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add the animation class
                entry.target.classList.add('is-visible');

                // Unobserve after animating once to keep it visible
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Find all elements to animate and observe them
    const animElements = document.querySelectorAll('.scroll-animate');
    animElements.forEach((el, index) => {
        // Optional: Add staggered delay if they are grouped
        // This is generic, we can add data-delay attributes directly to HTML if needed
        observer.observe(el);
    });
});
