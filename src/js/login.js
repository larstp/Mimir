import { login, isLoggedIn } from "../data/api.js";
import { createLoader } from "./modules/loader.js";

/**
 * Creates the login form
 * @returns {void}
 *
 * @description
 * Creates a login form with email and password fields.
 * Handles form submission and redirects to home on success.
 */
function createLoginForm() {
  const main = document.querySelector("main");

  if (!main) {
    console.error("Main element not found");
    return;
  }

  if (isLoggedIn()) {
    window.location.href = "../../index.html";
    return;
  }

  const container = document.createElement("div");
  container.className =
    "relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4 py-8 pt-[100px] md:pb-8";

  const form = document.createElement("form");
  form.className = "w-full max-w-md flex flex-col gap-6";
  form.setAttribute("aria-label", "Login form");

  const header = document.createElement("h1");
  header.className =
    "text-3xl font-semibold text-center text-[var(--text)] mb-4";
  header.textContent = "Log in";
  form.appendChild(header);

  const fieldsContainer = document.createElement("div");
  fieldsContainer.className = "flex flex-col gap-4";

  const emailLabel = document.createElement("label");
  emailLabel.className =
    "block text-[var(--text)] text-[0.9rem] font-semibold mb-2";
  emailLabel.textContent = "Email";
  emailLabel.setAttribute("for", "email");
  fieldsContainer.appendChild(emailLabel);

  const emailInput = document.createElement("input");
  emailInput.type = "email";
  emailInput.id = "email";
  emailInput.name = "email";
  emailInput.className =
    "w-full p-4 bg-white/25 border border-white/10 rounded-[10px] text-[var(--text)] text-base transition-all duration-300 placeholder:text-[var(--textLight)] placeholder:opacity-50 focus:outline-none focus:border-[var(--primary)] focus:bg-white/[0.08]";
  emailInput.placeholder = "example@stud.noroff.no";
  emailInput.required = true;
  emailInput.setAttribute("aria-label", "Email address");
  emailInput.setAttribute("pattern", ".*@stud\\.noroff\\.no$");
  emailInput.title = "Email must end with @stud.noroff.no";
  fieldsContainer.appendChild(emailInput);

  const passwordLabel = document.createElement("label");
  passwordLabel.className =
    "block text-[var(--text)] text-[0.9rem] font-semibold mb-2";
  passwordLabel.textContent = "Password";
  passwordLabel.setAttribute("for", "password");
  fieldsContainer.appendChild(passwordLabel);

  const passwordInput = document.createElement("input");
  passwordInput.type = "password";
  passwordInput.id = "password";
  passwordInput.name = "password";
  passwordInput.className =
    "w-full p-4 bg-white/25 border border-white/10 rounded-[10px] text-[var(--text)] text-base transition-all duration-300 placeholder:text-[var(--textLight)] placeholder:opacity-50 focus:outline-none focus:border-[var(--primary)] focus:bg-white/[0.08]";
  passwordInput.placeholder = "•••••";
  passwordInput.required = true;
  passwordInput.minLength = 8;
  passwordInput.title = "Enter your password";
  passwordInput.setAttribute("aria-label", "Password");
  fieldsContainer.appendChild(passwordInput);

  form.appendChild(fieldsContainer);

  const submitButton = document.createElement("button");
  submitButton.type = "submit";
  submitButton.className =
    "w-full p-4 bg-[var(--primary)] text-[var(--text)] border-none rounded-[10px] text-base font-semibold cursor-pointer transition-all duration-300 inline-block text-center hover:bg-[var(--primaryHover)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";
  submitButton.textContent = "Log in";
  form.appendChild(submitButton);

  const registerText = document.createElement("p");
  registerText.className = "text-center text-[var(--textLight)] text-sm";

  const textNode = document.createTextNode("Don't have an account? ");
  registerText.appendChild(textNode);

  const registerLink = document.createElement("a");
  registerLink.href = "./register.html";
  registerLink.className =
    "text-[var(--textLight)] no-underline font-semibold transition-colors duration-300 hover:text-[var(--primaryHover)] hover:underline";
  registerLink.textContent = "Click here to register";
  registerText.appendChild(registerLink);

  form.appendChild(registerText);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const existingError = form.querySelector(".login-error");
    if (existingError) {
      existingError.remove();
    }

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
      showError(form, "Please fill in all fields");
      return;
    }

    if (!email.endsWith("@stud.noroff.no")) {
      showError(form, "Email must be a valid @stud.noroff.no address");
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Logging in...";

    const loader = createLoader("Logging you in...");
    fieldsContainer.insertAdjacentElement("afterend", loader);

    try {
      await login(email, password);

      window.location.href = "../../index.html";
    } catch (error) {
      loader.remove();

      showError(form, error.message || "Login failed. Please try again.");

      submitButton.disabled = false;
      submitButton.textContent = "Log in";
    }
  });

  container.appendChild(form);
  main.appendChild(container);
}

/**
 * Shows an error message in the form
 * @param {HTMLFormElement} form - The form element
 * @param {string} message - The error message
 */
function showError(form, message) {
  const errorDiv = document.createElement("div");
  errorDiv.className =
    "login-error p-4 bg-[rgb(255,107,107)]/10 border border-[rgb(255,107,107)]/30 rounded-[10px] text-[#ff6b6b] text-center text-sm";
  errorDiv.textContent = message;
  errorDiv.setAttribute("role", "alert");

  const fieldsContainer = form.querySelector(".login-fields");
  fieldsContainer.insertAdjacentElement("afterend", errorDiv);
}

document.addEventListener("DOMContentLoaded", () => {
  createLoginForm();
});
