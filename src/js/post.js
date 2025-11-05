import { getPost, deletePost, getUserName, isLoggedIn } from "../data/api.js";
import { createLoader } from "./modules/loader.js";

/**
 * Displays a single post with all its details
 * @returns {Promise<void>}
 *
 * @description
 * Fetches a single post from the API and displays it with all comments.
 */
async function displayPost() {
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
    container.classList.add("post-page-container");

    const article = document.createElement("article");
    article.classList.add("post-card");

    const header = document.createElement("div");
    header.classList.add("post-card-header");

    if (post.author) {
      const authorContainer = document.createElement("div");
      authorContainer.classList.add("post-card-author");

      if (post.author.avatar?.url) {
        const avatarLink = document.createElement("a");
        avatarLink.href = `../../src/pages/user.html?name=${post.author.name}`;
        avatarLink.setAttribute(
          "aria-label",
          `View ${post.author.name}'s profile`
        );

        const avatar = document.createElement("img");
        avatar.src = post.author.avatar.url;
        avatar.alt = post.author.avatar.alt || `${post.author.name}'s avatar`;
        avatar.classList.add("post-card-avatar");
        avatarLink.appendChild(avatar);

        authorContainer.appendChild(avatarLink);
      }

      const authorName = document.createElement("a");
      authorName.href = `../../src/pages/user.html?name=${post.author.name}`;
      authorName.classList.add("post-card-author-name");
      authorName.textContent = post.author.name;
      authorName.setAttribute(
        "aria-label",
        `View ${post.author.name}'s profile`
      );
      authorContainer.appendChild(authorName);

      header.appendChild(authorContainer);
    }

    const date = document.createElement("time");
    date.classList.add("post-card-date");
    date.setAttribute("datetime", post.created);
    const postDate = new Date(post.created);
    date.textContent = postDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    header.appendChild(date);

    article.appendChild(header);

    if (post.media?.url) {
      const mediaContainer = document.createElement("div");
      mediaContainer.classList.add("post-card-media");

      const img = document.createElement("img");
      img.src = post.media.url;
      img.alt = post.media.alt || post.title;
      img.classList.add("post-card-image");
      mediaContainer.appendChild(img);

      article.appendChild(mediaContainer);
    }

    const content = document.createElement("div");
    content.classList.add("post-card-content");

    const titleContainer = document.createElement("div");
    titleContainer.classList.add("post-card-title-container");

    const title = document.createElement("h1");
    title.classList.add("post-card-title");
    title.textContent = post.title;
    titleContainer.appendChild(title);

    const likeCount = post._count?.reactions || 0;
    const likeBtn = document.createElement("div");
    likeBtn.classList.add("post-card-like-btn");
    likeBtn.setAttribute("aria-label", `${likeCount} likes`);

    const likeCountSpan = document.createElement("span");
    likeCountSpan.classList.add("post-card-like-count");
    likeCountSpan.textContent = likeCount;
    likeBtn.appendChild(likeCountSpan);

    const likeIcon = document.createElement("img");
    likeIcon.src = "../../public/icons/flowbite_heart-outline.svg";
    likeIcon.alt = "Likes";
    likeIcon.classList.add("post-card-like-icon");
    likeBtn.appendChild(likeIcon);

    titleContainer.appendChild(likeBtn);

    const commentCount = post._count?.comments || 0;
    const commentBtn = document.createElement("div");
    commentBtn.classList.add("post-card-comment-btn");
    commentBtn.setAttribute("aria-label", `${commentCount} comments`);

    const commentCountSpan = document.createElement("span");
    commentCountSpan.classList.add("post-card-comment-count");
    commentCountSpan.textContent = commentCount;
    commentBtn.appendChild(commentCountSpan);

    const commentIcon = document.createElement("img");
    commentIcon.src = "../../public/icons/flowbite_annotation-outline.svg";
    commentIcon.alt = "Comments";
    commentIcon.classList.add("post-card-comment-icon");
    commentBtn.appendChild(commentIcon);

    titleContainer.appendChild(commentBtn);

    content.appendChild(titleContainer);

    if (post.body) {
      const body = document.createElement("p");
      body.classList.add("post-card-excerpt");
      body.textContent = post.body;
      content.appendChild(body);
    }

    article.appendChild(content);

    const commentsSection = document.createElement("section");
    commentsSection.classList.add("post-comments");
    commentsSection.setAttribute("aria-label", "Comments");

    const commentsHeader = document.createElement("h2");
    commentsHeader.classList.add("post-comments-header");
    commentsHeader.textContent = `Comments (${commentCount})`;
    commentsSection.appendChild(commentsHeader);

    if (post.comments && post.comments.length > 0) {
      const commentsList = document.createElement("div");
      commentsList.classList.add("post-comments-list");

      post.comments.forEach((comment) => {
        const commentEl = document.createElement("article");
        commentEl.classList.add("post-comment");

        const commentHeader = document.createElement("div");
        commentHeader.classList.add("post-comment-header");

        if (comment.author?.avatar?.url) {
          // If this doesn't work I'll just leave it. I'm DONE googeling this
          const avatarLink = document.createElement("a");
          avatarLink.href = `../../src/pages/user.html?name=${comment.author.name}`;
          avatarLink.setAttribute(
            "aria-label",
            `View ${comment.author.name}'s profile`
          );

          const avatar = document.createElement("img");
          avatar.src = comment.author.avatar.url;
          avatar.alt =
            comment.author.avatar.alt || `${comment.author.name}'s avatar`;
          avatar.classList.add("post-comment-avatar");
          avatarLink.appendChild(avatar);

          commentHeader.appendChild(avatarLink);
        }

        const authorLink = document.createElement("a");
        authorLink.href = `../../src/pages/user.html?name=${comment.author?.name}`;
        authorLink.classList.add("post-comment-author");
        authorLink.textContent = comment.author?.name || "Anonymous";
        authorLink.setAttribute(
          "aria-label",
          `View ${comment.author?.name}'s profile`
        );
        commentHeader.appendChild(authorLink);

        const commentDate = document.createElement("time");
        commentDate.classList.add("post-comment-date");
        commentDate.setAttribute("datetime", comment.created);
        const date = new Date(comment.created);
        commentDate.textContent = date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        commentHeader.appendChild(commentDate);

        commentEl.appendChild(commentHeader);

        const commentBody = document.createElement("p");
        commentBody.classList.add("post-comment-body");
        commentBody.textContent = comment.body;
        commentEl.appendChild(commentBody);

        commentsList.appendChild(commentEl);
      });

      commentsSection.appendChild(commentsList);
    } else {
      const emptyMessage = document.createElement("p");
      emptyMessage.classList.add("post-comments-empty");
      emptyMessage.textContent = "No comments yet";
      commentsSection.appendChild(emptyMessage);
    }

    article.appendChild(commentsSection);

    container.appendChild(article);

    // ----------Show edit/delete buttons only for own posts (THIS I had to get a lot of help with)
    const currentUser = getUserName();
    if (currentUser && post.author?.name === currentUser) {
      const actionsContainer = document.createElement("div");
      actionsContainer.classList.add("post-actions");

      const editButton = document.createElement("a");
      editButton.href = `./editPost.html?id=${post.id}`;
      editButton.classList.add("btn", "btn-secondary");
      editButton.textContent = "Edit Post";
      actionsContainer.appendChild(editButton);

      const deleteButton = document.createElement("button");
      deleteButton.classList.add("btn", "btn-delete");
      deleteButton.textContent = "Delete Post";
      deleteButton.addEventListener("click", async () => {
        const confirmDelete = confirm(
          "Are you sure you want to delete this post? This cannot be undone."
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
  errorDiv.classList.add("post-error");
  errorDiv.textContent = message;
  errorDiv.setAttribute("role", "alert");
  container.appendChild(errorDiv);
}

document.addEventListener("DOMContentLoaded", () => {
  displayPost();
});
