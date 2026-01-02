/**
 * LA CITÉ DES BRUMES
 * Exploration & Inventory System
 */

setupF12Protection('../../magic_word.html');

const ITEM_DB = {
    'inv_machete': { icon: 'handyman', name: 'Machette' },
    'inv_corde': { icon: 'all_inclusive', name: 'Corde' },
    'inv_boussole': { icon: 'explore', name: 'Boussole' },
    'inv_torche': { icon: 'local_fire_department', name: 'Torche' },
    'inv_relique': { icon: 'diamond', name: 'Idole d\'Or' },
    'inv_journal': { icon: 'menu_book', name: 'Journal' },
    'inv_cle': { icon: 'vpn_key', name: 'Clé de Pierre' }
};

const story = new StoryEngine({
    storyId: 'lost_city',
    initialVariables: {
        sante: 100,
        vivres: 100,
        gloire: 0,
        inv_machete: 0,
        inv_corde: 0,
        inv_boussole: 0,
        inv_torche: 0,
        inv_relique: 0,
        inv_journal: 0,
        inv_cle: 0
    },
    clamping: {
        sante: [0, 100],
        vivres: [0, 100],
        gloire: [0, 1000]
    },
    onUpdateHUD: (vars) => {
        // --- 1. GESTION DES REQUIS (LOCK BUTTONS) ---
        document.querySelectorAll('button[data-req]').forEach(btn => {
            const reqVar = btn.dataset.req;

            // Si on n'a pas l'objet (valeur 0)
            if (!vars[reqVar] || vars[reqVar] <= 0) {
                // Style visuel "désactivé"
                btn.classList.add('opacity-30', 'cursor-not-allowed', 'grayscale');
                btn.style.pointerEvents = 'none'; // Désactive le clic

                // On met à jour le texte du label
                const label = btn.querySelector('.choice-req');
                if(label) {
                    label.classList.remove('text-emerald-500');
                    label.classList.add('text-red-600');
                    label.innerText = `MANQUANT : ${ITEM_DB[reqVar] ? ITEM_DB[reqVar].name.toUpperCase() : reqVar}`;
                }
            } else {
                // On a l'objet : on active
                btn.classList.remove('opacity-30', 'cursor-not-allowed', 'grayscale');
                btn.style.pointerEvents = 'auto';

                const label = btn.querySelector('.choice-req');
                if(label) {
                    label.classList.add('text-emerald-500');
                    label.classList.remove('text-red-600');
                    label.innerText = `ÉQUIPÉ : ${ITEM_DB[reqVar] ? ITEM_DB[reqVar].name.toUpperCase() : reqVar}`;
                }
            }
        });

        // --- 2. Construction HUD ---
        const santeColor = vars.sante < 30 ? 'bg-red-600' : 'bg-emerald-600';
        const vivresColor = vars.vivres < 20 ? 'bg-red-500' : 'bg-amber-600';

        let inventoryHTML = '';
        let slotsCount = 0;

        for (const [key, info] of Object.entries(ITEM_DB)) {
            const hasItem = vars[key] > 0;
            inventoryHTML += `
                <div class="inv-slot ${hasItem ? 'filled' : ''}" title="${info.name}">
                    <span class="material-symbols-outlined inv-icon">${info.icon}</span>
                </div>
            `;
            slotsCount++;
        }
        while(slotsCount < 8) {
            inventoryHTML += `<div class="inv-slot"></div>`;
            slotsCount++;
        }

        return `
            <div class="space-y-6">
                <div class="hud-panel">
                    <h3 class="text-amber-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-4 flex items-center gap-2 border-b border-amber-500/20 pb-2">
                        <span class="material-symbols-outlined text-sm">vital_signs</span> État de l'Expédition
                    </h3>
                    
                    <div class="space-y-3">
                        <div>
                            <div class="flex justify-between text-[10px] text-slate-400 mb-1 uppercase tracking-wider">
                                <span>Santé</span>
                                <span class="${vars.sante < 30 ? 'text-red-500 animate-pulse' : 'text-emerald-500'}">${vars.sante}%</span>
                            </div>
                            <div class="h-1.5 w-full bg-black/50 rounded-full overflow-hidden border border-white/5">
                                <div class="h-full ${santeColor} transition-all duration-500" style="width: ${vars.sante}%"></div>
                            </div>
                        </div>

                        <div>
                            <div class="flex justify-between text-[10px] text-slate-400 mb-1 uppercase tracking-wider">
                                <span>Vivres</span>
                                <span class="${vars.vivres < 20 ? 'text-red-500 animate-pulse' : 'text-amber-500'}">${vars.vivres}%</span>
                            </div>
                            <div class="h-1.5 w-full bg-black/50 rounded-full overflow-hidden border border-white/5">
                                <div class="h-full ${vivresColor} transition-all duration-500" style="width: ${vars.vivres}%"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="hud-panel">
                    <h3 class="text-amber-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-2 flex items-center gap-2 border-b border-amber-500/20 pb-2">
                        <span class="material-symbols-outlined text-sm">backpack</span> Sac à Dos
                    </h3>
                    <div class="inventory-grid">
                        ${inventoryHTML}
                    </div>
                </div>

                <div class="text-center opacity-40 mt-4">
                    <span class="text-[10px] font-serif italic text-amber-100 tracking-widest">Gloire acquise : ${vars.gloire}</span>
                </div>
            </div>
        `;
    },
    onComputeEnding: (vars, forceEnding) => {
        let title = 'DISPARU';
        let text = 'La jungle a englouti vos traces.';
        let color = '#57534e';
        let isSuccess = false;
        let isTerminal = false;

        if (vars.sante <= 0) {
            title = 'MORT DANS LA JUNGLE';
            text = 'Blessures, fièvres et prédateurs ont eu raison de vous.';
            color = '#8a0303';
            isTerminal = true;
        } else if (vars.vivres <= 0) {
            title = 'MORT DE FAIM';
            text = 'Épuisé, sans ressources, vous vous allongez pour une dernière sieste.';
            color = '#78350f';
            isTerminal = true;
        } else if (forceEnding === 'rich') {
            title = 'FORTUNE ET GLOIRE';
            text = 'Vous revenez avec l\'Idole d\'Or ! Le monde entier vous acclame.';
            color = '#fbbf24';
            isSuccess = true;
            isTerminal = true;
        } else if (forceEnding === 'knowledge') {
            title = 'ARCHÉOLOGUE LÉGENDAIRE';
            text = 'Vous rapportez le savoir des anciens. Une découverte inestimable.';
            color = '#0ea5e9';
            isSuccess = true;
            isTerminal = true;
        } else if (forceEnding === 'survivor') {
            title = 'RETOUR BREDOUILLE';
            text = 'Vivant, mais sans gloire. Personne ne croira votre histoire.';
            color = '#57534e';
            isSuccess = false;
            isTerminal = true;
        }

        return isTerminal ? { title, text, color, isSuccess, isTerminal } : null;
    }
});

