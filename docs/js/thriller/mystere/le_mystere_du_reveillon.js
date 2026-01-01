setupF12Protection('../../magic_word.html');

// --- DONNÉES DU JEU ---
const CLUES_TEXT = {
    paper: "Papier froissé avec le mot 'TRAHISON'.",
    testament: "Victor allait changer son testament demain.",
    camera: "Une caméra cachée filme le bureau.",
    fraud: "Documents prouvant une fraude financière massive.",
    video: "Vidéo : Jean entre dans la bibliothèque. Une femme court.",
    alibi_marc: "Marc-Antoine a un alibi téléphonique confirmé.",
    sketch: "Un carnet de croquis oublié appartenant à l'artiste."
};

const SUSPECTS_INFO = {
    eleonore: { name: "Éléonore", role: "La Veuve", status: "Froide. Veut l'héritage." },
    marc: { name: "Marc-Antoine", role: "L'Associé", status: "En faillite. Suspect idéal." },
    jean: { name: "Jean", role: "Le Majordome", status: "Loyal... ou pas ?" },
    artiste: { name: "Mlle Sorel", role: "L'Artiste", status: "La protégée de Victor." }
};

// --- FONCTION D'AFFICHAGE DU HUD (AUTONOME) ---
function renderMyHUD(vars) {
    // 1. Indicateur de sauvegarde
    const indicator = document.getElementById('save-indicator');
    if (indicator) {
        indicator.classList.remove('opacity-0');
        setTimeout(() => indicator.classList.add('opacity-0'), 2000);
    }

    // 2. HTML des Indices
    let cluesHtml = Object.keys(CLUES_TEXT)
        .filter(key => vars[key] > 0)
        .map(key => `<li>${CLUES_TEXT[key]}</li>`)
        .join('');
    if (!cluesHtml) cluesHtml = '<li class="italic text-slate-500">Aucun indice majeur.</li>';

    // 3. HTML des Suspects
    let suspectsHtml = '';

    // Marc
    if(vars.alibi_marc) suspectsHtml += `<li class="struck">${SUSPECTS_INFO.marc.name}: Alibi confirmé.</li>`;
    else suspectsHtml += `<li>${SUSPECTS_INFO.marc.name}: ${SUSPECTS_INFO.marc.status}</li>`;

    // Éléonore
    if(vars.testament) suspectsHtml += `<li>${SUSPECTS_INFO.eleonore.name}: <strong>Mobile confirmé (Argent)</strong>.</li>`;
    else suspectsHtml += `<li>${SUSPECTS_INFO.eleonore.name}: ${SUSPECTS_INFO.eleonore.status}</li>`;

    // Jean
    if(vars.video) suspectsHtml += `<li>${SUSPECTS_INFO.jean.name}: <strong>Suspect (Vu sur vidéo)</strong>.</li>`;
    else suspectsHtml += `<li>${SUSPECTS_INFO.jean.name}: ${SUSPECTS_INFO.jean.status}</li>`;

    // Mlle Sorel
    if(vars.fraud) suspectsHtml += `<li>${SUSPECTS_INFO.artiste.name}: <strong>Complice Fraude</strong>.</li>`;
    else suspectsHtml += `<li>${SUSPECTS_INFO.artiste.name}: ${SUSPECTS_INFO.artiste.status}</li>`;

    // 4. Injection dans le DOM
    const hudDiv = document.getElementById('hud');
    if (hudDiv) {
        hudDiv.innerHTML = `
            <div class="hud-panel">
                <div class="hud-title">Carnet de Notes</div>
                <ul class="hud-list">${cluesHtml}</ul>
            </div>
            <div class="hud-panel mt-4">
                <div class="hud-title">Suspects</div>
                <ul class="hud-list">${suspectsHtml}</ul>
            </div>
        `;
    }

    // 5. Gestion de la visibilité des boutons (Logique conditionnelle)
    const totalClues = (vars.paper || 0) + (vars.testament || 0) + (vars.camera || 0) + (vars.fraud || 0) + (vars.video || 0);

    // Bouton Accusation
    const btnAccuse = document.getElementById('btn-accuse');
    if (btnAccuse) {
        if (totalClues >= 3) btnAccuse.classList.remove('hidden');
    }

    // Option Caméra
    const optCamera = document.getElementById('opt-camera');
    if (optCamera) {
        if (vars.camera > 0) optCamera.classList.remove('hidden');
    }

    // Réaction Jean
    const jeanReaction = document.getElementById('jean-paper-reaction');
    if (jeanReaction) {
        if (vars.paper > 0) jeanReaction.classList.remove('hidden');
    }
}

