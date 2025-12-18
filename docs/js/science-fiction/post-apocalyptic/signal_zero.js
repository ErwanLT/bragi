/**
 * Signal Zéro - Transmission
 * Refactored using StoryEngine
 */

setupF12Protection('../../magic_word.html');

new StoryEngine({
    storyId: 'signal_zero',
    initialVariables: {
        signal: 100,
        squad: 4,
        ammo: 50
    },
    clamping: {
        signal: [0, 100],
        squad: [0, 4],
        ammo: [0, 100]
    },
    onUpdateHUD: (vars) => {
        return `
            <div><span>SIGNAL:</span> <span>${vars.signal}%</span></div>
            <div><span>ESCOUADE:</span> <span>${vars.squad}/4</span></div>
            <div><span>MUNITIONS:</span> <span>${vars.ammo}</span></div>
        `;
    },
    onComputeEnding: (vars, forceEnding) => {
        let title = 'SIGNAL PERDU';
        let text = 'La radio ne grésille plus. Le silence est définitif.';
        let color = '#555';
        let isSuccess = false;
        let isTerminal = false;

        if (vars.squad <= 0) {
            title = 'ESCOUADE ÉLIMINÉE';
            text = 'Vous avez guidé vos hommes vers la mort.';
            color = '#8a0303';
            isTerminal = true;
        } else if (vars.signal <= 0) {
            title = 'SILENCE RADIO';
            text = 'Vous ne pouvez plus les guider. Ils sont seuls dans le noir.';
            color = '#34495e';
            isTerminal = true;
        } else if (vars.ammo <= 0) {
            title = 'À BOUT DE SOUFFLE';
            text = 'Plus de munitions. Le dernier signal était un cri.';
            color = '#7f8c8d';
            isTerminal = true;
        } else if (forceEnding) {
            title = 'MISSION ACCOMPLISHED';
            text = `L'escouade a atteint la zone d'extraction. ${vars.squad} survivants.`;
            color = '#2ecc71';
            isSuccess = true;
            isTerminal = true;
        }

        return isTerminal ? { title, text, color, isSuccess, isTerminal } : null;
    }
});
