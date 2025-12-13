/**
 * Nexus Tech Digital Solutions
 * Main JavaScript File
 * 
 * Includes:
 * - Navigation functionality
 * - Firebase Authentication (Google, Apple, Email/Password, Email Link)
 * - Form handling
 * - FAQ accordion
 */

// ============================================
// NAVIGATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const nav = document.getElementById('nav');
    
    if (navToggle && mobileMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
        
        // Close menu when clicking a link
        const mobileLinks = mobileMenu.querySelectorAll('.mobile-menu__link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
    }
    
    // Sticky navigation
    if (nav) {
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                nav.classList.add('nav--scrolled');
            } else {
                nav.classList.remove('nav--scrolled');
            }
            
            lastScroll = currentScroll;
        });
    }
    
    // Initialize FAQ accordion
    initFAQ();
    
    // Initialize Firebase if SDK is loaded
    if (typeof firebase !== 'undefined') {
        initFirebase();
    }
});

// ============================================
// FAQ ACCORDION
// ============================================

function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-item__question');
        const answer = item.querySelector('.faq-item__answer');
        
        if (question && answer) {
            question.addEventListener('click', () => {
                const isOpen = item.classList.contains('active');
                
                // Close all other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current item
                item.classList.toggle('active');
            });
        }
    });
}

// ============================================
// FIREBASE CONFIGURATION
// ============================================

