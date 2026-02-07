import "./loadingState.css";

class LoadingStateManager {
    constructor() {
        this.overlayElement = null;
        this.createOverlay();
    }

    createOverlay() {
        this.overlayElement = document.createElement('div');
        this.overlayElement.className = 'loading-overlay';
        this.overlayElement.innerHTML = '<div class="loading-spinner"></div>';
        document.body.appendChild(this.overlayElement);
    }

    showLoading() {
        this.overlayElement.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    hideLoading() {
        this.overlayElement.classList.remove('show');
        document.body.style.overflow = '';
    }
}

const loadingStateManager = new LoadingStateManager();

export { loadingStateManager };