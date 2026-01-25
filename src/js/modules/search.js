let searchInstance = null;

/**
 * Creates and manages the search bar
 * @param {Function} onSearch - Callback function that receives the search query
 * @returns {Object} Controls the search bar
 *
 * @description
 * Creates a search bar overlay that can be triggered by clicking the search icon.
 * When a search is performed, it should call the onSearch callback with the query.
 * Clicking outside closes the search bar.
 */
export function initializeSearch(onSearch) {
  const searchOverlay = document.createElement("div");
  searchOverlay.className =
    "fixed top-0 left-0 w-full bg-[var(--background)] shadow-md z-40 py-4";
  searchOverlay.setAttribute("role", "dialog");
  searchOverlay.setAttribute("aria-label", "Search posts");
  searchOverlay.style.display = "none";

  const searchContainer = document.createElement("div");
  searchContainer.className = "flex gap-2 max-w-[600px] mx-auto px-4";

  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.className =
    "flex-1 p-4 bg-white/25 border border-white/10 rounded-[10px] text-[var(--text)] text-base transition-all duration-300 placeholder:text-[var(--textLight)] placeholder:opacity-50 focus:outline-none focus:border-[var(--primary)] focus:bg-white/[0.08]";
  searchInput.placeholder = "Search ...";
  searchInput.setAttribute("aria-label", "Search query");

  const searchButton = document.createElement("button");
  searchButton.type = "button";
  searchButton.className =
    "p-4 bg-[var(--primary)] text-[var(--text)] border-none rounded-[10px] text-base font-semibold cursor-pointer transition-all duration-300 hover:bg-[var(--primaryHover)] hover:-translate-y-0.5 active:translate-y-0";
  searchButton.setAttribute("aria-label", "Search");
  searchButton.textContent = "Search";

  searchContainer.appendChild(searchInput);
  searchContainer.appendChild(searchButton);
  searchOverlay.appendChild(searchContainer);

  document.body.appendChild(searchOverlay);

  function openSearch() {
    searchOverlay.style.display = "flex";
    searchInput.focus();
  }

  function closeSearch() {
    searchOverlay.style.display = "none";
    searchInput.value = "";
  }

  function performSearch() {
    const query = searchInput.value.trim();

    if (query && onSearch) {
      onSearch(query);
      closeSearch();
    }
  }

  searchButton.addEventListener("click", performSearch);

  searchInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      performSearch();
    }
  });

  searchOverlay.addEventListener("click", (event) => {
    if (event.target === searchOverlay) {
      closeSearch();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && searchOverlay.style.display === "flex") {
      closeSearch();
    }
  }); // To whomever reads this; Found somewhere on StackOverflow that said this was good to have for usability so I thought I'd try it. Then I found this article from CSS-Tricks-com talking about it. Is this a normal thing to incorporate?
  // https://css-tricks.com/snippets/javascript/javascript-keycodes/

  searchInstance = {
    open: openSearch,
    close: closeSearch,
  };

  return searchInstance;
}

/**
 * Opens the search overlay
 * Must call initializeSearch first. Can't make this function work otherwise.
 */
export function openSearch() {
  if (searchInstance) {
    searchInstance.open();
  }
}
