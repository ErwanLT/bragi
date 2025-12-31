/**
 * ------------------------------------------------------------------
 * BASE DE DONNÉES (SOURCE DE VÉRITÉ)
 * Contient les titres, descriptions et icônes de tous les trophées.
 * ------------------------------------------------------------------
 */
window.BRAGI_DB = {
    stories: [
        { id: 'labyrinth', title: "Lueur dans l'Abîme", desc: "Compléter 'Le Labyrinthe Oublié'", icon: 'brightness_7', genre: 'Horreur' },
        { id: 'manor', title: "Maître du Silence", desc: "Compléter 'Le Manoir du Silence'", icon: 'visibility_off', genre: 'Horreur' },
        { id: 'summer_camp', title: "Dernier Survivant", desc: "Compléter 'Lac Sanglant'", icon: 'nature_people', genre: 'Horreur' },
        { id: 'signal_zero', title: "Éclaireur du Néant", desc: "Compléter 'Signal Zéro'", icon: 'radio', genre: 'Sci-Fi' },
        { id: 'kubrick9', title: "IA Hunter", desc: "Compléter 'Kubrick 9'", icon: 'memory', genre: 'Sci-Fi' },
        { id: 'dernier_souffle', title: "Survivant de l'Arctique", desc: "Compléter 'Dernier Souffle'", icon: 'ac_unit', genre: 'Thriller' },
        { id: 'duel', title: "Fine Gâchette", desc: "Compléter 'Dernier Duel'", icon: 'gps_fixed', genre: 'Western' },
        { id: 'treasure', title: "Légende des Sept Mers", desc: "Compléter 'L'Île Maudite'", icon: 'sailing', genre: 'Aventure' },
        { id: 'jurassic', title: "Dompteur de Géants", desc: "Compléter 'Isla Nublar'", icon: 'pets', genre: 'Aventure' },
        { id: 'quest', title: "Gardien du Code", desc: "Compléter 'Code Ancestral'", icon: 'shield', genre: 'Fantasy' },
        { id: 'prohibition', title: "Incorruptible", desc: "Compléter 'Chicago 1932'", icon: 'policy', genre: 'Polar' }
    ],
    progression: [
        { id: 'collectionneur_debutant', title: "Collectionneur Débutant", desc: "Terminer 3 histoires différentes.", icon: 'collections_bookmark', genre: 'Progression' },
        { id: 'maitre_narrateur', title: "Maître Narrateur", desc: "Terminer 7 récits épiques.", icon: 'auto_stories', genre: 'Progression' },
        { id: 'chasseur_secrets', title: "Chasseur de Secrets", desc: "Découvrir 3 Easter Eggs cachés.", icon: 'search', genre: 'Progression' },
        { id: 'exportateur_prudent', title: "Exportateur Prudent", desc: "Sauvegarder votre progression dans un fichier .brg.", icon: 'cloud_download', genre: 'Progression' },
        { id: 'expert_horreur', title: "Maître de l'Effroi", desc: "Survivre à 3 récits d'horreur différents.", icon: 'skull', genre: 'Progression' },
        { id: 'expert_scifi', title: "Voyageur du Futur", desc: "Compléter 2 récits de Science-Fiction.", icon: 'rocket_launch', genre: 'Progression' }
    ],
    secrets: [
        { id: 'cheater', title: "Hacker de pacotille", desc: "Tenter d'ouvrir la console de développement.", icon: 'terminal', genre: 'Secret' },
        { id: 'konami', title: "L'Héritage de Konami", desc: "Saisir le code ancestral (↑↑↓↓←→←→BA).", icon: 'videogame_asset', genre: 'Secret' },
        { id: 'noctambule', title: "Noctambule", desc: "Lancer une archive entre minuit et 4h du matin.", icon: 'dark_mode', genre: 'Secret' },
        { id: 'rat_bibliotheque', title: "Rat de Bibliothèque", desc: "Passer plus de 2 minutes à explorer les rayons de la bibliothèque.", icon: 'menu_book', genre: 'Secret' },
        { id: 'maitre_espace', title: "Maître de l'Espace", desc: "Perturber la géométrie physique de la fenêtre 10 fois de suite.", icon: 'aspect_ratio', genre: 'Secret' },
        { id: 'apprenti_bragi', title: "L'Apprenti de Bragi", desc: "Lire les chroniques de Bragi jusqu'à la dernière ligne.", icon: 'school', genre: 'Secret' }
    ]
};

/**
 * Récupère les données d'un trophée par son ID (quelle que soit sa catégorie)
 */
window.getTrophyData = function (id) {
    const all = [...window.BRAGI_DB.stories, ...window.BRAGI_DB.progression, ...window.BRAGI_DB.secrets];
    return all.find(t => t.id === id) || { title: "Exploit Inconnu", desc: "???" };
};


/**
 * ------------------------------------------------------------------
 * SYSTÈME DE SAUVEGARDE ET TROPHÉES
 * ------------------------------------------------------------------
 */
