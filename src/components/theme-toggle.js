export function initializeThemeToggle() {
  const themeToggle = document.querySelector("#theme-toggle");
  const root = document.documentElement;

  // Function to get current theme
  const getCurrentTheme = () => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      return storedTheme;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  // Function to update theme
  const updateTheme = (theme) => {
    root.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  };

  // Handle click events
  themeToggle.addEventListener("click", () => {
    const currentTheme = root.getAttribute("data-theme");

    // Force a theme if none is set
    if (!currentTheme) {
      updateTheme("dark");
      return;
    }

    const newTheme = currentTheme === "dark" ? "light" : "dark";
    updateTheme(newTheme);
  });

  // Initialize theme on page load
  const initialTheme = getCurrentTheme();
  updateTheme(initialTheme);
}
