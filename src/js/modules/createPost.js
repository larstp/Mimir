import {
  followUser,
  unfollowUser,
  reactToPost,
  getUserName,
} from "../../data/api.js";

/**
 * Creates a post card element for display in the feed
 * @param {object} post - The post data from the API
 * @param {array} [followingList] - Array of usernames the current user is following
 * @param {number} post.id - Post ID
 * @param {string} post.title - Post title
 * @param {string} [post.body] - Post body text
 * @param {object} [post.media] - Post media object
 * @param {object} [post.author] - Post author object
 * @param {array} [post.reactions] - Post reactions
 * @param {string} post.created - Post creation date
 * @returns {HTMLElement} The post card element
 *
 * @description
 * Creates a clickable post card with:
 * - Featured image (if available)
 * - Post title
 * - Post text
 * - Author info with avatar
 * - Follow/unfollow button
 * - Like button
 * - Post date
 * - Links to full post view
 *
 * @example
 * const postElement = createPost(postData);
 * container.appendChild(postElement);
 */
export function createPost(post, followingList = []) {
  try {
    // ----------------------------------Figure out if we're on a root page or nested page (for correct paths)
    const isRootPage = !window.location.pathname.includes("/src/pages/");
    const prefix = isRootPage ? "." : "../..";
    const currentUser = getUserName();

    const article = document.createElement("article");
    article.classList.add("post-card");
    article.setAttribute("data-post-id", post.id);

    const header = document.createElement("div");
    header.classList.add("post-card-header");

    if (post.author) {
      const authorContainer = document.createElement("div");
      authorContainer.classList.add("post-card-author");

      if (post.author.avatar?.url) {
        const avatarLink = document.createElement("a");
        avatarLink.href = `${prefix}/src/pages/user.html?name=${post.author.name}`;
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
      authorName.href = `${prefix}/src/pages/user.html?name=${post.author.name}`; // 50% of the time this works 30% of the time
      authorName.classList.add("post-card-author-name");
      authorName.textContent = post.author.name;
      authorName.setAttribute(
        "aria-label",
        `View ${post.author.name}'s profile`
      );
      authorContainer.appendChild(authorName);

      if (currentUser && post.author.name !== currentUser) {
        const isFollowing = followingList.includes(post.author.name);

        const followBtn = document.createElement("button");
        followBtn.classList.add("post-card-follow-btn");
        followBtn.setAttribute("data-username", post.author.name);
        followBtn.setAttribute(
          "data-following",
          isFollowing ? "true" : "false"
        );
        followBtn.setAttribute(
          "aria-label",
          isFollowing ? "Unfollow user" : "Follow user"
        );

        const followIcon = document.createElement("img");
        followIcon.src = isFollowing
          ? `${prefix}/public/icons/flowbite_check-circle-solid.svg`
          : `${prefix}/public/icons/flowbite_circle-plus-solid.svg`;
        followIcon.alt = isFollowing ? "Following" : "Follow";
        followIcon.classList.add("post-card-follow-icon");
        followBtn.appendChild(followIcon);

        followBtn.addEventListener("click", async (event) => {
          event.stopPropagation();
          const btn = event.currentTarget;
          const username = btn.getAttribute("data-username");
          const isCurrentlyFollowing =
            btn.getAttribute("data-following") === "true";

          const updateAllFollowButtons = (following) => {
            const allButtons = document.querySelectorAll(
              `.post-card-follow-btn[data-username="${username}"]`
            );
            allButtons.forEach((button) => {
              const icon = button.querySelector(".post-card-follow-icon");
              if (following) {
                icon.src = `${prefix}/public/icons/flowbite_check-circle-solid.svg`;
                icon.alt = "Following";
                button.setAttribute("data-following", "true");
                button.setAttribute("aria-label", "Unfollow user");
              } else {
                icon.src = `${prefix}/public/icons/flowbite_circle-plus-solid.svg`;
                icon.alt = "Follow";
                button.setAttribute("data-following", "false");
                button.setAttribute("aria-label", "Follow user");
              }
            });
          };

          try {
            if (isCurrentlyFollowing) {
              await unfollowUser(username);
              updateAllFollowButtons(false);
            } else {
              await followUser(username);
              updateAllFollowButtons(true);
            }
          } catch (error) {
            if (error.message.includes("already following")) {
              updateAllFollowButtons(true);
            } else if (error.message.includes("not following")) {
              updateAllFollowButtons(false);
            } else {
              console.error("Error toggling follow:", error);
            }
          }
        });

        authorContainer.appendChild(followBtn);
      }

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

    const postLink = document.createElement("a");
    postLink.href = `${prefix}/src/pages/post.html?id=${post.id}`;
    postLink.classList.add("post-card-link");
    postLink.setAttribute("aria-label", `Read post: ${post.title}`);

    if (post.media?.url) {
      const mediaContainer = document.createElement("div");
      mediaContainer.classList.add("post-card-media");

      const img = document.createElement("img");
      img.src = post.media.url;
      img.alt = post.media.alt || post.title;
      img.classList.add("post-card-image");
      img.loading = "lazy"; // ------Lazy load images for performance (test if there's actually a boost)

      mediaContainer.appendChild(img);
      postLink.appendChild(mediaContainer);
    }

    const content = document.createElement("div");
    content.classList.add("post-card-content");

    const titleContainer = document.createElement("div");
    titleContainer.classList.add("post-card-title-container");

    const title = document.createElement("h2");
    title.classList.add("post-card-title");
    title.textContent = post.title;
    titleContainer.appendChild(title);

    if (currentUser) {
      const thumbsReaction = post.reactions?.find((r) => r.symbol === "👍");
      const hasLiked = thumbsReaction?.reactors?.includes(currentUser) || false;
      const likeCount = thumbsReaction?.count || 0;

      // Again, lots of help with CoPilot in understanding this whole function. Not sure I completely do tbh., but now the like function seems to work (also baie dankie to mr Krüger).

      const likeBtn = document.createElement("button");
      likeBtn.classList.add("post-card-like-btn");
      likeBtn.setAttribute(
        "aria-label",
        hasLiked ? "Unlike post" : "Like post"
      );
      likeBtn.setAttribute("data-post-id", post.id);
      likeBtn.setAttribute("data-liked", hasLiked);

      const likeIcon = document.createElement("img");
      likeIcon.src = hasLiked
        ? `${prefix}/public/icons/flowbite_heart-solid.svg`
        : `${prefix}/public/icons/flowbite_heart-outline.svg`;
      likeIcon.alt = hasLiked ? "Liked" : "Like";
      likeIcon.classList.add("post-card-like-icon");

      const likeCountSpan = document.createElement("span");
      likeCountSpan.classList.add("post-card-like-count");
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
            likeIcon.src = `${prefix}/public/icons/flowbite_heart-outline.svg`;
            likeIcon.alt = "Like";
            btn.setAttribute("data-liked", "false");
            btn.setAttribute("aria-label", "Like post");
          } else {
            likeIcon.src = `${prefix}/public/icons/flowbite_heart-solid.svg`;
            likeIcon.alt = "Liked";
            btn.setAttribute("data-liked", "true");
            btn.setAttribute("aria-label", "Unlike post");
          }

          const countSpan = btn.querySelector(".post-card-like-count");
          const currentCount = parseInt(countSpan?.textContent || 0);
          const newCount = isLiked ? currentCount - 1 : currentCount + 1;

          if (newCount > 0) {
            if (countSpan) {
              countSpan.textContent = newCount;
            } else {
              const newCountSpan = document.createElement("span");
              newCountSpan.classList.add("post-card-like-count");
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
    }

    const commentCount = post._count?.comments || 0;
    const commentBtn = document.createElement("button");
    commentBtn.classList.add("post-card-comment-btn");
    commentBtn.setAttribute("aria-label", `View ${commentCount} comments`);

    const commentCountSpan = document.createElement("span");
    commentCountSpan.classList.add("post-card-comment-count");
    commentCountSpan.textContent = commentCount;
    commentBtn.appendChild(commentCountSpan);

    const commentIcon = document.createElement("img");
    commentIcon.src = `${prefix}/public/icons/flowbite_annotation-outline.svg`;
    commentIcon.alt = "Comments";
    commentIcon.classList.add("post-card-comment-icon");
    commentBtn.appendChild(commentIcon);

    titleContainer.appendChild(commentBtn);

    content.appendChild(titleContainer);

    if (post.body) {
      const excerpt = document.createElement("p");
      excerpt.classList.add("post-card-excerpt");
      // ------------------------------------------Limit excerpt to 150 characters so I can make the CSS not look ugly
      const truncatedBody =
        post.body.length > 150
          ? post.body.substring(0, 150) + "..."
          : post.body;
      excerpt.textContent = truncatedBody;
      content.appendChild(excerpt);
    }

    postLink.appendChild(content);
    article.appendChild(postLink);

    if (post.comments && post.comments.length > 0) {
      const latestComment = post.comments[post.comments.length - 1];

      const commentPreview = document.createElement("div");
      commentPreview.classList.add("post-card-comment-preview");

      const commentHeader = document.createElement("div");
      commentHeader.classList.add("post-card-comment-header");

      if (latestComment.author?.avatar?.url) {
        const commentAvatar = document.createElement("img");
        commentAvatar.src = latestComment.author.avatar.url;
        commentAvatar.alt =
          latestComment.author.avatar.alt ||
          `${latestComment.author.name}'s avatar`;
        commentAvatar.classList.add("post-card-comment-avatar");
        commentHeader.appendChild(commentAvatar);
      }

      const commentAuthor = document.createElement("span");
      commentAuthor.classList.add("post-card-comment-author");
      commentAuthor.textContent = latestComment.author?.name || "Anonymous";
      commentHeader.appendChild(commentAuthor);

      commentPreview.appendChild(commentHeader);

      const commentText = document.createElement("p");
      commentText.classList.add("post-card-comment-text");
      const truncatedComment =
        latestComment.body.length > 100
          ? latestComment.body.substring(0, 100) + "..."
          : latestComment.body;
      commentText.textContent = truncatedComment;
      commentPreview.appendChild(commentText);

      article.appendChild(commentPreview);
    }

    return article;
  } catch (error) {
    console.error("Error creating post:", error);
    const errorDiv = document.createElement("div");
    errorDiv.classList.add("post-card-error");
    errorDiv.textContent = "Unable to load post";
    return errorDiv;
  }
}
