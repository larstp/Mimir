import { createHeader } from "../modules/header.js";
import { createNavbar } from "../modules/navbar.js";
import { createFooter } from "../modules/footer.js";

document.addEventListener("DOMContentLoaded", () => {
  createHeader();
  createNavbar();
  createFooter();
});
