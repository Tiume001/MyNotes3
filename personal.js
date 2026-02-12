// Personal Section Functionality
// This file handles interactions for the personal portfolio page

document.addEventListener('DOMContentLoaded', () => {
    // CV Collapsible Toggle
    const cvCard = document.getElementById('cvCard');
    const cvToggle = document.getElementById('cvToggle');

    if (cvCard && cvToggle) {
        // Click on toggle button
        cvToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            cvCard.classList.toggle('collapsed');
        });

        // Also allow clicking the header area to toggle
        const cvHeader = cvCard.querySelector('.cv-header');
        if (cvHeader) {
            cvHeader.style.cursor = 'pointer';
            cvHeader.addEventListener('click', () => {
                cvCard.classList.toggle('collapsed');
            });
        }
    }
});
