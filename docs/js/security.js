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

    // Konami Code Detection
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    document.addEventListener('keydown', function (e) {
        if (e.key === konamiSequence[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiSequence.length) {
                if (window.BragiStorage) {
                    BragiStorage.markAchievement('konami');
                }
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });

    // 1. Noctambule (Load between 00:00 and 04:00)
    const hour = new Date().getHours();
    if (hour >= 0 && hour <= 4) {
        if (window.BragiStorage) BragiStorage.markAchievement('noctambule');
    }

    // 2. Rat de Bibliothèque (Stay on stories.html for 2 minutes)
    if (window.location.pathname.includes('stories.html')) {
        setTimeout(() => {
            if (window.location.pathname.includes('stories.html')) {
                if (window.BragiStorage) BragiStorage.markAchievement('rat_bibliotheque');
            }
        }, 120000); // 2 minutes
    }

    // 3. Maître de l'Espace (Resize 10 times in 5 seconds)
    let resizeCount = 0;
    let resizeTimer = null;
    window.addEventListener('resize', () => {
        resizeCount++;
        if (!resizeTimer) {
            resizeTimer = setTimeout(() => {
                if (resizeCount >= 10) {
                    if (window.BragiStorage) BragiStorage.markAchievement('maitre_espace');
                }
                resizeCount = 0;
                resizeTimer = null;
            }, 5000);
        }
    });

    // 4. L'Apprenti de Bragi (Reach bottom of about.html and stay 30s)
    if (window.location.pathname.includes('about.html')) {
        let aboutTimeout = null;
        window.addEventListener('scroll', () => {
            const isAtBottom = (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 50);
            if (isAtBottom) {
                if (!aboutTimeout) {
                    aboutTimeout = setTimeout(() => {
                        const stillAtBottom = (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 50);
                        if (stillAtBottom && window.BragiStorage) {
                            BragiStorage.markAchievement('apprenti_bragi');
                        }
                    }, 30000); // 30 seconds
                }
            } else {
                if (aboutTimeout) {
                    clearTimeout(aboutTimeout);
                    aboutTimeout = null;
                }
            }
        });
    }
};

/**
 * Bragi Storage Utility
 * Manages game progress and achievements using localStorage.
 */
const STORAGE_KEY = 'bragi_progress';

const TROPHY_NAMES = {
    'labyrinth': "Lueur dans l'Abîme",
    'manor': "Maître du Silence",
    'summer_camp': "Dernier Survivant",
    'signal_zero': "Éclaireur du Néant",
    'kubrick9': "IA Hunter",
    'dernier_souffle': "Survivant de l'Arctique",
    'duel': "Fine Gâchette",
    'treasure': "Légende des Sept Mers",
    'jurassic': "Dompteur de Géants",
    'quest': "Gardien du Code",
    'prohibition': "Incorruptible",
    'cheater': "Hacker de pacotille",
    'konami': "L'Héritage de Konami",
    'noctambule': "Noctambule",
    'rat_bibliotheque': "Rat de Bibliothèque",
    'maitre_espace': "Maître de l'Espace",
    'apprenti_bragi': "L'Apprenti de Bragi"
};

window.BragiStorage = {
    _init: function () {
        if (this._inited) return;
        const style = document.createElement('style');
        style.innerHTML = `
            .bragi-notification {
                position: fixed; top: 20px; right: 20px;
                background: rgba(15, 23, 42, 0.95);
                border: 1px solid rgba(251, 191, 36, 0.4);
                border-left: 4px solid #fbbf24;
                color: white; padding: 16px 24px; border-radius: 8px;
                z-index: 10000; display: flex; align-items: center; gap: 16px;
                box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(10px); transform: translateX(120%);
                transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
                font-family: 'Inter', sans-serif;
            }
            .bragi-notification.visible { transform: translateX(0); }
            .bragi-notification-icon { color: #fbbf24; font-variation-settings: 'FILL' 1; }
            .bragi-notification-subtitle { font-size: 9px; text-transform: uppercase; letter-spacing: 0.2em; color: #94a3b8; }
            .bragi-notification-title { font-size: 13px; font-weight: bold; margin-top: 2px; color: white; }
        `;
        document.head.appendChild(style);
        this._inited = true;
    },
    /**
     * Mark a story as completed.
     * @param {string} storyId - Unique identifier for the story (e.g., 'labyrinth').
     */
    markAsFinished: function (storyId) {
        this._init();
        const progress = this.getProgress();
        if (!progress.completedStories.includes(storyId)) {
            progress.completedStories.push(storyId);
            this._save(progress);
            this._notify(storyId, "Trophée Débloqué");
        }
    },

    /**
     * Mark a special achievement.
     * @param {string} achievementId 
     */
    markAchievement: function (achievementId) {
        this._init();
        const progress = this.getProgress();
        if (!progress.achievements.includes(achievementId)) {
            progress.achievements.push(achievementId);
            this._save(progress);
            this._notify(achievementId, "Exploit Secret");
        }
    },

    /**
     * Check if an achievement is unlocked.
     * @param {string} achievementId 
     * @returns {boolean}
     */
    hasAchievement: function (achievementId) {
        const progress = this.getProgress();
        return progress.achievements.includes(achievementId);
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
        let progress = { completedStories: [], achievements: [] };
        if (data) {
            try {
                progress = { ...progress, ...JSON.parse(data) };
            } catch (e) {
                console.error("Error parsing Bragi progress, resetting.", e);
            }
        }
        return progress;
    },

    /**
     * Internal save helper.
     */
    _save: function (progress) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
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
                if (!Array.isArray(data.achievements)) data.achievements = [];
                localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
                return true;
            }
            throw new Error("Invalid structure");
        } catch (e) {
            console.error("Import failed:", e);
            return false;
        }
    },

    /**
     * Internal notification helper.
     */
    _notify: function (id, label) {
        const title = TROPHY_NAMES[id] || "Nouvel Exploit";
        const toast = document.createElement('div');
        toast.className = 'bragi-notification';
        toast.innerHTML = `
            <span class="material-symbols-outlined bragi-notification-icon">military_tech</span>
            <div class="bragi-notification-content">
                <span class="bragi-notification-subtitle">${label}</span>
                <span class="bragi-notification-title">${title}</span>
            </div>
        `;
        document.body.appendChild(toast);

        // Trigger animation
        setTimeout(() => toast.classList.add('visible'), 100);

        // Remove after delay
        setTimeout(() => {
            toast.classList.remove('visible');
            setTimeout(() => toast.remove(), 600);
        }, 5000);
    }
};
