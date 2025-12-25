import { commentOnPost } from "../../data/api.js";

let commentInstance = null;

/**
 * Creates and manages the comment overlay
 * @param {Function} onCommentSuccess - Callback function called after successful comment
 * @returns {Object} Controls the comment overlay
 *
 * @description
 * Creates a comment overlay that can be triggered by clicking the comment button.
 * When a comment is posted, it calls the API and then the onCommentSuccess callback.
 */
export function initializeComments(onCommentSuccess) {
  const commentOverlay = document.createElement("div");
  commentOverlay.classList.add("comment-overlay");
  commentOverlay.setAttribute("role", "dialog");
  commentOverlay.setAttribute("aria-label", "Add comment");
  commentOverlay.style.display = "none";

  const commentContainer = document.createElement("div");
  commentContainer.classList.add("comment-container");

  const commentHeader = document.createElement("h2");
  commentHeader.classList.add("comment-header");
  commentHeader.textContent = "Add Comment";
  commentContainer.appendChild(commentHeader);

  const commentTextarea = document.createElement("textarea");
  commentTextarea.classList.add("form-input", "comment-input");
  commentTextarea.placeholder = "Write your comment...";
  commentTextarea.setAttribute("aria-label", "Comment text");
  commentTextarea.rows = 3;
  commentContainer.appendChild(commentTextarea);

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("comment-button-container");

  const commentButton = document.createElement("button");
  commentButton.type = "button";
  commentButton.classList.add("btn", "comment-submit-btn");
  commentButton.setAttribute("aria-label", "Post comment");

  const buttonText = document.createElement("span");
  buttonText.textContent = "Post";
  commentButton.appendChild(buttonText);

  const sendIcon = document.createElement("img");
  sendIcon.src = "../../public/icons/flowbite_arrow-right-alt-outline.svg";
  sendIcon.alt = "";
  sendIcon.classList.add("comment-submit-icon");
  commentButton.appendChild(sendIcon);

  buttonContainer.appendChild(commentButton);
  commentContainer.appendChild(buttonContainer);

  commentOverlay.appendChild(commentContainer);
  document.body.appendChild(commentOverlay);

  let currentPostId = null;

  function openComment(postId) {
    currentPostId = postId;
    commentOverlay.style.display = "flex";
    commentTextarea.focus();
  }

  function closeComment() {
    commentOverlay.style.display = "none";
    commentTextarea.value = "";
    currentPostId = null;
    commentButton.disabled = false;
  }

  async function postComment() {
    const commentText = commentTextarea.value.trim();

    if (!commentText || !currentPostId) {
      return;
    }

    try {
      commentButton.disabled = true;
      buttonText.textContent = "Posting...";

      await commentOnPost(currentPostId, commentText);

      if (onCommentSuccess) {
        onCommentSuccess(currentPostId);
      }

      closeComment();
      buttonText.textContent = "Post";
    } catch (error) {
      console.error("Error posting comment:", error);
      alert("Failed to post comment. Please try again.");
      commentButton.disabled = false;
      buttonText.textContent = "Post";
    }
  }

  commentButton.addEventListener("click", postComment);

  commentButton.addEventListener("mouseenter", () => {
    sendIcon.src = "../../public/icons/flowbite_arrow-right-alt-solid.svg";
  });

  commentButton.addEventListener("mouseleave", () => {
    sendIcon.src = "../../public/icons/flowbite_arrow-right-alt-outline.svg";
  });

  commentTextarea.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
      postComment();
    }
  });

  commentOverlay.addEventListener("click", (event) => {
    if (event.target === commentOverlay) {
      closeComment();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && commentOverlay.style.display === "flex") {
      closeComment();
    }
  });

  commentInstance = {
    open: openComment,
    close: closeComment,
  };

  return commentInstance;
}

/**
 * Opens the comment overlay for a specific post
 * @param {number} postId - The post ID to comment on
 */
export function openComment(postId) {
  if (commentInstance) {
    commentInstance.open(postId);
  }
}
