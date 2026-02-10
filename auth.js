// ============================
// AUTHENTICATION LOGIC
// ============================

import { auth } from './firebase-config.js';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    onAuthStateChanged,
    updateProfile,
    sendEmailVerification,
    RecaptchaVerifier,
    signInWithPhoneNumber
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

// ============================
// DOM ELEMENTS
// ============================

const loginToggle = document.getElementById('loginToggle');
const signupToggle = document.getElementById('signupToggle');
const formsWrapper = document.getElementById('formsWrapper');
const formsSlider = document.getElementById('formsSlider');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const errorMessage = document.getElementById('errorMessage');

// Login Form Elements
const loginEmailInput = document.getElementById('loginEmail');
const loginPasswordInput = document.getElementById('loginPassword');
const loginBtn = document.getElementById('loginBtn');
const googleLoginBtn = document.getElementById('googleLoginBtn');

// Signup Form Elements
const signupNameInput = document.getElementById('signupName');
const signupEmailInput = document.getElementById('signupEmail');
const signupPasswordInput = document.getElementById('signupPassword');
const signupBtn = document.getElementById('signupBtn');
const googleSignupBtn = document.getElementById('googleSignupBtn');

// Phone Auth Elements
const phoneLoginBtn = document.getElementById('phoneLoginBtn');
const phoneSignupBtn = document.getElementById('phoneSignupBtn');
const phoneAuthForm = document.getElementById('phoneAuthForm');
const phoneNumberInput = document.getElementById('phoneNumber');
const verificationCodeInput = document.getElementById('verificationCode');
const sendCodeBtn = document.getElementById('sendCodeBtn');
const verifyCodeBtn = document.getElementById('verifyCodeBtn');
const backToLoginBtn = document.getElementById('backToLoginBtn');
const phoneInputGroup = document.getElementById('phoneInputGroup');
const otpInputGroup = document.getElementById('otpInputGroup');

// ============================
// CHECK AUTHENTICATION STATE
// ============================

// Note: We don't auto-redirect on auth state change in auth.html
// Users should only be redirected after explicitly logging in/signing up

// ============================
// SLIDER & HEIGHT LOGIC
// ============================

function updateFormsHeight(activeForm) {
    if (!formsWrapper) return;

    // Slight delay to ensure DOM update or just set immediate
    requestAnimationFrame(() => {
        const height = activeForm.scrollHeight;
        formsWrapper.style.height = height + 'px';
    });
}

function switchToLogin() {
    loginToggle.classList.add('active');
    signupToggle.classList.remove('active');

    // Slide to Login (0%)
    formsSlider.style.transform = 'translateX(0)';

    updateFormsHeight(loginForm);
    hideError();
}

function switchToSignup() {
    signupToggle.classList.add('active');
    loginToggle.classList.remove('active');

    // Slide to Signup (-50%)
    formsSlider.style.transform = 'translateX(-50%)';

    updateFormsHeight(signupForm);
    hideError();
}

// Initial Height Set on Load
window.addEventListener('load', () => {
    updateFormsHeight(loginForm);
});

// Also update on resize to prevent cutting off
window.addEventListener('resize', () => {
    const activeDetails = loginToggle.classList.contains('active');
    updateFormsHeight(activeDetails ? loginForm : signupForm);
});

loginToggle.addEventListener('click', switchToLogin);
signupToggle.addEventListener('click', switchToSignup);

// Set Language to Italian
auth.languageCode = 'it';

// ============================================
// PHONE AUTHENTICATION STATE MANAGEMENT
// ============================================

function showPhoneAuth() {
    // Hide the slider wrapper entirely
    formsWrapper.style.display = 'none';
    phoneAuthForm.classList.add('active'); // This usually just sets display:block if hidden class used, or we ensure it's visible
    phoneAuthForm.style.display = 'block';

    loginToggle.parentElement.style.display = 'none'; // Hide toggles
    hideError();
    setupRecaptcha();
}

