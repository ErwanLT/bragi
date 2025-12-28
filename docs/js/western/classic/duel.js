/**
 * Le Dernier Duel
 * Refactored using StoryEngine
 */

setupF12Protection('../../magic_word.html');

new StoryEngine({
    storyId: 'duel',
    initialVariables: {
        fortune: 50,
        honneur: 50,
        munitions: 6
    },
    clamping: {
        fortune: [0, 1000],
        honneur: [0, 100],
        munitions: [0, 20]
    },
    onUpdateHUD: (vars) => {
        const honneurColor = vars.honneur > 70 ? 'bg-primary' : (vars.honneur > 30 ? 'bg-amber-700' : 'bg-red-900');
        const munitionsColor = vars.munitions > 3 ? 'text-primary' : 'text-secondary';

        return `
        <!-- Sheriff's Record Card -->
        <div class="bg-surface-dark rounded-xl p-7 border border-white/5 sticky top-24 shadow-2xl overflow-hidden relative group">
            <!-- Decorative Star backdrop -->
            <span class="material-symbols-outlined absolute -right-4 -top-4 text-[120px] text-white/5 rotate-12 transition-transform duration-700 group-hover:rotate-45">star</span>
            
            <h3 class="text-white font-bold text-lg mb-8 flex items-center justify-between font-heading tracking-[0.2em] border-b border-primary/20 pb-4">
                REGISTRE DU SHERIFF
                <span class="material-symbols-outlined text-primary">menu_book</span>
            </h3>
            
            <div class="space-y-8 relative z-10">
                <!-- Honor -->
                <div class="flex flex-col gap-3">
                    <div class="flex justify-between text-[10px] uppercase tracking-[0.2em] text-text-secondary font-western">
                        <span class="flex items-center gap-2">Reputation / Honneur</span>
                        <span class="text-white font-bold">${vars.honneur}%</span>
                    </div>
                    <div class="h-1.5 w-full bg-black/40 border border-white/5 rounded-full overflow-hidden">
                        <div class="h-full ${honneurColor} transition-all duration-1000 ease-out" style="width: ${vars.honneur}%"></div>
                    </div>
                </div>

                <!-- Ammo & Wealth Grid -->
                <div class="grid grid-cols-2 gap-4">
                    <!-- Ammo -->
                    <div class="bg-black/20 p-4 rounded-lg border border-white/5 flex flex-col gap-1 items-center justify-center">
                        <span class="material-symbols-outlined ${munitionsColor} text-3xl mb-1">flare</span>
                        <span class="text-[9px] uppercase tracking-widest text-text-secondary font-western">Balles</span>
                        <span class="text-2xl font-heading text-white tracking-widest">${vars.munitions}</span>
                    </div>
                    
                    <!-- Wealth -->
                    <div class="bg-black/20 p-4 rounded-lg border border-white/5 flex flex-col gap-1 items-center justify-center">
                        <span class="material-symbols-outlined text-primary text-3xl mb-1">payments</span>
                        <span class="text-[9px] uppercase tracking-widest text-text-secondary font-western">Bourses</span>
                        <span class="text-2xl font-heading text-white tracking-widest">$${vars.fortune}</span>
                    </div>
                </div>
                
                <!-- Extra status info -->
                <div class="pt-4 border-t border-white/5 text-center">
                    <p class="text-[9px] text-text-secondary font-western italic opacity-50">"La loi n'atteint pas l'horizon..."</p>
                </div>
            </div>
        </div>
        `;
    },
    onComputeEnding: (vars, forceEnding) => {
        let title = 'MORT DANS LA POUSSIÈRE';
        let text = 'Le croque-mort a déjà pris vos mesures.';
        let color = '#555';
        let isSuccess = false;
        let isTerminal = false;

        if (vars.honneur >= 80 && vars.fortune >= 100 && forceEnding) {
            title = 'LÉGENDE DE L\'OUEST';
            text = 'Riche et respecté. Votre nom restera gravé dans l\'histoire.';
            color = '#ffd700';
            isSuccess = true;
            isTerminal = true;
        } else if (vars.honneur <= 20) {
            title = 'HORS-LA-LOI';
            text = 'Votre tête est mise à prix. Vous fuyez vers le Mexique.';
            color = '#8a0303';
            isSuccess = true;
            isTerminal = true;
        } else if (vars.munitions <= 0) {
            title = 'À SEC';
            text = 'Un duel sans balles est une exécution. Vous n\'avez pas tiré le premier.';
            color = '#333';
            isTerminal = true;
        } else if (forceEnding) {
            title = 'JUSTICE EST FAITE';
            text = 'Le bandit est sous les verrous. Chicago respire... enfin, le saloon.';
            color = '#2ecc71';
            isSuccess = true;
            isTerminal = true;
        }

        return isTerminal ? { title, text, color, isSuccess, isTerminal } : null;
    }
});