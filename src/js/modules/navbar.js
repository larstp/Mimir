import { isLoggedIn } from "../../data/api.js";
import { openSearch } from "./search.js";

/**
 * Creates and renders the mobile navigation bar.
 * The navbar is inserted into the existing <nav> element in the DOM.
 *
 * @function createNavbar
 * @returns {void}
 *
 * @description
 * This function creates a floating mobile navigation bar with:
 * - Five navigation icons (Home, Search, New, Favorites, Profile)
 * - Active page indicator with smooth transitions
 * - Mobile-only (hidden on desktop)
 *
 * @example
 * // Call this function when the DOM is loaded
 * createNavbar();
 */
export function createNavbar() {
  try {
    const navbar = document.querySelector("nav.mobile-navbar");

    if (!navbar) {
      console.error("Mobile navbar element not found in the DOM");
      return;
    }

    if (!isLoggedIn()) {
      navbar.style.display = "none";
      return;
    }

    // Hopefully figure out if we're on a root page or nested page (for correct paths)
    // CoPilot suggested this was the easiest way, but I'm not totally sure how it works
    const isRootPage = !window.location.pathname.includes("/src/pages/");
    const prefix = isRootPage ? "." : "../..";

    const navItems = [
      {
        icon: `${prefix}/public/icons/flowbite_home-solid.svg`,
        href: `${prefix}/index.html`,
        ariaLabel: "Go to home page",
        page: "index.html",
      },
      {
        icon: `${prefix}/public/icons/flowbite_search-solid.svg`,
        href: "#",
        ariaLabel: "Search",
        page: "search",
      },
      {
        icon: `${prefix}/public/icons/flowbite_circle-plus-solid.svg`,
        href: `${prefix}/src/pages/newPost.html`,
        ariaLabel: "Create new post",
        page: "newPost.html",
        isCenter: true, // ------------------------------------------Make this one bigger (center icon)
      },
      {
        icon: `${prefix}/public/icons/flowbite_heart-solid.svg`,
        href: "#",
        ariaLabel: "View favorites",
        page: "favorites",
      },
      {
        icon: `${prefix}/public/icons/flowbite_user-circle-solid.svg`,
        href: `${prefix}/src/pages/user.html`,
        ariaLabel: "Go to profile",
        page: "user.html",
      },
    ];

    navItems.forEach((item) => {
      const navItem = document.createElement("div");
      navItem.classList.add("navbar-item");

      const isActive = window.location.pathname.includes(item.page);

      if (isActive) {
        navItem.classList.add("navbar-item-active");
      }

      if (item.isCenter) {
        navItem.classList.add("navbar-item-center");
      }

      const link = document.createElement("a");
      link.href = item.href;
      link.classList.add("navbar-link");
      link.setAttribute("aria-label", item.ariaLabel);

      if (item.ariaLabel === "Search") {
        link.addEventListener("click", (event) => {
          event.preventDefault();
          openSearch();
        });
      }

      if (isActive) {
        link.setAttribute("aria-current", "page");
      }

      const icon = document.createElement("img");
      icon.src = item.icon;
      icon.alt = "";
      icon.classList.add("navbar-icon");

      link.appendChild(icon);
      navItem.appendChild(link);
      navbar.appendChild(navItem);
    });
  } catch (error) {
    console.error("Error creating navbar:", error);
  }
}