// --- SURCHARGE DU MOTEUR (Fix Visibilité) ---
// On remplace la fonction syncSections par une version stricte qui n'affiche que
// la section suivante immédiate.
story.syncSections = function() {
    const sections = Array.from(document.querySelectorAll('.section'));
    // On trouve l'index du dernier choix effectué (-1 si aucun)
    const lastChoiceIndex = Math.max(-1, ...Object.keys(this.choices).map(Number));

    // L'index de la section active est juste après le dernier choix
    const activeIndex = lastChoiceIndex + 1;

    sections.forEach((section, index) => {
        if (index === activeIndex) {
            // C'est la section active
            section.classList.add('visible');
            section.style.display = 'block';

            // Si c'est une section narrative sans boutons, on peut envisager de passer à la suivante
            // Mais dans votre structure, toutes les sections ont des boutons, donc on s'arrête là.
        } else if (index < activeIndex) {
            // Section passée : on peut la laisser visible mais "verrouillée" visuellement si on veut
            // Pour l'instant on la laisse visible pour l'historique
            section.classList.add('visible');
            section.style.display = 'block';

            // Désactiver les boutons des sections passées pour éviter de modifier l'histoire "en arrière"
            // (Optionnel, mais recommandé pour votre remarque "choix qui s'annulent")
            section.querySelectorAll('button').forEach(btn => {
                btn.style.pointerEvents = 'none';
                if(!btn.classList.contains('selected')) btn.style.opacity = '0.5';
            });
        } else {
            // Section future : on cache
            section.classList.remove('visible');
            section.style.display = 'none';
        }
    });
};

// Init forced
window.onload = function() {
    story.updateDisplay();
    story.syncSections();
};