import {
  getPost,
  updatePost,
  deletePost,
  getUserName,
  isLoggedIn,
} from "../data/api.js";
import { createLoader } from "./modules/loader.js";

// Hey ho this page was basically the create post page with some modifications

/**
 * Displays the edit post form
 * @returns {Promise<void>}
 */
async function displayEditPostForm() {
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
    });

    loader.remove();

    if (!post) {
      showError(main, "Post not found");
      return;
    }

    const currentUser = getUserName();
    if (post.author?.name !== currentUser) {
      showError(main, "You can only edit your own posts");
      return;
    }

    const container = document.createElement("div");
    container.className = "max-w-[600px] my-8 mx-auto px-4 py-0";

    const header = document.createElement("h1");
    header.className =
      "text-3xl font-semibold text-[var(--text)] m-0 mb-8 font-[var(--FontFamily)] text-center";
    header.textContent = "Edit Post";
    container.appendChild(header);

    if (post.media?.url) {
      const imagePreview = document.createElement("div");
      imagePreview.className = "mb-6";

      const imageLabel = document.createElement("p");
      imageLabel.className = "text-[var(--text)] font-semibold mb-2";
      imageLabel.textContent = "Current Image:";
      imagePreview.appendChild(imageLabel);

      const img = document.createElement("img");
      img.src = post.media.url;
      img.alt = post.media.alt || post.title;
      img.className = "w-full max-w-[400px] rounded-lg border border-white/10";
      imagePreview.appendChild(img);

      container.appendChild(imagePreview);
    }

    const form = document.createElement("form");
    form.className = "flex flex-col gap-4";
    form.setAttribute("aria-label", "Edit post form");

    const titleLabel = document.createElement("label");
    titleLabel.className =
      "block text-[var(--text)] text-[0.9rem] font-semibold mb-2";
    titleLabel.textContent = "Title";
    titleLabel.setAttribute("for", "title");
    form.appendChild(titleLabel);

    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.id = "title";
    titleInput.name = "title";
    titleInput.className =
      "w-full p-4 bg-white/25 border border-white/10 rounded-[10px] text-[var(--text)] text-base transition-all duration-300 placeholder:text-[var(--textLight)] placeholder:opacity-50 focus:outline-none focus:border-[var(--primary)] focus:bg-white/[0.08]";
    titleInput.value = post.title || "";
    titleInput.required = true;
    titleInput.setAttribute("aria-label", "Post title");
    form.appendChild(titleInput);

    const bodyLabel = document.createElement("label");
    bodyLabel.className =
      "block text-[var(--text)] text-[0.9rem] font-semibold mb-2";
    bodyLabel.textContent = "Body (optional)";
    bodyLabel.setAttribute("for", "body");
    form.appendChild(bodyLabel);

    const bodyTextarea = document.createElement("textarea");
    bodyTextarea.id = "body";
    bodyTextarea.name = "body";
    bodyTextarea.className =
      "w-full p-4 bg-white/25 border border-white/10 rounded-[10px] text-[var(--text)] text-base transition-all duration-300 placeholder:text-[var(--textLight)] placeholder:opacity-50 focus:outline-none focus:border-[var(--primary)] focus:bg-white/[0.08] resize-y min-h-[100px] font-[inherit]";
    bodyTextarea.value = post.body || "";
    bodyTextarea.setAttribute("aria-label", "Post body");
    bodyTextarea.rows = 6;
    form.appendChild(bodyTextarea);

    const imageAltLabel = document.createElement("label");
    imageAltLabel.className =
      "block text-[var(--text)] text-[0.9rem] font-semibold mb-2";
    imageAltLabel.textContent = "Image Description (optional)";
    imageAltLabel.setAttribute("for", "imageAlt");
    form.appendChild(imageAltLabel);

    const imageAltInput = document.createElement("input");
    imageAltInput.type = "text";
    imageAltInput.id = "imageAlt";
    imageAltInput.name = "imageAlt";
    imageAltInput.className =
      "w-full p-4 bg-white/25 border border-white/10 rounded-[10px] text-[var(--text)] text-base transition-all duration-300 placeholder:text-[var(--textLight)] placeholder:opacity-50 focus:outline-none focus:border-[var(--primary)] focus:bg-white/[0.08]";
    imageAltInput.value = post.media?.alt || "";
    imageAltInput.setAttribute("aria-label", "Image alt text");
    form.appendChild(imageAltInput);

    const buttonsContainer = document.createElement("div");
    buttonsContainer.className = "flex gap-4 mt-4 flex-wrap";

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className =
      "p-4 bg-[var(--error)] text-[var(--text)] border-none rounded-[10px] text-base font-semibold cursor-pointer transition-all duration-300 inline-block text-center hover:bg-[#dc2626] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";
    deleteButton.textContent = "Delete Post";
    buttonsContainer.appendChild(deleteButton);

    const cancelButton = document.createElement("a");
    cancelButton.href = `./post.html?id=${postId}`;
    cancelButton.className =
      "p-4 bg-[var(--surface-elevated)] text-[var(--text)] border border-white/10 rounded-[10px] text-base font-semibold cursor-pointer transition-all duration-300 inline-block text-center no-underline hover:bg-[var(--cardBackground)] hover:-translate-y-0.5 active:translate-y-0";
    cancelButton.textContent = "Cancel";
    buttonsContainer.appendChild(cancelButton);

    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.className =
      "p-4 bg-[var(--primary)] text-[var(--text)] border-none rounded-[10px] text-base font-semibold cursor-pointer transition-all duration-300 inline-block text-center hover:bg-[var(--primaryHover)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";
    submitButton.textContent = "Save Changes";
    buttonsContainer.appendChild(submitButton);

    form.appendChild(buttonsContainer);

    deleteButton.addEventListener("click", async () => {
      const confirmDelete = confirm(
        "Are you sure you want to delete this post? This cannot be undone.",
      );

      if (!confirmDelete) {
        return;
      }

      try {
        const deleteLoader = createLoader("Deleting post...");
        form.appendChild(deleteLoader);
        deleteButton.disabled = true;
        submitButton.disabled = true;

        await deletePost(postId);

        deleteLoader.remove();
        window.location.href = "../../index.html";
      } catch (error) {
        console.error("Error deleting post:", error);
        const deleteLoader = form.querySelector(".loader-container");
        if (deleteLoader) {
          deleteLoader.remove();
        }
        deleteButton.disabled = false;
        submitButton.disabled = false;
        showFormError(form, "Failed to delete post. Please try again.");
      }
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const existingError = form.querySelector("[data-error='edit-post']");
      if (existingError) {
        existingError.remove();
      }

      const title = titleInput.value.trim();
      const body = bodyTextarea.value.trim();
      const imageAlt = imageAltInput.value.trim();

      if (!title) {
        showFormError(form, "Please enter a title");
        return;
      }

      try {
        const updateLoader = createLoader("Saving changes...");
        form.appendChild(updateLoader);
        submitButton.disabled = true;
        deleteButton.disabled = true;

        const updateData = {
          title: title,
        };

        if (body) {
          updateData.body = body;
        }

        if (post.media?.url) {
          updateData.media = {
            url: post.media.url,
            alt: imageAlt || title,
          };
        }

        await updatePost(postId, updateData);

        updateLoader.remove();
        window.location.href = `./post.html?id=${postId}`;
      } catch (error) {
        console.error("Error updating post:", error);
        const updateLoader = form.querySelector(".loader-container");
        if (updateLoader) {
          updateLoader.remove();
        }
        submitButton.disabled = false;
        deleteButton.disabled = false;
        showFormError(form, "Failed to update post. Please try again.");
      }
    });

    container.appendChild(form);
    main.appendChild(container);
  } catch (error) {
    console.error("Error displaying edit post form:", error);
    const main = document.querySelector("main");
    if (main) {
      showError(main, "Failed to load edit form. Please try again.");
    }
  }
}

/**
 * Shows an error message in the main container
 * @param {HTMLElement} container - The container element
 * @param {string} message - The error message
 */
function showError(container, message) {
  const error = document.createElement("div");
  error.className = "post-error text-center py-12 px-4 text-[var(--error)]";
  error.setAttribute("role", "alert");
  error.textContent = message;
  container.appendChild(error);
}

/**
 * Shows an error message in the form
 * @param {HTMLElement} form - The form element
 * @param {string} message - The error message
 */
function showFormError(form, message) {
  const error = document.createElement("div");
  error.className =
    "bg-[rgba(220,38,38,0.1)] text-[var(--error)] p-4 rounded-lg border border-[var(--error)] mb-4";
  error.setAttribute("role", "alert");
  error.setAttribute("data-error", "edit-post"); // THIS mfer
  error.textContent = message;
  form.insertBefore(error, form.firstChild);
}

displayEditPostForm();
