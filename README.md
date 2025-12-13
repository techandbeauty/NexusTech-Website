# Nexus Tech Digital Solutions Website

Professional website for Nexus Tech Digital Solutions - a tech services company offering web development, app development, branding, and IT support.

## Features

- 📱 Fully responsive design
- 🔐 Firebase Authentication (Google, Apple, Email/Password, Email Link)
- 📝 Netlify Forms for contact submissions
- 🖼️ Cloudinary image management (using tags)
- 🎨 Modern design with DM Sans & DM Serif Display fonts
- ⚡ Fast loading with optimized assets

## Pages

- `index.html` - Homepage
- `about.html` - About page
- `services.html` - Services offered
- `portfolio.html` - Project portfolio (MARC, Tech Deck, Nexora, Codex Labs)
- `faq.html` - Frequently asked questions
- `contact.html` - Contact form (Netlify Forms)
- `login.html` - Client portal login (Firebase Auth)
- `portal.html` - Client dashboard
- `reset-password.html` - Password reset
- `thank-you.html` - Payment confirmation page
- `privacy.html` - Privacy policy
- `terms.html` - Terms of service

## Setup Instructions

### 1. Cloudinary Images
See `CLOUDINARY-SETUP.md` for detailed instructions on setting up images.

Quick steps:
1. Create Cloudinary account at https://cloudinary.com
2. Upload images with these tags: `nexus-hero`, `nexus-founder`, `nexus-marc`, `nexus-techdeck`, `nexus-nexora`, `nexus-codex`
3. Find & Replace `YOUR_CLOUD_NAME` with your Cloudinary cloud name in all HTML files

### 2. Firebase Configuration
Firebase is already configured in `js/main.js` with these credentials:
- Project: nexus-tech-ds-website
- Auth methods: Google, Apple, Email/Password, Email Link

### 3. Netlify Deployment
1. Push to GitHub
2. Connect repository to Netlify
3. Set publish directory to root (or subfolder name if in subfolder)
4. Enable form detection for contact form

### 4. Stripe Payments (Optional)
Update thank-you.html Google Form link if using different questionnaire.

## File Structure

```
nexus-website/
├── css/
│   └── styles.css
├── js/
│   └── main.js
├── images/
│   └── .gitkeep
├── index.html
├── about.html
├── services.html
├── portfolio.html
├── faq.html
├── contact.html
├── login.html
├── portal.html
├── reset-password.html
├── thank-you.html
├── privacy.html
├── terms.html
├── netlify.toml
├── CLOUDINARY-SETUP.md
└── README.md
```

## Contact

- Email: info@nexustechdigitalsolutions.net
- Phone: (202) 709-4556
- Location: Norfolk, Virginia

© 2024 Nexus Tech Digital Solutions
