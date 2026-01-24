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
    container.className = "max-w-[600px] my-8 mx-auto px-4 py-0";

    const header = document.createElement("h1");
    header.className =
      "text-3xl font-semibold text-[var(--text)] m-0 mb-8 font-[var(--FontFamily)] text-center";
    header.textContent = "Edit Profile";
    container.appendChild(header);

    const form = document.createElement("form");
    form.className = "flex flex-col gap-4";
    form.setAttribute("aria-label", "Edit profile form");

    const bioLabel = document.createElement("label");
    bioLabel.className =
      "block text-[var(--text)] text-[0.9rem] font-semibold mb-2";
    bioLabel.textContent = "Bio";
    bioLabel.setAttribute("for", "bio");
    form.appendChild(bioLabel);

    const bioTextarea = document.createElement("textarea");
    bioTextarea.id = "bio";
    bioTextarea.name = "bio";
    bioTextarea.className =
      "w-full p-4 bg-white/25 border border-white/10 rounded-[10px] text-[var(--text)] text-base transition-all duration-300 placeholder:text-[var(--textLight)] placeholder:opacity-50 focus:outline-none focus:border-[var(--primary)] focus:bg-white/[0.08] resize-y min-h-[100px] font-[inherit]";
    bioTextarea.placeholder = "Tell us about yourself...";
    bioTextarea.value = profile.bio || "";
    bioTextarea.setAttribute("aria-label", "Bio");
    bioTextarea.rows = 4;
    form.appendChild(bioTextarea);

    const avatarLabel = document.createElement("label");
    avatarLabel.className =
      "block text-[var(--text)] text-[0.9rem] font-semibold mb-2";
    avatarLabel.textContent = "Avatar URL (optional)";
    avatarLabel.setAttribute("for", "avatar");
    form.appendChild(avatarLabel);

    const avatarInput = document.createElement("input");
    avatarInput.type = "url";
    avatarInput.id = "avatar";
    avatarInput.name = "avatar";
    avatarInput.className =
      "w-full p-4 bg-white/25 border border-white/10 rounded-[10px] text-[var(--text)] text-base transition-all duration-300 placeholder:text-[var(--textLight)] placeholder:opacity-50 focus:outline-none focus:border-[var(--primary)] focus:bg-white/[0.08]";
    avatarInput.placeholder = "https://example.com/avatar.jpg";
    avatarInput.value = profile.avatar?.url || "";
    avatarInput.setAttribute("aria-label", "Avatar URL");
    form.appendChild(avatarInput);

    const bannerLabel = document.createElement("label");
    bannerLabel.className =
      "block text-[var(--text)] text-[0.9rem] font-semibold mb-2";
    bannerLabel.textContent = "Banner URL (optional)";
    bannerLabel.setAttribute("for", "banner");
    form.appendChild(bannerLabel);

    const bannerInput = document.createElement("input");
    bannerInput.type = "url";
    bannerInput.id = "banner";
    bannerInput.name = "banner";
    bannerInput.className =
      "w-full p-4 bg-white/25 border border-white/10 rounded-[10px] text-[var(--text)] text-base transition-all duration-300 placeholder:text-[var(--textLight)] placeholder:opacity-50 focus:outline-none focus:border-[var(--primary)] focus:bg-white/[0.08]";
    bannerInput.placeholder = "https://example.com/banner.jpg";
    bannerInput.value = profile.banner?.url || "";
    bannerInput.setAttribute("aria-label", "Banner URL");
    form.appendChild(bannerInput);

    const buttonsContainer = document.createElement("div");
    buttonsContainer.className = "flex gap-4 mt-4";

    const cancelButton = document.createElement("a");
    cancelButton.href = "./user.html";
    cancelButton.className =
      "flex-1 p-4 bg-[var(--surface-elevated)] text-[var(--text)] border border-white/10 rounded-[10px] text-base font-semibold cursor-pointer transition-all duration-300 inline-block text-center no-underline hover:bg-[var(--cardBackground)] hover:-translate-y-0.5 active:translate-y-0";
    cancelButton.textContent = "Cancel";
    buttonsContainer.appendChild(cancelButton);

    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.className =
      "flex-1 p-4 bg-[var(--primary)] text-[var(--text)] border-none rounded-[10px] text-base font-semibold cursor-pointer transition-all duration-300 inline-block text-center hover:bg-[var(--primaryHover)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";
    submitButton.textContent = "Save Changes";
    buttonsContainer.appendChild(submitButton);

    form.appendChild(buttonsContainer);

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const existingError = form.querySelector("[data-error='edit-profile']");
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
  error.className =
    "post-feed-error text-center py-12 px-4 text-[var(--error)]";
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
  error.className =
    "bg-[rgba(220,38,38,0.1)] text-[var(--error)] p-4 rounded-lg border border-[var(--error)] mb-4";
  error.setAttribute("role", "alert");
  error.setAttribute("data-error", "edit-profile");
  error.textContent = message;
  form.insertBefore(error, form.firstChild);
}

displayEditProfile();