const STORAGE_KEY = 'bragi_progress';

window.BragiStorage = {
    _inited: false,

    _init: function () {
        if (this._inited) return;

        // Injection CSS pour les notifications
        // Note: top: 100px pour passer sous le header
        const style = document.createElement('style');
        style.innerHTML = `
            .bragi-notification {
                position: fixed; top: 100px; right: 20px;
                background: rgba(15, 23, 42, 0.95);
                border: 1px solid rgba(251, 191, 36, 0.4);
                border-left: 4px solid #fbbf24;
                color: white; padding: 16px 24px; border-radius: 8px;
                z-index: 10000; display: flex; align-items: center; gap: 16px;
                box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(10px); transform: translateX(120%);
                transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
                font-family: 'Inter', sans-serif;
                max-width: 90vw;
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
     * Marquer une histoire comme terminée
     */
    markAsFinished: function (storyId) {
        this._init();
        const progress = this.getProgress();
        if (!progress.completedStories.includes(storyId)) {
            progress.completedStories.push(storyId);
            this._save(progress);
            this._notify(storyId, "Trophée Débloqué");
            this.checkProgressionTrophies();
        }
    },

    /**
     * Marquer un exploit ou un secret (Optimisé)
     */
    markAchievement: function (achievementId) {
        this._init();
        const progress = this.getProgress();

        if (!progress.achievements.includes(achievementId)) {
            progress.achievements.push(achievementId);
            this._save(progress); // Sauvegarde l'exploit immédiat
            this._notify(achievementId, "Exploit Secret");

            // On demande au cerveau de vérifier si cela débloque autre chose (ex: Chasseur de Secrets)
            this.checkProgressionTrophies();
        }
    },

    /**
     * Cerveau central des trophées de progression.
     * Vérifie TOUS les critères (Histoires et Secrets) en une seule fois.
     */
    checkProgressionTrophies: function () {
        const progress = this.getProgress();
        let hasChanged = false;

        // --- 1. CALCUL GÉNÉRAL (Existant) ---
        const completedCount = progress.completedStories.length;

        if (completedCount >= 3 && !progress.achievements.includes('collectionneur_debutant')) {
            progress.achievements.push('collectionneur_debutant');
            this._notify('collectionneur_debutant', "Progression");
            hasChanged = true;
        }

        if (completedCount >= 7 && !progress.achievements.includes('maitre_narrateur')) {
            progress.achievements.push('maitre_narrateur');
            setTimeout(() => this._notify('maitre_narrateur', "Progression"), 1000);
            hasChanged = true;
        }

        // --- 2. CALCUL PAR GENRE (Nouveau !) ---

        // On récupère toutes les histoires d'Horreur définies dans la DB
        const horrorStories = window.BRAGI_DB.stories.filter(s => s.genre === 'Horreur');

        // On compte combien de ces histoires l'utilisateur a vraiment finies
        // (On croise les IDs des histoires d'horreur avec les IDs complétés par le joueur)
        const horrorCompletedCount = horrorStories.filter(s => progress.completedStories.includes(s.id)).length;

        // Si 3 ou plus, on débloque
        if (horrorCompletedCount >= 3 && !progress.achievements.includes('expert_horreur')) {
            progress.achievements.push('expert_horreur');
            setTimeout(() => this._notify('expert_horreur', "Spécialiste"), 1500);
            hasChanged = true;
        }

        const scifiStories = window.BRAGI_DB.stories.filter(s => s.genre === 'Sci-Fi');
        const scifiCompletedCount = scifiStories.filter(s => progress.completedStories.includes(s.id)).length;

        if (scifiCompletedCount >= 2 && !progress.achievements.includes('expert_scifi')) {
            progress.achievements.push('expert_scifi');
            this._notify('expert_scifi', "Spécialiste");
            hasChanged = true;
        }

        // --- 3. CALCUL DES SECRETS (Existant) ---
        const allSecretIds = window.BRAGI_DB.secrets.map(s => s.id);
        const unlockedSecretsCount = progress.achievements.filter(id => allSecretIds.includes(id)).length;

        if (unlockedSecretsCount >= 3 && !progress.achievements.includes('chasseur_secrets')) {
            progress.achievements.push('chasseur_secrets');
            setTimeout(() => this._notify('chasseur_secrets', "Méta Exploit"), 2000);
            hasChanged = true;
        }

        // --- 4. SAUVEGARDE FINALE ---
        if (hasChanged) {
            this._save(progress);
        }
    },

    hasAchievement: function (achievementId) {
        return this.getProgress().achievements.includes(achievementId);
    },

    getProgress: function () {
        const data = localStorage.getItem(STORAGE_KEY);
        let progress = { completedStories: [], achievements: [] };
        if (data) {
            try {
                progress = { ...progress, ...JSON.parse(data) };
            } catch (e) {
                console.error("Erreur lecture sauvegarde Bragi.", e);
            }
        }
        return progress;
    },

    _save: function (progress) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    },

    resetProgress: function () {
        localStorage.removeItem(STORAGE_KEY);
        console.log("Bragi progress reset.");
        location.reload();
    },

    exportProgress: function () {
        this.markAchievement('exportateur_prudent');
        const progress = this.getProgress();
        const json = JSON.stringify(progress);
        const encoded = btoa(unescape(encodeURIComponent(json)));

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

    importProgress: function (encodedContent) {
        try {
            const json = decodeURIComponent(escape(atob(encodedContent)));
            const data = JSON.parse(json);
            if (data && Array.isArray(data.completedStories)) {
                if (!Array.isArray(data.achievements)) data.achievements = [];
                localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

                // ICI : On vérifie rétroactivement si l'import mérite des trophées
                this.checkProgressionTrophies();

                // On recharge la page pour afficher les changements
                alert("Progression importée avec succès !");
                location.reload();
                return true;
            }
            throw new Error("Structure invalide");
        } catch (e) {
            console.error("Import échoué:", e);
            alert("Fichier de sauvegarde corrompu ou invalide.");
            return false;
        }
    },

    _notify: function (id, label) {
        const trophy = window.getTrophyData(id);
        const title = trophy.title;

        const toast = document.createElement('div');
        toast.className = 'bragi-notification';
        toast.innerHTML = `
            <span class="material-symbols-outlined bragi-notification-icon">${trophy.icon || 'military_tech'}</span>
            <div class="bragi-notification-content">
                <span class="bragi-notification-subtitle">${label}</span>
                <span class="bragi-notification-title">${title}</span>
            </div>
        `;
        document.body.appendChild(toast);

        // Animation
        setTimeout(() => toast.classList.add('visible'), 100);
        setTimeout(() => {
            toast.classList.remove('visible');
            setTimeout(() => toast.remove(), 600);
        }, 5000);
    }
};


/**
 * ------------------------------------------------------------------
 * SÉCURITÉ & ANTI-TRICHE (HARDCORE MODE)
 * ------------------------------------------------------------------
 */
window.setupF12Protection = function (redirectUrl) {

    // Fonction interne pour punir AVANT de rediriger
    // Permet de valider le trophée 'cheater' même si on quitte la page
    function punishCheater() {
        if (window.BragiStorage) {
            // Force l'ajout immédiat (synchrone)
            const progress = BragiStorage.getProgress();
            if (!progress.achievements.includes('cheater')) {
                progress.achievements.push('cheater');
                BragiStorage._save(progress);
            }
        }
        window.location.href = redirectUrl;
    }

    // 1. Détection Clavier (F12, Ctrl+Shift+I, etc.)
    document.addEventListener('keydown', function (event) {
        if (event.key === 'F12' || event.keyCode === 123 ||
            (event.ctrlKey && event.shiftKey && ['I', 'J', 'C'].includes(event.key)) ||
            (event.metaKey && event.altKey && ['I', 'J', 'C'].includes(event.key))) {
            event.preventDefault();
            punishCheater();
        }
    });

    // 2. Détection Clic Droit
    document.addEventListener('contextmenu', function (event) {
        event.preventDefault();
        punishCheater();
    });

    // 3. Détection DevTools Ouvert (Méthode Debugger)
    setInterval(function () {
        const start = performance.now();
        debugger; // <--- Point d'arrêt forcé
        const end = performance.now();
        if (end - start > 100) {
            punishCheater();
        }
    }, 1000);

    // ---------------------------------------------------
    // GESTION DES EASTER EGGS IN-GAME
    // ---------------------------------------------------

    // A. Konami Code
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    document.addEventListener('keydown', function (e) {
        if (e.key === konamiSequence[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiSequence.length) {
                if (window.BragiStorage) BragiStorage.markAchievement('konami');
                konamiIndex = 0;
            }
        } else {
            // Reset intelligent : si la touche pressée est le début de la séquence, on met l'index à 1
            konamiIndex = (e.key === konamiSequence[0]) ? 1 : 0;
        }
    });

    // B. Noctambule (Entre 00h et 04h)
    const hour = new Date().getHours();
    if (hour >= 0 && hour <= 4) {
        if (window.BragiStorage) BragiStorage.markAchievement('noctambule');
    }

    // C. Rat de Bibliothèque (2 min sur stories.html)
    if (window.location.pathname.includes('stories.html')) {
        setTimeout(() => {
            // Vérification double pour être sûr qu'on est toujours sur la page
            if (window.location.pathname.includes('stories.html')) {
                if (window.BragiStorage) BragiStorage.markAchievement('rat_bibliotheque');
            }
        }, 120000);
    }

    // D. Maître de l'Espace (Resize fenêtre)
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

    // E. L'Apprenti de Bragi (Bas de page about.html + 30s)
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
                    }, 30000);
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