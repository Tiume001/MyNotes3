// ============================================
// AUTH GUARD - PROTECT STATIC PAGES (GITHUB PAGES)
// ============================================

import { auth } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Check authentication state
onAuthStateChanged(auth, (user) => {
  if (!user) {
    // Not logged in → redirect to login page (replace to prevent BFCache)
    window.location.replace('auth.html');
  } else {
    // Logged in → Show the page content
    document.body.style.opacity = '1';
    document.body.style.visibility = 'visible';
  }
});
// ============================================
// BATCH SAFARI BFCACHE WORKAROUND
// ============================================
window.addEventListener('pageshow', (event) => {
  // If the page was loaded from the Back-Forward Cache (e.g. Safari back button)
  if (event.persisted) {
    // Force a reload so Firebase Auth state can be freshly evaluated
    window.location.reload();
  }
});
