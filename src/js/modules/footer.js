/**
 * Creates and renders the footer element.
 * The footer is inserted into the existing <footer> element in the DOM.
 *
 * @function createFooter
 * @returns {void}
 *
 * @description
 * This function creates a simple footer with:
 * - A centered Vegvisir icon, because i needed something there and I have a vegvisir tattooed on my foot, hehe
 * - Copyright text with GitHub link
 * - Extra height on mobile to accommodate floating navbar (its removed using media query for desktop)
 *
 * @example
 * // Call this function when the DOM is loaded
 * createFooter();
 */
export function createFooter() {
  try {
    // Find the footer element in the HTML if it's there.. which it DAMN WELL BETTER BE
    const footer = document.querySelector("footer");

    if (!footer) {
      console.error("Footer element not found in the DOM");
      return;
    }

    const isRootPage = !window.location.pathname.includes("/src/pages/");
    const prefix = isRootPage ? "." : "../..";

    const footerContent = document.createElement("div");
    footerContent.classList.add("footer-content");

    const icon = document.createElement("img");
    icon.src = `${prefix}/public/icons/vegvisir.svg`;
    icon.alt = "Vegvisir symbol";
    icon.classList.add("footer-icon");

    const copyright = document.createElement("p");
    copyright.classList.add("footer-copyright");

    const copyrightSymbol = document.createTextNode("© ");
    copyright.appendChild(copyrightSymbol);

    const githubLink = document.createElement("a");
    githubLink.href = "https://github.com/larstp";
    githubLink.textContent = "larstp";
    githubLink.classList.add("footer-link");
    githubLink.setAttribute("aria-label", "Visit larstp's GitHub profile");
    githubLink.setAttribute("target", "_blank");
    githubLink.setAttribute("rel", "noopener noreferrer");

    copyright.appendChild(githubLink);

    const githubText = document.createTextNode(" 2025");
    copyright.appendChild(githubText);

    footerContent.appendChild(icon);
    footerContent.appendChild(copyright);
    footer.appendChild(footerContent);
  } catch (error) {
    console.error("Error creating footer:", error);
  }
}
