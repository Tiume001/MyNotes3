// ============================================
// THEME SWITCHER - LIGHT/DARK TOGGLE
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const themeBtn = document.getElementById('themeToggleBtn');
    const themeIcon = document.getElementById('themeIcon');
    const root = document.documentElement;

    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem('app-theme');

    // If specifically set to light, apply it
    if (savedTheme === 'light') {
        root.classList.add('light-mode');
        if (themeIcon) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    }

    // Toggle logic
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const isLight = root.classList.toggle('light-mode');

            if (isLight) {
                localStorage.setItem('app-theme', 'light');
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            } else {
                localStorage.setItem('app-theme', 'dark');
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            }
        });
    }
});
