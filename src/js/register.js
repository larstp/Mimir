// This Tailwind is mostly copy/pasted from login. mostly

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
  container.className =
    "register-container relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4 py-8 pt-[100px] md:pb-8";

  const form = document.createElement("form");
  form.className = "register-form w-full max-w-[300px] flex flex-col gap-6";
  form.setAttribute("aria-label", "Registration form");

  const header = document.createElement("h1");
  header.className =
    "register-header text-3xl font-semibold text-center text-[var(--text)] mb-4";
  header.textContent = "Create Account";
  form.appendChild(header);

  const fieldsContainer = document.createElement("div");
  fieldsContainer.className = "register-fields flex flex-col gap-4";

  const usernameLabel = document.createElement("label");
  usernameLabel.className =
    "form-label block text-[var(--text)] text-[0.9rem] font-semibold mb-2";
  usernameLabel.setAttribute("for", "username");
  usernameLabel.textContent = "Username";
  fieldsContainer.appendChild(usernameLabel);

  const usernameInput = document.createElement("input");
  usernameInput.type = "text";
  usernameInput.id = "username";
  usernameInput.name = "username";
  usernameInput.className =
    "form-input w-full p-4 bg-white/25 border border-white/10 rounded-[10px] text-[var(--text)] text-base transition-all duration-300 placeholder:text-[var(--textLight)] placeholder:opacity-50 focus:outline-none focus:border-[var(--primary)] focus:bg-white/[0.08]";
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
  emailLabel.className =
    "form-label block text-[var(--text)] text-[0.9rem] font-semibold mb-2";
  emailLabel.setAttribute("for", "email");
  emailLabel.textContent = "Email";
  fieldsContainer.appendChild(emailLabel);

  const emailInput = document.createElement("input");
  emailInput.type = "email";
  emailInput.id = "email";
  emailInput.name = "email";
  emailInput.className =
    "form-input w-full p-4 bg-white/25 border border-white/10 rounded-[10px] text-[var(--text)] text-base transition-all duration-300 placeholder:text-[var(--textLight)] placeholder:opacity-50 focus:outline-none focus:border-[var(--primary)] focus:bg-white/[0.08]";
  emailInput.placeholder = "example@stud.noroff.no";
  emailInput.required = true;
  emailInput.setAttribute("aria-label", "Email address");
  emailInput.setAttribute("pattern", ".*@stud\\.noroff\\.no$");
  emailInput.title = "Email must end with @stud.noroff.no";
  fieldsContainer.appendChild(emailInput);

  const passwordLabel = document.createElement("label");
  passwordLabel.className =
    "form-label block text-[var(--text)] text-[0.9rem] font-semibold mb-2";
  passwordLabel.setAttribute("for", "password");
  passwordLabel.textContent = "Password";
  fieldsContainer.appendChild(passwordLabel);

  const passwordInput = document.createElement("input");
  passwordInput.type = "password";
  passwordInput.id = "password";
  passwordInput.name = "password";
  passwordInput.className =
    "form-input w-full p-4 bg-white/25 border border-white/10 rounded-[10px] text-[var(--text)] text-base transition-all duration-300 placeholder:text-[var(--textLight)] placeholder:opacity-50 focus:outline-none focus:border-[var(--primary)] focus:bg-white/[0.08]";
  passwordInput.placeholder = "Min 8 characters";
  passwordInput.required = true;
  passwordInput.minLength = 8;
  passwordInput.maxLength = 128;
  passwordInput.title = "Password must be at least 8 characters";
  passwordInput.setAttribute("aria-label", "Password");
  fieldsContainer.appendChild(passwordInput);

  const repeatPasswordLabel = document.createElement("label");
  repeatPasswordLabel.className =
    "form-label block text-[var(--text)] text-[0.9rem] font-semibold mb-2";
  repeatPasswordLabel.setAttribute("for", "repeat-password");
  repeatPasswordLabel.textContent = "Repeat Password";
  fieldsContainer.appendChild(repeatPasswordLabel);

  const repeatPasswordInput = document.createElement("input");
  repeatPasswordInput.type = "password";
  repeatPasswordInput.id = "repeat-password";
  repeatPasswordInput.name = "repeat-password";
  repeatPasswordInput.className =
    "form-input w-full p-4 bg-white/25 border border-white/10 rounded-[10px] text-[var(--text)] text-base transition-all duration-300 placeholder:text-[var(--textLight)] placeholder:opacity-50 focus:outline-none focus:border-[var(--primary)] focus:bg-white/[0.08]";
  repeatPasswordInput.placeholder = "Repeat your password";
  repeatPasswordInput.required = true;
  repeatPasswordInput.minLength = 8;
  repeatPasswordInput.maxLength = 128;
  repeatPasswordInput.title = "Password must match the password above";
  repeatPasswordInput.setAttribute("aria-label", "Repeat password");
  fieldsContainer.appendChild(repeatPasswordInput);

  const avatarLabel = document.createElement("label");
  avatarLabel.className =
    "form-label block text-[var(--text)] text-[0.9rem] font-semibold mb-2";
  avatarLabel.setAttribute("for", "avatar-url");
  avatarLabel.textContent = "Profile Picture URL (Optional)";
  fieldsContainer.appendChild(avatarLabel);

  const avatarInput = document.createElement("input");
  avatarInput.type = "url";
  avatarInput.id = "avatar-url";
  avatarInput.name = "avatar-url";
  avatarInput.className =
    "form-input w-full p-4 bg-white/25 border border-white/10 rounded-[10px] text-[var(--text)] text-base transition-all duration-300 placeholder:text-[var(--textLight)] placeholder:opacity-50 focus:outline-none focus:border-[var(--primary)] focus:bg-white/[0.08]";
  avatarInput.placeholder = "https://example.com/your-image.jpg";
  avatarInput.setAttribute("aria-label", "Profile picture URL");
  fieldsContainer.appendChild(avatarInput);

  form.appendChild(fieldsContainer);

  const submitButton = document.createElement("button");
  submitButton.type = "submit";
  submitButton.className =
    "btn w-full p-4 bg-[var(--primary)] text-[var(--text)] border-none rounded-[10px] text-base font-semibold cursor-pointer transition-all duration-300 inline-block text-center hover:bg-[var(--primaryHover)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";
  submitButton.textContent = "Register";
  form.appendChild(submitButton);

  const loginText = document.createElement("p");
  loginText.className =
    "register-login text-center text-[var(--textLight)] text-sm";

  const textNode = document.createTextNode("Already have an account? ");
  loginText.appendChild(textNode);

  const loginLink = document.createElement("a");
  loginLink.href = "./login.html";
  loginLink.className =
    "register-login-link text-[var(--textLight)] no-underline font-semibold transition-colors duration-300 hover:text-[var(--primaryHover)] hover:underline";
  loginLink.textContent = "Log in here";
  loginText.appendChild(loginLink);

  form.appendChild(loginText);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const existingError = form.querySelector("[data-error='register']"); // this took some time whoh
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
        "Username can only contain letters, numbers, and underscores",
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
        error.message || "Registration failed. Please try again.",
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
  errorDiv.className =
    "register-error p-4 bg-[rgb(255,107,107)]/10 border border-[rgb(255,107,107)]/30 rounded-[10px] text-[#ff6b6b] text-center text-sm";
  errorDiv.textContent = message;
  errorDiv.setAttribute("role", "alert");
  errorDiv.setAttribute("data-error", "register");

  const fieldsContainer = form.querySelector(".register-fields");
  fieldsContainer.insertAdjacentElement("afterend", errorDiv);
}

document.addEventListener("DOMContentLoaded", () => {
  createRegisterForm();
});
