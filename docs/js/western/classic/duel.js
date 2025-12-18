/**
 * Le Dernier Duel
 * Refactored using StoryEngine
 */

setupF12Protection('../../magic_word.html');

new StoryEngine({
    storyId: 'duel',
    initialVariables: {
        fortune: 50,
        honneur: 50,
        munitions: 6
    },
    clamping: {
        fortune: [0, 1000],
        honneur: [0, 100],
        munitions: [0, 20]
    },
    onUpdateHUD: (vars) => {
        return `
            <div><span>FORTUNE:</span> <span>$${vars.fortune}</span></div>
            <div><span>HONNEUR:</span> <span>${vars.honneur}%</span></div>
            <div><span>MUNITIONS:</span> <span>${vars.munitions}</span></div>
        `;
    },
    onComputeEnding: (vars, forceEnding) => {
        let title = 'MORT DANS LA POUSSIÈRE';
        let text = 'Le croque-mort a déjà pris vos mesures.';
        let color = '#555';
        let isSuccess = false;

        if (vars.honneur >= 80 && vars.fortune >= 100) {
            title = 'LÉGENDE DE L\'OUEST';
            text = 'Riche et respecté. Votre nom restera gravé dans l\'histoire.';
            color = '#ffd700';
            isSuccess = true;
        } else if (vars.honneur <= 20) {
            title = 'HORS-LA-LOI';
            text = 'Votre tête est mise à prix. Vous fuyez vers le Mexique.';
            color = '#8a0303';
            isSuccess = true;
        } else if (vars.munitions <= 0) {
            title = 'À SEC';
            text = 'Un duel sans balles est une exécution. Vous n\'avez pas tiré le premier.';
            color = '#333';
        } else {
            title = 'JUSTICE EST FAITE';
            text = 'Le bandit est sous les verrous. Chicago respire... enfin, le saloon.';
            color = '#2ecc71';
            isSuccess = true;
        }

        return { title, text, color, isSuccess };
    }
});