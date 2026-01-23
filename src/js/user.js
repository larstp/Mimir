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
    const currentUser = getUserName();
    const profileName = urlParams.get("name") || currentUser;

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
    banner.className =
      "profile-banner relative w-full h-[150px] bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] overflow-hidden md:h-[200px] lg:h-[250px]";
    banner.setAttribute("aria-label", "Profile banner");

    if (profile.banner?.url) {
      const bannerImage = document.createElement("img");
      bannerImage.src = profile.banner.url;
      bannerImage.alt = profile.banner.alt || `${profile.name}'s banner`;
      bannerImage.className = "profile-banner-image w-full h-full object-cover";
      banner.appendChild(bannerImage);
    }

    const backButton = document.createElement("button");
    backButton.className =
      "profile-back-button absolute top-4 left-4 flex items-center justify-center w-10 h-10 bg-black/50 backdrop-blur-[10px] border border-white/10 rounded-full cursor-pointer transition-all duration-200 ease-in-out z-10 p-0 hover:bg-black/70 hover:scale-105";
    backButton.setAttribute("aria-label", "Go back to previous page");

    const backIcon = document.createElement("img");
    backIcon.src = "../../public/icons/flowbite_arrow-left-alt-outline.svg";
    backIcon.alt = "";
    backIcon.className =
      "profile-back-icon w-5 h-5 brightness-0 invert transition-opacity duration-200 ease-in-out";
    backButton.appendChild(backIcon);

    backButton.addEventListener("click", () => {
      window.history.back();
    });

    banner.appendChild(backButton);

    if (currentUser === profileName) {
      const editButton = document.createElement("a");
      editButton.href = "./editUser.html";
      editButton.className =
        "profile-edit-button absolute top-4 right-4 flex items-center justify-center py-2 px-4 bg-black/50 backdrop-blur-[10px] border border-white/10 rounded-[5px] cursor-pointer transition-all duration-200 ease-in-out z-10 text-[var(--text)] font-[var(--FontFamily)] no-underline text-sm font-medium hover:bg-black/70 hover:scale-105"; // AAAAAaah
      editButton.setAttribute("aria-label", "Edit profile");
      editButton.textContent = "Edit Profile";

      banner.appendChild(editButton);
    }

    main.appendChild(banner);

    const header = document.createElement("section");
    header.className =
      "profile-header max-w-[1200px] mx-auto px-4 flex gap-6 -mt-[60px] relative z-[5] flex-col items-center text-center md:flex-row md:text-left md:-mt-[75px]";
    header.setAttribute("aria-label", "Profile information");

    const avatarContainer = document.createElement("div");
    avatarContainer.className = "profile-avatar-container shrink-0";

    const avatar = document.createElement("img");
    avatar.src =
      profile.avatar?.url ||
      "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=150&h=150&fit=crop";
    avatar.alt = profile.avatar?.alt || `${profile.name}'s avatar`;
    avatar.className =
      "profile-avatar w-[120px] h-[120px] rounded-full border-4 border-[var(--background)] object-cover bg-[var(--cardBackground)] md:w-[150px] md:h-[150px]";
    avatarContainer.appendChild(avatar);

    header.appendChild(avatarContainer);

    const info = document.createElement("div");
    info.className = "profile-info flex-1 pt-4 md:pt-14";

    const nameContainer = document.createElement("div");
    nameContainer.className = "profile-name-container inline-block mb-2";

    const name = document.createElement("h1");
    name.className =
      "profile-name text-2xl font-semibold text-[var(--text)] m-0 font-[var(--FontFamily)] bg-[rgba(17,17,17,0.85)] py-1 px-3 rounded-md inline-block md:text-[1.75rem]";
    name.textContent = profile.name;
    nameContainer.appendChild(name);

    info.appendChild(nameContainer);

    if (profile.bio) {
      const bio = document.createElement("p");
      bio.className = "profile-bio text-[var(--textLight)] m-0 mb-4 leading-6";
      bio.textContent = profile.bio;
      info.appendChild(bio);
    }

    const stats = document.createElement("div");
    stats.className =
      "profile-stats flex gap-8 text-[var(--textLight)] text-[0.95rem] justify-center md:justify-start";
    stats.setAttribute("aria-label", "Profile statistics");

    const followersCount = profile._count?.followers || 0;
    const followingCount = profile._count?.following || 0;

    const followers = document.createElement("div");
    followers.className = "profile-stat flex gap-1";

    const followersLabel = document.createElement("span");
    followersLabel.textContent = "Followers: ";
    followers.appendChild(followersLabel);

    const followersValue = document.createElement("span");
    followersValue.className =
      "profile-stat-value font-semibold text-[var(--text)]";
    followersValue.textContent = followersCount;
    followers.appendChild(followersValue);

    stats.appendChild(followers);

    const following = document.createElement("div");
    following.className = "profile-stat flex gap-1";

    const followingLabel = document.createElement("span");
    followingLabel.textContent = "Following: ";
    following.appendChild(followingLabel);

    const followingValue = document.createElement("span");
    followingValue.className =
      "profile-stat-value font-semibold text-[var(--text)]";
    followingValue.textContent = followingCount;
    following.appendChild(followingValue);

    stats.appendChild(following);
    info.appendChild(stats);

    header.appendChild(info);
    main.appendChild(header);

    const postsSection = document.createElement("section");
    postsSection.className =
      "profile-posts max-w-[1200px] mt-8 mx-auto mb-0 px-4 pb-4 pt-0";
    postsSection.setAttribute("aria-label", "User posts");

    const postsHeader = document.createElement("h2");
    postsHeader.className =
      "profile-posts-header text-xl font-semibold text-[var(--text)] m-0 mb-6 font-[var(--FontFamily)]";
    const postCount = profile._count?.posts || 0;
    postsHeader.textContent = `Posts (${postCount})`;
    postsSection.appendChild(postsHeader);

    if (profile.posts && profile.posts.length > 0) {
      const postsWithImages = profile.posts.filter((post) => post.media?.url);

      if (postsWithImages.length > 0) {
        const postsGrid = document.createElement("div");
        postsGrid.className =
          "post-feed-grid grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 xl:grid-cols-3";

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

    if (currentUser === profileName) {
      const logoutSection = document.createElement("section");
      logoutSection.className =
        "profile-logout-section max-w-[1200px] mt-12 mx-auto mb-8 px-4 py-0 flex justify-center";

      const logoutButton = document.createElement("button");
      logoutButton.className =
        "profile-logout-btn p-4 bg-[var(--error)] text-[var(--text)] border-none rounded-[10px] text-base font-semibold cursor-pointer transition-all duration-300 inline-block text-center hover:bg-[#dc2626] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";
      logoutButton.textContent = "Log Out";
      logoutButton.setAttribute("aria-label", "Log out of your account");

      logoutButton.addEventListener("click", () => {
        logout();
        window.location.href = "../../index.html";
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
  error.className =
    "post-feed-error text-center py-12 px-4 text-[var(--error)]";
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
  empty.className =
    "post-feed-empty flex flex-col items-center gap-8 max-w-[300px] mx-auto text-center py-12 px-4 text-[var(--textLight)]";

  const emptyText = document.createElement("p");
  emptyText.textContent = "No posts with images yet";
  empty.appendChild(emptyText);

  container.appendChild(empty);
}

displayUserProfile();
