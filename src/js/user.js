import { getProfile, getUserName, isLoggedIn, logout } from "../data/api.js";
import { createLoader } from "./modules/loader.js";
import { createPost } from "./modules/createPost.js";

/**
 * Displays the user profile page
 * @returns {Promise<void>}
 *
 * @description
 * Fetches and displays a user's profile with their posts.
 * If no username is provided in URL params, displays the logged-in user's profile.
 */
async function displayUserProfile() {
  try {
    const main = document.querySelector("main");

    if (!main) {
      console.error("Main element not found");
      return;
    }

    if (!isLoggedIn()) {
      window.location.href = "../../index.html";
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const profileName = urlParams.get("name") || getUserName();

    if (!profileName) {
      showError(main, "No user specified");
      return;
    }

    const loader = createLoader("Loading profile...");
    main.appendChild(loader);

    const profile = await getProfile(profileName, {
      _posts: true,
      _followers: true,
      _following: true,
    });

    loader.remove();

    if (!profile) {
      showError(main, "Profile not found");
      return;
    }

    const banner = document.createElement("section");
    banner.classList.add("profile-banner");
    banner.setAttribute("aria-label", "Profile banner");

    if (profile.banner?.url) {
      // hope this works on all browsers
      const bannerImage = document.createElement("img");
      bannerImage.src = profile.banner.url;
      bannerImage.alt = profile.banner.alt || `${profile.name}'s banner`;
      bannerImage.classList.add("profile-banner-image");
      banner.appendChild(bannerImage);
    }

    const backButton = document.createElement("button");
    backButton.classList.add("profile-back-button");
    backButton.setAttribute("aria-label", "Go back to previous page");

    const backIcon = document.createElement("img");
    backIcon.src = "../../public/icons/flowbite_arrow-left-alt-outline.svg";
    backIcon.alt = "";
    backIcon.classList.add("profile-back-icon");
    backButton.appendChild(backIcon);

    backButton.addEventListener("click", () => {
      window.history.back();
    });

    banner.appendChild(backButton);
    main.appendChild(banner);

    const header = document.createElement("section");
    header.classList.add("profile-header");
    header.setAttribute("aria-label", "Profile information");

    const avatarContainer = document.createElement("div");
    avatarContainer.classList.add("profile-avatar-container");

    const avatar = document.createElement("img");
    avatar.src =
      profile.avatar?.url ||
      "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=150&h=150&fit=crop";
    avatar.alt = profile.avatar?.alt || `${profile.name}'s avatar`;
    avatar.classList.add("profile-avatar");
    avatarContainer.appendChild(avatar);

    header.appendChild(avatarContainer);

    const info = document.createElement("div");
    info.classList.add("profile-info");

    const nameContainer = document.createElement("div");
    nameContainer.classList.add("profile-name-container");

    const name = document.createElement("h1");
    name.classList.add("profile-name");
    name.textContent = profile.name;
    nameContainer.appendChild(name);

    info.appendChild(nameContainer);

    if (profile.bio) {
      const bio = document.createElement("p");
      bio.classList.add("profile-bio");
      bio.textContent = profile.bio;
      info.appendChild(bio);
    }

    const stats = document.createElement("div");
    stats.classList.add("profile-stats");
    stats.setAttribute("aria-label", "Profile statistics");

    const followersCount = profile._count?.followers || 0;
    const followingCount = profile._count?.following || 0;

    const followers = document.createElement("div");
    followers.classList.add("profile-stat");

    const followersLabel = document.createElement("span");
    followersLabel.textContent = "Followers: ";
    followers.appendChild(followersLabel);

    const followersValue = document.createElement("span");
    followersValue.classList.add("profile-stat-value");
    followersValue.textContent = followersCount;
    followers.appendChild(followersValue);

    stats.appendChild(followers);

    const following = document.createElement("div");
    following.classList.add("profile-stat");

    const followingLabel = document.createElement("span");
    followingLabel.textContent = "Following: ";
    following.appendChild(followingLabel);

    const followingValue = document.createElement("span");
    followingValue.classList.add("profile-stat-value");
    followingValue.textContent = followingCount;
    following.appendChild(followingValue);

    stats.appendChild(following);
    info.appendChild(stats);

    header.appendChild(info);
    main.appendChild(header);

    const postsSection = document.createElement("section");
    postsSection.classList.add("profile-posts");
    postsSection.setAttribute("aria-label", "User posts");

    const postsHeader = document.createElement("h2");
    postsHeader.classList.add("profile-posts-header");
    const postCount = profile._count?.posts || 0;
    postsHeader.textContent = `Posts (${postCount})`;
    postsSection.appendChild(postsHeader);

    if (profile.posts && profile.posts.length > 0) {
      const postsWithImages = profile.posts.filter((post) => post.media?.url);

      if (postsWithImages.length > 0) {
        const postsGrid = document.createElement("div");
        postsGrid.classList.add("post-feed-grid");

        const followingList = [];

        postsWithImages.forEach((post) => {
          const postCard = createPost(post, followingList);
          postsGrid.appendChild(postCard);
        });

        postsSection.appendChild(postsGrid);
      } else {
        showNoPosts(postsSection);
      }
    } else {
      showNoPosts(postsSection);
    }

    main.appendChild(postsSection);

    const currentUser = getUserName();
    if (currentUser === profileName) {
      const logoutSection = document.createElement("section");
      logoutSection.classList.add("profile-logout-section");

      const logoutButton = document.createElement("button");
      logoutButton.classList.add("btn", "btn-delete", "profile-logout-btn");
      logoutButton.textContent = "Log Out";
      logoutButton.setAttribute("aria-label", "Log out of your account");

      logoutButton.addEventListener("click", () => {
        if (confirm("Are you sure you want to log out?")) {
          logout();
          window.location.href = "../../index.html";
        }
      });

      logoutSection.appendChild(logoutButton);
      main.appendChild(logoutSection);
    }
  } catch (error) {
    console.error("Error displaying user profile:", error);
    const main = document.querySelector("main");
    if (main) {
      showError(main, "Failed to load profile. Please try again.");
    }
  }
}

/**
 * Shows an error message
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
 * Shows a "no posts" message if the user hasn't posted anything with images. (had to base it on if posts have media bc of current brain limitations)
 * @param {HTMLElement} container - The container element
 */
function showNoPosts(container) {
  const empty = document.createElement("div");
  empty.classList.add("post-feed-empty");

  const emptyText = document.createElement("p");
  emptyText.textContent = "No posts with images yet";
  empty.appendChild(emptyText);

  container.appendChild(empty);
}

displayUserProfile();
