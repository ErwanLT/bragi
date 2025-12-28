/**
 * Le Camp du Lac Sanglant
 * Slasher Horror Refactor
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
        // Apply visual filters based on panic (No more shaking)
        const storyContainer = document.getElementById('story');
        if (storyContainer) {
            if (vars.panique > 60) {
                storyContainer.style.filter = `sepia(${vars.panique / 100}) saturate(${1 + vars.panique / 50}) brightness(${1 - vars.panique / 200})`;
            } else {
                storyContainer.style.filter = 'none';
            }
        }

        const healthColor = vars.vie < 30 ? 'text-primary animate-pulse' : 'text-primary/80';
        const panicColor = vars.panique > 70 ? 'text-red-600' : 'text-accent';

        return `
            <div class="space-y-10 font-body uppercase font-bold italic text-[14px]">
                
                <!-- Health / Life -->
                <div class="space-y-3">
                    <div class="flex justify-between items-center ${healthColor}">
                        <span class="flex items-center gap-2">
                            <span class="material-symbols-outlined text-sm">favorite</span> ÉTAT PHYSIQUE
                        </span>
                        <span class="text-xl font-heading tracking-widest">${vars.vie}%</span>
                    </div>
                    <div class="h-4 bg-black/60 border-2 border-primary/20 relative overflow-hidden">
                        <div class="absolute inset-0 bg-primary/80 transition-all duration-500" 
                             style="width: ${vars.vie}%">
                             <!-- Blood splatter pattern in bar -->
                             <div class="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]"></div>
                        </div>
                    </div>
                    ${vars.vie < 40 ? '<p class="text-[9px] text-primary italic lowercase tracking-tight animate-pulse font-bold">Saignement important...</p>' : ''}
                </div>

                <!-- Panic Gauge -->
                <div class="space-y-3 pt-4 border-t-2 border-primary/10">
                    <div class="flex justify-between items-center ${panicColor}">
                        <span class="flex items-center gap-2">
                            <span class="material-symbols-outlined text-sm">emergency_home</span> NIVEAU PANIQUE
                        </span>
                        <span>${vars.panique}%</span>
                    </div>
                    <div class="h-2 bg-black/60 relative">
                        <div class="h-full bg-accent transition-all duration-300 shadow-[0_0_15px_rgba(245,158,11,0.5)]" 
                             style="width: ${vars.panique}%"></div>
                    </div>
                </div>

                <!-- Survivors Tracker -->
                <div class="space-y-4 pt-4 border-t-2 border-primary/10">
                    <p class="text-[10px] tracking-[0.2em] opacity-60 text-center uppercase not-italic">Survivants au Camp</p>
                    <div class="flex justify-center gap-4">
                        ${Array(5).fill().map((_, i) => {
            const isDead = i >= vars.survivants;
            return `
                                <div class="flex flex-col items-center gap-1 ${isDead ? 'opacity-20 transition-all duration-1000 scale-90 grayscale' : 'text-secondary'}">
                                    <span class="material-symbols-outlined text-2xl">
                                        ${isDead ? 'skull' : 'person'}
                                    </span>
                                    <span class="text-[8px] font-bold tracking-tighter">${isDead ? 'DEAD' : 'ALIVE'}</span>
                                </div>
                            `;
        }).join('')}
                    </div>
                    <div class="text-center bg-black/40 py-2 border border-primary/10">
                        <span class="text-xs text-primary font-heading">${vars.survivants} / 5</span>
                    </div>
                </div>

            </div>
        `;
    },
    onComputeEnding: (vars, forceEnding) => {
        let title = 'TUÉ DANS LE NOIR';
        let text = 'Le tueur a été plus rapide que vous... Votre cri s\'éteint dans la forêt.';
        let color = '#ef4444'; // Blood Red
        let isSuccess = false;
        let isTerminal = false;

        if (vars.vie <= 0) {
            title = 'VICTIME DU LAC';
            text = 'Vous n\'êtes plus qu\'une statistique de plus. Le camp fermera à nouveau ses portes.';
            color = '#8a0303';
            isTerminal = true;
        } else if (vars.panique >= 100) {
            title = 'PANIQUE TOTALE';
            text = 'L\'adrénaline a figé votre corps. Vous êtes resté sur place, incapable de fuir, alors que la machette s\'abattait.';
            color = '#f59e0b';
            isTerminal = true;
        } else if (forceEnding) {
            let prefix = "";
            if (forceEnding === 'kill') {
                prefix = "Dernière confrontation. Vous avez pris le risque ultime. ";
            } else if (forceEnding === 'police') {
                prefix = "Le bout du tunnel. Les gyrophares bleus et rouges percent la nuit. ";
            }

            if (vars.survivants === 5) {
                title = 'FINAL SURVIVORS';
                text = prefix + 'Contre toute attente, vous avez sauvé tout le monde. Une fin de film parfaite.';
                color = '#10b981'; // Forest Green
                isSuccess = true;
            } else if (vars.survivants > 0) {
                title = 'SURVIVANT TRAUMATISÉ';
                text = prefix + `Vous êtes vivant, mais le silence de vos ${5 - vars.survivants} amis disparus pèsera lourd sur votre conscience.`;
                color = '#3b82f6'; // Blue
                isSuccess = true;
            } else {
                title = 'DERNIER SOUFFLE';
                text = prefix + 'Seul survivant du massacre. Vous sortez de la forêt couvert de sang, l\'unique témoin de l\'horreur.';
                color = '#f97316'; // Orange
                isSuccess = true;
            }
            isTerminal = true;
        }

        return isTerminal ? { title, text, color, isSuccess, isTerminal } : null;
    }
});
