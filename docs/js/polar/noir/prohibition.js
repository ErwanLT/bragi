/**
 * Dossier: ombres de Chicago - 1932
 * Refactored using StoryEngine
 */

setupF12Protection('../../../magic_word.html');

new StoryEngine({
    storyId: 'prohibition',
    initialVariables: {
        indices: 0,
        respect: 50,
        sangFroid: 80
    },
    clamping: {
        indices: [0, 100],
        respect: [0, 100],
        sangFroid: [0, 100]
    },
    onUpdateHUD: (vars) => {
        return `
            <div><span>INDICES:</span> <span>${vars.indices}%</span></div>
            <div><span>RESPECT:</span> <span>${vars.respect}%</span></div>
            <div><span>SANG-FROID:</span> <span>${vars.sangFroid}%</span></div>
        `;
    },
    onComputeEnding: (vars, forceEnding) => {
        let title = 'AFFAIRE CLASSÉE';
        let text = ' Chicago a raison de vous. Le crime paie, mais pas pour vous.';
        let color = '#555';
        let isSuccess = false;
        let isTerminal = false;

        if (vars.indices >= 80 && forceEnding) {
            title = 'AFFAIRE RÉSOLUE';
            text = 'Capone ira en prison. Vous êtes le héros de Chicago.';
            color = '#000';
            isSuccess = true;
            isTerminal = true;
        } else if (vars.sangFroid <= 0) {
            title = 'CRAQUAGE';
            text = 'La pression était trop forte. Vous avez rendu votre badge et votre arme.';
            color = '#8a0303';
            isTerminal = true;
        } else if (vars.respect <= 0) {
            title = 'DESCENDU';
            text = 'Vous avez posé trop de questions aux mauvaises personnes. Sans respect, on ne survit pas longtemps.';
            color = '#333';
            isTerminal = true;
        } else if (forceEnding) {
            title = 'PREUVES INSUFFISANTES';
            text = 'Le Capitaine secoue la tête. "C\'est tout ce que vous avez ?" Capone est relâché faute de preuves.';
            color = '#666';
            isTerminal = true;
        }

        return isTerminal ? { title, text, color, isSuccess, isTerminal } : null;
    }
});