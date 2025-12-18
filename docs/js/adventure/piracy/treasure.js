/**
 * Le Trésor de l'Île Maudite
 * Refactored using StoryEngine
 */

setupF12Protection('../../../magic_word.html');

new StoryEngine({
    storyId: 'treasure',
    initialVariables: {
        loyalte: 100,
        vivres: 100,
        or: 0
    },
    clamping: {
        loyalte: [0, 100],
        vivres: [0, 100],
        or: [0, 1000]
    },
    onUpdateHUD: (vars) => {
        return `
            <div><span>LOYAUTÉ:</span> <span>${vars.loyalte}%</span></div>
            <div><span>VIVRES:</span> <span>${vars.vivres}%</span></div>
            <div><span>OR:</span> <span>${vars.or} pièces</span></div>
        `;
    },
    onComputeEnding: (vars, forceEnding) => {
        let title = 'NAUFRAGE';
        let text = 'La mer a repris ce qu\'elle vous avait prêté.';
        let color = '#555';
        let isSuccess = false;

        if (forceEnding === 'rich') {
            title = 'ROI DES PIRATES';
            text = 'Avec ce trésor, vous construisez une flotte. Votre nom fera trembler les sept mers !';
            color = '#ffd700';
            isSuccess = true;
        } else if (vars.loyalte <= 0) {
            title = 'MUTINERIE !';
            text = 'L\'équipage vous abandonne sur un îlot désert. Ils partent avec le navire.';
            color = '#8a0303';
        } else if (vars.vivres <= 0) {
            title = 'FAMINE';
            text = 'Le calme plat a duré trop longtemps. Les cales sont vides.';
            color = '#7f8c8d';
        } else {
            title = 'RETOUR AU PORT';
            text = 'Pas de gloire, mais pas de mort. Une histoire à raconter à la taverne.';
            color = '#e6ccb2';
            isSuccess = true;
        }

        return { title, text, color, isSuccess };
    }
});