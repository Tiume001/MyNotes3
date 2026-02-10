// ============================================
// AUTH GUARD - PROTECT STATIC PAGES (GITHUB PAGES)
// ============================================

import { auth } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Check authentication state
onAuthStateChanged(auth, (user) => {
  if (!user) {
    // Not logged in → redirect to login page
    window.location.href = "auth.html";
  }
});