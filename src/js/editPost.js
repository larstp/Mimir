import {
  getPost,
  updatePost,
  deletePost,
  getUserName,
  isLoggedIn,
} from "../data/api.js";
import { createLoader } from "./modules/loader.js";
import { createHeader } from "./modules/header.js";
import { createFooter } from "./modules/footer.js";
import { createNavbar } from "./modules/navbar.js";

// Hey ho this page was basically the create post page with some modifications

/**
 * Displays the edit post form
 * @returns {Promise<void>}
 */
async function displayEditPostForm() {
  try {
    createHeader();
    createFooter();
    createNavbar();

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
    container.classList.add("post-page-container");

    const header = document.createElement("h1");
    header.classList.add("create-post-header");
    header.textContent = "Edit Post";
    container.appendChild(header);

    if (post.media?.url) {
      const imagePreview = document.createElement("div");
      imagePreview.classList.add("edit-post-image-preview");

      const imageLabel = document.createElement("p");
      imageLabel.classList.add("edit-post-image-label");
      imageLabel.textContent = "Current Image:";
      imagePreview.appendChild(imageLabel);

      const img = document.createElement("img");
      img.src = post.media.url;
      img.alt = post.media.alt || post.title;
      img.classList.add("edit-post-image");
      imagePreview.appendChild(img);

      container.appendChild(imagePreview);
    }

    const form = document.createElement("form");
    form.classList.add("create-post-form");
    form.setAttribute("aria-label", "Edit post form");

    const titleLabel = document.createElement("label");
    titleLabel.classList.add("form-label");
    titleLabel.textContent = "Title";
    titleLabel.setAttribute("for", "title");
    form.appendChild(titleLabel);

    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.id = "title";
    titleInput.name = "title";
    titleInput.classList.add("form-input");
    titleInput.value = post.title || "";
    titleInput.required = true;
    titleInput.setAttribute("aria-label", "Post title");
    form.appendChild(titleInput);

    const bodyLabel = document.createElement("label");
    bodyLabel.classList.add("form-label");
    bodyLabel.textContent = "Body (optional)";
    bodyLabel.setAttribute("for", "body");
    form.appendChild(bodyLabel);

    const bodyTextarea = document.createElement("textarea");
    bodyTextarea.id = "body";
    bodyTextarea.name = "body";
    bodyTextarea.classList.add("form-input", "create-post-textarea");
    bodyTextarea.value = post.body || "";
    bodyTextarea.setAttribute("aria-label", "Post body");
    bodyTextarea.rows = 6;
    form.appendChild(bodyTextarea);

    const imageAltLabel = document.createElement("label");
    imageAltLabel.classList.add("form-label");
    imageAltLabel.textContent = "Image Description (optional)";
    imageAltLabel.setAttribute("for", "imageAlt");
    form.appendChild(imageAltLabel);

    const imageAltInput = document.createElement("input");
    imageAltInput.type = "text";
    imageAltInput.id = "imageAlt";
    imageAltInput.name = "imageAlt";
    imageAltInput.classList.add("form-input");
    imageAltInput.value = post.media?.alt || "";
    imageAltInput.setAttribute("aria-label", "Image alt text");
    form.appendChild(imageAltInput);

    const buttonsContainer = document.createElement("div");
    buttonsContainer.classList.add("edit-post-buttons");

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.classList.add("btn", "btn-delete");
    deleteButton.textContent = "Delete Post";
    buttonsContainer.appendChild(deleteButton);

    const cancelButton = document.createElement("a");
    cancelButton.href = `./post.html?id=${postId}`;
    cancelButton.classList.add("btn", "btn-secondary");
    cancelButton.textContent = "Cancel";
    buttonsContainer.appendChild(cancelButton);

    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.classList.add("btn");
    submitButton.textContent = "Save Changes";
    buttonsContainer.appendChild(submitButton);

    form.appendChild(buttonsContainer);

    deleteButton.addEventListener("click", async () => {
      const confirmDelete = confirm(
        "Are you sure you want to delete this post? This cannot be undone."
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

      const existingError = form.querySelector(".create-post-error");
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
  error.classList.add("post-error");
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
  error.classList.add("create-post-error");
  error.setAttribute("role", "alert");
  error.textContent = message;
  form.insertBefore(error, form.firstChild);
}

displayEditPostForm();
