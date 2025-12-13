# Nexus Tech Digital Solutions - Production Setup Guide

## Quick Start Checklist

- [ ] Deploy to Netlify
- [ ] Set up Netlify Forms email notifications
- [ ] Create Firebase project & add config
- [ ] Create Stripe account & add keys
- [ ] Test everything

---

## 1. NETLIFY HOSTING & FORMS

### Deploy Your Site

1. Go to [netlify.com](https://netlify.com) and sign up/login
2. Click **"Add new site"** → **"Deploy manually"**
3. Drag and drop your `nexus-website` folder
4. Your site will be live instantly!

### Set Up Form Notifications (Get Emails!)

1. In Netlify dashboard, click your site
2. Go to **"Forms"** in the sidebar
3. You'll see your forms listed after the first submission
4. Click **"Settings and usage"** → **"Form notifications"**
5. Click **"Add notification"** → **"Email notification"**
6. Enter your email address
7. Now you'll get an email every time someone submits a form!

### Custom Domain (Optional)

1. Go to **"Domain settings"**
2. Click **"Add custom domain"**
3. Follow the DNS instructions for your domain registrar

---

## 2. FIREBASE AUTHENTICATION

### Create Firebase Project

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Click **"Create a project"**
3. Name it "nexus-tech-portal" (or similar)
4. Disable Google Analytics (not needed) → **"Create project"**

### Enable Authentication

1. In your Firebase project, click **"Authentication"** in sidebar
2. Click **"Get started"**
3. Click **"Email/Password"** → Enable it → **"Save"**

### Enable Firestore Database

1. Click **"Firestore Database"** in sidebar
2. Click **"Create database"**
3. Select **"Start in production mode"**
4. Choose a location closest to you → **"Enable"**

### Set Firestore Rules

1. Go to **"Firestore Database"** → **"Rules"** tab
2. Replace with these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Projects - users can read their own projects
    match /projects/{projectId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow write: if false; // Only admin can write (you'll do this manually)
    }
  }
}
```

3. Click **"Publish"**

### Get Your Firebase Config

1. Click the gear icon → **"Project settings"**
2. Scroll down to **"Your apps"** → Click the web icon **"</>"**
3. Register app name: "nexus-website"
4. Copy the config object (you'll need this!)

### Add Config to Your Site

Open `js/main.js` and replace the placeholder config (around line 174):

```javascript
const firebaseConfig = {
    apiKey: "AIzaSyB.....................",
    authDomain: "nexus-tech-portal.firebaseapp.com",
    projectId: "nexus-tech-portal",
    storageBucket: "nexus-tech-portal.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123def456"
};
```

### Create Your First Client Account

1. In Firebase Console → **"Authentication"** → **"Users"**
2. Click **"Add user"**
3. Enter client's email and a temporary password
4. Tell client to use "Forgot Password" to set their own

---

## 3. STRIPE PAYMENTS

### Create Stripe Account

1. Go to [stripe.com](https://stripe.com) and sign up
2. Complete your business profile
3. Add your bank account for payouts

### Get Your API Keys

1. In Stripe Dashboard, click **"Developers"** → **"API keys"**
2. Copy your **Publishable key** (starts with `pk_`)
3. Copy your **Secret key** (starts with `sk_`) - keep this private!

### Add Keys to Your Site

Open `js/main.js` and find the Stripe section, add your publishable key:

```javascript
const stripe = Stripe('pk_live_your_actual_key_here');
```

### Create Payment Links (Easiest Method)

1. In Stripe Dashboard → **"Payment Links"**
2. Click **"Create payment link"**
3. Add your service as a product:
   - Name: "Website Development - Deposit"
   - Price: $750 (or your deposit amount)
4. Copy the payment link
5. Use this link on your pricing page!

### For Deposits/Invoices

I recommend using **Stripe Invoicing** for client projects:
1. Go to **"Invoicing"** in Stripe
2. Create an invoice for the client
3. Send it directly - they pay online
4. You get notified when paid

---

## 4. ENVIRONMENT VARIABLES (Security)

For production, store sensitive keys in Netlify:

1. Netlify Dashboard → **"Site settings"** → **"Environment variables"**
2. Add these:
   - `FIREBASE_API_KEY` = your Firebase API key
   - `STRIPE_PUBLISHABLE_KEY` = your Stripe publishable key

---

## 5. TESTING CHECKLIST

### Test Forms
- [ ] Submit contact form
- [ ] Check you received email notification
- [ ] Check Netlify Forms dashboard shows submission

### Test Authentication
- [ ] Create a test account
- [ ] Login works
- [ ] Logout works
- [ ] Password reset sends email

### Test Payments
- [ ] Payment link opens correctly
- [ ] Use Stripe test card: 4242 4242 4242 4242
- [ ] Check Stripe dashboard shows test payment

---

## 6. CLIENT ONBOARDING WORKFLOW

### When You Get a New Client:

1. **Initial Contact** → They fill out your contact form
2. **Discovery Call** → Discuss their project
3. **Send Proposal** → Email with scope & pricing
4. **Collect Deposit** → Send Stripe invoice or payment link
5. **Create Portal Account** → Add them to Firebase Auth
6. **Add Project to Firestore** → Track their project status
7. **Begin Work** → Keep them updated via portal

---

## Quick Reference

| Service | Dashboard URL |
|---------|--------------|
| Netlify | app.netlify.com |
| Firebase | console.firebase.google.com |
| Stripe | dashboard.stripe.com |

---

## Need Help?

- Netlify Docs: docs.netlify.com
- Firebase Docs: firebase.google.com/docs
- Stripe Docs: stripe.com/docs
