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

[2. Assignment Specifics](#2-assignment-specifics)

- [JS2](#js2)
- [CSS Frameworks](#css-frameworks)
- [POR2](#por2)

[3. Setup & Installation](#3-setup--installation)

[4. User](#4-user)

- [LogIn User](#login-user)
- [Create User](#creating-your-own-user)

[5. Technologies Used](#5-technologies-used)

[6. Folder Structure](#6-folder-structure)

[7. Features](#7-features)

[8. Accessibility and SEO](#8-accessibility--seo)

[9. Known Issues & Limitations](#9-known-issues--limitations)

[10. Credits](#10-credits)

[11. Contact](#11-contact)

</details>

---

## 1. Project Overview

ᛗìmir is a modern, responsive social media platform built as part of the JavaScript 2 course assignment at NOROFF. Originally built with custom CSS, the platform has been fully migrated to **Tailwind CSS v4** as part of the CSS Frameworks course assignment.

The platform allows users to share posts with images, follow other users, interact through comments and reactions, and manage their profiles.

### Brand Story

**ᛗ mannaʀ - maðr - menneske / human**

Mannaz is the conventional name of the /m/ rune ᛗ of the Elder Futhark. It is derived from the Proto-Germanic word for 'man', and I thought that was a fitting name for a social media platform where humans interact, share stories, and connect with each other.

### Project Links:

- GitHub Repo: [https://github.com/larstp/Mimir](https://github.com/larstp/Mimir)
- Live Site (GitHub Pages): [https://larstp.github.io/Mimir/](https://larstp.github.io/Mimir/)

---

## 2. Assignment Specifics

### JS2

Mimir was originally created as the main project for the JavaScript 2 course assignment at NOROFF. The assignment focused on building a social media platform using JavaScript, HTML, CSS, DOM manipulation, asynchronous code, and the Noroff Social API.

The JS2 implementation includes:

- User registration, login, and logout
- A feed of posts loaded from the Noroff Social API
- Creating, editing, and deleting posts
- User profiles and profile editing
- Following and unfollowing users
- Searching posts
- Likes, comments, and individual post pages
- Responsive navigation and form validation

### CSS Frameworks

For the CSS Frameworks course assignment, we could either create a new page or enhance the page from the JS2 assignment by introducing a CSS framework. I chose to continue developing Mimir and migrated the project from custom CSS to **Tailwind CSS v4**.

The migration introduced Tailwind utility classes throughout the HTML and JavaScript-generated UI, while retaining shared CSS variables and the existing visual identity. The project uses npm-managed Tailwind packages rather than a CDN.

### POR2

The POR2 assignment focused on enhancing Mimir and making it properly presentable as part of my portfolio at [larstp.com](https://www.larstp.com/). This included addressing feedback from the previous assignments, improving the presentation, and fixing broken or incomplete functionality.

#### POR2 fixes & enhancements:

- Removed all `console.error` instances
- Fixed the comment pop-up background, which was undefined and caused see-through elements
- Added `imageFallback.js` for images that fail to load
- Defined `cardBackground`, which was missing and caused transparent card surfaces and images
- Removed Favorites because the API does not provide a Favorites/bookmarks feature
- Fixed `.post-card-like-count` so likes update correctly without displaying duplicate counts
- Added reusable show/hide password toggles to login and registration forms
- Matched register form field sizing to the login form
- Removed unused legacy CSS files and stale stylesheet references

---

## 3. Setup & Installation

### Prerequisites

- Node.js and npm installed

### Installation Steps

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run development mode (with file watching):
   ```bash
   npm run dev
   ```
4. Or build for production:
   ```bash
   npm run build
   ```
5. Open `index.html` in your browser using Live Server, or visit the deployed site: [larstp.github.io/Mimir](https://larstp.github.io/Mimir/)

---

## 4. User

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

## 5. Technologies Used

- **HTML5** - Semantic markup with comprehensive form validation
- **Tailwind CSS v4** - Utility-first CSS framework (migrated from custom CSS)
- **JavaScript ES6+** - Modules, async/await, DOM manipulation
- **Noroff Social API v2** - Backend for posts, users, authentication
- **GitHub Pages** - Hosting
- **Flowbite Icons** - SVG icon library
- **npm** - Package management and build scripts

---

## 6. Folder Structure

```
/
├── public/
│   ├── icons/          # SVG icons and favicon
│   ├── img/            # Static images
│   └── video/          # Video assets
├── src/
│   ├── css/
│   │   ├── global/     # Global styles (CSS variables, loader animation)
│   │   ├── input.css   # Tailwind source file
│   │   ├── tailwind.css # Generated Tailwind output
│   │   └── *.css       # Legacy page-specific styles (commented out)
│   ├── js/
│   │   ├── global/     # Global JS (main.js)
│   │   ├── modules/    # Reusable components (createPost, header, search, etc.)
│   │   └── *.js        # Page-specific scripts (all using Tailwind)
│   ├── data/
│   │   └── api.js      # API integration
│   └── pages/          # HTML pages
├── vercel.json         # Vercel static deployment configuration
├── docs/               # Documentation
├── index.html          # Home page (feed)
├── package.json        # npm scripts and dependencies
└── README.md
```

---

## 7. Features

### Core Functionality:

- **User Authentication** - Register, login, logout with validation
- **Home Feed** - Paginated posts sorted by newest first
- **Create Posts** - Upload images with title, body, and alt text
- **Edit/Delete Posts** - Owner-only controls with confirmation
- **User Profiles** - View own and others' profiles with avatar, banner, and bio
- **Edit Profile** - Update avatar, banner, and bio
- **Follow/Unfollow System** - Real-time follower/following counts
- **Search** - Search posts by title, body, or author name
- **Comments** - Read and add comments to posts
- **Reactions** - Like and unlike posts
- **Individual Post Pages** - Full post view with all comments
- **Clickable Navigation** - Usernames and avatars link to profiles
- **Dark Theme** - Modern dark UI with custom color scheme (wanted to try something new)

### UI/UX Features:

- **Fully Responsive Design** - Mobile-first approach with md/lg/xl breakpoints
- **Pure Tailwind Utilities** - All 8 pages converted to Tailwind CSS v4
- **Custom CSS Variables** - Using Tailwind's arbitrary values with CSS variables
- Search overlay with filter-in-place
- Image fallback for broken image URLs
- Loading indicators for async operations
- Error handling and user feedback
- Keyboard navigation support
- Mobile bottom navigation bar
- Desktop header with logo and icons
- Form validation on all input fields (required, minLength, maxLength, type validation)

---

## 8. Accessibility & SEO

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

## 9. Known Issues / Limitations

- **Image Uploads** - Requires external URLs (Unsplash, Imgur, etc.)
- **No Dark/Light Toggle** - Fixed dark theme only. Will try to add this as a self-project later

---

## 10. Credits

### Icons:

- [Flowbite Icons](https://flowbite.com/icons/) - SVG icon library (MIT License)
- Mannaz Rune - Custom design based on Elder Futhark

### Fonts:

- [Gotham](https://fonts.adobe.com/fonts/gotham) via Adobe Fonts

### Tools & Resources:

- [Tailwind CSS v4](https://tailwindcss.com/) - Utility-first CSS framework
- [GitHub Copilot](https://github.com/features/copilot) - AI coding assistant for code suggestions and explanations, and a lot of help with API CRUD
- [MDN Web Docs](https://developer.mozilla.org/) - JavaScript and Web API references

### Images:

All post images are sourced from [Unsplash](https://unsplash.com) - Free to use under the [Unsplash License](https://unsplash.com/license)

---

## 11. Contact

- **Author**: [larstp](https://github.com/larstp)
- **Course**: JavaScript 2 & CSS Frameworks - NOROFF School of Technology and Digital Media
- **Year**: 2025/2026 Year 2
