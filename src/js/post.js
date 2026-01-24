import {
  getPost,
  deletePost,
  getUserName,
  isLoggedIn,
  reactToPost,
} from "../data/api.js";
import { createLoader } from "./modules/loader.js";
import { openComment } from "./modules/comments.js";

/**
 * Displays a single post with all its details
 * @returns {Promise<void>}
 *
 * @description
 * Fetches a single post from the API and displays it with all comments (as opposed to just the newest).
 */
async function displayPost() {
  try {
    const main = document.querySelector("main");

    if (!main) {
      console.error("Main element not found");
      return;
    } // This worked for me, not sure if its right

    if (!isLoggedIn()) {
      window.location.href = "../../index.html";
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("id");

    if (!postId) {
      showError(main, "No post ID provided");
      return;
    }

    const loader = createLoader("Loading post...");
    main.appendChild(loader);

    const post = await getPost(postId, {
      _author: true,
      _comments: true,
      _reactions: true,
    });

    loader.remove();

    if (!post) {
      showError(main, "Post not found");
      return;
    }

    const container = document.createElement("div");
    container.className = "max-w-[800px] my-8 mx-auto px-4 py-0";

    const article = document.createElement("article");
    article.className =
      "bg-[var(--cardBackground)] rounded-[10px] shadow-[0_4px_6px_rgba(0,0,0,0.1)] overflow-hidden hover:shadow-[0_6px_12px_rgba(0,0,0,0.15)] transition-shadow duration-300";

    const header = document.createElement("div");
    header.className = "flex justify-between items-center p-4 pb-0";

    if (post.author) {
      const authorContainer = document.createElement("div");
      authorContainer.className = "flex items-center gap-3";

      if (post.author.avatar?.url) {
        const avatarLink = document.createElement("a");
        avatarLink.href = `../../src/pages/user.html?name=${post.author.name}`;
        avatarLink.setAttribute(
          "aria-label",
          `View ${post.author.name}'s profile`,
        );

        const avatar = document.createElement("img");
        avatar.src = post.author.avatar.url;
        avatar.alt = post.author.avatar.alt || `${post.author.name}'s avatar`;
        avatar.className = "w-10 h-10 rounded-full object-cover";
        avatarLink.appendChild(avatar);

        authorContainer.appendChild(avatarLink);
      }

      const authorName = document.createElement("a");
      authorName.href = `../../src/pages/user.html?name=${post.author.name}`;
      authorName.className =
        "text-[var(--text)] font-semibold no-underline hover:text-[var(--primary)] transition-colors duration-300";
      authorName.textContent = post.author.name;
      authorName.setAttribute(
        "aria-label",
        `View ${post.author.name}'s profile`,
      );
      authorContainer.appendChild(authorName);

      header.appendChild(authorContainer);
    }

    const date = document.createElement("time");
    date.className = "text-[var(--textLight)] text-sm";
    date.setAttribute("datetime", post.created);
    const postDate = new Date(post.created);
    date.textContent = postDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }); // ----- Why was this so hard to understand for meeee?
    header.appendChild(date);

    article.appendChild(header);

    if (post.media?.url) {
      const mediaContainer = document.createElement("div");
      mediaContainer.className = "w-full overflow-hidden";

      const img = document.createElement("img");
      img.src = post.media.url;
      img.alt = post.media.alt || post.title;
      img.className = "w-full h-auto object-cover";
      mediaContainer.appendChild(img);

      article.appendChild(mediaContainer);
    }

    const content = document.createElement("div");
    content.className = "p-4 pt-0";

    const titleContainer = document.createElement("div");
    titleContainer.className =
      "flex justify-between items-start gap-4 mb-3 mt-4";

    const title = document.createElement("h1");
    title.className =
      "text-2xl font-bold text-[var(--text)] m-0 flex-1 font-[var(--FontFamily)]";
    title.textContent = post.title;
    titleContainer.appendChild(title);

    const currentUser = getUserName();
    const thumbsReaction = post.reactions?.find((r) => r.symbol === "👍");
    const hasLiked = thumbsReaction?.reactors?.includes(currentUser) || false;
    const likeCount = thumbsReaction?.count || 0;

    const likeBtn = document.createElement("button");
    likeBtn.className =
      "flex items-center gap-2 p-2 bg-transparent border-none cursor-pointer transition-all duration-300 hover:bg-white/5 rounded-md";
    likeBtn.setAttribute("aria-label", hasLiked ? "Unlike post" : "Like post");
    likeBtn.setAttribute("data-post-id", post.id);
    likeBtn.setAttribute("data-liked", hasLiked);

    const likeIcon = document.createElement("img");
    likeIcon.src = hasLiked
      ? "../../public/icons/flowbite_heart-solid.svg"
      : "../../public/icons/flowbite_heart-outline.svg";
    likeIcon.alt = hasLiked ? "Liked" : "Like";
    likeIcon.className = "w-6 h-6";

    const likeCountSpan = document.createElement("span");
    likeCountSpan.className = "text-[var(--text)] font-semibold";
    likeCountSpan.textContent = likeCount;
    likeBtn.appendChild(likeCountSpan);

    likeBtn.appendChild(likeIcon);

    likeBtn.addEventListener("click", async (event) => {
      event.preventDefault();
      event.stopPropagation();
      const btn = event.currentTarget;
      const isLiked = btn.getAttribute("data-liked") === "true";

      try {
        await reactToPost(post.id, "👍");

        if (isLiked) {
          likeIcon.src = "../../public/icons/flowbite_heart-outline.svg";
          likeIcon.alt = "Like";
          btn.setAttribute("data-liked", "false");
          btn.setAttribute("aria-label", "Like post");
        } else {
          likeIcon.src = "../../public/icons/flowbite_heart-solid.svg";
          likeIcon.alt = "Liked";
          btn.setAttribute("data-liked", "true");
          btn.setAttribute("aria-label", "Unlike post");
        }

        const countSpan = btn.querySelector(
          "[class*='text-'][class*='font-semibold']",
        );
        const currentCount = parseInt(countSpan?.textContent || 0);
        const newCount = isLiked ? currentCount - 1 : currentCount + 1;

        if (newCount > 0) {
          if (countSpan) {
            countSpan.textContent = newCount;
          } else {
            const newCountSpan = document.createElement("span");
            newCountSpan.className = "text-[var(--text)] font-semibold";
            newCountSpan.textContent = newCount;
            btn.appendChild(newCountSpan);
          }
        } else if (countSpan) {
          countSpan.remove();
        }
      } catch (error) {
        console.error("Error reacting to post:", error);
        alert("Failed to like post. Please try again.");
      }
    });

    titleContainer.appendChild(likeBtn);

    const commentCount = post._count?.comments || 0;
    const commentBtn = document.createElement("div");
    commentBtn.className =
      "flex items-center gap-2 p-2 bg-transparent border-none cursor-pointer transition-all duration-300 hover:bg-white/5 rounded-md";
    commentBtn.setAttribute("aria-label", `${commentCount} comments`);

    const commentCountSpan = document.createElement("span");
    commentCountSpan.className = "text-[var(--text)] font-semibold";
    commentCountSpan.textContent = commentCount;
    commentBtn.appendChild(commentCountSpan);

    const commentIcon = document.createElement("img");
    commentIcon.src = "../../public/icons/flowbite_annotation-outline.svg";
    commentIcon.alt = "Comments";
    commentIcon.className = "w-6 h-6";
    commentBtn.appendChild(commentIcon);

    commentBtn.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      openComment(post.id);
    });

    titleContainer.appendChild(commentBtn);

    content.appendChild(titleContainer);

    if (post.body) {
      const body = document.createElement("p");
      body.className = "text-[var(--text)] leading-relaxed m-0 mt-3";
      body.textContent = post.body;
      content.appendChild(body);
    }

    article.appendChild(content);

    const commentsSection = document.createElement("section");
    commentsSection.className = "p-4 border-t border-white/10 mt-4";
    commentsSection.setAttribute("aria-label", "Comments");

    const commentsHeader = document.createElement("h2");
    commentsHeader.className =
      "text-xl font-semibold text-[var(--text)] m-0 mb-4 font-[var(--FontFamily)]";
    commentsHeader.textContent = `Comments (${commentCount})`;
    commentsSection.appendChild(commentsHeader);

    if (post.comments && post.comments.length > 0) {
      const commentsList = document.createElement("div");
      commentsList.className = "flex flex-col gap-4";

      post.comments.forEach((comment) => {
        const commentEl = document.createElement("article");
        commentEl.className = "bg-white/5 rounded-lg p-3 border border-white/5";

        const commentHeader = document.createElement("div");
        commentHeader.className = "flex items-center gap-2 mb-2";

        if (comment.author?.avatar?.url) {
          // If this doesn't work I'll just leave it. I'm DONE googling this.
          const avatarLink = document.createElement("a");
          avatarLink.href = `../../src/pages/user.html?name=${comment.author.name}`;
          avatarLink.setAttribute(
            "aria-label",
            `View ${comment.author.name}'s profile`,
          );

          const avatar = document.createElement("img");
          avatar.src = comment.author.avatar.url;
          avatar.alt =
            comment.author.avatar.alt || `${comment.author.name}'s avatar`;
          avatar.className = "w-8 h-8 rounded-full object-cover";
          avatarLink.appendChild(avatar);

          commentHeader.appendChild(avatarLink);
        }

        const authorLink = document.createElement("a");
        authorLink.href = `../../src/pages/user.html?name=${comment.author?.name}`;
        authorLink.className =
          "text-[var(--text)] font-semibold text-sm no-underline hover:text-[var(--primary)] transition-colors duration-300";
        authorLink.textContent = comment.author?.name || "Anonymous";
        authorLink.setAttribute(
          "aria-label",
          `View ${comment.author?.name}'s profile`,
        );
        commentHeader.appendChild(authorLink);

        const commentDate = document.createElement("time");
        commentDate.className = "text-[var(--textLight)] text-xs ml-auto";
        commentDate.setAttribute("datetime", comment.created);
        const date = new Date(comment.created);
        commentDate.textContent = date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        commentHeader.appendChild(commentDate);

        commentEl.appendChild(commentHeader);

        const commentBody = document.createElement("p");
        commentBody.className =
          "text-[var(--text)] text-sm leading-relaxed m-0";
        commentBody.textContent = comment.body;
        commentEl.appendChild(commentBody);

        commentsList.appendChild(commentEl);
      });

      commentsSection.appendChild(commentsList);
    } else {
      const emptyMessage = document.createElement("p");
      emptyMessage.className = "text-[var(--textLight)] text-center py-4";
      emptyMessage.textContent = "No comments yet";
      commentsSection.appendChild(emptyMessage);
    }

    article.appendChild(commentsSection);

    container.appendChild(article);

    // ----------Show edit/delete buttons only for own posts (This I had to get a LOT of help with)
    if (currentUser && post.author?.name === currentUser) {
      const actionsContainer = document.createElement("div");
      actionsContainer.className = "flex gap-4 mt-6";

      const editButton = document.createElement("a");
      editButton.href = `./editPost.html?id=${post.id}`;
      editButton.className =
        "flex-1 p-4 bg-[var(--surface-elevated)] text-[var(--text)] border border-white/10 rounded-[10px] text-base font-semibold cursor-pointer transition-all duration-300 inline-block text-center no-underline hover:bg-[var(--cardBackground)] hover:-translate-y-0.5 active:translate-y-0";
      editButton.textContent = "Edit Post";
      actionsContainer.appendChild(editButton);

      const deleteButton = document.createElement("button");
      deleteButton.className =
        "flex-1 p-4 bg-[var(--error)] text-[var(--text)] border-none rounded-[10px] text-base font-semibold cursor-pointer transition-all duration-300 inline-block text-center hover:bg-[#dc2626] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";
      deleteButton.textContent = "Delete Post";
      deleteButton.addEventListener("click", async () => {
        const confirmDelete = confirm(
          "Are you sure you want to delete this post? This cannot be undone.",
        );

        if (!confirmDelete) {
          return;
        }

        try {
          const deleteLoader = createLoader("Deleting post...");
          main.appendChild(deleteLoader);
          deleteButton.disabled = true;

          await deletePost(post.id);

          deleteLoader.remove();
          window.location.href = "../../index.html";
        } catch (error) {
          console.error("Error deleting post:", error);
          const deleteLoader = main.querySelector(".loader-container");
          if (deleteLoader) {
            deleteLoader.remove();
          }
          deleteButton.disabled = false;
          alert("Failed to delete post. Please try again.");
        }
      });

      actionsContainer.appendChild(deleteButton);
      container.appendChild(actionsContainer);
    }

    main.appendChild(container);
  } catch (error) {
    console.error("Error displaying post:", error);
    const main = document.querySelector("main");
    if (main) {
      const loader = main.querySelector(".loader-container");
      if (loader) {
        loader.remove();
      }
      showError(main, "Failed to load post. Please try again later.");
    }
  }
}

/**
 * Shows an error message
 * @param {HTMLElement} container - The container element
 * @param {string} message - The error message
 */
function showError(container, message) {
  const errorDiv = document.createElement("div");
  errorDiv.className = "text-center py-12 px-4 text-[var(--error)]";
  errorDiv.textContent = message;
  errorDiv.setAttribute("role", "alert");
  container.appendChild(errorDiv);
}

document.addEventListener("DOMContentLoaded", () => {
  displayPost();
});
