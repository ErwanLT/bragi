/**
 * NEON CORTEX - VERSION EXTENDED
 * Cyberpunk Narrative - 30+ Sections
 */

setupF12Protection('../../magic_word.html');

new StoryEngine({
    storyId: 'neon_cortex',
    initialVariables: {
        synapse: 100, // Santé mentale / Intégrité (Game Over si 0)
        credits: 100, // Argent (Nécessaire pour certains choix)
        heat: 0,      // Niveau de recherche (Game Over si 100)
        data: 0,      // Progression du décryptage (Débloque des fins)
        tech: 0       // Compétence technique (Pour débloquer des choix)
    },
    clamping: {
        synapse: [0, 100],
        credits: [0, 5000],
        heat: [0, 100],
        data: [0, 100],
        tech: [0, 10]
    },
    onUpdateHUD: (vars) => {
        const synapseColor = vars.synapse < 30 ? 'text-[#ff00c1] animate-pulse' : 'text-[#00f3ff]';
        const heatColor = vars.heat > 80 ? 'bg-[#ff00c1] shadow-[0_0_10px_#ff00c1]' : 'bg-[#00f3ff]';

        return `
            <div class="space-y-6 font-mono text-xs">
                <div class="hud-module">
                    <div class="flex justify-between items-center mb-2">
                        <span class="uppercase tracking-widest text-slate-400 flex items-center gap-2">
                            <span class="material-symbols-outlined text-sm">psychology</span> Neural Sync
                        </span>
                        <span class="text-sm font-bold ${synapseColor}">${vars.synapse}%</span>
                    </div>
                    <div class="h-1 w-full bg-slate-800">
                        <div class="h-full bg-gradient-to-r from-[#00f3ff] to-[#0066ff] transition-all duration-500" 
                             style="width: ${vars.synapse}%"></div>
                    </div>
                </div>

                <div class="hud-module border-[#ff00c1] shadow-[0_0_15px_rgba(255,0,193,0.2)]">
                    <div class="flex justify-between items-center mb-2">
                        <span class="uppercase tracking-widest text-slate-400 flex items-center gap-2">
                            <span class="material-symbols-outlined text-sm">local_police</span> Wanted Level
                        </span>
                        <span class="text-sm font-bold text-[#ff00c1]">${vars.heat}%</span>
                    </div>
                    <div class="h-1 w-full bg-slate-800">
                        <div class="h-full ${heatColor} transition-all duration-500" 
                             style="width: ${vars.heat}%"></div>
                    </div>
                    ${vars.heat > 80 ? '<div class="text-[10px] text-[#ff00c1] mt-1 animate-pulse font-bold">⚠️ MAX TAC DETECTED</div>' : ''}
                </div>

                <div class="grid grid-cols-2 gap-2">
                    <div class="hud-module flex flex-col items-center justify-center p-2">
                        <span class="material-symbols-outlined text-[#ffd700] text-xl">payments</span>
                        <span class="text-lg font-bold text-white">¥${vars.credits}</span>
                    </div>
                    <div class="hud-module flex flex-col justify-center gap-1">
                        <div class="flex justify-between w-full">
                            <span class="text-[#00f3ff]">DATA</span>
                            <span>${vars.data}%</span>
                        </div>
                        <div class="flex justify-between w-full">
                            <span class="text-slate-400">TECH</span>
                            <span>LVL ${vars.tech}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    onComputeEnding: (vars, forceEnding) => {
        let title = 'FLATLINE';
        let text = 'Votre signal neural s\'est éteint.';
        let color = '#333';
        let isSuccess = false;
        let isTerminal = false;

        // Conditions de défaite automatique
        if (vars.synapse <= 0) {
            title = 'CYBERPSYCHOSE';
            text = 'Votre esprit s\'est fragmenté. Vous êtes devenu une machine à tuer sans âme, abattue par la Max-Tac dans une ruelle de Kabuki.';
            color = '#ff00c1';
            isTerminal = true;
        } else if (vars.heat >= 100) {
            title = 'ARRESTATION';
            text = 'Arasaka vous a coincé. Vous finirez vos jours dans une prison orbitale, votre cerveau scanné et archivé.';
            color = '#ff3333';
            isTerminal = true;
        } else if (vars.credits < 0) {
            // Protection simple contre les dettes (devrait être géré par les choix mais au cas où)
            vars.credits = 0;
        }

        // Fins scénarisées
        else if (forceEnding === 'rich') {
            title = 'LE ROI DE NIGHT CITY';
            text = 'Vous avez vendu la puce au plus offrant. Avec des millions de crédits, vous vivez dans le luxe, regardant la ville brûler depuis votre penthouse.';
            color = '#ffd700'; // Gold
            isSuccess = true;
            isTerminal = true;
        } else if (forceEnding === 'revolution') {
            title = 'LÉGENDE DU NET';
            text = 'Les secrets d\'Arasaka sont publics. La ville est en chaos, les corpos tombent. Vous êtes mort dans le processus, mais votre nom est immortel.';
            color = '#00f3ff'; // Cyan
            isSuccess = true;
            isTerminal = true;
        } else if (forceEnding === 'nomade') {
            title = 'LIBRE';
            text = 'Vous avez quitté la ville avec les Aldecaldos. La puce est détruite. Vous n\'êtes ni riche ni célèbre, mais vous êtes vivant et libre.';
            color = '#10b981'; // Green
            isSuccess = true;
            isTerminal = true;
        } else if (forceEnding === 'arasaka') {
            title = 'VENDU';
            text = 'Vous avez rendu la puce à Arasaka. Ils ont retiré la bombe de votre tête et vous ont donné un emploi de bureau. Une vie grise, sans âme.';
            color = '#aaaaaa';
            isSuccess = false; // Pas vraiment un succès moral
            isTerminal = true;
        } else if (forceEnding === 'dead') {
            title = 'MORT AU COMBAT';
            text = 'Une balle de trop. Un hack de trop. Vous êtes tombé en combattant, comme tant d\'autres avant vous.';
            color = '#555';
            isTerminal = true;
        }

        return isTerminal ? { title, text, color, isSuccess, isTerminal } : null;
    }
});