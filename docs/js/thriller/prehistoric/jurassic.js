/**
 * JURASSIC PARK - ISLA NUBLAR
 * Refactored using StoryEngine
 */

setupF12Protection('../../../magic_word.html');

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
        return `
            <div><span>SANTÉ:</span> <span>${vars.sante}%</span></div>
            <div><span>MUNITIONS:</span> <span>${vars.munitions}</span></div>
            <div><span>SÉCURITÉ:</span> <span>${vars.securite}%</span></div>
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