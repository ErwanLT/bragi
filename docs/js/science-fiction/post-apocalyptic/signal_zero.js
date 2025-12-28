/**
 * Signal Zéro - Transmission
 * Refactored using StoryEngine
 */

setupF12Protection('../../magic_word.html');

new StoryEngine({
    storyId: 'signal_zero',
    initialVariables: {
        signal: 100,
        squad: 4,
        ammo: 50
    },
    clamping: {
        signal: [0, 100],
        squad: [0, 4],
        ammo: [0, 100]
    },
    onUpdateHUD: (vars) => {
        const signalColor = vars.signal > 60 ? 'bg-primary' : (vars.signal > 20 ? 'bg-amber-600' : 'bg-red-600 animate-pulse');
        const ammoColor = vars.ammo > 15 ? 'text-primary' : (vars.ammo > 5 ? 'text-amber-500' : 'text-red-500 animate-pulse');

        // Generate squad icons
        let squadIcons = '';
        for (let i = 0; i < 4; i++) {
            const isActive = i < vars.squad;
            squadIcons += `
                <div class="size-8 flex items-center justify-center border-2 ${isActive ? 'border-primary bg-primary/10 text-primary' : 'border-white/5 text-white/5'}">
                    <span class="material-symbols-outlined text-[18px]">${isActive ? 'person' : 'person_off'}</span>
                </div>
            `;
        }

        return `
        <!-- Bunker Terminal HUD -->
        <div class="bg-surface-dark rounded-lg p-7 border border-primary/20 sticky top-24 shadow-[0_0_30px_rgba(255,152,0,0.05)] overflow-hidden relative group">
            <!-- Terminal glitch lines -->
            <div class="absolute inset-0 scanlines opacity-5 pointer-events-none"></div>
            
            <h3 class="text-primary font-bold text-lg mb-8 flex items-center justify-between font-terminal tracking-widest border-b border-primary/20 pb-4">
                CONSOLE_SYSTEM_v4.2
                <span class="material-symbols-outlined text-primary animate-pulse">terminal</span>
            </h3>
            
            <div class="space-y-8 relative z-10 font-terminal">
                <!-- Signal Intensity -->
                <div class="flex flex-col gap-3">
                    <div class="flex justify-between text-xs uppercase tracking-[0.2em] text-text-secondary">
                        <span class="flex items-center gap-2 italic">RSSI_SIGNAL</span>
                        <span class="text-primary font-bold">${vars.signal}%</span>
                    </div>
                    <div class="h-1.5 w-full bg-black/40 border border-white/5 rounded-full overflow-hidden">
                        <div class="h-full ${signalColor} transition-all duration-700 ease-out shadow-[0_0_10px_rgba(255,152,0,0.3)]" style="width: ${vars.signal}%"></div>
                    </div>
                </div>

                <!-- Squad Status -->
                <div class="flex flex-col gap-3">
                    <div class="flex justify-between text-xs uppercase tracking-[0.2em] text-text-secondary">
                        <span class="italic">SIGMA_SQUAD_UNITS</span>
                        <span class="text-primary font-bold uppercase">${vars.squad}/4 ACTIVE</span>
                    </div>
                    <div class="flex gap-3">
                        ${squadIcons}
                    </div>
                </div>

                <!-- Ammo Grid -->
                <div class="bg-black/40 p-5 border border-white/5 flex flex-col gap-2 relative">
                    <div class="flex items-center justify-between">
                         <span class="material-symbols-outlined ${ammoColor} text-3xl">flare</span>
                         <div class="text-right">
                             <div class="text-[10px] uppercase tracking-widest text-text-secondary">AMMO_CAPACITY</div>
                             <div class="text-3xl font-bold ${ammoColor} tracking-tighter">${vars.ammo}</div>
                         </div>
                    </div>
                    <!-- Small status mini-log -->
                    <div class="mt-4 pt-4 border-t border-white/5">
                        <p class="text-[10px] text-text-secondary uppercase tracking-widest leading-tight">
                            > STATUS: ${vars.ammo > 10 ? 'NOMINAL' : 'CRITICAL_LOW'}<br>
                            > LINK: STABLE_V3
                        </p>
                    </div>
                </div>
            </div>
        </div>
        `;
    },
    onComputeEnding: (vars, forceEnding) => {
        let title = 'SIGNAL PERDU';
        let text = 'La radio ne grésille plus. Le silence est définitif.';
        let color = '#555';
        let isSuccess = false;
        let isTerminal = false;

        if (vars.squad <= 0) {
            title = 'ESCOUADE ÉLIMINÉE';
            text = 'Vous avez guidé vos hommes vers la mort.';
            color = '#8a0303';
            isTerminal = true;
        } else if (vars.signal <= 0) {
            title = 'SILENCE RADIO';
            text = 'Vous ne pouvez plus les guider. Ils sont seuls dans le noir.';
            color = '#34495e';
            isTerminal = true;
        } else if (vars.ammo <= 0) {
            title = 'À BOUT DE SOUFFLE';
            text = 'Plus de munitions. Le dernier signal était un cri.';
            color = '#7f8c8d';
            isTerminal = true;
        } else if (forceEnding) {
            title = 'MISSION ACCOMPLISHED';
            text = `L'escouade a atteint la zone d'extraction. ${vars.squad} survivants.`;
            color = '#2ecc71';
            isSuccess = true;
            isTerminal = true;
        }

        return isTerminal ? { title, text, color, isSuccess, isTerminal } : null;
    }
});
