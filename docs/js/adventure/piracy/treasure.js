/**
 * Le Trésor de l'Île Maudite
 * Refactored using StoryEngine
 */

setupF12Protection('../../magic_word.html');

new StoryEngine({
    storyId: 'treasure',
    initialVariables: {
        loyalte: 100,
        vivres: 100,
        or: 100 // Starting gold
    },
    clamping: {
        loyalte: [0, 100],
        vivres: [0, 100],
        or: [0, 1000]
    },
    onUpdateHUD: (vars) => {
        // Calculate colors
        const loyalteColor = vars.loyalte > 50 ? 'bg-emerald-500' : (vars.loyalte > 20 ? 'bg-amber-500' : 'bg-red-600');
        const vivresColor = vars.vivres > 50 ? 'bg-emerald-500' : (vars.vivres > 20 ? 'bg-amber-500' : 'bg-red-600');
        const goldClass = vars.or > 500 ? 'text-primary' : 'text-white';

        return `
        <!-- Status Card -->
        <div class="bg-surface-dark rounded-xl p-6 border border-surface-highlight sticky top-24 shadow-xl">
            <h3 class="text-white font-bold text-lg mb-4 flex items-center justify-between font-display">
                Journal du Capitaine
                <span class="material-symbols-outlined text-text-secondary">import_contacts</span>
            </h3>
            <div class="space-y-5">
                <!-- Loyalty -->
                <div class="flex flex-col gap-1">
                    <div class="flex justify-between text-sm">
                        <span class="text-text-secondary flex items-center gap-2">
                            <span class="material-symbols-outlined text-primary text-[18px]">handshake</span> Loyauté
                        </span>
                        <span class="text-white font-bold">${vars.loyalte}%</span>
                    </div>
                    <div class="h-1.5 w-full bg-surface-highlight rounded-full overflow-hidden">
                        <div class="h-full ${loyalteColor} rounded-full transition-all duration-500" style="width: ${vars.loyalte}%"></div>
                    </div>
                </div>

                <!-- Provisions -->
                <div class="flex flex-col gap-1">
                    <div class="flex justify-between text-sm">
                        <span class="text-text-secondary flex items-center gap-2">
                            <span class="material-symbols-outlined text-rose-400 text-[18px]">set_meal</span> Vivres
                        </span>
                        <span class="text-white font-bold">${vars.vivres}%</span>
                    </div>
                    <div class="h-1.5 w-full bg-surface-highlight rounded-full overflow-hidden">
                        <div class="h-full ${vivresColor} rounded-full transition-all duration-500" style="width: ${vars.vivres}%"></div>
                    </div>
                </div>
                
                <!-- Gold -->
                <div class="flex items-center justify-between p-3 bg-surface-highlight/30 rounded-lg border border-white/5 mt-2">
                    <div class="flex items-center gap-3">
                        <div class="p-2 rounded-lg bg-primary/10">
                            <span class="material-symbols-outlined text-primary text-[24px]">savings</span>
                        </div>
                        <div class="flex flex-col">
                            <span class="text-text-secondary text-xs uppercase font-bold tracking-wider">Butin</span>
                            <span class="text-xl font-bold ${goldClass} font-display">${vars.or} <span class="text-sm font-normal text-white/50">pièces</span></span>
                        </div>
                    </div>
                </div>
            
            <!-- Treasure Map -->
            <div class="mt-6 pt-4 border-t border-white/5">
                <img src="../../img/adventure/piracy/treasure_map.png" alt="Carte au trésor" class="w-full rounded-lg border border-surface-highlight opacity-90 hover:opacity-100 transition-opacity duration-300 shadow-lg">
                <p class="text-center text-xs text-text-secondary mt-2 italic font-display tracking-widest">Carte de l'Île Maudite</p>
            </div>
            </div>
        </div>
        `;
    },
    onComputeEnding: (vars, forceEnding) => {
        let title = 'NAUFRAGE';
        let text = 'La mer a repris ce qu\'elle vous avait prêté.';
        let color = '#555';
        let isSuccess = false;
        let isTerminal = false;

        if (forceEnding === 'rich') {
            title = 'ROI DES PIRATES';
            text = 'Avec ce trésor, vous construisez une flotte. Votre nom fera trembler les sept mers !';
            color = '#ffd700';
            isSuccess = true;
            isTerminal = true;
        } else if (forceEnding === 'cursed') {
            title = 'LÉGENDE MAUDITE';
            text = 'L\'or est à vous, mais vos yeux brillent d\'une lueur violette. Vous ne vieillirez plus, mais vous ne connaîtrez plus le repos.';
            color = '#9b59b6';
            isSuccess = true;
            isTerminal = true;
        } else if (vars.loyalte <= 0) {
            title = 'MUTINERIE !';
            text = 'L\'équipage vous abandonne sur un îlot désert. Ils partent avec le navire.';
            color = '#8a0303';
            isTerminal = true;
        } else if (vars.vivres <= 0) {
            title = 'FAMINE';
            text = 'Le calme plat a duré trop longtemps. Les cales sont vides.';
            color = '#7f8c8d';
            isTerminal = true;
        } else if (vars.or <= 0) {
            title = 'BANQUEROUTE';
            text = 'Plus un sou pour payer les marins ou réparer le pont. Vous finissez aux fers pour dettes.';
            color = '#34495e';
            isTerminal = true;
        } else if (forceEnding) {
            title = 'RETOUR AU PORT';
            text = 'Pas de gloire, mais pas de mort. Une histoire à raconter à la taverne.';
            color = '#e6ccb2';
            isSuccess = true;
            isTerminal = true;
        }

        return isTerminal ? { title, text, color, isSuccess, isTerminal } : null;
    }
});