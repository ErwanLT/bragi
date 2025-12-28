/**
 * Dossier: ombres de Chicago - 1932
 * Refactored using StoryEngine
 */

setupF12Protection('../../magic_word.html');

new StoryEngine({
    storyId: 'prohibition',
    initialVariables: {
        indices: 0,
        respect: 50,
        sangFroid: 80
    },
    clamping: {
        indices: [0, 100],
        respect: [0, 100],
        sangFroid: [0, 100]
    },
    onUpdateHUD: (vars) => {
        const indicesColor = vars.indices > 70 ? 'bg-primary' : (vars.indices > 40 ? 'bg-amber-600' : 'bg-slate-600');
        const sangFroidColor = vars.sangFroid > 60 ? 'bg-cyan-600' : (vars.sangFroid > 30 ? 'bg-amber-600' : 'bg-red-600');
        const respectColor = vars.respect > 70 ? 'text-primary' : (vars.respect > 40 ? 'text-white' : 'text-red-500');

        return `
        <!-- Case File Card -->
        <div class="bg-surface-dark rounded-sm p-6 border border-white/10 sticky top-24 shadow-[0_30px_60px_rgba(0,0,0,0.8)]">
            <h3 class="text-white font-bold text-lg mb-6 flex items-center justify-between font-noir tracking-widest border-b border-primary/20 pb-4">
                PIÈCES À CONVICTION
                <span class="material-symbols-outlined text-primary opacity-50">folder_open</span>
            </h3>
            <div class="space-y-6 font-typewriter">
                <!-- Indices -->
                <div class="flex flex-col gap-2">
                    <div class="flex justify-between text-[10px] uppercase tracking-widest text-text-secondary">
                        <span class="flex items-center gap-2 italic">Indices trouvés</span>
                        <span class="text-white font-bold">${vars.indices}%</span>
                    </div>
                    <div class="h-1 w-full bg-black/40 border border-white/5 rounded-full overflow-hidden">
                        <div class="h-full ${indicesColor} transition-all duration-700 shadow-[0_0_10px_rgba(212,175,55,0.2)]" style="width: ${vars.indices}%"></div>
                    </div>
                </div>

                <!-- Sang-Froid -->
                <div class="flex flex-col gap-2">
                    <div class="flex justify-between text-[10px] uppercase tracking-widest text-text-secondary">
                        <span class="flex items-center gap-2 italic">Sang-Froid</span>
                        <span class="text-white font-bold">${vars.sangFroid}%</span>
                    </div>
                    <div class="h-1 w-full bg-black/40 border border-white/5 rounded-full overflow-hidden">
                        <div class="h-full ${sangFroidColor} transition-all duration-700" style="width: ${vars.sangFroid}%"></div>
                    </div>
                </div>
                
                <!-- Respect Mafia -->
                <div class="flex items-center justify-between p-4 bg-black/20 rounded-sm border border-white/5 mt-4">
                    <div class="flex items-center gap-4">
                        <div class="p-2 bg-surface-highlight border border-white/10">
                            <span class="material-symbols-outlined text-primary text-[20px]">handshake</span>
                        </div>
                        <div class="flex flex-col">
                            <span class="text-[9px] uppercase font-bold tracking-[0.2em] text-text-secondary">Respect Mafia</span>
                            <span class="text-sm font-bold ${respectColor} tracking-tighter uppercase font-noir mt-0.5">${vars.respect}%</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Typewriter Ribbon Decoration -->
            <div class="mt-8 flex justify-center opacity-20">
                <div class="h-[2px] w-24 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
            </div>
        </div>
        `;
    },
    onComputeEnding: (vars, forceEnding) => {
        let title = 'AFFAIRE CLASSÉE';
        let text = ' Chicago a raison de vous. Le crime paie, mais pas pour vous.';
        let color = '#555';
        let isSuccess = false;
        let isTerminal = false;

        if (vars.indices >= 80 && forceEnding) {
            title = 'AFFAIRE RÉSOLUE';
            text = 'Capone ira en prison. Vous êtes le héros de Chicago.';
            color = '#000';
            isSuccess = true;
            isTerminal = true;
        } else if (vars.sangFroid <= 0) {
            title = 'CRAQUAGE';
            text = 'La pression était trop forte. Vous avez rendu votre badge et votre arme.';
            color = '#8a0303';
            isTerminal = true;
        } else if (vars.respect <= 0) {
            title = 'DESCENDU';
            text = 'Vous avez posé trop de questions aux mauvaises personnes. Sans respect, on ne survit pas longtemps.';
            color = '#333';
            isTerminal = true;
        } else if (forceEnding) {
            title = 'PREUVES INSUFFISANTES';
            text = 'Le Capitaine secoue la tête. "C\'est tout ce que vous avez ?" Capone est relâché faute de preuves.';
            color = '#666';
            isTerminal = true;
        }

        return isTerminal ? { title, text, color, isSuccess, isTerminal } : null;
    }
});