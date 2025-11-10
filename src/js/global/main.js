import { createHeader } from "../modules/header.js";
import { createNavbar } from "../modules/navbar.js";
import { createFooter } from "../modules/footer.js";
import { initializeSearch } from "../modules/search.js";

document.addEventListener("DOMContentLoaded", () => {
  createHeader();
  createNavbar();
  createFooter();

  initializeSearch((query) => {
    const isHomePage =
      window.location.pathname.endsWith("index.html") ||
      window.location.pathname === "/" ||
      window.location.pathname.endsWith("/");

    if (isHomePage) {
      window.dispatchEvent(new CustomEvent("homeSearch", { detail: query }));
    } else {
      const homeUrl = window.location.pathname.includes("/src/pages/")
        ? "../../index.html"
        : "./index.html";
      window.location.href = `${homeUrl}?search=${encodeURIComponent(query)}`;
    }
  });
});
