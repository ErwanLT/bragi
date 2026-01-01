/**
 * ==================================================================
 * BRAGI SECURITY & ACHIEVEMENTS SYSTEM
 * Version: 2.0 (Unified Genre Mastery)
 * ==================================================================
 */

/**
 * ------------------------------------------------------------------
 * 1. BASE DE DONNÉES (SOURCE DE VÉRITÉ)
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
        { id: 'le_mystere_du_reveillon', title: "Nouvel an sous tension", desc: "Compléter 'Le mystère du nouvel an'", icon: 'calendar_month', genre: 'Thriller'},
        { id: 'duel', title: "Fine Gâchette", desc: "Compléter 'Dernier Duel'", icon: 'gps_fixed', genre: 'Western' },
        { id: 'treasure', title: "Légende des Sept Mers", desc: "Compléter 'L'Île Maudite'", icon: 'sailing', genre: 'Aventure' },
        { id: 'jurassic', title: "Dompteur de Géants", desc: "Compléter 'Isla Nublar'", icon: 'pets', genre: 'Aventure' },
        { id: 'quest', title: "Gardien du Code", desc: "Compléter 'Code Ancestral'", icon: 'shield', genre: 'Fantasy' },
        { id: 'prohibition', title: "Incorruptible", desc: "Compléter 'Chicago 1932'", icon: 'policy', genre: 'Polar' }
    ],
    progression: [
        // --- GÉNÉRAL ---
        { id: 'collectionneur_debutant', title: "Collectionneur Débutant", desc: "Terminer 3 histoires différentes.", icon: 'collections_bookmark', genre: 'Progression' },
        { id: 'maitre_narrateur', title: "Maître Narrateur", desc: "Terminer 7 récits épiques.", icon: 'auto_stories', genre: 'Progression' },
        { id: 'chasseur_secrets', title: "Chasseur de Secrets", desc: "Découvrir 3 Easter Eggs cachés.", icon: 'search', genre: 'Progression' },
        { id: 'exportateur_prudent', title: "Exportateur Prudent", desc: "Sauvegarder votre progression dans un fichier .brg.", icon: 'cloud_download', genre: 'Progression' },
        // --- HORREUR (3, 6, 10) ---
        { id: 'initie_horreur', title: "Initié de l'Horreur", desc: "Survivre à 3 récits d'horreur.", icon: 'skull', genre: 'Progression' },
        { id: 'traqueur_ombres', title: "Traqueur d'Ombres", desc: "Survivre à 6 cauchemars différents.", icon: 'visibility', genre: 'Progression' },
        { id: 'maitre_effroi', title: "Maître de l'Effroi", desc: "Survivre à 10 récits d'horreur.", icon: 'sentiment_very_dissatisfied', genre: 'Progression' },
        // --- SCIENCE-FICTION (2, 6, 10) ---
        { id: 'cadet_scifi', title: "Cadet de l'Espace", desc: "Compléter 2 récits de Sci-Fi.", icon: 'rocket_launch', genre: 'Progression' },
        { id: 'explorateur_galactique', title: "Explorateur Galactique", desc: "Voyager à travers 6 mondes futuristes.", icon: 'public', genre: 'Progression' },
        { id: 'amiral_cosmos', title: "Amiral du Cosmos", desc: "Maîtriser l'espace-temps dans 10 épopées.", icon: 'auto_awesome', genre: 'Progression' },
        // --- THRILLER (3, 6, 10) ---
        { id: 'nerfs_acier', title: "Nerfs d'Acier", desc: "Garder son sang-froid dans 3 thrillers.", icon: 'psychology', genre: 'Progression' },
        { id: 'expert_tension', title: "Expert en Tension", desc: "Survivre au suspense de 6 thrillers.", icon: 'hotel_class', genre: 'Progression' },
        { id: 'maitre_suspense', title: "Maître du Suspense", desc: "Terminer 10 thrillers haletants.", icon: 'hourglass_bottom', genre: 'Progression' },
        // --- WESTERN (3, 6, 10) ---
        { id: 'pied_tendre', title: "Pied-Tendre", desc: "Chevaucher à travers 3 westerns.", icon: 'bedroom_baby', genre: 'Progression' },
        { id: 'gachette_rapide', title: "Gâchette Rapide", desc: "Faire la loi dans 6 récits de l'Ouest.", icon: 'stars', genre: 'Progression' },
        { id: 'legende_ouest', title: "Légende de l'Ouest", desc: "Devenir un mythe dans 10 westerns.", icon: 'wb_sunny', genre: 'Progression' },
        // --- AVENTURE (3, 6, 10) ---
        { id: 'voyageur_intrepide', title: "Voyageur Intrépide", desc: "Vivre 3 grandes aventures.", icon: 'hiking', genre: 'Progression' },
        { id: 'chasseur_reliques', title: "Chasseur de Reliques", desc: "Découvrir les trésors de 6 aventures.", icon: 'diamond', genre: 'Progression' },
        { id: 'roi_exploration', title: "Roi de l'Exploration", desc: "Cartographier 10 mondes perdus.", icon: 'map', genre: 'Progression' },
        // --- FANTASY (3, 6, 10) ---
        { id: 'ecuyer_heroique', title: "Écuyer Héroïque", desc: "Accomplir 3 quêtes fantastiques.", icon: 'shield', genre: 'Progression' },
        { id: 'chevalier_royaume', title: "Chevalier du Royaume", desc: "Triompher de 6 épopées magiques.", icon: 'castle', genre: 'Progression' },
        { id: 'gardien_mondes', title: "Gardien des Mondes", desc: "Sauver 10 univers fantastiques.", icon: 'auto_fix_high', genre: 'Progression' },
        // --- POLAR (3, 6, 10) ---
        { id: 'detective_prive', title: "Détective Privé", desc: "Résoudre 3 enquêtes criminelles.", icon: 'fingerprint', genre: 'Progression' },
        { id: 'inspecteur_chef', title: "Inspecteur Chef", desc: "Mettre 6 criminels sous les verrous.", icon: 'local_police', genre: 'Progression' },
        { id: 'grand_commissaire', title: "Grand Commissaire", desc: "Élucider 10 affaires impossibles.", icon: 'balance', genre: 'Progression' }
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
 * 2. SYSTÈME DE SAUVEGARDE ET LOGIQUE DES TROPHÉES
 * ------------------------------------------------------------------
 */
