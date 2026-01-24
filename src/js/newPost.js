import { createPost, isLoggedIn } from "../data/api.js";
import { createLoader } from "./modules/loader.js";

// I had huge problems with this so I had CoPilot help me with implementing a function to check if an image URL is valid.

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
    container.className = "max-w-[600px] my-8 mx-auto px-4 py-0";

    const header = document.createElement("h1");
    header.className =
      "text-3xl font-semibold text-[var(--text)] m-0 mb-8 font-[var(--FontFamily)] text-center";
    header.textContent = "Create New Post";
    container.appendChild(header);

    const form = document.createElement("form");
    form.className = "flex flex-col gap-4";
    form.setAttribute("aria-label", "Create new post form");

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
    titleInput.placeholder = "Enter your post title";
    titleInput.required = true;
    titleInput.minLength = 3;
    titleInput.maxLength = 280;
    titleInput.title = "Post title must be between 3 and 280 characters";
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
    bodyTextarea.placeholder = "Write your post content...";
    bodyTextarea.maxLength = 2000;
    bodyTextarea.title = "Post body can be up to 2000 characters";
    bodyTextarea.setAttribute("aria-label", "Post body");
    bodyTextarea.rows = 6;
    form.appendChild(bodyTextarea);

    const imageUrlLabel = document.createElement("label");
    imageUrlLabel.className =
      "block text-[var(--text)] text-[0.9rem] font-semibold mb-2";
    imageUrlLabel.textContent = "Image URL";
    imageUrlLabel.setAttribute("for", "imageUrl");
    form.appendChild(imageUrlLabel);

    const imageUrlInput = document.createElement("input");
    imageUrlInput.type = "url";
    imageUrlInput.id = "imageUrl";
    imageUrlInput.name = "imageUrl";
    imageUrlInput.className =
      "w-full p-4 bg-white/25 border border-white/10 rounded-[10px] text-[var(--text)] text-base transition-all duration-300 placeholder:text-[var(--textLight)] placeholder:opacity-50 focus:outline-none focus:border-[var(--primary)] focus:bg-white/[0.08]";
    imageUrlInput.placeholder = "https://example.com/image.jpg";
    imageUrlInput.required = true;
    imageUrlInput.setAttribute("aria-label", "Image URL");
    form.appendChild(imageUrlInput);

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
    imageAltInput.placeholder = "Describe the image";
    imageAltInput.setAttribute("aria-label", "Image alt text");
    form.appendChild(imageAltInput);

    const buttonsContainer = document.createElement("div");
    buttonsContainer.className = "flex gap-4 mt-4";

    const cancelButton = document.createElement("a");
    cancelButton.href = "../../index.html";
    cancelButton.className =
      "flex-1 p-4 bg-[var(--surface-elevated)] text-[var(--text)] border border-white/10 rounded-[10px] text-base font-semibold cursor-pointer transition-all duration-300 inline-block text-center no-underline hover:bg-[var(--cardBackground)] hover:-translate-y-0.5 active:translate-y-0";
    cancelButton.textContent = "Cancel";
    buttonsContainer.appendChild(cancelButton);

    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.className =
      "flex-1 p-4 bg-[var(--primary)] text-[var(--text)] border-none rounded-[10px] text-base font-semibold cursor-pointer transition-all duration-300 inline-block text-center hover:bg-[var(--primaryHover)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";
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
            "Image URL is not valid or cannot be loaded. Please check the URL and try again.",
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
  error.className = "text-center py-12 px-4 text-[var(--error)]";
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
  error.textContent = message;
  form.insertBefore(error, form.firstChild);
}

displayCreatePostForm();