function initFirebase() {
    // Firebase configuration
    // =============================================
    // UPDATE THESE VALUES WITH YOUR FIREBASE CONFIG
    // =============================================
    const firebaseConfig = {
        apiKey: "AIzaSyBt0RLkHSe0R5164VsaT93Hb-T_nTUw1AY",
        authDomain: "nexus-tech-ds-website.firebaseapp.com",
        projectId: "nexus-tech-ds-website",
        storageBucket: "nexus-tech-ds-website.firebasestorage.app",
        messagingSenderId: "363249530024",
        appId: "1:363249530024:web:1a42c36a10f71ebf4fbe9d",
        measurementId: "G-Q96W038P4G"
    };
    
    // Initialize Firebase
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    
    const auth = firebase.auth();
    const db = firebase.firestore();
    
    // ============================================
    // AUTH STATE OBSERVER
    // ============================================
    
    auth.onAuthStateChanged((user) => {
        if (user) {
            // User is signed in
            console.log('User signed in:', user.email);
            
            // If on login page, redirect to portal
            if (window.location.pathname.includes('login.html')) {
                window.location.href = 'portal.html';
            }
            
            // Update portal UI if on portal page
            if (window.location.pathname.includes('portal.html')) {
                updatePortalUI(user);
            }
        } else {
            // User is signed out
            console.log('User signed out');
            
            // If on portal page, redirect to login
            if (window.location.pathname.includes('portal.html')) {
                window.location.href = 'login.html';
            }
        }
    });
    
    // Check for email link sign-in on page load
    checkEmailLinkSignIn();
    
    // ============================================
    // LOGIN PAGE EVENT LISTENERS
    // ============================================
    
    // Google Sign-In
    const googleBtn = document.getElementById('googleSignIn');
    if (googleBtn) {
        googleBtn.addEventListener('click', signInWithGoogle);
    }
    
    // Apple Sign-In
    const appleBtn = document.getElementById('appleSignIn');
    if (appleBtn) {
        appleBtn.addEventListener('click', signInWithApple);
    }
    
    // Email/Password Sign-In
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            signInWithEmail(email, password);
        });
    }
    
    // Email Link Sign-In
    const emailLinkBtn = document.getElementById('emailLinkSignIn');
    if (emailLinkBtn) {
        emailLinkBtn.addEventListener('click', () => {
            const email = document.getElementById('email').value;
            if (email) {
                sendSignInLink(email);
            } else {
                showError('loginError', 'Please enter your email address first.');
            }
        });
    }
    
    // Password Reset
    const resetForm = document.getElementById('resetForm');
    if (resetForm) {
        resetForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            sendPasswordReset(email);
        });
    }
    
    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', signOut);
    }
    
    // ============================================
    // AUTHENTICATION FUNCTIONS
    // ============================================
    
    // Google Sign-In
    window.signInWithGoogle = async function() {
        try {
            const provider = new firebase.auth.GoogleAuthProvider();
            provider.addScope('email');
            provider.addScope('profile');
            
            const result = await auth.signInWithPopup(provider);
            await createUserProfile(result.user, 'google');
            
        } catch (error) {
            console.error('Google sign-in error:', error);
            showError('loginError', getErrorMessage(error.code));
        }
    };
    
    // Apple Sign-In
    window.signInWithApple = async function() {
        try {
            const provider = new firebase.auth.OAuthProvider('apple.com');
            provider.addScope('email');
            provider.addScope('name');
            
            const result = await auth.signInWithPopup(provider);
            await createUserProfile(result.user, 'apple');
            
        } catch (error) {
            console.error('Apple sign-in error:', error);
            showError('loginError', getErrorMessage(error.code));
        }
    };
    
    // Email/Password Sign-In
    window.signInWithEmail = async function(email, password) {
        try {
            const result = await auth.signInWithEmailAndPassword(email, password);
            console.log('Email sign-in successful');
            
        } catch (error) {
            console.error('Email sign-in error:', error);
            showError('loginError', getErrorMessage(error.code));
        }
    };
    
    // Create Account with Email
    window.createAccountWithEmail = async function(email, password, name) {
        try {
            const result = await auth.createUserWithEmailAndPassword(email, password);
            
            // Update display name
            await result.user.updateProfile({ displayName: name });
            
            await createUserProfile(result.user, 'email');
            
        } catch (error) {
            console.error('Account creation error:', error);
            showError('loginError', getErrorMessage(error.code));
        }
    };
    
    // Email Link (Passwordless) Sign-In
    window.sendSignInLink = async function(email) {
        const actionCodeSettings = {
            url: window.location.origin + '/portal.html',
            handleCodeInApp: true
        };
        
        try {
            await auth.sendSignInLinkToEmail(email, actionCodeSettings);
            
            // Save email for later verification
            window.localStorage.setItem('emailForSignIn', email);
            
            showSuccess('loginError', 'Check your email! We sent you a sign-in link.');
            
        } catch (error) {
            console.error('Email link error:', error);
            showError('loginError', getErrorMessage(error.code));
        }
    };
    
    // Check for Email Link Sign-In
    window.checkEmailLinkSignIn = async function() {
        if (auth.isSignInWithEmailLink(window.location.href)) {
            let email = window.localStorage.getItem('emailForSignIn');
            
            if (!email) {
                email = window.prompt('Please enter your email for confirmation:');
            }
            
            try {
                const result = await auth.signInWithEmailLink(email, window.location.href);
                
                // Clear saved email
                window.localStorage.removeItem('emailForSignIn');
                
                await createUserProfile(result.user, 'emailLink');
                
            } catch (error) {
                console.error('Email link sign-in error:', error);
                showError('loginError', getErrorMessage(error.code));
            }
        }
    };
    
    // Password Reset
    window.sendPasswordReset = async function(email) {
        try {
            await auth.sendPasswordResetEmail(email);
            showSuccess('resetSuccess', 'Password reset email sent! Check your inbox.');
            
        } catch (error) {
            console.error('Password reset error:', error);
            showError('resetError', getErrorMessage(error.code));
        }
    };
    
    // Sign Out
    window.signOut = async function() {
        try {
            await auth.signOut();
            window.location.href = 'login.html';
        } catch (error) {
            console.error('Sign out error:', error);
        }
    };
    
    // ============================================
    // HELPER FUNCTIONS
    // ============================================
    
    // Create/Update User Profile in Firestore
    async function createUserProfile(user, provider) {
        const userRef = db.collection('users').doc(user.uid);
        
        try {
            const doc = await userRef.get();
            
            if (!doc.exists) {
                // Create new user profile
                await userRef.set({
                    email: user.email,
                    displayName: user.displayName || '',
                    photoURL: user.photoURL || '',
                    provider: provider,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    lastLogin: firebase.firestore.FieldValue.serverTimestamp()
                });
            } else {
                // Update last login
                await userRef.update({
                    lastLogin: firebase.firestore.FieldValue.serverTimestamp()
                });
            }
        } catch (error) {
            console.error('Error creating user profile:', error);
        }
    }
    
    // Update Portal UI with user info
    function updatePortalUI(user) {
        const userName = document.getElementById('userName');
        const welcomeName = document.getElementById('welcomeName');
        const userAvatar = document.getElementById('userAvatar');
        
        const displayName = user.displayName || user.email.split('@')[0];
        const initials = displayName.charAt(0).toUpperCase();
        
        if (userName) userName.textContent = displayName;
        if (welcomeName) welcomeName.textContent = displayName.split(' ')[0];
        if (userAvatar) userAvatar.textContent = initials;
        
        // Update demo stats
        const activeCount = document.getElementById('activeCount');
        const pendingCount = document.getElementById('pendingCount');
        const completedCount = document.getElementById('completedCount');
        
        if (activeCount) activeCount.textContent = '1';
        if (pendingCount) pendingCount.textContent = '1';
        if (completedCount) completedCount.textContent = '1';
    }
    
    // Show error message
    function showError(elementId, message) {
        const errorEl = document.getElementById(elementId);
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.style.display = 'block';
            errorEl.style.background = '#FEF2F2';
            errorEl.style.borderColor = '#FECACA';
            errorEl.style.color = '#DC2626';
        }
    }
    
    // Show success message
    function showSuccess(elementId, message) {
        const el = document.getElementById(elementId);
        if (el) {
            el.textContent = message;
            el.style.display = 'block';
            el.style.background = '#DCFCE7';
            el.style.borderColor = '#86EFAC';
            el.style.color = '#166534';
        }
    }
    
    // Get user-friendly error message
    function getErrorMessage(errorCode) {
        const errorMessages = {
            'auth/invalid-email': 'Please enter a valid email address.',
            'auth/user-disabled': 'This account has been disabled. Please contact support.',
            'auth/user-not-found': 'No account found with this email. Please check your email or contact us to get started.',
            'auth/wrong-password': 'Incorrect password. Please try again or reset your password.',
            'auth/email-already-in-use': 'An account with this email already exists.',
            'auth/weak-password': 'Password should be at least 6 characters.',
            'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
            'auth/popup-closed-by-user': 'Sign-in was cancelled. Please try again.',
            'auth/popup-blocked': 'Sign-in popup was blocked. Please allow popups for this site.',
            'auth/account-exists-with-different-credential': 'An account already exists with this email using a different sign-in method.',
            'auth/operation-not-allowed': 'This sign-in method is not enabled. Please contact support.',
            'auth/invalid-action-code': 'The sign-in link has expired or already been used. Please request a new one.',
            'auth/expired-action-code': 'The sign-in link has expired. Please request a new one.'
        };
        
        return errorMessages[errorCode] || 'An error occurred. Please try again.';
    }
}

// ============================================
// FORM VALIDATION (for contact form)
// ============================================

function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.classList.add('error');
        } else {
            field.classList.remove('error');
        }
    });
    
    return isValid;
}

// ============================================
// SMOOTH SCROLL
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        if (href !== '#') {
            e.preventDefault();
            
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});
