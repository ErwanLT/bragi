setupF12Protection('../../magic_word.html');

// --- TEXTES & DONNÉES ---
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

// --- INITIALISATION DU MOTEUR ---
const story = new StoryEngine({
    storyId: 'le_mystere_du_reveillon',
    initialVariables: {
        paper: 0, testament: 0, camera: 0, fraud: 0, video: 0, alibi_marc: 0, artiste: 0,
        accuse_ready: 0
    },
    // Mise à jour du HUD (Doit retourner une chaîne HTML string)
    onUpdateHUD: (vars) => {
        // 1. Gestion indicateur sauvegarde
        const indicator = document.getElementById('save-indicator');
        if (indicator) {
            indicator.classList.remove('opacity-0');
            setTimeout(() => indicator.classList.add('opacity-0'), 2000);
        }

        // 2. Gestion logique des boutons (Afficher/Masquer selon les indices)
        // On le fait ici car cette fonction est appelée à chaque changement de variable
        setTimeout(() => updateButtonVisibility(vars), 50);

        // 3. Construction du HTML
        return buildHudHTML(vars);
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

// --- CRUCIAL : ON DÉSACTIVE LA LOGIQUE LINÉAIRE DU MOTEUR ---
// On remplace les méthodes du moteur qui cachent les sections pour gérer la navigation nous-mêmes
story.syncSections = function() {
    // On ne fait rien ici pour empêcher le moteur de masquer nos scènes
    console.log("Navigation linéaire désactivée pour le mode Mystère.");
};
story.setupUI = function() {
    // On empêche le moteur de modifier nos boutons customisés
};


// --- FONCTIONS UTILITAIRES ---

function buildHudHTML(vars) {
    // Indices
    let cluesHtml = Object.keys(CLUES_TEXT)
        .filter(key => vars[key] > 0)
        .map(key => `<li>${CLUES_TEXT[key]}</li>`)
        .join('');
    if (!cluesHtml) cluesHtml = '<li class="italic text-slate-500">Aucun indice majeur.</li>';

    // Suspects
    let suspectsHtml = '';

    // Logique d'affichage des suspects barrés ou non
    if(vars.alibi_marc) suspectsHtml += `<li class="struck">${SUSPECTS_INFO.marc.name}: Alibi confirmé.</li>`;
    else suspectsHtml += `<li>${SUSPECTS_INFO.marc.name}: ${SUSPECTS_INFO.marc.status}</li>`;

    if(vars.testament) suspectsHtml += `<li>${SUSPECTS_INFO.eleonore.name}: <strong>Mobile confirmé</strong>.</li>`;
    else suspectsHtml += `<li>${SUSPECTS_INFO.eleonore.name}: ${SUSPECTS_INFO.eleonore.status}</li>`;

    if(vars.video) suspectsHtml += `<li>${SUSPECTS_INFO.jean.name}: <strong>Suspect (Vu sur vidéo)</strong>.</li>`;
    else suspectsHtml += `<li>${SUSPECTS_INFO.jean.name}: ${SUSPECTS_INFO.jean.status}</li>`;

    if(vars.fraud) suspectsHtml += `<li>${SUSPECTS_INFO.artiste.name}: <strong>Complice Fraude</strong>.</li>`;
    else suspectsHtml += `<li>${SUSPECTS_INFO.artiste.name}: ${SUSPECTS_INFO.artiste.status}</li>`;

    return `
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

function updateButtonVisibility(vars) {
    const totalClues = (vars.paper || 0) + (vars.testament || 0) + (vars.camera || 0) + (vars.fraud || 0) + (vars.video || 0);

    // 1. Bouton Accusation finale
    const btnAccuse = document.getElementById('btn-accuse');
    if (btnAccuse) {
        if (totalClues >= 3) btnAccuse.classList.remove('hidden');
    }

    // 2. Option Caméra (Bureau)
    const optCamera = document.getElementById('opt-camera');
    if (optCamera) {
        if (vars.camera > 0) optCamera.classList.remove('hidden');
    }

    // 3. Réaction Jean (Papier)
    const jeanReaction = document.getElementById('jean-paper-reaction');
    if (jeanReaction) {
        if (vars.paper > 0) jeanReaction.classList.remove('hidden');
    }

    // --- NOUVEAU : Options Mlle Sorel ---

    // Lui montrer le carnet (si trouvé en bibliothèque, variable 'sketch')
    // NOTE : Assure-toi que le bouton dans la bibliothèque donne bien data-sketch="1"
    const optSketch = document.getElementById('opt-artiste-sketch');
    if (optSketch) {
        if (vars.sketch > 0) optSketch.classList.remove('hidden');
    }

    // Lui parler de la fraude (si documents trouvés, variable 'fraud')
    const optFraud = document.getElementById('opt-artiste-fraud');
    if (optFraud) {
        if (vars.fraud > 0) optFraud.classList.remove('hidden');
    }

    // Sa réaction quand on clique sur "Confronter Fraude"
    const fraudReaction = document.getElementById('artiste-fraud-reaction');
    if (fraudReaction) {
        // J'ai ajouté un data-fraud-confession="1" sur le bouton de confrontation dans le HTML ci-dessus
        if (vars.fraud_confession > 0) fraudReaction.classList.remove('hidden');
    }
}

// --- SYSTÈME DE NAVIGATION CUSTOM ---
window.makeChoice = function(btnElement) {
    // 1. Mise à jour des variables
    const dataset = btnElement.dataset;
    let dataChanged = false;

    Object.keys(dataset).forEach(key => {
        if (key !== 'next') {
            const val = parseFloat(dataset[key]);
            if (!isNaN(val)) {
                // Si la variable n'existe pas, on l'ajoute (ex: sketch)
                if (story.variables[key] === undefined) story.variables[key] = 0;
                story.variables[key] = val;
                dataChanged = true;
            }
        }
    });

    // 2. Si les données ont changé, on force l'update du HUD
    if (dataChanged) {
        story.updateDisplay();
    }

    // 3. Navigation visuelle (Changement de salle)
    const nextSectionId = btnElement.getAttribute('data-next');
    if (nextSectionId) {
        const currentSection = btnElement.closest('.section');
        const nextSection = document.getElementById(nextSectionId);

        if (currentSection && nextSection) {
            // Animation de sortie
            currentSection.classList.remove('visible');

            setTimeout(() => {
                currentSection.style.display = 'none';

                // Préparation entrée
                nextSection.style.display = 'block';
                void nextSection.offsetWidth; // Force Reflow

                // Animation d'entrée
                nextSection.classList.add('visible');

                // Scroll fluide vers le haut de l'histoire
                const storyContainer = document.getElementById('story');
                if(storyContainer) storyContainer.scrollIntoView({ behavior: 'smooth' });
            }, 500);
        }
    }
};

// Initialisation forcée au chargement
window.onload = function() {
    story.updateDisplay();
    // On s'assure que la première section est visible
    document.getElementById('scene-start').classList.add('visible');
    document.getElementById('scene-start').style.display = 'block';
};