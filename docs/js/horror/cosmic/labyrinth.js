/**
 * Le Labyrinthe Oublié
 * Refactored using StoryEngine
 */

// Initialize security
setupF12Protection('../../magic_word.html');

// Create the story engine instance
const labyrinth = new StoryEngine({
    storyId: 'labyrinth',
    initialVariables: {
        sanity: 100,
        light: 100,
        orientation: 0
    },
    clamping: {
        sanity: [0, 100],
        light: [0, 100],
        orientation: [0, 100]
    },
    onUpdateHUD: (vars) => {
        return `
            <div><span>SANTÉ MENTALE:</span> <span>${vars.sanity}%</span></div>
            <div><span>LUMIÈRE:</span> <span>${vars.light}%</span></div>
            <div><span>ORIENTATION:</span> <span>${vars.orientation}%</span></div>
        `;
    },
    onComputeEnding: (vars, forceEnding) => {
        let title = 'MAÎTRE DU DÉDALE';
        let text = 'Vous avez cartographié l\'impossible. Vous sortez, mais le labyrinthe reste en vous.';
        let color = '#ff3333';
        let isSuccess = false;
        let isTerminal = false;

        if (forceEnding === 'escaped') {
            title = 'LIBRE !';
            text = 'Vous avez trouvé la sortie. La lumière du soleil n\'a jamais été aussi belle.';
            color = '#dcdcdc';
            isSuccess = true;
            isTerminal = true;
        } else if (vars.light <= 0) {
            title = 'DÉVORÉ PAR L\'OMBRE';
            text = 'Votre lanterne s\'éteint. Vous n\'êtes plus seul dans le noir.';
            color = '#000';
            isTerminal = true;
        } else if (vars.sanity <= 0) {
            title = 'ESPRIT BRISÉ';
            text = 'Le labyrinthe est désormais votre maison. Vous riez dans le noir.';
            color = '#8a0303';
            isTerminal = true;
        } else if (vars.orientation >= 100) {
            title = 'MAÎTRE DU DÉDALE';
            text = 'Vous avez cartographié l\'impossible. Vous sortez, mais le labyrinthe reste en vous.';
            color = '#ff3333';
            isSuccess = true;
            isTerminal = true;
        } else if (forceEnding) {
            title = 'PERDU DANS LES TÉNÈBRES';
            text = 'Vos os rejoindront ceux des autres.';
            color = '#555';
            isTerminal = true;
        }

        return isTerminal ? { title, text, color, isSuccess, isTerminal } : null;
    }
});