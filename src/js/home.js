import {
  getAllPosts,
  searchPosts,
  isLoggedIn,
  getProfile,
  getUserName,
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
    feedContainer.classList.add("post-feed");

    if (!isLoggedIn()) {
      const emptyState = document.createElement("div");
      emptyState.classList.add("post-feed-empty");

      const heading = document.createElement("h1");
      heading.textContent = "Please log in to view posts";
      emptyState.appendChild(heading);

      const loginLink = document.createElement("a");
      loginLink.href = "./src/pages/login.html";
      loginLink.classList.add("btn");
      loginLink.textContent = "Log in";
      emptyState.appendChild(loginLink);

      const registerHeading = document.createElement("h2");
      registerHeading.textContent = "Don't have an account?";
      emptyState.appendChild(registerHeading);

      const registerLink = document.createElement("a");
      registerLink.href = "./src/pages/register.html";
      registerLink.classList.add("btn");
      registerLink.textContent = "Register";
      emptyState.appendChild(registerLink);

      feedContainer.appendChild(emptyState);
      main.appendChild(feedContainer);
      return;
    }

    const loader = createLoader(
      searchQuery ? "Searching..." : "Loading posts..."
    );
    feedContainer.appendChild(loader);
    main.appendChild(feedContainer);

    if (searchQuery) {
      const searchIndicator = document.createElement("div");
      searchIndicator.classList.add("search-indicator");
      searchIndicator.innerHTML = `
        <span>Searching for:  <strong>"${searchQuery}"</strong></span>
        <button class="btn btn-delete clear-search-btn">Clear Search</button>
      `;
      feedContainer.insertBefore(searchIndicator, loader);

      const clearBtn = searchIndicator.querySelector(".clear-search-btn");
      clearBtn.addEventListener("click", () => {
        currentSearchQuery = null;
        displayPostFeed(1);
      });
    } // This whole segment feels wrong. I'm really struggling with how search works.

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
      }); // I'm so confused
    }

    // ----------------------------------------------Fetch following list only once (first page load)(MUCH help from CoPilot here (with much explaining). This is unbelievably confusing for me)
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
      emptyMessage.classList.add("post-feed-empty");
      emptyMessage.textContent = "No posts found";
      feedContainer.appendChild(emptyMessage);
      return;
    }

    const postsWithImages = response.data.filter((post) => post.media?.url);

    if (postsWithImages.length === 0) {
      const emptyMessage = document.createElement("div");
      emptyMessage.classList.add("post-feed-empty");
      emptyMessage.textContent = "No posts with images found";
      feedContainer.appendChild(emptyMessage);
      return;
    }

    const grid = document.createElement("div");
    grid.classList.add("post-feed-grid");

    postsWithImages.forEach((post) => {
      const postCard = createPost(post, followingList);
      grid.appendChild(postCard);
    });

    feedContainer.appendChild(grid);

    if (!searchQuery) {
      const paginationContainer = document.createElement("div");
      paginationContainer.classList.add("post-feed-pagination");

      const meta = response.meta;
      const hasNextPage = meta.isLastPage === false;
      const hasPrevPage = meta.isFirstPage === false;

      if (hasPrevPage) {
        const prevBtn = document.createElement("button");
        prevBtn.classList.add("pagination-btn", "pagination-prev");
        prevBtn.textContent = "← Previous";
        prevBtn.addEventListener("click", () => {
          currentPage--;
          displayPostFeed(currentPage);
          window.scrollTo({ top: 0, behavior: "smooth" });
        });
        paginationContainer.appendChild(prevBtn);
      }

      const pageInfo = document.createElement("span");
      pageInfo.classList.add("pagination-info");
      pageInfo.textContent = `Page ${meta.currentPage} of ${meta.pageCount}`;
      paginationContainer.appendChild(pageInfo);

      if (hasNextPage) {
        const nextBtn = document.createElement("button");
        nextBtn.classList.add("pagination-btn", "pagination-next");
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
      errorDiv.classList.add("post-feed-error");
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
      'a[aria-label="Go to home page"]'
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
