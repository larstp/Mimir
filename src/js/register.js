// This is mostly copy/pasted from a previous project

import { register, isLoggedIn } from "../data/api.js";
import { createLoader } from "./modules/loader.js";

/**
 * Creates the registration form
 * @returns {void}
 *
 * @description
 * Creates a registration form with username, email, and password fields.
 * Handles form submission and redirects to home on success.
 */
function createRegisterForm() {
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
  container.classList.add("register-container");

  const form = document.createElement("form");
  form.classList.add("register-form");
  form.setAttribute("aria-label", "Registration form");

  const header = document.createElement("h1");
  header.classList.add("register-header");
  header.textContent = "Create Account";
  form.appendChild(header);

  const fieldsContainer = document.createElement("div");
  fieldsContainer.classList.add("register-fields");

  const usernameLabel = document.createElement("label");
  usernameLabel.classList.add("form-label");
  usernameLabel.setAttribute("for", "username");
  usernameLabel.textContent = "Username";
  fieldsContainer.appendChild(usernameLabel);

  const usernameInput = document.createElement("input");
  usernameInput.type = "text";
  usernameInput.id = "username";
  usernameInput.name = "username";
  usernameInput.classList.add("form-input");
  usernameInput.placeholder = "john_doe";
  usernameInput.required = true;
  usernameInput.minLength = 3;
  usernameInput.maxLength = 20;
  usernameInput.setAttribute("aria-label", "Username");
  usernameInput.setAttribute("pattern", "^[a-zA-Z0-9_]+$");
  usernameInput.title =
    "Username must be 3-20 characters and contain only letters, numbers, and underscores";
  fieldsContainer.appendChild(usernameInput);

  const emailLabel = document.createElement("label");
  emailLabel.classList.add("form-label");
  emailLabel.setAttribute("for", "email");
  emailLabel.textContent = "Email";
  fieldsContainer.appendChild(emailLabel);

  const emailInput = document.createElement("input");
  emailInput.type = "email";
  emailInput.id = "email";
  emailInput.name = "email";
  emailInput.classList.add("form-input");
  emailInput.placeholder = "example@stud.noroff.no";
  emailInput.required = true;
  emailInput.setAttribute("aria-label", "Email address");
  emailInput.setAttribute("pattern", ".*@stud\\.noroff\\.no$");
  emailInput.title = "Email must end with @stud.noroff.no";
  fieldsContainer.appendChild(emailInput);

  const passwordLabel = document.createElement("label");
  passwordLabel.classList.add("form-label");
  passwordLabel.setAttribute("for", "password");
  passwordLabel.textContent = "Password";
  fieldsContainer.appendChild(passwordLabel);

  const passwordInput = document.createElement("input");
  passwordInput.type = "password";
  passwordInput.id = "password";
  passwordInput.name = "password";
  passwordInput.classList.add("form-input");
  passwordInput.placeholder = "Min 8 characters";
  passwordInput.required = true;
  passwordInput.minLength = 8;
  passwordInput.maxLength = 128;
  passwordInput.title = "Password must be at least 8 characters";
  passwordInput.setAttribute("aria-label", "Password");
  fieldsContainer.appendChild(passwordInput);

  const repeatPasswordLabel = document.createElement("label");
  repeatPasswordLabel.classList.add("form-label");
  repeatPasswordLabel.setAttribute("for", "repeat-password");
  repeatPasswordLabel.textContent = "Repeat Password";
  fieldsContainer.appendChild(repeatPasswordLabel);

  const repeatPasswordInput = document.createElement("input");
  repeatPasswordInput.type = "password";
  repeatPasswordInput.id = "repeat-password";
  repeatPasswordInput.name = "repeat-password";
  repeatPasswordInput.classList.add("form-input");
  repeatPasswordInput.placeholder = "Repeat your password";
  repeatPasswordInput.required = true;
  repeatPasswordInput.minLength = 8;
  repeatPasswordInput.maxLength = 128;
  repeatPasswordInput.title = "Password must match the password above";
  repeatPasswordInput.setAttribute("aria-label", "Repeat password");
  fieldsContainer.appendChild(repeatPasswordInput);

  const avatarLabel = document.createElement("label");
  avatarLabel.classList.add("form-label");
  avatarLabel.setAttribute("for", "avatar-url");
  avatarLabel.textContent = "Profile Picture URL (Optional)";
  fieldsContainer.appendChild(avatarLabel);

  const avatarInput = document.createElement("input");
  avatarInput.type = "url";
  avatarInput.id = "avatar-url";
  avatarInput.name = "avatar-url";
  avatarInput.classList.add("form-input");
  avatarInput.placeholder = "https://example.com/your-image.jpg";
  avatarInput.setAttribute("aria-label", "Profile picture URL");
  fieldsContainer.appendChild(avatarInput);

  form.appendChild(fieldsContainer);

  const submitButton = document.createElement("button");
  submitButton.type = "submit";
  submitButton.classList.add("btn");
  submitButton.textContent = "Register";
  form.appendChild(submitButton);

  const loginText = document.createElement("p");
  loginText.classList.add("register-login");

  const textNode = document.createTextNode("Already have an account? ");
  loginText.appendChild(textNode);

  const loginLink = document.createElement("a");
  loginLink.href = "./login.html";
  loginLink.classList.add("register-login-link");
  loginLink.textContent = "Log in here";
  loginText.appendChild(loginLink);

  form.appendChild(loginText);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const existingError = form.querySelector(".register-error");
    if (existingError) {
      existingError.remove();
    }

    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const repeatPassword = repeatPasswordInput.value;
    const avatarUrl = avatarInput.value.trim();

    if (!username || !email || !password || !repeatPassword) {
      showError(form, "Please fill in all fields");
      return;
    }

    if (!email.endsWith("@stud.noroff.no")) {
      showError(form, "Email must be a valid @stud.noroff.no address");
      return;
    }

    if (password.length < 8) {
      showError(form, "Password must be at least 8 characters");
      return;
    }

    if (password !== repeatPassword) {
      showError(form, "Passwords do not match");
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      showError(
        form,
        "Username can only contain letters, numbers, and underscores"
      );
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Creating account...";

    const loader = createLoader("Creating your account...");
    fieldsContainer.insertAdjacentElement("afterend", loader);

    try {
      const userData = {
        name: username,
        email: email,
        password: password,
      };

      if (avatarUrl) {
        userData.avatar = {
          url: avatarUrl,
          alt: `${username}'s profile picture`,
        };
      }

      await register(userData);

      window.location.href = "./login.html";
    } catch (error) {
      loader.remove();

      showError(
        form,
        error.message || "Registration failed. Please try again."
      );

      submitButton.disabled = false;
      submitButton.textContent = "Register";
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
  errorDiv.classList.add("register-error");
  errorDiv.textContent = message;
  errorDiv.setAttribute("role", "alert");

  const fieldsContainer = form.querySelector(".register-fields");
  fieldsContainer.insertAdjacentElement("afterend", errorDiv);
}

document.addEventListener("DOMContentLoaded", () => {
  createRegisterForm();
});
