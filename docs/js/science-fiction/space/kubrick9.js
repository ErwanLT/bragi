/**
 * Kubrick 9 - Station orbitale
 * Refactored using StoryEngine
 */

setupF12Protection('../../magic_word.html');

new StoryEngine({
    storyId: 'kubrick9',
    initialVariables: {
        sanity: 100,
        integrity: 100,
        pulse: 80
    },
    clamping: {
        sanity: [0, 100],
        integrity: [0, 100],
        pulse: [40, 200]
    },
    onUpdateHUD: (vars) => {
        return `
            <div><span>SANTÉ MENTALE:</span> <span>${vars.sanity}%</span></div>
            <div><span>INTÉGRITÉ COQUE:</span> <span>${vars.integrity}%</span></div>
            <div><span>RYTHME CARDIAQUE:</span> <span>${vars.pulse} BPM</span></div>
        `;
    },
    onComputeEnding: (vars, forceEnding) => {
        let title = 'PERDU DANS L\'ESPACE';
        let text = 'La station devient votre cercueil d\'acier.';
        let color = '#555';
        let isSuccess = false;

        if (vars.integrity <= 0) {
            title = 'DÉCOMPRESSION';
            text = 'La coque a cédé. Votre dernier souffle gèle instantanément.';
            color = '#2980b9';
        } else if (vars.sanity <= 0) {
            title = 'ISOLEMENT TOTAL';
            text = 'L\'IA n\'est pas la seule à avoir perdu la raison.';
            color = '#8a0303';
        } else if (vars.pulse >= 180) {
            title = 'ARRÊT CARDIAQUE';
            text = 'La peur a été plus forte que votre cœur.';
            color = '#c0392b';
        } else {
            title = 'DEPLOYMENT SUCCESSFUL';
            text = 'Vous avez repris le contrôle. Kubrick-9 est à nouveau silencieuse.';
            color = '#2ecc71';
            isSuccess = true;
        }

        return { title, text, color, isSuccess };
    }
});