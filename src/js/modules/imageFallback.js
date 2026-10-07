const FALLBACK_MESSAGE = "ᛃ Broken Image Link ᛃ";

/**
 * Replaces failed images with the Mimir logo and a descriptive message.
 * @param {Event} event - The captured image error event
 * @returns {void}
 */
function handleImageError(event) {
  const image = event.target;

  if (!(image instanceof HTMLImageElement) || image.dataset.fallbackHandled) {
    return;
  }

  image.dataset.fallbackHandled = "true";

  const isRootPage = !window.location.pathname.includes("/src/pages/");
  const prefix = isRootPage ? "." : "../..";

  const fallback = document.createElement("div");
  fallback.className =
    "flex h-full min-h-[160px] w-full flex-col items-center justify-center gap-3 bg-[var(--background)] p-6 text-center";

  const logo = document.createElement("img");
  logo.src = `${prefix}/public/icons/mannaz-sign-round-black-outline-icon-WHITE.svg`;
  logo.alt = "Mimir logo";
  logo.className = "h-16 w-16 object-contain";
  logo.dataset.fallbackHandled = "true";

  const message = document.createElement("p");
  message.className = "m-0 text-sm text-[var(--textLight)]";
  message.textContent = FALLBACK_MESSAGE;

  fallback.appendChild(logo);
  fallback.appendChild(message);
  image.replaceWith(fallback);
}

/**
 * Initializes image fallback handling for existing and dynamically created images.
 * @returns {void}
 */
export function initializeImageFallbacks() {
  document.addEventListener("error", handleImageError, true);

  document.querySelectorAll("img").forEach((image) => {
    if (image.complete && image.naturalWidth === 0) {
      handleImageError({ target: image });
    }
  });
}
