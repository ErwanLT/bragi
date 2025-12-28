/**
 * Le Manoir du Silence
 * Psychological Horror Refactor
 */

setupF12Protection('../../magic_word.html');

new StoryEngine({
    storyId: 'manor',
    initialVariables: {
        sanity: 100,
        battery: 100
    },
    clamping: {
        sanity: [0, 100],
        battery: [0, 100]
    },
    onUpdateHUD: (vars) => {
        // Pulse speed based on sanity
        const pulseRate = vars.sanity > 70 ? '1.5s' : (vars.sanity > 40 ? '0.8s' : '0.4s');
        const pulseColor = vars.sanity > 70 ? 'text-slate-400' : (vars.sanity > 40 ? 'text-orange-400' : 'text-accent animate-pulse');

        return `
            <div class="space-y-10 investigation-hud font-body italic text-[14px]">
                
                <!-- Battery Level -->
                <div class="space-y-4">
                    <div class="flex justify-between items-center text-[10px] tracking-[0.2em] font-heading not-italic opacity-60">
                        <span class="flex items-center gap-2">
                            <span class="material-symbols-outlined text-sm">battery_horiz_075</span> Alimentation Lampe
                        </span>
                        <span class="${vars.battery < 20 ? 'text-accent animate-pulse' : ''}">${vars.battery}%</span>
                    </div>
                    <div class="h-[1px] w-full bg-white/5 relative">
                        <div class="h-full bg-slate-300 transition-all duration-[2000ms] shadow-[0_0_10px_rgba(255,255,255,0.2)]" 
                             style="width: ${vars.battery}%"></div>
                    </div>
                </div>

                <!-- Heart Rate Monitor (Sanity) -->
                <div class="space-y-4 pt-4 border-t border-white/5">
                    <div class="flex justify-between items-center text-[10px] tracking-[0.2em] font-heading not-italic opacity-60">
                        <span class="flex items-center gap-2">
                            <span class="material-symbols-outlined text-sm">ecg</span> Rythme Cardiaque
                        </span>
                        <span>BPM: ${180 - vars.sanity}</span>
                    </div>
                    
                    <div class="flex items-center gap-2 h-12 justify-center">
                        <span class="material-symbols-outlined text-4xl ${pulseColor}" style="animation: pulse ${pulseRate} infinite ease-in-out">
                            favorite
                        </span>
                        <div class="flex-grow h-8 bg-white/5 rounded-sm relative overflow-hidden opacity-40">
                             <!-- Visual pulse wave -->
                             <div class="absolute inset-0 bg-gradient-to-r from-transparent via-current to-transparent w-full h-full ${pulseColor}"
                                  style="animation: slide 3s infinite linear; transform: translateX(-100%)"></div>
                        </div>
                    </div>
                    <p class="text-[9px] text-center opacity-40 uppercase tracking-widest font-heading not-italic">
                        ${vars.sanity < 30 ? 'État Critique : Dissociation en cours' : 'Sujet Stable'}
                    </p>
                </div>

                <!-- Investigation Time (Simulated from progression) -->
                <div class="pt-6 border-t border-white/5 flex flex-col items-center gap-3">
                     <span class="material-symbols-outlined text-slate-600">history_toggle_off</span>
                     <div class="text-center">
                        <p class="text-[10px] uppercase font-heading not-italic tracking-[0.3em] opacity-40">Horloge Interne</p>
                        <p class="text-lg text-slate-200">Session : ${vars.battery < 50 ? '02:45 AM' : '00:30 AM'}</p>
                     </div>
                </div>

            </div>

            <style>
                @keyframes slide {
                    from { transform: translateX(-100%); }
                    to { transform: translateX(100%); }
                }
            </style>
        `;
    },
    onComputeEnding: (vars, forceEnding) => {
        let title = 'PERDU DANS LE SILENCE';
        let text = 'Votre lampe s\'éteint... et les ombres du manoir vous réclament.';
        let color = '#2d3748'; // Cold Blue Gray
        let isSuccess = false;
        let isTerminal = false;

        if (forceEnding === 'flee') {
            title = 'ABANDON';
            text = 'Vous n\'avez pas osé franchir le seuil du grenier. La peur a été plus forte que la vérité.';
            color = '#4a5568';
            isTerminal = true;
        } else if (vars.battery <= 0) {
            title = 'OBSCURITÉ TOTALE';
            text = 'Plus de lumière. Le manoir n\'est plus qu\'un piège sans fin où vous errez pour l\'éternité.';
            color = '#000000';
            isTerminal = true;
        } else if (vars.sanity <= 0) {
            title = 'L\'ESPRIT ÉGARÉ';
            text = 'Le manoir ne vous a pas tué, il vous a absorbé. Vous êtes désormais l\'un des murmures que vous entendiez.';
            color = '#8a0303'; // Blood Red
            isTerminal = true;
        } else if (forceEnding) {
            title = 'SURVIVANT DES ARCHIVES';
            text = 'L\'aube se lève enfin. Vous quittez le manoir avec des réponses, mais un morceau de votre esprit restera à jamais dans ces couloirs.';
            color = '#a0aec0'; // Ash Gray
            isSuccess = true;
            isTerminal = true;
        }

        return isTerminal ? { title, text, color, isSuccess, isTerminal } : null;
    }
});