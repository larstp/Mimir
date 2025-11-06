import { createPost, isLoggedIn } from "../data/api.js";
import { createLoader } from "./modules/loader.js";

// I had huge problems with this so I had CoPilot help me with implementing a function to check if an image URL is valid

/**
 * Checks if an image URL is valid by trying to load it
 * @param {string} url - The image URL to validate
 * @returns {Promise<boolean>} True if image loads successfully
 */
async function isValidImageUrl(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

/**
 * Displays the create post form
 * @returns {void}
 */
function displayCreatePostForm() {
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

    const container = document.createElement("div");
    container.classList.add("post-page-container");

    const header = document.createElement("h1");
    header.classList.add("create-post-header");
    header.textContent = "Create New Post";
    container.appendChild(header);

    const form = document.createElement("form");
    form.classList.add("create-post-form");
    form.setAttribute("aria-label", "Create new post form");

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
    titleInput.placeholder = "Enter your post title";
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
    bodyTextarea.placeholder = "Write your post content...";
    bodyTextarea.setAttribute("aria-label", "Post body");
    bodyTextarea.rows = 6;
    form.appendChild(bodyTextarea);

    const imageUrlLabel = document.createElement("label");
    imageUrlLabel.classList.add("form-label");
    imageUrlLabel.textContent = "Image URL";
    imageUrlLabel.setAttribute("for", "imageUrl");
    form.appendChild(imageUrlLabel);

    const imageUrlInput = document.createElement("input");
    imageUrlInput.type = "url";
    imageUrlInput.id = "imageUrl";
    imageUrlInput.name = "imageUrl";
    imageUrlInput.classList.add("form-input");
    imageUrlInput.placeholder = "https://example.com/image.jpg";
    imageUrlInput.required = true;
    imageUrlInput.setAttribute("aria-label", "Image URL");
    form.appendChild(imageUrlInput);

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
    imageAltInput.placeholder = "Describe the image";
    imageAltInput.setAttribute("aria-label", "Image alt text");
    form.appendChild(imageAltInput);

    const buttonsContainer = document.createElement("div");
    buttonsContainer.classList.add("create-post-buttons");

    const cancelButton = document.createElement("a");
    cancelButton.href = "../../index.html";
    cancelButton.classList.add("btn", "btn-secondary");
    cancelButton.textContent = "Cancel";
    buttonsContainer.appendChild(cancelButton);

    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.classList.add("btn");
    submitButton.textContent = "Create Post";
    buttonsContainer.appendChild(submitButton);
    // this was absolutely tedious to write correctly. I hope there's a shorter way of doing it

    form.appendChild(buttonsContainer);

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const existingError = form.querySelector(".create-post-error");
      if (existingError) {
        existingError.remove();
      }

      const title = titleInput.value.trim();
      const body = bodyTextarea.value.trim();
      const imageUrl = imageUrlInput.value.trim();
      const imageAlt = imageAltInput.value.trim();

      if (!title) {
        showFormError(form, "Please enter a title");
        return;
      }

      if (!imageUrl) {
        showFormError(form, "Please enter a valid image URL");
        return;
      }

      try {
        const loader = createLoader("Validating image...");
        form.appendChild(loader);
        submitButton.disabled = true;

        const isValidImage = await isValidImageUrl(imageUrl);

        if (!isValidImage) {
          // THIS was the thing I struggled SO much with
          loader.remove();
          submitButton.disabled = false;
          showFormError(
            form,
            "Image URL is not valid or cannot be loaded. Please check the URL and try again."
          );
          return;
        }

        loader.remove();
        const createLoader2 = createLoader("Creating post...");
        form.appendChild(createLoader2);

        const postData = {
          title: title,
          media: {
            url: imageUrl,
            alt: imageAlt || title,
          },
        };

        if (body) {
          postData.body = body;
        }

        await createPost(postData);

        createLoader2.remove();

        window.location.href = "../../index.html";
      } catch (error) {
        console.error("Error creating post:", error);
        const loaders = form.querySelectorAll(".loader-container");
        loaders.forEach((loader) => loader.remove());
        submitButton.disabled = false;
        showFormError(form, "Failed to create post. Please try again.");
      }
    });

    container.appendChild(form);
    main.appendChild(container);
  } catch (error) {
    console.error("Error displaying create post form:", error);
    const main = document.querySelector("main");
    if (main) {
      showError(main, "Failed to load form. Please try again.");
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

displayCreatePostForm();
