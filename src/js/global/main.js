import { createHeader } from "../modules/header.js";
import { createNavbar } from "../modules/navbar.js";
import { createFooter } from "../modules/footer.js";
// import { createPost } from "../modules/createPost.js";

// ----------------------------------------------------------  Initialize header when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  createHeader();
  createNavbar();
  createFooter();
});
