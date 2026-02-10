// Configuration
const CONFIG = {
  scrollOnClick: false, // Set to true to scroll to tabs after clicking
};

export function initTabs() {
  const tabsContainer = document.querySelector("[data-tabs]");
  if (!tabsContainer) return;

  const tabButtons = tabsContainer.querySelectorAll('[role="tab"]');
  const tabPanels = tabsContainer.querySelectorAll('[role="tabpanel"]');

  // Function to activate a specific tab
  function activateTab(index) {
    if (index < 0 || index >= tabButtons.length) return;

    // Deactivate all tabs
    tabButtons.forEach((btn) => {
      btn.setAttribute("aria-selected", "false");
    });

    // Hide all panels
    tabPanels.forEach((panel) => {
      panel.setAttribute("hidden", "");
    });

    // Activate selected tab
    tabButtons[index].setAttribute("aria-selected", "true");

    // Show corresponding panel
    const panelId = tabButtons[index].getAttribute("aria-controls");
    const panel = document.getElementById(panelId);
    if (panel) {
      panel.removeAttribute("hidden");
    }
  }

  // Handle hash navigation (e.g., from header links)
  function handleHashNavigation() {
    const hash = window.location.hash.slice(1); // Remove the # symbol
    if (!hash) return;

    // Find the tab button with matching data-tab-hash
    const targetButton = Array.from(tabButtons).findIndex(
      (btn) => btn.dataset.tabHash === hash,
    );

    if (targetButton !== -1) {
      activateTab(targetButton);

      // Scroll to the section containing the tabs (if it has an ID)
      // Otherwise fall back to the tabs container itself
      const section = tabsContainer.closest("section[id]");
      const scrollTarget = section || tabsContainer;

      setTimeout(() => {
        scrollTarget.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }

  // Check hash on page load
  handleHashNavigation();

  // Listen for hash changes
  window.addEventListener("hashchange", handleHashNavigation);

  // Tab button click handlers
  tabButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      activateTab(index);

      // Optionally scroll to the tabs container, accounting for header height
      if (CONFIG.scrollOnClick) {
        const yOffset = -110;
        const y =
          tabsContainer.getBoundingClientRect().top +
          window.pageYOffset +
          yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    });

    // Keyboard navigation
    button.addEventListener("keydown", (e) => {
      let newIndex;

      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        newIndex = index + 1 >= tabButtons.length ? 0 : index + 1;
        tabButtons[newIndex].focus();
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        newIndex = index - 1 < 0 ? tabButtons.length - 1 : index - 1;
        tabButtons[newIndex].focus();
      } else if (e.key === "Home") {
        e.preventDefault();
        tabButtons[0].focus();
      } else if (e.key === "End") {
        e.preventDefault();
        tabButtons[tabButtons.length - 1].focus();
      }
    });
  });
}
