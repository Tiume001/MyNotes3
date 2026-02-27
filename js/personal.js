// Personal Section Functionality
// This file handles interactions for the personal portfolio page

document.addEventListener('DOMContentLoaded', () => {
    // Overlay for Certifications Cards
    const certCards = document.querySelectorAll('.cert-card');

    certCards.forEach(card => {
        // Handle opening the overlay when clicking on the card
        card.addEventListener('click', (e) => {
            // Prevent opening/closing if clicking on a link inside the overlay or the close button
            if (e.target.closest('a') || e.target.closest('.cert-close-btn')) {
                return;
            }

            // Close other open cards
            document.querySelectorAll('.cert-card').forEach(otherCard => {
                if (otherCard !== card && otherCard.classList.contains('active')) {
                    otherCard.classList.remove('active');
                }
            });

            // Open current card
            card.classList.add('active');
        });

        const content = card.querySelector('.cert-group-content');
        if (content) {
            content.addEventListener('wheel', (e) => {
                if (!card.classList.contains('active')) return;

                const isScrollingDown = e.deltaY > 0;
                const isScrollingUp = e.deltaY < 0;

                const isAtBottom = content.scrollTop + content.clientHeight >= content.scrollHeight;
                const isAtTop = content.scrollTop === 0;

                // Preveniamo lo scroll della pagina se:
                // 1. L'overlay non è effettivamente scrollabile (contenuto piccolo), allora blocchiamo TUTTO lo scroll sopra l'overlay
                // 2. L'utente sta scrollando verso il basso ed è arrivato in fondo
                // 3. L'utente sta scrollando verso l'alto ed è arrivato in cima

                const isScrollable = content.scrollHeight > content.clientHeight;

                if (!isScrollable || (isScrollingDown && isAtBottom) || (isScrollingUp && isAtTop)) {
                    e.preventDefault();
                }
            });
        }

        // Handle closing the overlay explicitly via close button
        const closeBtn = card.querySelector('.cert-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Stop event bubbling up to card
                card.classList.remove('active');
            });
        }
    });
});
