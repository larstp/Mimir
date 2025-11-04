import {
  getAllPosts,
  isLoggedIn,
  getProfile,
  getUserName,
} from "../data/api.js";
import { createPost } from "./modules/createPost.js";
import { createLoader } from "./modules/loader.js";

let currentPage = 1;
let followingList = [];

/**
 * Displays the post feed on the home page
 * @param {number} page - Page number to load
 * @returns {Promise<void>}
 *
 * @description
 * Fetches all posts from the API and displays them in a grid.
 * Shows loading state while fetching and SHOULD handle errors.
 */
async function displayPostFeed(page = 1) {
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

    const loader = createLoader("Loading posts...");
    feedContainer.appendChild(loader);
    main.appendChild(feedContainer);

    // -----------------------------------------------------------------Fetch posts from API
    const response = await getAllPosts({
      page: page,
      _author: true, // -----------------------------------------------Include author info
      _reactions: true, // --------------------------------------------Include reactions
      _comments: true, // ---------------------------------------------Include comments
      limit: 100, // --------------------------------------------------Get up to 100 posts (API max per page I think)
      sort: "created", // ---------------------------------------------Sort by creation date
      sortOrder: "desc", // -------------------------------------------Newest first
    });

    // ----------------------------------------------Fetch following list only once (first page load)(MUCH help from CoPilot here)
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
  displayPostFeed();
});
