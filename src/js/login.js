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
  container.classList.add("login-container");

  const form = document.createElement("form");
  form.classList.add("login-form");
  form.setAttribute("aria-label", "Login form");

  const header = document.createElement("h1");
  header.classList.add("login-header");
  header.textContent = "Log in";
  form.appendChild(header);

  const fieldsContainer = document.createElement("div");
  fieldsContainer.classList.add("login-fields");

  const emailLabel = document.createElement("label");
  emailLabel.classList.add("form-label");
  emailLabel.textContent = "Email";
  emailLabel.setAttribute("for", "email");
  fieldsContainer.appendChild(emailLabel);

  const emailInput = document.createElement("input");
  emailInput.type = "email";
  emailInput.id = "email";
  emailInput.name = "email";
  emailInput.classList.add("form-input");
  emailInput.placeholder = "example@stud.noroff.no";
  emailInput.required = true;
  emailInput.setAttribute("aria-label", "Email address");
  fieldsContainer.appendChild(emailInput);

  const passwordLabel = document.createElement("label");
  passwordLabel.classList.add("form-label");
  passwordLabel.textContent = "Password";
  passwordLabel.setAttribute("for", "password");
  fieldsContainer.appendChild(passwordLabel);

  const passwordInput = document.createElement("input");
  passwordInput.type = "password";
  passwordInput.id = "password";
  passwordInput.name = "password";
  passwordInput.classList.add("form-input");
  passwordInput.placeholder = "•••••";
  passwordInput.required = true;
  passwordInput.setAttribute("aria-label", "Password");
  fieldsContainer.appendChild(passwordInput);

  form.appendChild(fieldsContainer);

  const submitButton = document.createElement("button");
  submitButton.type = "submit";
  submitButton.classList.add("btn");
  submitButton.textContent = "Log in";
  form.appendChild(submitButton);

  const registerText = document.createElement("p");
  registerText.classList.add("login-register");

  const textNode = document.createTextNode("Don't have an account? ");
  registerText.appendChild(textNode);

  const registerLink = document.createElement("a");
  registerLink.href = "./register.html";
  registerLink.classList.add("login-register-link");
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
  errorDiv.classList.add("login-error");
  errorDiv.textContent = message;
  errorDiv.setAttribute("role", "alert");

  const fieldsContainer = form.querySelector(".login-fields");
  fieldsContainer.insertAdjacentElement("afterend", errorDiv);
}

document.addEventListener("DOMContentLoaded", () => {
  createLoginForm();
});
