// ============================================
// THEME SWITCHER - LIGHT/DARK TOGGLE
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const themeBtn = document.getElementById('themeToggleBtn');
    const themeIcon = document.getElementById('themeIcon');
    const drawerThemeBtn = document.getElementById('drawerThemeToggle');
    const drawerThemeIcon = document.getElementById('drawerThemeIcon');
    const root = document.documentElement;

    // Helper to update icons based on theme
    function updateIcons(isLight) {
        if (isLight) {
            if (themeIcon) {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            }
            if (drawerThemeIcon) {
                drawerThemeIcon.classList.remove('fa-moon');
                drawerThemeIcon.classList.add('fa-sun');
            }
        } else {
            if (themeIcon) {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            }
            if (drawerThemeIcon) {
                drawerThemeIcon.classList.remove('fa-sun');
                drawerThemeIcon.classList.add('fa-moon');
            }
        }
    }

    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem('app-theme');

    // If specifically set to light, apply it
    if (savedTheme === 'light') {
        root.classList.add('light-mode');
        updateIcons(true);
    }

    // Toggle logic
    function toggleTheme() {
        const isLight = root.classList.toggle('light-mode');
        localStorage.setItem('app-theme', isLight ? 'light' : 'dark');
        updateIcons(isLight);
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', toggleTheme);
    }

    if (drawerThemeBtn) {
        drawerThemeBtn.addEventListener('click', toggleTheme);
    }
});
