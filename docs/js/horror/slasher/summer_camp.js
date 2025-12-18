/**
 * Le Camp du Lac Sanglant
 * Refactored using StoryEngine
 */

setupF12Protection('../../magic_word.html');

new StoryEngine({
    storyId: 'summer_camp',
    initialVariables: {
        vie: 100,
        panique: 0,
        survivants: 5
    },
    clamping: {
        vie: [0, 100],
        panique: [0, 100],
        survivants: [0, 5]
    },
    onUpdateHUD: (vars) => {
        return `
            <div><span>SANTÉ:</span> <span>${vars.vie}%</span></div>
            <div><span>PANIQUE:</span> <span>${vars.panique}%</span></div>
            <div><span>SURVIVANTS:</span> <span>${vars.survivants}/5</span></div>
        `;
    },
    onComputeEnding: (vars, forceEnding) => {
        let title = 'TUÉ DANS LE NOIR';
        let text = 'Le tueur a été plus rapide que vous.';
        let color = '#555';
        let isSuccess = false;
        let isTerminal = false;

        if (vars.vie <= 0) {
            title = 'VICTIME DU LAC';
            text = 'Vous rejoignez les autres au fond du lac.';
            color = '#8a0303';
            isTerminal = true;
        } else if (vars.panique >= 100) {
            title = 'PANIQUE TOTALE';
            text = 'Vous courez droit vers le tueur sans réfléchir.';
            color = '#ff3333';
            isTerminal = true;
        } else if (forceEnding) {
            if (vars.survivants === 5) {
                title = 'FINAL GIRL/BOY';
                text = 'Vous avez sauvé tout le monde ! Une légende urbaine est née.';
                color = '#2ecc71';
                isSuccess = true;
            } else if (vars.survivants > 0) {
                title = 'SURVIVANT TRAUMATISÉ';
                text = `Vous êtes vivant, mais ${5 - vars.survivants} amis manquent à l'appel.`;
                color = '#3498db';
                isSuccess = true;
            } else {
                title = 'DERNIER SOUFFLE';
                text = 'Vous sortez seul de cette forêt, le seul survivant d\'un massacre.';
                color = '#e67e22';
                isSuccess = true;
            }
            isTerminal = true;
        }

        return isTerminal ? { title, text, color, isSuccess, isTerminal } : null;
    }
});
