setupF12Protection('../../magic_word.html');

const story = new StoryEngine({
    storyId: 'dernier_souffle',
    initialVariables: {
        chaleur: 100,
        energie: 100,
        mental: 100
    },
    clamping: {
        chaleur: [0, 100],
        energie: [0, 100],
        mental: [0, 100]
    },
    onUpdateHUD: (vars) => {
        // Show saving indicator if it exists
        const indicator = document.getElementById('save-indicator');
        if (indicator) {
            indicator.classList.remove('opacity-0');
            indicator.classList.add('opacity-100');
            setTimeout(() => {
                indicator.classList.remove('opacity-100');
                indicator.classList.add('opacity-0');
            }, 2000);
        }

        const getStatus = (val) => {
            if (val <= 20) return 'text-rose-500 animate-pulse font-bold';
            if (val <= 50) return 'text-sky-500';
            return 'text-sky-300';
        };

        return `
            <div class="hud-stat">
                <div class="flex justify-between items-center mb-1">
                    <span class="text-[10px] uppercase tracking-widest text-slate-400">Température Corporelle</span>
                    <span class="text-xs ${getStatus(vars.chaleur)}">${vars.chaleur}%</span>
                </div>
                <div class="progress-bar-bg">
                    <div class="progress-bar-fill bg-sky-400" style="width: ${vars.chaleur}%"></div>
                </div>
            </div>

            <div class="hud-stat">
                <div class="flex justify-between items-center mb-1">
                    <span class="text-[10px] uppercase tracking-widest text-slate-400">Réserves Énergie</span>
                    <span class="text-xs ${getStatus(vars.energie)}">${vars.energie}%</span>
                </div>
                <div class="progress-bar-bg">
                    <div class="progress-bar-fill bg-orange-400" style="width: ${vars.energie}%"></div>
                </div>
            </div>

            <div class="hud-stat">
                <div class="flex justify-between items-center mb-1">
                    <span class="text-[10px] uppercase tracking-widest text-slate-400">État Mental</span>
                    <span class="text-xs ${getStatus(vars.mental)}">${vars.mental}%</span>
                </div>
                <div class="progress-bar-bg">
                    <div class="progress-bar-fill bg-purple-400" style="width: ${vars.mental}%"></div>
                </div>
            </div>
        `;
    },
    onComputeEnding: (vars, forceEnding) => {
        // Lose Conditions
        if (vars.chaleur <= 0) {
            return {
                isTerminal: true,
                isSuccess: false,
                title: "Hypothermie",
                text: "Le froid a fini par engourdir vos sens. Vous vous endormez dans la neige, pour ne plus jamais vous réveiller.",
                color: "#60a5fa"
            };
        }
        if (vars.energie <= 0) {
            return {
                isTerminal: true,
                isSuccess: false,
                title: "Épuisement Total",
                text: "Vos muscles refusent de bouger. Le blizzard vous recouvre lentement alors que vos forces vous abandonnent.",
                color: "#fb923c"
            };
        }
        if (vars.mental <= 0) {
            return {
                isTerminal: true,
                isSuccess: false,
                title: "Perdu dans le Néant",
                text: "La solitude et le vent ont brisé votre esprit. Vous marchez sans but jusqu'à ce que le monde disparaisse.",
                color: "#a78bfa"
            };
        }

        // Forced Endings (Story Specific)
        if (forceEnding === 'REACH_OUTPOST') {
            return {
                isTerminal: true,
                isSuccess: true,
                title: "La Lumière dans la Nuit",
                text: "Vous voyez enfin les lumières de la station météo. Vous êtes sauvé. Vous avez survécu à l'impossible.",
                color: "#10b981"
            };
        }

        return null;
    }
});
