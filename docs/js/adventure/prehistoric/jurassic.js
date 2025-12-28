/**
 * JURASSIC PARK - ISLA NUBLAR
 * Refactored using StoryEngine
 */

setupF12Protection('../../magic_word.html');

new StoryEngine({
    storyId: 'jurassic',
    initialVariables: {
        sante: 100,
        munitions: 10,
        securite: 20
    },
    clamping: {
        sante: [0, 100],
        munitions: [0, 50],
        securite: [0, 100]
    },
    onUpdateHUD: (vars) => {
        // Calculate colors based on values
        const santeColor = vars.sante > 50 ? 'bg-secondary' : (vars.sante > 20 ? 'bg-primary' : 'bg-red-600');
        const securiteColor = vars.securite > 50 ? 'text-secondary' : (vars.securite > 20 ? 'text-primary' : 'text-red-500');

        return `
        <!-- Character Status Card -->
        <div class="bg-surface-dark rounded-xl p-6 border border-surface-highlight sticky top-24">
            <h3 class="text-white font-bold text-lg mb-4 flex items-center justify-between font-display">
                État du Parc
                <span class="material-symbols-outlined text-text-secondary">monitor_heart</span>
            </h3>
            <div class="space-y-4">
                <!-- Health -->
                <div class="flex flex-col gap-1">
                    <div class="flex justify-between text-sm">
                        <span class="text-text-secondary flex items-center gap-2"><span class="material-symbols-outlined text-rose-500 text-[18px]">favorite</span> Santé</span>
                        <span class="text-white font-bold">${vars.sante}%</span>
                    </div>
                    <div class="h-1.5 w-full bg-surface-highlight rounded-full">
                        <div class="h-full ${santeColor} rounded-full transition-all duration-500" style="width: ${vars.sante}%"></div>
                    </div>
                </div>
                
                <!-- Security -->
                <div class="flex items-center justify-between p-3 bg-surface-highlight/30 rounded-lg border border-white/5">
                    <div class="flex items-center gap-3">
                        <span class="bg-primary/20 text-primary p-1.5 rounded-md material-symbols-outlined">security</span>
                        <div>
                            <p class="text-text-secondary text-xs uppercase font-bold">Sécurité</p>
                            <p class="text-white text-sm font-medium ${securiteColor}">${vars.securite}%</p>
                        </div>
                    </div>
                </div>
                
                <!-- Ammo -->
                <div class="flex items-center justify-between p-3 bg-surface-highlight/30 rounded-lg border border-white/5">
                    <div class="flex items-center gap-3">
                        <span class="bg-amber-500/20 text-amber-500 p-1.5 rounded-md material-symbols-outlined">my_location</span>
                        <div>
                            <p class="text-text-secondary text-xs uppercase font-bold">Munitions</p>
                            <p class="text-white text-sm font-medium">${vars.munitions}</p>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
        `;
    },
    onComputeEnding: (vars, forceEnding) => {
        let title = 'REPAS POUR DINO';
        let text = 'Vous n\'étiez pas tout à fait en haut de la chaîne alimentaire.';
        let color = '#d35400';
        let isSuccess = false;
        let isTerminal = false;

        if (forceEnding === 'hero') {
            title = '🦸 HÉROS DE NUBLAR';
            text = 'Vous avez sauvé tout le monde et restauré la sécurité. InGen vous propose un poste de directeur de la sécurité. Vous refusez poliment et prenez le premier hélicoptère.';
            color = '#2ecc71';
            isSuccess = true;
            isTerminal = true;
        } else if (forceEnding === 'escape') {
            title = '🚁 ÉVACUATION RÉUSSIE';
            text = 'Vous avez survécu et quitté l\'île. Les cauchemars de dinosaures vous hanteront, mais vous êtes vivant. C\'est déjà ça.';
            color = '#3498db';
            isSuccess = true;
            isTerminal = true;
        } else if (forceEnding === 'sacrifice') {
            title = '💔 SACRIFICE HÉROÏQUE';
            text = 'Vous avez donné votre vie pour sauver les autres. Votre nom sera gravé sur une plaque commémorative... que personne ne verra jamais car l\'île est fermée.';
            color = '#e74c3c';
            isTerminal = true;
        } else if (vars.sante <= 0) {
            title = 'PROIE FACILE';
            text = 'Les dinosaures ont faim. Et vous êtes savoureux.';
            color = '#8a0303';
            isTerminal = true;
        } else if (vars.securite >= 80 && forceEnding) {
            title = 'REPRISE DE CONTRÔLE';
            text = 'Le parc est à nouveau sous contrôle. Les dinosaures sont de nouveau derrière des clôtures... pour le moment.';
            color = '#27ae60';
            isSuccess = true;
            isTerminal = true;
        } else if (forceEnding) {
            title = 'UNE LONGUE NUIT';
            text = 'Vous êtes toujours sur l\'île. Chaque craquement de branche vous fait sursauter. La survie continue.';
            color = '#7f8c8d';
            isTerminal = true;
        }

        return isTerminal ? { title, text, color, isSuccess, isTerminal } : null;
    }
});