/* ==========================================================================
   NEXUS TECH DIGITAL SOLUTIONS - Main JavaScript
   Navigation, Forms, Firebase Auth, Animations
   ========================================================================== */

// ==========================================================================
// Navigation
// ==========================================================================

document.addEventListener('DOMContentLoaded', function() {
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    // Scroll behavior for nav
    if (nav) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        });
    }

    // Mobile menu toggle
    if (navToggle && mobileMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking a link
        const mobileLinks = mobileMenu.querySelectorAll('.mobile-menu__link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
            });
        });
    }
});

// ==========================================================================
// FAQ Accordion
// ==========================================================================

document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-item__question');
        
        if (question) {
            question.addEventListener('click', function() {
                // Close other items
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
});

// ==========================================================================
// Scroll Animations
// ==========================================================================

document.addEventListener('DOMContentLoaded', function() {
    const animateElements = document.querySelectorAll('.animate-on-scroll');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in-up');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animateElements.forEach(el => observer.observe(el));
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        animateElements.forEach(el => el.classList.add('animate-fade-in-up'));
    }
});

// ==========================================================================
// Smooth Scroll for Anchor Links
// ==========================================================================

document.addEventListener('DOMContentLoaded', function() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#') {
                const target = document.querySelector(href);
                
                if (target) {
                    e.preventDefault();
                    const navHeight = document.getElementById('nav')?.offsetHeight || 80;
                    const targetPosition = target.offsetTop - navHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});

// ==========================================================================
// Form Validation (for Netlify Forms)
// ==========================================================================

document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('form[data-netlify="true"]');

    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;

            requiredFields.forEach(field => {
                // Remove previous error state
                field.classList.remove('error');
                
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                }

                // Email validation
                if (field.type === 'email' && field.value) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(field.value)) {
                        isValid = false;
                        field.classList.add('error');
                    }
                }
            });

            if (!isValid) {
                e.preventDefault();
                // Show first error
                const firstError = form.querySelector('.error');
                if (firstError) {
                    firstError.focus();
                }
            }
        });
    });
});

// ==========================================================================
// Firebase Authentication
// ==========================================================================

// Firebase configuration - Replace with your actual config
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase (only if Firebase SDK is loaded)
let auth = null;
let db = null;

function initializeFirebase() {
    if (typeof firebase !== 'undefined') {
        firebase.initializeApp(firebaseConfig);
        auth = firebase.auth();
        db = firebase.firestore();
        
        // Auth state observer
        auth.onAuthStateChanged(handleAuthStateChange);
    }
}

function handleAuthStateChange(user) {
    const loginPage = document.querySelector('.login');
    const dashboardPage = document.querySelector('.dashboard');
    
    if (user) {
        // User is signed in
        console.log('User signed in:', user.email);
        
        // If on login page, redirect to dashboard
        if (loginPage && window.location.pathname.includes('login')) {
            window.location.href = 'portal.html';
        }
        
        // Update dashboard with user info
        if (dashboardPage) {
            updateDashboardUser(user);
            loadUserProjects(user.uid);
        }
    } else {
        // User is signed out
        console.log('User signed out');
        
        // If on protected page, redirect to login
        if (dashboardPage) {
            window.location.href = 'login.html';
        }
    }
}

function updateDashboardUser(user) {
    const userNameEl = document.getElementById('userName');
    const userAvatarEl = document.getElementById('userAvatar');
    const welcomeNameEl = document.getElementById('welcomeName');
    
    if (userNameEl) {
        userNameEl.textContent = user.displayName || user.email;
    }
    
    if (userAvatarEl) {
        userAvatarEl.textContent = (user.displayName || user.email).charAt(0).toUpperCase();
    }
    
    if (welcomeNameEl) {
        welcomeNameEl.textContent = user.displayName ? user.displayName.split(' ')[0] : 'there';
    }
}

async function loadUserProjects(userId) {
    if (!db) return;
    
    const projectsList = document.getElementById('projectsList');
    const projectsCount = document.getElementById('projectsCount');
    
    try {
        const snapshot = await db.collection('projects')
            .where('userId', '==', userId)
            .orderBy('createdAt', 'desc')
            .get();
        
        const projects = [];
        snapshot.forEach(doc => {
            projects.push({ id: doc.id, ...doc.data() });
        });
        
        if (projectsCount) {
            projectsCount.textContent = projects.length;
        }
        
        if (projectsList) {
            if (projects.length === 0) {
                projectsList.innerHTML = `
                    <div class="dashboard__project">
                        <span class="dashboard__project-name">No projects yet</span>
                    </div>
                `;
            } else {
                projectsList.innerHTML = projects.map(project => `
                    <div class="dashboard__project">
                        <span class="dashboard__project-name">${project.name}</span>
                        <span class="dashboard__project-status dashboard__project-status--${project.status}">
                            ${project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                        </span>
                    </div>
                `).join('');
            }
        }
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

// ==========================================================================
// Login Form Handler
// ==========================================================================

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            
            // Clear previous errors
            if (loginError) loginError.classList.remove('active');
            
            // Disable button
            submitBtn.disabled = true;
            submitBtn.textContent = 'Signing in...';
            
            try {
                if (auth) {
                    await auth.signInWithEmailAndPassword(email, password);
                    // Redirect handled by auth state observer
                } else {
                    // Demo mode without Firebase
                    console.log('Demo login:', email);
                    window.location.href = 'portal.html';
                }
            } catch (error) {
                console.error('Login error:', error);
                
                if (loginError) {
                    loginError.textContent = getAuthErrorMessage(error.code);
                    loginError.classList.add('active');
                }
                
                submitBtn.disabled = false;
                submitBtn.textContent = 'Sign In';
            }
        });
    }
});

