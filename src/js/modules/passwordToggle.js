/**
 * Adds an accessible show/hide toggle to a password input.
 * @param {HTMLInputElement} input - The password input to control
 * @returns {HTMLDivElement} A wrapper containing the input and toggle button
 */
export function createPasswordToggle(input) {
  const wrapper = document.createElement("div");
  wrapper.className = "relative w-full";

  const toggleButton = document.createElement("button");
  toggleButton.type = "button";
  toggleButton.className =
    "absolute right-3 top-1/2 -translate-y-1/2 p-2 text-sm font-semibold text-[var(--text)] hover:text-[var(--primaryHover)]";
  toggleButton.textContent = "Show";
  toggleButton.setAttribute("aria-label", "Show password");

  toggleButton.addEventListener("click", () => {
    const isPassword = input.type === "password";
    input.type = isPassword ? "text" : "password";
    toggleButton.textContent = isPassword ? "Hide" : "Show";
    toggleButton.setAttribute(
      "aria-label",
      isPassword ? "Hide password" : "Show password",
    );
  });

  wrapper.appendChild(input);
  wrapper.appendChild(toggleButton);
  return wrapper;
}