function hidePhoneAuth() {
    phoneAuthForm.style.display = 'none';
    phoneAuthForm.classList.remove('active');

    // Show slider wrapper again
    formsWrapper.style.display = 'block';

    // Reset to login view
    switchToLogin();

    loginToggle.parentElement.style.display = 'flex'; // Show toggles

    // Reset phone form state
    phoneInputGroup.classList.remove('hidden');
    otpInputGroup.classList.add('hidden');
    sendCodeBtn.classList.remove('hidden');
    verifyCodeBtn.classList.add('hidden');
    phoneNumberInput.value = '';
    verificationCodeInput.value = '';
    hideError();
}

backToLoginBtn.addEventListener('click', hidePhoneAuth);
phoneLoginBtn.addEventListener('click', showPhoneAuth);
phoneSignupBtn.addEventListener('click', showPhoneAuth);

// ============================================
// PHONE AUTHENTICATION LOGIC (RECAPTCHA & SMS)
// ============================================

// Initialize Recaptcha
function setupRecaptcha() {
    if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            'size': 'normal',
            'callback': (response) => {
                // reCAPTCHA solved, allow signInWithPhoneNumber.
                console.log('Recaptcha solved');
            },
            'expired-callback': () => {
                // Response expired. Ask user to solve reCAPTCHA again.
                console.log('Recaptcha expired');
                showError('Recaptcha scaduto. Riprova.');
            }
        });
        window.recaptchaVerifier.render();
    }
}

// Send Verification Code
sendCodeBtn.addEventListener('click', async () => {
    hideError();
    const phoneNumber = phoneNumberInput.value.trim();

    if (!phoneNumber) {
        showError('Inserisci un numero di telefono valido.');
        return;
    }

    setButtonLoading(sendCodeBtn, true);

    try {
        const appVerifier = window.recaptchaVerifier;
        const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);

        // SMS sent. Prompt user to type the code.
        window.confirmationResult = confirmationResult;

        console.log('SMS sent to:', phoneNumber);

        // Switch UI to OTP mode
        phoneInputGroup.classList.add('hidden');
        otpInputGroup.classList.remove('hidden');
        sendCodeBtn.classList.add('hidden');
        verifyCodeBtn.classList.remove('hidden');

        // Hide Recaptcha after success (optional visual cleanup)
        document.getElementById('recaptcha-container').style.display = 'none';

        showError('✅ Codice inviato! Controlla i tuoi SMS.');
        errorMessage.style.color = '#22c55e';
        errorMessage.style.borderColor = 'rgba(34, 197, 94, 0.5)';
        errorMessage.style.background = 'rgba(34, 197, 94, 0.1)';

    } catch (error) {
        console.error('SMS Error:', error);
        setButtonLoading(sendCodeBtn, false);

        // Reset Recaptcha on error
        if (window.recaptchaVerifier) {
            window.recaptchaVerifier.clear();
            window.recaptchaVerifier = null;
            document.getElementById('recaptcha-container').innerHTML = ''; // Clear DOM
            setupRecaptcha(); // Re-init
        }

        if (error.code === 'auth/invalid-phone-number') {
            showError('Numero di telefono non valido. Assicurati di includere il prefisso (es. +39).');
        } else if (error.code === 'auth/too-many-requests') {
            showError('Troppi tentativi. Riprova più tardi.');
        } else if (error.code === 'auth/billing-not-enabled') {
            showError('Errore: Abilita il piano "Blaze" (a consumo) su Firebase per inviare SMS a numeri reali.');
        } else if (error.code === 'auth/quota-exceeded') {
            showError('Quota SMS superata.');
        } else {
            showError(`Errore (${error.code}): ${error.message}`);
        }
    }
});

// Verify Code
verifyCodeBtn.addEventListener('click', async () => {
    hideError();
    const code = verificationCodeInput.value.trim();

    if (!code || code.length < 6) {
        showError('Inserisci il codice di verifica a 6 cifre.');
        return;
    }

    setButtonLoading(verifyCodeBtn, true);

    try {
        const result = await window.confirmationResult.confirm(code);
        const user = result.user;
        console.log('Phone sign-in successful:', user.phoneNumber);

        // Redirect
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Verify Error:', error);
        setButtonLoading(verifyCodeBtn, false);

        if (error.code === 'auth/invalid-verification-code') {
            showError('Codice non valido. Controlla e riprova.');
        } else {
            showError('Errore di verifica. Riprova.');
        }
    }
});

// ============================
// UTILITY FUNCTIONS
// ============================

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
}