// ==========================================================================
// Signup Form Handler
// ==========================================================================

document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');
    const signupError = document.getElementById('signupError');
    
    if (signupForm) {
        signupForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const submitBtn = signupForm.querySelector('button[type="submit"]');
            
            // Clear previous errors
            if (signupError) signupError.classList.remove('active');
            
            // Validate passwords match
            if (password !== confirmPassword) {
                if (signupError) {
                    signupError.textContent = 'Passwords do not match.';
                    signupError.classList.add('active');
                }
                return;
            }
            
            // Validate password strength
            if (password.length < 8) {
                if (signupError) {
                    signupError.textContent = 'Password must be at least 8 characters.';
                    signupError.classList.add('active');
                }
                return;
            }
            
            // Disable button
            submitBtn.disabled = true;
            submitBtn.textContent = 'Creating account...';
            
            try {
                if (auth) {
                    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
                    
                    // Update profile with name
                    await userCredential.user.updateProfile({
                        displayName: name
                    });
                    
                    // Create user document in Firestore
                    if (db) {
                        await db.collection('users').doc(userCredential.user.uid).set({
                            name: name,
                            email: email,
                            createdAt: firebase.firestore.FieldValue.serverTimestamp()
                        });
                    }
                    
                    // Redirect handled by auth state observer
                } else {
                    // Demo mode without Firebase
                    console.log('Demo signup:', name, email);
                    window.location.href = 'portal.html';
                }
            } catch (error) {
                console.error('Signup error:', error);
                
                if (signupError) {
                    signupError.textContent = getAuthErrorMessage(error.code);
                    signupError.classList.add('active');
                }
                
                submitBtn.disabled = false;
                submitBtn.textContent = 'Create Account';
            }
        });
    }
});

// ==========================================================================
// Logout Handler
// ==========================================================================

document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            
            try {
                if (auth) {
                    await auth.signOut();
                }
                window.location.href = 'login.html';
            } catch (error) {
                console.error('Logout error:', error);
            }
        });
    }
});

// ==========================================================================
// Password Reset Handler
// ==========================================================================

document.addEventListener('DOMContentLoaded', function() {
    const resetForm = document.getElementById('resetForm');
    const resetError = document.getElementById('resetError');
    const resetSuccess = document.getElementById('resetSuccess');
    
    if (resetForm) {
        resetForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const submitBtn = resetForm.querySelector('button[type="submit"]');
            
            // Clear previous messages
            if (resetError) resetError.classList.remove('active');
            if (resetSuccess) resetSuccess.classList.remove('active');
            
            // Disable button
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            
            try {
                if (auth) {
                    await auth.sendPasswordResetEmail(email);
                }
                
                if (resetSuccess) {
                    resetSuccess.textContent = 'Password reset email sent. Check your inbox.';
                    resetSuccess.classList.add('active');
                }
                
                submitBtn.textContent = 'Email Sent';
            } catch (error) {
                console.error('Reset error:', error);
                
                if (resetError) {
                    resetError.textContent = getAuthErrorMessage(error.code);
                    resetError.classList.add('active');
                }
                
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Reset Link';
            }
        });
    }
});

// ==========================================================================
// Helper Functions
// ==========================================================================

function getAuthErrorMessage(code) {
    const errorMessages = {
        'auth/invalid-email': 'Invalid email address.',
        'auth/user-disabled': 'This account has been disabled.',
        'auth/user-not-found': 'No account found with this email.',
        'auth/wrong-password': 'Incorrect password.',
        'auth/email-already-in-use': 'An account with this email already exists.',
        'auth/weak-password': 'Password is too weak.',
        'auth/too-many-requests': 'Too many attempts. Please try again later.',
        'auth/network-request-failed': 'Network error. Check your connection.'
    };
    
    return errorMessages[code] || 'An error occurred. Please try again.';
}

// ==========================================================================
// Contact Form Success Handler (for Netlify)
// ==========================================================================

document.addEventListener('DOMContentLoaded', function() {
    // Check if redirected from successful form submission
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.get('success') === 'true') {
        const successMessage = document.getElementById('formSuccess');
        if (successMessage) {
            successMessage.style.display = 'block';
            successMessage.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

// ==========================================================================
// Initialize
// ==========================================================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Firebase if SDK is loaded
    if (typeof firebase !== 'undefined') {
        initializeFirebase();
    }
});
