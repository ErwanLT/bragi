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
        or: 100 // Starting gold
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
        let isTerminal = false;

        if (forceEnding === 'rich') {
            title = 'ROI DES PIRATES';
            text = 'Avec ce trésor, vous construisez une flotte. Votre nom fera trembler les sept mers !';
            color = '#ffd700';
            isSuccess = true;
            isTerminal = true;
        } else if (forceEnding === 'cursed') {
            title = 'LÉGENDE MAUDITE';
            text = 'L\'or est à vous, mais vos yeux brillent d\'une lueur violette. Vous ne vieillirez plus, mais vous ne connaîtrez plus le repos.';
            color = '#9b59b6';
            isSuccess = true;
            isTerminal = true;
        } else if (vars.loyalte <= 0) {
            title = 'MUTINERIE !';
            text = 'L\'équipage vous abandonne sur un îlot désert. Ils partent avec le navire.';
            color = '#8a0303';
            isTerminal = true;
        } else if (vars.vivres <= 0) {
            title = 'FAMINE';
            text = 'Le calme plat a duré trop longtemps. Les cales sont vides.';
            color = '#7f8c8d';
            isTerminal = true;
        } else if (vars.or <= 0) {
            title = 'BANQUEROUTE';
            text = 'Plus un sou pour payer les marins ou réparer le pont. Vous finissez aux fers pour dettes.';
            color = '#34495e';
            isTerminal = true;
        } else if (forceEnding) {
            title = 'RETOUR AU PORT';
            text = 'Pas de gloire, mais pas de mort. Une histoire à raconter à la taverne.';
            color = '#e6ccb2';
            isSuccess = true;
            isTerminal = true;
        }

        return isTerminal ? { title, text, color, isSuccess, isTerminal } : null;
    }
});