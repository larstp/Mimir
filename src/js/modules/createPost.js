import {
  followUser,
  unfollowUser,
  reactToPost,
  getUserName,
} from "../../data/api.js";
import { openComment } from "./comments.js";

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
    article.className =
      "bg-[var(--cardBackground)] rounded-[10px] shadow-[0_4px_6px_rgba(0,0,0,0.1)] overflow-hidden hover:shadow-[0_6px_12px_rgba(0,0,0,0.15)] transition-shadow duration-300";
    article.setAttribute("data-post-id", post.id);

    const header = document.createElement("div");
    header.className = "flex justify-between items-center p-4 pb-1";

    if (post.author) {
      const authorContainer = document.createElement("div");
      authorContainer.className = "flex items-center gap-3";

      if (post.author.avatar?.url) {
        const avatarLink = document.createElement("a");
        avatarLink.href = `${prefix}/src/pages/user.html?name=${post.author.name}`;
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
      authorName.href = `${prefix}/src/pages/user.html?name=${post.author.name}`; // 50% of the time this works 30% of the time
      authorName.className =
        "text-[var(--text)] font-semibold no-underline hover:text-[var(--primary)] transition-colors duration-300";
      authorName.textContent = post.author.name;
      authorName.setAttribute(
        "aria-label",
        `View ${post.author.name}'s profile`,
      );
      authorContainer.appendChild(authorName);

      if (currentUser && post.author.name !== currentUser) {
        const isFollowing = followingList.includes(post.author.name);

        const followBtn = document.createElement("button");
        followBtn.className =
          "p-1.5 bg-transparent border-none cursor-pointer transition-all duration-300 hover:bg-white/5 rounded-md";
        followBtn.setAttribute("data-username", post.author.name);
        followBtn.setAttribute(
          "data-following",
          isFollowing ? "true" : "false",
        );
        followBtn.setAttribute(
          "aria-label",
          isFollowing ? "Unfollow user" : "Follow user",
        );

        const followIcon = document.createElement("img");
        followIcon.src = isFollowing
          ? `${prefix}/public/icons/flowbite_check-circle-solid.svg`
          : `${prefix}/public/icons/flowbite_circle-plus-solid.svg`;
        followIcon.alt = isFollowing ? "Following" : "Follow";
        followIcon.className = "w-5 h-5";
        followBtn.appendChild(followIcon);

        followBtn.addEventListener("click", async (event) => {
          event.stopPropagation();
          const btn = event.currentTarget;
          const username = btn.getAttribute("data-username");
          const isCurrentlyFollowing =
            btn.getAttribute("data-following") === "true";

          const updateAllFollowButtons = (following) => {
            const allButtons = document.querySelectorAll(
              `.post-card-follow-btn[data-username="${username}"]`,
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
    date.className = "text-[var(--textLight)] text-sm";
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
    postLink.className = "no-underline block";
    postLink.setAttribute("aria-label", `Read post: ${post.title}`);

    if (post.media?.url) {
      const mediaContainer = document.createElement("div");
      mediaContainer.className = "w-full overflow-hidden";

      const img = document.createElement("img");
      img.src = post.media.url;
      img.alt = post.media.alt || post.title;
      img.className = "w-full h-auto object-cover";
      img.loading = "lazy"; // ------Lazy load images for performance (test if there's actually a boost)

      mediaContainer.appendChild(img);
      postLink.appendChild(mediaContainer);
    }

    const content = document.createElement("div");
    content.className = "p-4 pt-0";

    const titleContainer = document.createElement("div");
    titleContainer.className =
      "flex justify-between items-start gap-4 mb-3 mt-4";

    const title = document.createElement("h2");
    title.className =
      "text-xl font-bold text-[var(--text)] m-0 flex-1 font-[var(--FontFamily)]";
    title.textContent = post.title;
    titleContainer.appendChild(title);

    if (currentUser) {
      const thumbsReaction = post.reactions?.find((r) => r.symbol === "👍");
      const hasLiked = thumbsReaction?.reactors?.includes(currentUser) || false;
      const likeCount = thumbsReaction?.count || 0;

      // Again, lots of help with CoPilot in understanding this whole function. Not sure I completely do tbh., but now the like function seems to work (also baie dankie to mr Krüger).

      const likeBtn = document.createElement("button");
      likeBtn.className =
        "flex items-center gap-2 p-2 bg-transparent border-none cursor-pointer transition-all duration-300 hover:bg-white/5 rounded-md";
      likeBtn.setAttribute(
        "aria-label",
        hasLiked ? "Unlike post" : "Like post",
      );
      likeBtn.setAttribute("data-post-id", post.id);
      likeBtn.setAttribute("data-liked", hasLiked);

      const likeIcon = document.createElement("img");
      likeIcon.src = hasLiked
        ? `${prefix}/public/icons/flowbite_heart-solid.svg`
        : `${prefix}/public/icons/flowbite_heart-outline.svg`;
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
    }

    const commentCount = post._count?.comments || 0;
    const commentBtn = document.createElement("button");
    commentBtn.className =
      "flex items-center gap-2 p-2 bg-transparent border-none cursor-pointer transition-all duration-300 hover:bg-white/5 rounded-md";
    commentBtn.setAttribute("aria-label", `View ${commentCount} comments`);

    const commentCountSpan = document.createElement("span");
    commentCountSpan.className = "text-[var(--text)] font-semibold";
    commentCountSpan.textContent = commentCount;
    commentBtn.appendChild(commentCountSpan);

    const commentIcon = document.createElement("img");
    commentIcon.src = `${prefix}/public/icons/flowbite_annotation-outline.svg`;
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
      const excerpt = document.createElement("p");
      excerpt.className = "text-[var(--text)] leading-relaxed m-0 mt-3";
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
      commentPreview.className =
        "bg-white/5 rounded-lg p-3 mt-3 border border-white/5";

      const commentHeader = document.createElement("div");
      commentHeader.className = "flex items-center gap-2 mb-2";

      if (latestComment.author?.avatar?.url) {
        const commentAvatar = document.createElement("img");
        commentAvatar.src = latestComment.author.avatar.url;
        commentAvatar.alt =
          latestComment.author.avatar.alt ||
          `${latestComment.author.name}'s avatar`;
        commentAvatar.className = "w-6 h-6 rounded-full object-cover";
        commentHeader.appendChild(commentAvatar);
      }

      const commentAuthor = document.createElement("span");
      commentAuthor.className = "text-[var(--text)] font-semibold text-xs";
      commentAuthor.textContent = latestComment.author?.name || "Anonymous";
      commentHeader.appendChild(commentAuthor);

      commentPreview.appendChild(commentHeader);

      const commentText = document.createElement("p");
      commentText.className = "text-[var(--text)] text-sm leading-relaxed m-0";
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
    errorDiv.className = "text-center py-12 px-4 text-[var(--error)]";
    errorDiv.textContent = "Unable to load post";
    return errorDiv;
  }
}