function hideError() {
    errorMessage.classList.remove('show');
    errorMessage.textContent = '';
    // Reset styling to default error colors
    errorMessage.style.background = '';
    errorMessage.style.borderColor = '';
    errorMessage.style.color = '';
}

function setButtonLoading(button, isLoading) {
    if (isLoading) {
        button.disabled = true;
        button.classList.add('loading');
        button.dataset.originalText = button.textContent;
        button.textContent = '';
    } else {
        button.disabled = false;
        button.classList.remove('loading');
        button.textContent = button.dataset.originalText || button.textContent;
    }
}


function getFirebaseErrorMessage(errorCode) {
    const errorMessages = {
        'auth/email-already-in-use': 'Questa email è già registrata. Prova ad accedere.',
        'auth/invalid-email': 'Email non valida.',
        'auth/operation-not-allowed': 'Operazione non permessa.',
        'auth/weak-password': 'La password deve essere di almeno 6 caratteri.',
        'auth/user-disabled': 'Questo account è stato disabilitato.',
        'auth/user-not-found': 'Nessun account trovato con questa email.',
        'auth/wrong-password': 'Password errata.',
        'auth/invalid-credential': 'Credenziali non valide. Verifica email e password.',
        'auth/too-many-requests': 'Troppi tentativi falliti. Riprova più tardi.',
        'auth/network-request-failed': 'Errore di connessione. Verifica la tua rete.',
        'auth/popup-closed-by-user': 'Login annullato.',
        'auth/cancelled-popup-request': 'Login annullato.',
        'auth/invalid-api-key': 'Configurazione Firebase non valida. Controlla firebase-config.js',
        'auth/app-deleted': 'Configurazione Firebase non valida.',
        'auth/unauthorized-domain': 'Dominio non autorizzato. Aggiungi questo dominio nella Firebase Console.'
    };

    return errorMessages[errorCode] || 'Si è verificato un errore. Riprova.';
}

// ============================================
// EMAIL/PASSWORD LOGIN
// ============================================

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError();

    const email = loginEmailInput.value.trim();
    const password = loginPasswordInput.value;

    if (!email || !password) {
        showError('Inserisci email e password.');
        return;
    }

    setButtonLoading(loginBtn, true);

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Check if email is verified (skip check for Google sign-in users)
        if (!user.emailVerified && user.providerData[0]?.providerId === 'password') {
            console.log('Email not verified for:', user.email);

            // Log out the user
            await auth.signOut();

            // Show error with option to resend verification
            setButtonLoading(loginBtn, false);
            showError('⚠️ Email non verificata. Controlla la tua casella di posta e clicca sul link di verifica. Non hai ricevuto l\'email?');
            errorMessage.style.background = 'rgba(251, 146, 60, 0.1)';
            errorMessage.style.borderColor = 'rgba(251, 146, 60, 0.5)';
            errorMessage.style.color = '#fb923c';

            // Add resend button
            const resendBtn = document.createElement('button');
            resendBtn.textContent = 'Reinvia email di verifica';
            resendBtn.className = 'resend-verification-btn';
            resendBtn.style.cssText = 'margin-top: 0.5rem; padding: 0.5rem 1rem; background: rgba(251, 146, 60, 0.2); border: 1px solid rgba(251, 146, 60, 0.5); color: #fb923c; border-radius: 8px; cursor: pointer; font-size: 0.9rem;';
            resendBtn.onclick = async () => {
                try {
                    // Re-authenticate to get user object
                    const tempUser = await signInWithEmailAndPassword(auth, email, password);
                    await sendEmailVerification(tempUser.user);
                    await auth.signOut();
                    showError('✅ Email di verifica inviata! Controlla la tua casella di posta.');
                    errorMessage.style.background = 'rgba(34, 197, 94, 0.1)';
                    errorMessage.style.borderColor = 'rgba(34, 197, 94, 0.5)';
                    errorMessage.style.color = '#22c55e';
                } catch (err) {
                    console.error('Error resending verification:', err);
                    showError('Errore durante l\'invio dell\'email. Riprova più tardi.');
                }
            };
            errorMessage.appendChild(resendBtn);
            return;
        }

        console.log('Login successful:', user.email);
        // Redirect to main site
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Login error:', error.code, error.message);
        showError(getFirebaseErrorMessage(error.code));
        setButtonLoading(loginBtn, false);
    }
});

