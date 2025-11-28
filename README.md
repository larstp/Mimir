# ᛗìmir

<p align="center">
  <img src="public/icons/mannaz-sign-round-black-outline-icon-WHITE.svg" alt="Mannaz Rune" width="150" />
</p>

## Project Documentation: ᛗìmir Social Media Platform

### Contents:

<details>
  <summary>Table of Contents</summary>
  
  [1. Project Overview](#1-project-overview)

- [Project Links](#project-links)
- [Brand Story](#brand-story)

[2. Setup & Installation](#2-setup--installation)

[3. User](#3-user)

- [LogIn User](#login-user)
- [Create User](#creating-your-own-user)

[4. Technologies Used](#4-technologies-used)

[5. Folder Structure](#5-folder-structure)

[6. Features](#6-features)

[7. Accessibility and SEO](#7-accessibility--seo)

[8. Known Issues & Limitations](#8-known-issues--limitations)

[9. Credits](#9-credits)

[10. Contact](#10-contact)

</details>

---

## 1. Project Overview

ᛗìmir is a modern, responsive social media platform built as part of the JavaScript 2 course assignment at NOROFF. The platform allows users to share posts with images, follow other users, interact through comments and reactions, and manage their profiles—all while maintaining a clean, accessible user experience.

### Brand Story

**ᛗ mannaʀ - maðr - menneske / human**

Mannaz is the conventional name of the /m/ rune ᛗ of the Elder Futhark. It is derived from the Proto-Germanic word for 'man', and I thought that was a fitting name for a social media platform where humans interact, share stories, and connect with each other.

### Project Links:

- GitHub Repo: [https://github.com/larstp/Mimir](https://github.com/larstp/Mimir)
- Live Site (GitHub Pages): [https://larstp.github.io/Mimir/](https://larstp.github.io/Mimir/)

---

## 2. Setup & Installation

- Clone repo and open `index.html` in your browser using Live Server, or visit the deployed site: [larstp.github.io/Mimir](https://larstp.github.io/Mimir/)
- No build steps required; all code is static and client-side using ES6 modules.

---

## 3. User

### LogIn User:

I have created a 'test' user that you can use for testing the functionality:

<table>
  <tr>
    <th>E-Mail</th>
    <th>Username</th>
    <th>Password</th>
  </tr>
  <tr>
    <td>mimir-test@stud.noroff.no</td>
    <td>mimir_test</td>
    <td>Password123</td>
  </tr>
</table>

Or you can create your own.

### Creating your user:

<table>
  <tr>
    <th>E-Mail</th>
    <th>Username</th>
    <th>Password</th>
  </tr>
  <tr>
    <td>Must be a valid email ending in @stud.noroff.no</td>
    <td>Letters, numbers, and underscores only</td>
    <td>Minimum 8 characters</td>
  </tr>
</table>

---

## 4. Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Custom properties, Flexbox, Grid (no frameworks)
- **JavaScript ES6+** - Modules, async/await, DOM manipulation
- **Noroff Social API v2** - Backend for posts, users, authentication
- **GitHub Pages** - Hosting
- **Flowbite Icons** - SVG icon library

---

## 5. Folder Structure

```
/
├── public/
│   ├── icons/          # SVG icons and favicon
│   ├── img/            # Static images
│   └── video/          # Video assets
├── src/
│   ├── css/
│   │   ├── global/     # Global styles (header, footer, navbar, etc.)
│   │   └── *.css       # Page-specific styles
│   ├── js/
│   │   ├── global/     # Global JS (main.js)
│   │   ├── modules/    # Reusable components (createPost, header, search, etc.)
│   │   └── *.js        # Page-specific scripts
│   ├── data/
│   │   └── api.js      # API integration
│   └── pages/          # HTML pages
├── docs/               # Documentation
├── index.html          # Home page (feed)
└── README.md
```

---

## 6. Features

### Core Functionality:

- ✅ **User Authentication** - Register, login, logout with validation
- ✅ **Home Feed** - Paginated posts sorted by newest first
- ✅ **Create Posts** - Upload images with title, body, and alt text
- ✅ **Edit/Delete Posts** - Owner-only controls with confirmation
- ✅ **User Profiles** - View own and others' profiles with avatar, banner, bio (will be updated)
- ✅ **Edit Profile** - Update avatar, banner, and bio (will be added later)
- ✅ **Follow/Unfollow System** - Real-time follower/following counts
- ✅ **Search** - Search posts by title, body, or author name
- ✅ **Individual Post Pages** - Full post view with all comments
- ✅ **Clickable Navigation** - Usernames and avatars link to profiles
- ✅ **Dark Theme** - Modern dark UI with custom color scheme (wanted to try something new)

### UI/UX Features:

- Search overlay with filter-in-place
- Loading indicators for async operations
- Error handling and user feedback
- Keyboard navigation support
- Mobile bottom navigation bar
- Desktop header with logo and icons

---

## 7. Accessibility & SEO

### Accessibility:

- Semantic HTML structure (`header`, `nav`, `main`, `section`, `footer`)
- ARIA labels and roles on interactive elements
- Alt text on all images
- Keyboard navigation support
- Color contrast meets WCAG standards
- Focus states on all interactive elements
- Screen reader friendly form labels

### SEO:

- Comprehensive meta tags on all pages
- Open Graph tags for social sharing
- Theme color for browser UI
- Semantic heading hierarchy
- Descriptive page titles

---

## 8. Known Issues / Limitations

- **Comments** - Read-only display, comment creation not part of current assignment (will be added later)
- **Image Uploads** - Requires external URLs (Unsplash, Imgur, etc.)
- **No Dark/Light Toggle** - Fixed dark theme only. Ill try to add this as a self-project later

---

## 9. Credits

### Icons:

- [Flowbite Icons](https://flowbite.com/icons/) - SVG icon library (MIT License)
- Mannaz Rune - Custom design based on Elder Futhark

### Fonts:

- [Gotham](https://fonts.adobe.com/fonts/gotham) via Adobe Fonts

### Tools & Resources:

- [GitHub Copilot](https://github.com/features/copilot) - AI coding assistant for code suggestions and explanations, and a lot of help with API CRUD.
- [Noroff API Documentation](https://docs.noroff.dev/) - API reference
- [MDN Web Docs](https://developer.mozilla.org/) - JavaScript and Web API references

### Images:

All post images are sourced from [Unsplash](https://unsplash.com) - Free to use under the [Unsplash License](https://unsplash.com/license)

---

## 10. Contact

- **Author**: [larstp](https://github.com/larstp)
- **Course**: JavaScript 2 - NOROFF School of Technology and Digital Media
- **Year**: 2025/2026 Year 2
