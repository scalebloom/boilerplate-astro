// src/components/toast/toast.js
import "./toast.css";

let notificationContainer = null;

// Configuration constants
const NOTIFICATION_DURATION = 4000; // 4 seconds
const ANIMATION_DURATION = 300; // 0.3 seconds

export function initializeNotifications() {
  // Create notification container if it doesn't exist
  if (!notificationContainer) {
    notificationContainer = document.createElement("div");
    notificationContainer.id = "notification-container";
    notificationContainer.className = "notification-container";

    // Add ARIA live region for accessibility
    notificationContainer.setAttribute("aria-live", "polite");
    notificationContainer.setAttribute("aria-label", "Notifications");

    // Ensure document.body exists before appending
    if (document.body) {
      document.body.appendChild(notificationContainer);
    } else {
      console.warn("Cannot initialize notifications: document.body not found");
      return false;
    }
  }

  return true;
}

export function toastSuccess(message) {
  return showNotification(message, "success");
}

export function toastError(message) {
  return showNotification(message, "error");
}

export function toastWarning(message) {
  return showNotification(message, "warning");
}

export function toastInfo(message) {
  return showNotification(message, "info");
}

function showNotification(message, type = "info") {
  // Ensure container exists
  if (!notificationContainer) {
    const initialized = initializeNotifications();
    if (!initialized) {
      console.error("Failed to initialize notifications");
      return null;
    }
  }

  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;

  notification.innerHTML = `
    <span class="notification-message">${message}</span>
    <button class="notification-dismiss" aria-label="Dismiss notification">×</button>
  `;

  // Add to container
  notificationContainer.appendChild(notification);

  // Handle dismiss button
  const dismissBtn = notification.querySelector(".notification-dismiss");
  dismissBtn.addEventListener("click", () => {
    dismissNotification(notification);
  });

  // Animate in
  requestAnimationFrame(() => {
    notification.classList.add("notification-visible");
  });

  // Auto-dismiss after configured duration
  setTimeout(() => {
    dismissNotification(notification);
  }, NOTIFICATION_DURATION);

  return notification;
}

function dismissNotification(notification) {
  if (!notification || !notification.parentNode) return;

  notification.classList.add("notification-dismissing");

  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, ANIMATION_DURATION);
}
