/**
 * Creates a loading spinner with optional text
 * @param {string} [text="Loading..."] - Text to display below the spinner
 * @returns {HTMLElement} The loader container element
 *
 * @description
 * Creates an animated loading spinner with three dots
 *
 * @example
 * const loader = createLoader("Loading posts...");
 * container.appendChild(loader);
 * This loader is borrowed from https://loading.io/css/ and adapted for this project. It's such a
 * great website for loading animations! (see /docs/documentation.md)
 */
export function createLoader(text = "Loading...") {
  const loaderContainer = document.createElement("div");
  loaderContainer.className = "flex flex-col items-center justify-center py-12";

  const loadingAnimation = document.createElement("div");
  loadingAnimation.className = "lds-ellipsis";
  for (let i = 0; i < 4; i++) {
    const dot = document.createElement("div");
    loadingAnimation.appendChild(dot);
  }

  loaderContainer.appendChild(loadingAnimation);

  if (text) {
    const loadingText = document.createElement("p");
    loadingText.className = "text-[var(--text)] mt-4 text-center";
    loadingText.textContent = text;
    loaderContainer.appendChild(loadingText);
  }

  return loaderContainer;
}
