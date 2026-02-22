// ============================================
// INDEX PAGE - AUTHENTICATION CHECK & LOGOUT
// ============================================

import { auth } from './firebase-config.js';
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

// ============================================
// CHECK IF USER IS AUTHENTICATED
// ============================================

onAuthStateChanged(auth, (user) => {
    if (!user) {
        // User is not signed in, redirect to auth page
        console.log('User not authenticated, redirecting to auth.html');
        window.location.href = 'auth.html';
    } else {
        console.log('User authenticated:', user.email);
        // Update user info in the UI if needed
        updateUserProfile(user);
    }
});

// ============================================
// UPDATE USER PROFILE IN UI
// ============================================

function updateUserProfile(user) {
    const userNameElement = document.querySelector('.user-profile span');
    const userAvatarElement = document.querySelector('.user-profile .avatar');

    if (user.displayName) {
        if (userNameElement) {
            userNameElement.textContent = user.displayName;
        }
        if (userAvatarElement) {
            // Create initials from display name
            const initials = user.displayName
                .split(' ')
                .map(word => word[0])
                .join('')
                .toUpperCase()
                .slice(0, 2);
            userAvatarElement.textContent = initials;
        }
    } else if (user.email) {
        if (userNameElement) {
            userNameElement.textContent = user.email;
        }
        if (userAvatarElement) {
            // Create initials from email
            const initials = user.email.slice(0, 2).toUpperCase();
            userAvatarElement.textContent = initials;
        }
    }
}

// ============================================
// LOGOUT FUNCTIONALITY
// ============================================

function setupLogoutButton() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                await signOut(auth);
                console.log('User signed out successfully');
                // Redirect will happen automatically via onAuthStateChanged
            } catch (error) {
                console.error('Error signing out:', error);
                alert('Errore durante il logout. Riprova.');
            }
        });
    }
}

// Initialize logout button when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupLogoutButton);
} else {
    setupLogoutButton();
}

// ============================================
// ENTRANCE ANIMATIONS - INTERSECTION OBSERVER
// ============================================

function setupEntranceAnimations() {
    // Intersection Observer options
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    // Callback function for when elements enter viewport
    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Trigger animation by setting animation-play-state to running
                entry.target.style.animationPlayState = 'running';
                // Optionally unobserve after animation triggers (one-time animation)
                // observer.unobserve(entry.target);
            }
        });
    };

    // Create the observer
    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all elements with data-animate attribute
    const animatedElements = document.querySelectorAll('[data-animate]');
    animatedElements.forEach(element => {
        // Start with animation paused
        element.style.animationPlayState = 'paused';
        observer.observe(element);
    });
}

// Initialize entrance animations when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupEntranceAnimations);
} else {
    setupEntranceAnimations();
}

// ============================================
// PARALLAX SCROLLING EFFECT
// ============================================

function setupParallaxEffect() {
    const heroVisual = document.querySelector('.hero-visual');
    
    if (!heroVisual) {
        console.warn('Hero visual element not found for parallax effect');
        return;
    }

    // Throttle function to limit scroll event frequency
    function throttle(func, delay) {
        let lastCall = 0;
        return function(...args) {
            const now = Date.now();
            if (now - lastCall >= delay) {
                lastCall = now;
                func.apply(this, args);
            }
        };
    }

    // Parallax scroll handler
    function handleParallaxScroll() {
        const scrolled = window.pageYOffset;
        // Apply parallax transform with 0.3 multiplier for subtle effect
        heroVisual.style.transform = `translateY(${scrolled * 0.3}px)`;
    }

    // Throttle scroll events to run at most every 16ms (~60fps)
    const throttledParallaxScroll = throttle(handleParallaxScroll, 16);

    // Add scroll event listener
    window.addEventListener('scroll', throttledParallaxScroll, { passive: true });

    // Initial call to set correct position on page load
    handleParallaxScroll();
}

// Initialize parallax effect when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupParallaxEffect);
} else {
    setupParallaxEffect();
}