// ============================================
// EMAIL/PASSWORD SIGNUP
// ============================================

signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError();

    const name = signupNameInput.value.trim();
    const email = signupEmailInput.value.trim();
    const password = signupPasswordInput.value;

    if (!name || !email || !password) {
        showError('Compila tutti i campi.');
        return;
    }

    if (password.length < 6) {
        showError('La password deve essere di almeno 6 caratteri.');
        return;
    }

    setButtonLoading(signupBtn, true);

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Update user profile with name
        await updateProfile(userCredential.user, {
            displayName: name
        });

        console.log('Signup successful:', userCredential.user.email);

        // Send email verification
        await sendEmailVerification(userCredential.user);
        console.log('Verification email sent to:', userCredential.user.email);

        // Log out the user immediately after signup
        await auth.signOut();

        // Clear signup form
        signupNameInput.value = '';
        signupEmailInput.value = '';
        signupPasswordInput.value = '';

        // Switch to login form
        loginToggle.click();

        // Show success message with verification instructions
        setButtonLoading(signupBtn, false);
        showError('✅ Registrazione completata! Ti abbiamo inviato un\'email di verifica. Controlla la tua casella di posta e clicca sul link di conferma prima di effettuare il login.');
        errorMessage.style.background = 'rgba(34, 197, 94, 0.1)';
        errorMessage.style.borderColor = 'rgba(34, 197, 94, 0.5)';
        errorMessage.style.color = '#22c55e';

    } catch (error) {
        console.error('Signup error:', error.code, error.message);
        showError(getFirebaseErrorMessage(error.code));
        setButtonLoading(signupBtn, false);
    }
});

// ============================================
// GOOGLE SIGN-IN
// ============================================

async function handleGoogleSignIn(button) {
    hideError();
    setButtonLoading(button, true);

    const provider = new GoogleAuthProvider();

    try {
        const result = await signInWithPopup(auth, provider);
        console.log('Google sign-in successful:', result.user.email);
        // Redirect to main site
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Google sign-in error:', error.code, error.message);

        // Don't show error if user simply closed the popup
        if (error.code !== 'auth/popup-closed-by-user' &&
            error.code !== 'auth/cancelled-popup-request') {
            showError(getFirebaseErrorMessage(error.code));
        }

        setButtonLoading(button, false);
    }
}

googleLoginBtn.addEventListener('click', () => handleGoogleSignIn(googleLoginBtn));
googleSignupBtn.addEventListener('click', () => handleGoogleSignIn(googleSignupBtn));



// ============================================
// CLEAR INPUTS ON FORM SWITCH
// ============================================

function clearFormInputs() {
    loginEmailInput.value = '';
    loginPasswordInput.value = '';
    signupNameInput.value = '';
    signupEmailInput.value = '';
    signupPasswordInput.value = '';
}

loginToggle.addEventListener('click', clearFormInputs);
signupToggle.addEventListener('click', clearFormInputs);

// ============================================
// 3D TILT EFFECT
// ============================================

const card = document.getElementById('authCard');
const container = document.querySelector('.auth-container');

container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate rotation (reduced to max 4 degrees for subtlety)
    const xRotation = -1 * ((y - rect.height / 2) / rect.height * 4);
    const yRotation = (x - rect.width / 2) / rect.width * 4;

    card.style.transform = `perspective(1000px) rotateX(${xRotation}deg) rotateY(${yRotation}deg)`;
});

container.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
});

// ============================================
// CURSOR SPOTLIGHT
// ============================================

const cursorGlow = document.getElementById('cursor-glow');
let mouseX = 0;
let mouseY = 0;
let currentX = 0;
let currentY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Smooth follow loop for performance
function animateSpotlight() {
    // Linear interpolation for smooth lag
    const distX = mouseX - currentX;
    const distY = mouseY - currentY;

    currentX += distX * 0.15;
    currentY += distY * 0.15;

    if (cursorGlow) {
        cursorGlow.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`;
    }

    requestAnimationFrame(animateSpotlight);
}

animateSpotlight();
