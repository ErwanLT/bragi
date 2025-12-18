/**
 * Sets up F12 and DevTools protection.
 * @param {string} redirectUrl - The URL to redirect to when DevTools use is detected.
 */
window.setupF12Protection = function (redirectUrl) {
    document.addEventListener('keydown', function (event) {
        if (event.key === 'F12' || event.keyCode === 123 ||
            (event.ctrlKey && event.shiftKey && ['I', 'J', 'C'].includes(event.key)) ||
            (event.metaKey && event.altKey && ['I', 'J', 'C'].includes(event.key))) {
            event.preventDefault();
            window.location.href = redirectUrl;
        }
    });

    // Disable right-click and redirect
    document.addEventListener('contextmenu', function (event) {
        event.preventDefault();
        window.location.href = redirectUrl;
    });

    // Detect if DevTools is open by checking execution time around a debugger statement
    setInterval(function () {
        const start = performance.now();
        debugger;
        const end = performance.now();
        if (end - start > 100) {
            window.location.href = redirectUrl;
        }
    }, 1000);
};

/**
 * Bragi Storage Utility
 * Manages game progress and achievements using localStorage.
 */
const STORAGE_KEY = 'bragi_progress';

window.BragiStorage = {
    /**
     * Mark a story as completed.
     * @param {string} storyId - Unique identifier for the story (e.g., 'labyrinth').
     */
    markAsFinished: function (storyId) {
        const progress = this.getProgress();
        if (!progress.completedStories.includes(storyId)) {
            progress.completedStories.push(storyId);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
            console.log(`Story "${storyId}" marked as completed.`);
        }
    },

    /**
     * Check if a story is completed.
     * @param {string} storyId 
     * @returns {boolean}
     */
    isCompleted: function (storyId) {
        const progress = this.getProgress();
        return progress.completedStories.includes(storyId);
    },

    /**
     * Get the full progress object.
     * @returns {Object}
     */
    getProgress: function () {
        const data = localStorage.getItem(STORAGE_KEY);
        if (data) {
            try {
                return JSON.parse(data);
            } catch (e) {
                console.error("Error parsing Bragi progress, resetting.", e);
            }
        }
        return { completedStories: [] };
    },

    /**
     * Reset all progress (for debugging).
     */
    resetProgress: function () {
        localStorage.removeItem(STORAGE_KEY);
        console.log("Bragi progress reset.");
    }
};