// --- INITIALISATION DU MOTEUR ---
const story = new StoryEngine({
    storyId: 'le_mystere_du_reveillon',
    initialVariables: {
        paper: 0, testament: 0, camera: 0, fraud: 0, video: 0, alibi_marc: 0, artiste: 0,
        // Variables techniques
        scene: 0
    },
    // On connecte notre fonction personnalisée au moteur
    onUpdateHUD: (vars) => {
        renderMyHUD(vars);
        return ""; // Le moteur attend un string, mais on gère l'affichage nous-mêmes
    },
    onComputeEnding: (vars, forceEnding) => {
        const endings = {
            "fin_eleonore": { isTerminal: true, isSuccess: false, title: "Erreur Judiciaire", text: "Vous faites arrêter Éléonore. Elle hurlait son innocence. Trois jours plus tard, une nouvelle preuve disculpe la veuve. Le vrai coupable court toujours.", color: "#e11d48" },
            "fin_marc": { isTerminal: true, isSuccess: false, title: "L'Alibi Ignoré", text: "Marc-Antoine avait un alibi solide. La police le relâche après vérification. Vous avez perdu votre crédibilité.", color: "#f59e0b" },
            "fin_jean": { isTerminal: true, isSuccess: false, title: "Le Bouc Émissaire", text: "Jean avoue sous la pression pour protéger quelqu'un, mais quelque chose ne colle pas. Vous avez arrêté l'exécutant, mais pas le cerveau.", color: "#71717a" },
            "fin_artiste": { isTerminal: true, isSuccess: true, title: "Le Chef-d'œuvre du Crime", text: "C'était elle ! Mlle Sorel. Victor avait découvert qu'elle vendait ses toiles en douce. La silhouette féminine sur la vidéo, le mobile... tout concorde. Elle s'effondre en larmes.", color: "#10b981" }
        };
        if (forceEnding && endings[forceEnding]) return endings[forceEnding];
        return null;
    }
});

// --- SYSTÈME DE NAVIGATION (GLOBAL) ---
window.makeChoice = function(btnElement) {
    console.log("Bouton cliqué :", btnElement); // Debug

    // 1. Mise à jour des données (Variables)
    const dataset = btnElement.dataset;
    let dataChanged = false;

    Object.keys(dataset).forEach(key => {
        // On ignore 'next' et les propriétés natives
        if (key !== 'next' && story.variables.hasOwnProperty(key)) {
            const val = parseFloat(dataset[key]);
            if (!isNaN(val)) {
                story.variables[key] = val;
                dataChanged = true;
            }
        } else if (key !== 'next' && !story.variables.hasOwnProperty(key)) {
            // Si la variable n'existe pas dans l'init, on la crée à la volée (ex: sketch)
            const val = parseFloat(dataset[key]);
            if (!isNaN(val)) {
                story.variables[key] = val;
                dataChanged = true;
            }
        }
    });

    // 2. Mise à jour visuelle du HUD
    if (dataChanged) {
        renderMyHUD(story.variables);
        // On sauvegarde si le moteur a une fonction de save, sinon c'est pas grave
        if (typeof story.save === 'function') story.save();
    }

    // 3. Navigation (Changement de Scène)
    const nextSectionId = btnElement.getAttribute('data-next');
    if (nextSectionId) {
        const currentSection = btnElement.closest('.section');
        const nextSection = document.getElementById(nextSectionId);

        if (currentSection && nextSection) {
            console.log("Navigation vers :", nextSectionId); // Debug

            // Animation simple
            currentSection.classList.remove('visible');

            setTimeout(() => {
                currentSection.style.display = 'none';
                nextSection.style.display = 'block';

                // Force le navigateur à recalculer (Reflow) pour l'animation CSS
                void nextSection.offsetWidth;

                nextSection.classList.add('visible');

                // Scroll en haut en douceur
                const storyContainer = document.getElementById('story');
                if(storyContainer) storyContainer.scrollIntoView({ behavior: 'smooth' });
            }, 500); // Correspond à la durée CSS (0.5s ou 0.6s)
        } else {
            console.warn("Section introuvable :", nextSectionId);
        }
    }
};

// Initialisation au chargement pour afficher le HUD vide
window.onload = function() {
    renderMyHUD(story.variables);
};