/**
 * La Quête du Code Ancestral
 * Refactored using StoryEngine
 */

setupF12Protection('../../../magic_word.html');

new StoryEngine({
    storyId: 'quest',
    initialVariables: {
        mana: 100,
        xp: 0,
        karma: 50
    },
    clamping: {
        mana: [0, 100],
        xp: [0, 1000],
        karma: [0, 100]
    },
    onUpdateHUD: (vars) => {
        return `
            <div><span>MANA:</span> <span>${vars.mana}%</span></div>
            <div><span>EXP:</span> <span>${vars.xp} XP</span></div>
            <div><span>KARMA:</span> <span>${vars.karma}%</span></div>
        `;
    },
    onComputeEnding: (vars, forceEnding) => {
        let title = 'GAME OVER';
        let text = 'Votre quête s\'arrête ici.';
        let color = '#555';
        let isSuccess = false;

        if (vars.xp >= 100) {
            title = 'Grand Archimage (CTO Légendaire)';
            text = 'Vous avez maîtrisé le code et le destin. Le royaume est sauvé.';
            color = '#ffd700';
            isSuccess = true;
        } else if (vars.mana <= 0) {
            title = 'BURN-OUT MAGIQUE';
            text = 'Plus d\'énergie pour coder les sorts. Vous devenez un simple villageois.';
            color = '#7f8c8d';
        } else if (vars.karma <= 20) {
            title = 'SORCIER NOIR';
            text = 'Le pouvoir vous a corrompu. Vous régnez par la terreur.';
            color = '#8a0303';
            isSuccess = true;
        } else {
            title = 'DÉVELOPPEUR JUNIOR';
            text = 'Vous avez survécu au donjon, mais il vous reste tant à apprendre.';
            color = '#2ecc71';
            isSuccess = true;
        }

        return { title, text, color, isSuccess };
    }
});