/**
 * Le Manoir du Silence
 * Refactored using StoryEngine
 */

setupF12Protection('../../magic_word.html');

new StoryEngine({
    storyId: 'manor',
    initialVariables: {
        sanity: 100,
        battery: 100
    },
    clamping: {
        sanity: [0, 100],
        battery: [0, 100]
    },
    onUpdateHUD: (vars) => {
        return `
            <div><span>SANTÉ MENTALE:</span> <span>${vars.sanity}%</span></div>
            <div><span>BATTERIE LAMPE:</span> <span>${vars.battery}%</span></div>
        `;
    },
    onComputeEnding: (vars, forceEnding) => {
        let title = 'PERDU DANS LE NOIR';
        let text = 'Votre lampe s\'éteint... et quelque chose vous attrape.';
        let color = '#555';
        let isSuccess = false;
        let isTerminal = false;

        if (forceEnding === 'flee') {
            title = 'ABANDON';
            text = 'Vous n\'avez pas osé franchir le seuil. La peur a gagné.';
            color = '#888';
            isTerminal = true;
        } else if (vars.battery <= 0) {
            title = 'NOIR TOTAL';
            text = 'Plus de piles. Les ombres du manoir se referment sur vous.';
            color = '#000';
            isTerminal = true;
        } else if (vars.sanity <= 0) {
            title = 'FOLIE';
            text = 'L\'esprit du manoir vous a brisé. Vous faites désormais partie des portraits.';
            color = '#8a0303';
            isTerminal = true;
        } else if (forceEnding) {
            title = 'SURVIVANT';
            text = 'Vous avez survécu à la nuit. Mais ce que vous avez vu vous hantera à jamais.';
            color = '#2ecc71';
            isSuccess = true;
            isTerminal = true;
        }

        return isTerminal ? { title, text, color, isSuccess, isTerminal } : null;
    }
});