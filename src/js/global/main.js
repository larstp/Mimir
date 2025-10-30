import { createHeader } from "../modules/header.js";
import { createNavbar } from "../modules/navbar.js";
// import { Footer } from "../modules/footer.js";
// import { createPost } from "../modules/createPost.js";

// ----------------------------------------------------------  Initialize header when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  createHeader();
  createNavbar();
});
