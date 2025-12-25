import {
  getProfile,
  updateProfile,
  getUserName,
  isLoggedIn,
} from "../data/api.js";
import { createLoader } from "./modules/loader.js";
import { createHeader } from "./modules/header.js";
import { createFooter } from "./modules/footer.js";
import { createNavbar } from "./modules/navbar.js";

/**
 * Displays the edit profile form
 * @returns {Promise<void>}
 */
async function displayEditProfile() {
  try {
    createHeader();
    createFooter();
    createNavbar();

    const main = document.querySelector("main");

    if (!main) {
      console.error("Main element not found");
      return;
    }

    if (!isLoggedIn()) {
      window.location.href = "../../index.html";
      return;
    }

    const currentUser = getUserName();

    if (!currentUser) {
      window.location.href = "./user.html";
      return;
    }

    const loader = createLoader("Loading profile...");
    main.appendChild(loader);

    const profile = await getProfile(currentUser, {
      _posts: false,
      _followers: false,
    });

    loader.remove();

    if (!profile) {
      showError(main, "Profile not found");
      return;
    }

    const container = document.createElement("div");
    container.classList.add("edit-profile-container");

    const header = document.createElement("h1");
    header.classList.add("edit-profile-header");
    header.textContent = "Edit Profile";
    container.appendChild(header);

    const form = document.createElement("form");
    form.classList.add("edit-profile-form");
    form.setAttribute("aria-label", "Edit profile form");

    const bioLabel = document.createElement("label");
    bioLabel.classList.add("form-label");
    bioLabel.textContent = "Bio";
    bioLabel.setAttribute("for", "bio");
    form.appendChild(bioLabel);

    const bioTextarea = document.createElement("textarea");
    bioTextarea.id = "bio";
    bioTextarea.name = "bio";
    bioTextarea.classList.add("form-input", "edit-profile-textarea");
    bioTextarea.placeholder = "Tell us about yourself...";
    bioTextarea.value = profile.bio || "";
    bioTextarea.setAttribute("aria-label", "Bio");
    bioTextarea.rows = 4;
    form.appendChild(bioTextarea);

    const avatarLabel = document.createElement("label");
    avatarLabel.classList.add("form-label");
    avatarLabel.textContent = "Avatar URL (optional)";
    avatarLabel.setAttribute("for", "avatar");
    form.appendChild(avatarLabel);

    const avatarInput = document.createElement("input");
    avatarInput.type = "url";
    avatarInput.id = "avatar";
    avatarInput.name = "avatar";
    avatarInput.classList.add("form-input");
    avatarInput.placeholder = "https://example.com/avatar.jpg";
    avatarInput.value = profile.avatar?.url || "";
    avatarInput.setAttribute("aria-label", "Avatar URL");
    form.appendChild(avatarInput);

    const bannerLabel = document.createElement("label");
    bannerLabel.classList.add("form-label");
    bannerLabel.textContent = "Banner URL (optional)";
    bannerLabel.setAttribute("for", "banner");
    form.appendChild(bannerLabel);

    const bannerInput = document.createElement("input");
    bannerInput.type = "url";
    bannerInput.id = "banner";
    bannerInput.name = "banner";
    bannerInput.classList.add("form-input");
    bannerInput.placeholder = "https://example.com/banner.jpg";
    bannerInput.value = profile.banner?.url || "";
    bannerInput.setAttribute("aria-label", "Banner URL");
    form.appendChild(bannerInput);

    const buttonsContainer = document.createElement("div");
    buttonsContainer.classList.add("edit-profile-buttons");

    const cancelButton = document.createElement("a");
    cancelButton.href = "./user.html";
    cancelButton.classList.add("btn", "btn-secondary");
    cancelButton.textContent = "Cancel";
    buttonsContainer.appendChild(cancelButton);

    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.classList.add("btn");
    submitButton.textContent = "Save Changes";
    buttonsContainer.appendChild(submitButton);

    form.appendChild(buttonsContainer);

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const existingError = form.querySelector(".edit-profile-error");
      if (existingError) {
        existingError.remove();
      }

      const bio = bioTextarea.value.trim();
      const avatarUrl = avatarInput.value.trim();
      const bannerUrl = bannerInput.value.trim();

      try {
        const updateLoader = createLoader("Updating profile...");
        form.appendChild(updateLoader);
        submitButton.disabled = true;

        const updateData = {};

        if (bio !== profile.bio) {
          updateData.bio = bio;
        }

        if (avatarUrl && avatarUrl !== profile.avatar?.url) {
          updateData.avatar = {
            url: avatarUrl,
            alt: `${currentUser}'s profile picture`,
          };
        } else if (!avatarUrl && profile.avatar?.url) {
          updateData.avatar = null;
        }

        if (bannerUrl && bannerUrl !== profile.banner?.url) {
          updateData.banner = {
            url: bannerUrl,
            alt: `${currentUser}'s banner`,
          };
        } else if (!bannerUrl && profile.banner?.url) {
          updateData.banner = null;
        }

        if (Object.keys(updateData).length > 0) {
          await updateProfile(currentUser, updateData);
        }

        updateLoader.remove();

        window.location.href = "./user.html";
      } catch (error) {
        console.error("Error updating profile:", error);
        const updateLoader = form.querySelector(".loader-container");
        if (updateLoader) {
          updateLoader.remove();
        }
        submitButton.disabled = false;
        showFormError(form, "Failed to update profile. Please try again.");
      }
    });

    container.appendChild(form);
    main.appendChild(container);
  } catch (error) {
    console.error("Error displaying edit profile:", error);
    const main = document.querySelector("main");
    if (main) {
      showError(main, "Failed to load edit profile. Please try again.");
    }
  }
}

/**
 * Shows an error message in the main container
 * @param {HTMLElement} container - The container element
 * @param {string} message - The error message
 */
function showError(container, message) {
  const error = document.createElement("div");
  error.classList.add("post-feed-error");
  error.setAttribute("role", "alert");
  error.textContent = message;
  container.appendChild(error);
}

/**
 * Shows an error message in the form
 * @param {HTMLElement} form - The form element
 * @param {string} message - The error message
 */
function showFormError(form, message) {
  const error = document.createElement("div");
  error.classList.add("edit-profile-error");
  error.setAttribute("role", "alert");
  error.textContent = message;
  form.insertBefore(error, form.firstChild);
}

// Initialize the edit profile page
displayEditProfile();
