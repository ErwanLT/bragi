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
    },

    /**
     * Export progress as a Base64 encoded file.
     */
    exportProgress: function () {
        const progress = this.getProgress();
        const json = JSON.stringify(progress);
        const encoded = btoa(unescape(encodeURIComponent(json))); // Support Unicode

        const blob = new Blob([encoded], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bragi_backup_${new Date().toISOString().split('T')[0]}.brg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    /**
     * Import progress from encoded content.
     * @param {string} encodedContent 
     */
    importProgress: function (encodedContent) {
        try {
            const json = decodeURIComponent(escape(atob(encodedContent)));
            const data = JSON.parse(json);

            // Basic validation
            if (data && Array.isArray(data.completedStories)) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
                return true;
            }
            throw new Error("Invalid structure");
        } catch (e) {
            console.error("Import failed:", e);
            return false;
        }
    }
};
