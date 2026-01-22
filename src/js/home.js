import {
  getAllPosts,
  searchPosts,
  isLoggedIn,
  getProfile,
  getUserName,
  register,
} from "../data/api.js";
import { createPost } from "./modules/createPost.js";
import { createLoader } from "./modules/loader.js";

let currentPage = 1;
let followingList = [];
let currentSearchQuery = null;

/**
 * Displays the post feed on the home page
 * @param {number} page - Page number to load
 * @param {string|null} searchQuery - Optional search query to filter posts
 * @returns {Promise<void>}
 *
 * @description
 * Fetches all posts from the API and displays them in a grid.
 * If searchQuery is provided, fetches search results instead.
 * Shows loading state while fetching and SHOULD handle errors.
 */
async function displayPostFeed(page = 1, searchQuery = null) {
  try {
    const main = document.querySelector("main");

    if (!main) {
      console.error("Main element not found");
      return;
    }

    const existingFeed = main.querySelector(".post-feed");
    if (existingFeed) {
      existingFeed.remove();
    }

    const feedContainer = document.createElement("div");
    feedContainer.className =
      "post-feed max-w-[1200px] mx-auto px-4 py-0 md:p-8";

    if (!isLoggedIn()) {
      const emptyState = document.createElement("div");
      emptyState.className =
        "flex flex-col items-center gap-8 max-w-[300px] my-0 mx-auto";

      const heading = document.createElement("h1");
      heading.className =
        "text-[2rem] font-semibold text-[var(--text)] m-0 font-[var(--FontFamily)] pt-8 text-center";
      heading.textContent = "Please log in to view posts";
      emptyState.appendChild(heading);

      const loginLink = document.createElement("a");
      loginLink.href = "./src/pages/login.html";
      loginLink.className =
        "w-full max-w-[300px] p-4 bg-[var(--primary)] text-[var(--text)] border-none rounded-[10px] text-base font-semibold cursor-pointer transition-all duration-300 inline-block text-center hover:bg-[var(--primaryHover)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";
      loginLink.textContent = "Log in";
      emptyState.appendChild(loginLink);

      const registerHeading = document.createElement("h2");
      registerHeading.className = "text-xl font-medium text-[var(--text)] m-0";
      registerHeading.textContent = "Don't have an account?";
      emptyState.appendChild(registerHeading);

      const registerLink = document.createElement("a");
      registerLink.href = "./src/pages/register.html";
      registerLink.className =
        "w-full max-w-[300px] p-4 bg-[var(--primary)] text-[var(--text)] border-none rounded-[10px] text-base font-semibold cursor-pointer transition-all duration-300 inline-block text-center hover:bg-[var(--primaryHover)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";
      registerLink.textContent = "Register";
      emptyState.appendChild(registerLink);

      feedContainer.appendChild(emptyState);
      main.appendChild(feedContainer);
      return;
    }

    const loader = createLoader(
      searchQuery ? "Searching..." : "Loading posts...",
    );
    feedContainer.appendChild(loader);
    main.appendChild(feedContainer);

    if (searchQuery) {
      const searchIndicator = document.createElement("div");
      searchIndicator.className =
        "bg-[var(--surface-elevated)] font-[var(--FontFamily)] border border-white/10 rounded-lg py-4 px-[1.5rem] mb-8 flex items-center justify-between gap-4";

      const searchText = document.createElement("span");
      searchText.innerHTML = `Searching for:  <strong>"${searchQuery}"</strong>`;

      const clearBtn = document.createElement("button");
      clearBtn.className =
        "clear-search-btn p-4 bg-[var(--error)] text-white border-none rounded-[10px] text-base font-semibold cursor-pointer transition-all duration-300 hover:bg-[#dc2626]";
      clearBtn.textContent = "Clear Search";
      clearBtn.addEventListener("click", () => {
        currentSearchQuery = null;
        displayPostFeed(1);
      });

      searchIndicator.appendChild(searchText);
      searchIndicator.appendChild(clearBtn);
      feedContainer.insertBefore(searchIndicator, loader);
    }

    let response;
    if (searchQuery) {
      response = await searchPosts(searchQuery, {
        _author: true, // -------------------------------------------Include author info
        _reactions: true, // -----------------------------------------Include reactions
        _comments: true, // -----------------------------------------Include comments
      });
      if (response.data) {
        response = {
          data: response.data,
          meta: {
            isFirstPage: true,
            isLastPage: true,
            currentPage: 1,
            pageCount: 1,
          },
        };
      }
    } else {
      response = await getAllPosts({
        page: page,
        _author: true, // Include author info
        _reactions: true, // Include reactions
        _comments: true, // Include comments
        limit: 100, // Get up to 100 posts (API max per page I think)
        sort: "created", // Sort by creation date
        sortOrder: "desc", // Newest first
      });
    }

    if (page === 1) {
      followingList = [];
      try {
        const currentUser = getUserName();
        if (currentUser) {
          const profile = await getProfile(currentUser, { _following: true });
          followingList = profile.following?.map((user) => user.name) || [];
        }
      } catch (error) {
        console.error("Error fetching following list:", error);
      }
    }

    loader.remove();

    if (!response.data || response.data.length === 0) {
      const emptyMessage = document.createElement("div");
      emptyMessage.className =
        "flex flex-col items-center gap-4 max-w-[300px] my-0 mx-auto";
      emptyMessage.textContent = "No posts found";
      feedContainer.appendChild(emptyMessage);
      return;
    }

    const postsWithImages = response.data.filter((post) => post.media?.url);

    if (postsWithImages.length === 0) {
      const emptyMessage = document.createElement("div");
      emptyMessage.className =
        "flex flex-col items-center gap-4 max-w-[300px] my-0 mx-auto";
      emptyMessage.textContent = "No posts with images found";
      feedContainer.appendChild(emptyMessage);
      return;
    }

    const grid = document.createElement("div");
    grid.className =
      "grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 xl:grid-cols-3";

    postsWithImages.forEach((post) => {
      const postCard = createPost(post, followingList);
      grid.appendChild(postCard);
    });

    feedContainer.appendChild(grid);

    if (!searchQuery) {
      const paginationContainer = document.createElement("div");
      paginationContainer.className =
        "flex justify-center items-center gap-4 mt-12 py-8 px-0";

      const meta = response.meta;
      const hasNextPage = meta.isLastPage === false;
      const hasPrevPage = meta.isFirstPage === false;

      if (hasPrevPage) {
        const prevBtn = document.createElement("button");
        prevBtn.className =
          "bg-[var(--primary)] text-[var(--background)] border-none py-3 px-6 rounded-lg text-base font-semibold cursor-pointer transition-all duration-200 ease-in-out hover:bg-[var(--primaryHover)] hover:-translate-y-0.5 active:translate-y-0";
        prevBtn.textContent = "← Previous";
        prevBtn.addEventListener("click", () => {
          currentPage--;
          displayPostFeed(currentPage);
          window.scrollTo({ top: 0, behavior: "smooth" });
        });
        paginationContainer.appendChild(prevBtn);
      }

      const pageInfo = document.createElement("span");
      pageInfo.className = "text-[var(--text)] text-base font-medium";
      pageInfo.textContent = `Page ${meta.currentPage} of ${meta.pageCount}`;
      paginationContainer.appendChild(pageInfo);

      if (hasNextPage) {
        const nextBtn = document.createElement("button");
        nextBtn.className =
          "bg-[var(--primary)] text-[var(--background)] border-none py-3 px-6 rounded-lg text-base font-semibold cursor-pointer transition-all duration-200 ease-in-out hover:bg-[var(--primaryHover)] hover:-translate-y-0.5 active:translate-y-0";
        nextBtn.textContent = "Next →";
        nextBtn.addEventListener("click", () => {
          currentPage++;
          displayPostFeed(currentPage);
          window.scrollTo({ top: 0, behavior: "smooth" });
        });
        paginationContainer.appendChild(nextBtn);
      }

      feedContainer.appendChild(paginationContainer);
    }
  } catch (error) {
    console.error("Error displaying post feed:", error);

    const main = document.querySelector("main");
    if (main) {
      const errorDiv = document.createElement("div");
      errorDiv.className = "text-center py-12 px-4 text-[var(--error)]";
      errorDiv.textContent = "Failed to load posts. Please try again later.";
      main.appendChild(errorDiv);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.addEventListener("homeSearch", (event) => {
    currentSearchQuery = event.detail;
    currentPage = 1;
    displayPostFeed(1, event.detail);
  });

  const urlParams = new URLSearchParams(window.location.search);
  const searchParam = urlParams.get("search");

  setTimeout(() => {
    const homeLinks = document.querySelectorAll(
      'a[aria-label="Go to home page"]',
    );
    homeLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        if (currentSearchQuery) {
          event.preventDefault();
          currentSearchQuery = null;
          currentPage = 1;
          displayPostFeed(1);
          window.history.replaceState({}, "", window.location.pathname);
        }
      });
    });
  }, 100);

  if (searchParam) {
    currentSearchQuery = searchParam;
    displayPostFeed(1, searchParam);
  } else {
    displayPostFeed();
  }
});
