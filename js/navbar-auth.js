// ============================================
// NAVBAR AUTH LISTENER - UPDATES PADLOCK ICON
// ============================================

import { auth } from './firebase-config.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

onAuthStateChanged(auth, (user) => {
    const padlock = document.getElementById('authPadlock');
    if (padlock) {
        if (user) {
            padlock.classList.remove('fa-lock');
            padlock.classList.add('fa-lock-open');
            padlock.style.color = '#22c55e'; // Green when logged in
            padlock.title = "Accesso Effettuato";
        } else {
            padlock.classList.remove('fa-lock-open');
            padlock.classList.add('fa-lock');
            padlock.style.color = ''; // Reset to default when logged out
            padlock.title = "Richiede Accesso";
        }
    }
});
