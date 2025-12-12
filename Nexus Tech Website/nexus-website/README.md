# Nexus Tech Digital Solutions Website

A professional, modern website for Nexus Tech Digital Solutions featuring web development, app development, branding, and IT support services.

## Features

- ✅ Clean, professional design matching provided mockup
- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ Firebase Authentication for client portal
- ✅ Netlify Forms integration for contact forms
- ✅ FAQ accordion functionality
- ✅ Smooth scroll animations
- ✅ SEO optimized

## File Structure

```
nexus-website/
├── index.html          # Homepage
├── about.html          # About page
├── services.html       # Services overview
├── portfolio.html      # Portfolio showcase
├── faq.html            # FAQ page
├── contact.html        # Contact form (Netlify Forms)
├── login.html          # Client portal login
├── portal.html         # Client dashboard
├── reset-password.html # Password reset
├── privacy.html        # Privacy policy
├── terms.html          # Terms of service
├── css/
│   └── styles.css      # All styles
├── js/
│   └── main.js         # All JavaScript
├── netlify.toml        # Netlify configuration
└── README.md           # This file
```

## Setup Instructions

### 1. Deploy to Netlify

1. Go to [netlify.com](https://netlify.com) and sign up/login
2. Click "Add new site" → "Deploy manually"
3. Drag and drop the entire `nexus-website` folder
4. Your site will be live at a random URL (you can customize this)

### 2. Configure Firebase (for Client Portal)

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable Authentication → Email/Password
4. Enable Firestore Database
5. Go to Project Settings → General → Your apps → Add web app
6. Copy the configuration and update `js/main.js`:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_ACTUAL_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

### 3. Enable Netlify Forms

Netlify automatically detects forms with `data-netlify="true"`. To view submissions:
1. Go to your Netlify dashboard
2. Select your site
3. Go to "Forms" in the sidebar
4. You'll see all form submissions there

### 4. Customize Content

1. **Images**: Replace placeholder images in the HTML files
   - Add a professional headshot in the About section
   - Add project screenshots in the Portfolio section
   - Add a hero image on the homepage

2. **Contact Info**: Update email addresses and social links
   - Search for `@nexustechsolutions.com` and update
   - Update social media links in the footer

3. **Pricing**: Update pricing ranges in `services.html` if needed

## Customization

### Colors
Edit CSS custom properties in `css/styles.css`:

```css
:root {
    --color-primary: #0F172A;      /* Navy blue */
    --color-accent: #2563EB;        /* Blue */
    --color-success: #059669;       /* Green */
}
```

### Fonts
Currently using:
- DM Serif Display (headings)
- DM Sans (body)

To change, update the Google Fonts link in all HTML files and the CSS variables.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

© 2024 Nexus Tech Digital Solutions. All rights reserved.
