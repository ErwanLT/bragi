/**
 * La Quête du Code Ancestral
 * Refactored with "Hero Status" HUD logic
 */

setupF12Protection('../../magic_word.html');

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
        const karmaColor = vars.karma >= 70 ? 'text-green-600' : (vars.karma <= 30 ? 'text-red-700' : 'text-blue-700');
        const karmaIcon = vars.karma >= 70 ? 'auto_awesome' : (vars.karma <= 30 ? 'skull' : 'balance');
        const karmaLabel = vars.karma >= 70 ? 'HÉROS DE LUMIÈRE' : (vars.karma <= 30 ? 'MAGE NOIR' : 'NEUTRE');

        return `
            <div class="space-y-8 character-status text-[#2c1810]">
                <!-- Mana Gauge -->
                <div class="space-y-2">
                    <div class="flex justify-between items-center text-[10px] font-bold tracking-widest uppercase">
                        <span class="flex items-center gap-1"><span class="material-symbols-outlined text-sm">bolus</span> Énergies Magiques</span>
                        <span>${vars.mana}%</span>
                    </div>
                    <div class="h-3 w-full bg-[#2c1810]/5 rounded-full p-[2px] border border-[#2c1810]/10">
                        <div class="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-700 shadow-[0_0_10px_rgba(79,70,229,0.3)]"
                             style="width: ${vars.mana}%"></div>
                    </div>
                </div>

                <!-- XP Progression -->
                <div class="space-y-2">
                    <div class="flex justify-between items-center text-[10px] font-bold tracking-widest uppercase text-primary">
                        <span class="flex items-center gap-1 text-[#2c1810]"><span class="material-symbols-outlined text-sm text-[#2c1810]">star</span> Expérience</span>
                        <span class="text-[#2c1810]">${vars.xp} / 100</span>
                    </div>
                    <div class="h-3 w-full bg-[#2c1810]/5 rounded-full p-[2px] border border-[#2c1810]/10 overflow-hidden">
                        <div class="h-full bg-gradient-to-r from-yellow-500 to-amber-600 rounded-full transition-all duration-700 shadow-[0_0_10px_rgba(212,175,55,0.3)]"
                             style="width: ${Math.min(100, vars.xp)}%"></div>
                    </div>
                    <p class="text-[9px] text-center italic opacity-60">"Bientôt prêt pour le déploiement royal..."</p>
                </div>

                <!-- Karma Alignment -->
                <div class="pt-4 border-t border-[#2c1810]/10">
                    <div class="flex flex-col items-center gap-3">
                        <span class="material-symbols-outlined text-4xl ${karmaColor} drop-shadow-sm">${karmaIcon}</span>
                        <div class="text-center">
                            <span class="text-[9px] font-bold tracking-[0.2em] block opacity-60 uppercase mb-1">Alignement</span>
                            <span class="text-xs font-bold ${karmaColor} tracking-widest">${karmaLabel}</span>
                        </div>
                    </div>
                </div>

                <!-- Discovery Map -->
                <div class="pt-4 border-t border-[#2c1810]/10 space-y-3">
                    <div class="flex justify-between items-center text-[9px] font-bold tracking-widest opacity-60 uppercase">
                        <span>Exploration du Legacy</span>
                        <span>${Math.floor(vars.xp / 8)} / 12</span>
                    </div>
                    <div class="grid grid-cols-4 gap-1.5 px-2">
                        ${Array(12).fill().map((_, i) => {
            const isRevealed = vars.xp >= (i + 1) * 8;
            return `<div class="aspect-square rounded-sm border ${isRevealed ? 'bg-primary border-primary shadow-[0_0_8px_rgba(212,175,55,0.4)]' : 'bg-black/5 border-black/10 transition-colors duration-1000'}"></div>`;
        }).join('')}
                    </div>
                </div>
            </div>
        `;
    },
    onComputeEnding: (vars, forceEnding) => {
        let title = 'GAME OVER';
        let text = 'Votre quête s\'arrête ici.';
        let color = '#d4af37'; // Gold
        let isSuccess = false;
        let isTerminal = false;

        if (vars.xp >= 100 && forceEnding) {
            title = 'GRAND ARCHIMAGE (CTO LÉGENDAIRE)';
            text = 'Vous avez maîtrisé le code et le destin. Le royaume est sauvé grâce à votre architecture parfaite.';
            color = '#d4af37';
            isSuccess = true;
            isTerminal = true;
        } else if (vars.mana <= 0) {
            title = 'BURN-OUT MAGIQUE';
            text = 'Plus d\'énergie pour coder les sorts. Vous devenez un simple villageois, hanté par vos commits inachevés.';
            color = '#4a5568'; // Slate
            isTerminal = true;
        } else if (vars.karma <= 20) {
            title = 'SORCIER NOIR DU LEGACY';
            text = 'Le pouvoir vous a corrompu. Vous régnez par la terreur et les bugs volontaires sur le royaume de la Prod.';
            color = '#8a0303'; // Blood Red
            isSuccess = true;
            isTerminal = true;
        } else if (forceEnding) {
            title = 'DÉVELOPPEUR JUNIOR (RÉSISTANCE)';
            text = 'Vous avez survécu au donjon, mais il vous reste tant d\'heures de bug report à corriger.';
            color = '#38a169'; // Green
            isSuccess = true;
            isTerminal = true;
        }

        return isTerminal ? { title, text, color, isSuccess, isTerminal } : null;
    }
});