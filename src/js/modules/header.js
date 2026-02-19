import { openSearch } from "./search.js";

/**
 * Creates and renders the header element with a logo that links to the home page.
 * The header is inserted into the existing <header> element in the DOM.
 *
 * @function createHeader
 * @returns {void}
 *
 * @description
 * This function creates a simple header with:
 * - A left-aligned logo (desktop) or centered logo (mobile) linking to index.html
 * - Relative path support for both root and nested pages
 * - Desktop-only navigation icons with hover labels (Search, Favorites, Profile, New)
 * - Mobile-first responsive design (navigation hidden on mobile)
 * - No innerHTML usage - all elements created via DOM methods
 *
 * @example
 * // Call this function when the DOM is loaded
 * createHeader();
 */
export function createHeader() {
  try {
    const header = document.querySelector("header");

    if (!header) {
      console.error("Cannot find <header> element");
      return;
    }

    const isRootPage = !window.location.pathname.includes("/src/pages/");
    const prefix = isRootPage ? "." : "../..";

    const logoLink = document.createElement("a");
    logoLink.href = `${prefix}/index.html`;
    logoLink.className = "flex items-center no-underline";
    logoLink.setAttribute("aria-label", "Go to home page");

    const logoImg = document.createElement("img");
    logoImg.src = `${prefix}/public/icons/mannaz-sign-round-black-outline-icon-WHITE.svg`;
    logoImg.alt = "Mimir Logo";
    logoImg.className = "h-12 w-auto";

    logoLink.appendChild(logoImg);
    header.appendChild(logoLink);

    const navItems = [
      {
        icon: `${prefix}/public/icons/flowbite_search-solid.svg`,
        label: "Search",
        href: "#",
        ariaLabel: "Search",
      },
      {
        icon: `${prefix}/public/icons/flowbite_heart-solid.svg`,
        label: "Favorites",
        href: "#",
        ariaLabel: "View favorites",
      },
      {
        icon: `${prefix}/public/icons/flowbite_user-circle-solid.svg`,
        label: "Profile",
        href: `${prefix}/src/pages/user.html`,
        ariaLabel: "Go to profile",
      },
      {
        icon: `${prefix}/public/icons/flowbite_circle-plus-solid.svg`,
        label: "New",
        href: `${prefix}/src/pages/newPost.html`,
        ariaLabel: "Create new post",
      },
    ];

    const nav = document.createElement("nav");
    nav.className = "flex gap-6 items-center";
    nav.setAttribute("aria-label", "Main navigation");

    navItems.forEach((item) => {
      const navItem = document.createElement("div");
      navItem.className = "flex";

      const link = document.createElement("a");
      link.href = item.href;
      link.className =
        "flex flex-col items-center gap-1 no-underline text-[var(--text)] hover:text-[var(--primary)] transition-colors duration-300";
      link.setAttribute("aria-label", item.ariaLabel);

      if (item.ariaLabel === "Search") {
        link.addEventListener("click", (event) => {
          event.preventDefault();
          openSearch();
        }); // This is copy/paste from navbar.js
      }

      const icon = document.createElement("img");
      icon.src = item.icon;
      icon.alt = "";
      icon.className = "w-6 h-6";

      const label = document.createElement("span");
      label.className = "text-xs";
      label.textContent = item.label;

      link.appendChild(icon);
      link.appendChild(label);
      navItem.appendChild(link);
      nav.appendChild(navItem);
    });

    header.appendChild(nav);
  } catch (error) {
    console.error("Error creating header:", error);
  }
}