const STORAGE_KEY = 'bragi_progress';

window.BragiStorage = {
    _inited: false,

    _init: function () {
        if (this._inited) return;

        // Injection CSS pour les notifications
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
     * Marquer un exploit ou un secret
     */
    markAchievement: function (achievementId) {
        this._init();
        const progress = this.getProgress();

        if (!progress.achievements.includes(achievementId)) {
            progress.achievements.push(achievementId);
            this._save(progress);
            this._notify(achievementId, "Exploit Secret");
            // Vérification si cela débloque "Chasseur de Secrets"
            this.checkProgressionTrophies();
        }
    },

    /**
     * CERVEAU CENTRAL DES TROPHÉES DE PROGRESSION
     * Orchestre l'appel aux sous-fonctions.
     */
    checkProgressionTrophies: function () {
        const progress = this.getProgress();
        let hasChanged = false;

        // 1. Calcul global (Nombre total d'histoires)
        if (this._computeGlobalSuccess(progress)) hasChanged = true;

        // 2. Calcul des Genres (Méthode Unifiée)
        if (this._computeGenreMastery(progress)) hasChanged = true;

        // 3. Calcul des Secrets
        if (this._computeSecretsSuccess(progress)) hasChanged = true;

        if (hasChanged) {
            this._save(progress);
        }
    },

    /**
     * Calcul de l'avancement global (Histoires terminées)
     */
    _computeGlobalSuccess: function (progress) {
        const completedCount = progress.completedStories.length;
        let changed = false;

        if (completedCount >= 3 && !progress.achievements.includes('collectionneur_debutant')) {
            progress.achievements.push('collectionneur_debutant');
            this._notify('collectionneur_debutant', "Progression");
            changed = true;
        }

        if (completedCount >= 7 && !progress.achievements.includes('maitre_narrateur')) {
            progress.achievements.push('maitre_narrateur');
            setTimeout(() => this._notify('maitre_narrateur', "Progression"), 1000);
            changed = true;
        }

        return changed;
    },

    /**
     * CALCUL DE LA MAÎTRISE DES GENRES (Moteur Unifié)
     * Gère automatiquement tous les paliers pour tous les genres.
     */
    _computeGenreMastery: function (progress) {
        let changed = false;

        // CONFIGURATION DES PALIERS PAR GENRE
        const GENRE_RULES = [
            {
                genre: 'Horreur',
                tiers: [
                    { count: 3, id: 'initie_horreur' },
                    { count: 6, id: 'traqueur_ombres' },
                    { count: 10, id: 'maitre_effroi' }
                ]
            },
            {
                genre: 'Sci-Fi',
                tiers: [
                    { count: 2, id: 'cadet_scifi' }, // Seuil bas spécifique pour Sci-Fi
                    { count: 6, id: 'explorateur_galactique' },
                    { count: 10, id: 'amiral_cosmos' }
                ]
            },
            {
                genre: 'Thriller',
                tiers: [
                    { count: 3, id: 'nerfs_acier' },
                    { count: 6, id: 'expert_tension' },
                    { count: 10, id: 'maitre_suspense' }
                ]
            },
            {
                genre: 'Western',
                tiers: [
                    { count: 3, id: 'pied_tendre' },
                    { count: 6, id: 'gachette_rapide' },
                    { count: 10, id: 'legende_ouest' }
                ]
            },
            {
                genre: 'Aventure',
                tiers: [
                    { count: 3, id: 'voyageur_intrepide' },
                    { count: 6, id: 'chasseur_reliques' },
                    { count: 10, id: 'roi_exploration' }
                ]
            },
            {
                genre: 'Fantasy',
                tiers: [
                    { count: 3, id: 'ecuyer_heroique' },
                    { count: 6, id: 'chevalier_royaume' },
                    { count: 10, id: 'gardien_mondes' }
                ]
            },
            {
                genre: 'Polar',
                tiers: [
                    { count: 3, id: 'detective_prive' },
                    { count: 6, id: 'inspecteur_chef' },
                    { count: 10, id: 'grand_commissaire' }
                ]
            }
        ];

        // BOUCLE DE TRAITEMENT
        GENRE_RULES.forEach(rule => {
            // 1. Trouver les histoires de ce genre dans la DB
            const genreStories = window.BRAGI_DB.stories.filter(s => s.genre === rule.genre);

            // 2. Compter combien le joueur en a fini
            const count = genreStories.filter(s => progress.completedStories.includes(s.id)).length;

            // 3. Vérifier chaque palier
            rule.tiers.forEach(tier => {
                if (count >= tier.count && !progress.achievements.includes(tier.id)) {
                    progress.achievements.push(tier.id);
                    // Délai calculé pour éviter l'avalanche de notifications visuelles
                    setTimeout(() => this._notify(tier.id, "Spécialiste " + rule.genre), 1500 + (tier.count * 200));
                    changed = true;
                }
            });
        });

        return changed;
    },

    /**
     * Calcul des Secrets et Easter Eggs (Méta-Trophée)
     */
    _computeSecretsSuccess: function (progress) {
        const allSecretIds = window.BRAGI_DB.secrets.map(s => s.id);
        const unlockedCount = progress.achievements.filter(id => allSecretIds.includes(id)).length;
        let changed = false;

        if (unlockedCount >= 3 && !progress.achievements.includes('chasseur_secrets')) {
            progress.achievements.push('chasseur_secrets');
            setTimeout(() => this._notify('chasseur_secrets', "Méta Exploit"), 2000);
            changed = true;
        }

        return changed;
    },

    // --- Utilitaires de Stockage ---

    hasAchievement: function (achievementId) {
        return this.getProgress().achievements.includes(achievementId);
    },

    isCompleted: function (storyId) {
        return this.getProgress().completedStories.includes(storyId);
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

                // Vérification rétroactive des trophées
                this.checkProgressionTrophies();

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

        setTimeout(() => toast.classList.add('visible'), 100);
        setTimeout(() => {
            toast.classList.remove('visible');
            setTimeout(() => toast.remove(), 600);
        }, 5000);
    }
};


/**
 * ------------------------------------------------------------------
 * 3. SÉCURITÉ & ANTI-TRICHE (HARDCORE MODE)
 * ------------------------------------------------------------------
 */
window.setupF12Protection = function (redirectUrl) {

    // Helper : Punir AVANT de rediriger pour garantir le trophée
    function punishCheater() {
        if (window.BragiStorage) {
            const progress = BragiStorage.getProgress();
            if (!progress.achievements.includes('cheater')) {
                progress.achievements.push('cheater');
                BragiStorage._save(progress);
            }
        }
        window.location.href = redirectUrl;
    }

    // A. Détection Clavier
    document.addEventListener('keydown', function (event) {
        if (event.key === 'F12' || event.keyCode === 123 ||
            (event.ctrlKey && event.shiftKey && ['I', 'J', 'C'].includes(event.key)) ||
            (event.metaKey && event.altKey && ['I', 'J', 'C'].includes(event.key))) {
            event.preventDefault();
            punishCheater();
        }
    });

    // B. Détection Clic Droit
    document.addEventListener('contextmenu', function (event) {
        event.preventDefault();
        punishCheater();
    });

    // C. Détection DevTools (Boucle Debugger)
    setInterval(function () {
        const start = performance.now();
        debugger;
        const end = performance.now();
        if (end - start > 100) {
            punishCheater();
        }
    }, 1000);

    // ---------------------------------------------------
    // GESTION DES EASTER EGGS IN-GAME
    // ---------------------------------------------------

    // D. Konami Code
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
            konamiIndex = (e.key === konamiSequence[0]) ? 1 : 0;
        }
    });

    // E. Noctambule
    const hour = new Date().getHours();
    if (hour >= 0 && hour <= 4) {
        if (window.BragiStorage) BragiStorage.markAchievement('noctambule');
    }

    // F. Rat de Bibliothèque
    if (window.location.pathname.includes('stories.html')) {
        setTimeout(() => {
            if (window.location.pathname.includes('stories.html')) {
                if (window.BragiStorage) BragiStorage.markAchievement('rat_bibliotheque');
            }
        }, 120000);
    }

    // G. Maître de l'Espace
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

    // H. L'Apprenti de Bragi
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