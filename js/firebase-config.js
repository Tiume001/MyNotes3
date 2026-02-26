// ============================================
// CONFIGURAZIONE FIREBASE
// ============================================
// IMPORTANTE: Sostituisci i valori qui sotto con le tue credenziali Firebase
// Segui la guida in FIREBASE_SETUP.md per ottenere queste credenziali

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDzna-qBMLL0hfgD4Yx2jnENw2g6mV0Eag",
    authDomain: "webauth-38128.firebaseapp.com",
    projectId: "webauth-38128",
    storageBucket: "webauth-38128.firebasestorage.app",
    messagingSenderId: "1004406475053",
    appId: "1:1004406475053:web:8e2cf123cd6e7797282ba4",
    measurementId: "G-ZCHVRHTMYD"
};

// Importa le funzioni necessarie da Firebase SDK
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

// Inizializza Firebase
const app = initializeApp(firebaseConfig);

// Inizializza Firebase Authentication
export const auth = getAuth(app);
