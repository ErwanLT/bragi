/**
 * Kubrick 9 - Station orbitale
 * Refactored with high-tech Biometric HUD
 */

setupF12Protection('../magic_word.html');

new StoryEngine({
    storyId: 'kubrick9',
    initialVariables: {
        sanity: 100,
        integrity: 100,
        pulse: 80
    },
    clamping: {
        sanity: [0, 100],
        integrity: [0, 100],
        pulse: [40, 200]
    },
    onUpdateHUD: (vars) => {
        const pulseColor = vars.pulse > 140 ? 'text-red-500' : (vars.pulse > 110 ? 'text-orange-400' : 'text-primary');
        const pulseAnim = vars.pulse > 140 ? 'animate-[pulse_0.4s_infinite]' : (vars.pulse > 110 ? 'animate-[pulse_0.7s_infinite]' : 'animate-[pulse_1.2s_infinite]');

        return `
            <div class="space-y-6">
                <!-- Neural Stability -->
                <div class="hud-card">
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-[10px] uppercase tracking-widest text-primary/80 flex items-center gap-2">
                            <span class="material-symbols-outlined text-sm">psychology</span> Stabilité Neurale
                        </span>
                        <span class="text-xs font-bold ${vars.sanity < 30 ? 'text-red-500 animate-pulse' : 'text-primary'}">${vars.sanity}%</span>
                    </div>
                    <div class="h-1.5 w-full bg-primary/10 rounded-full overflow-hidden border border-primary/5">
                        <div class="h-full bg-gradient-to-r from-primary/40 to-primary transition-all duration-500 shadow-[0_0_10px_rgba(77,182,172,0.4)]" 
                             style="width: ${vars.sanity}%"></div>
                    </div>
                    ${vars.sanity < 30 ? '<p class="text-[9px] mt-1 text-red-500 font-bold uppercase tracking-tighter">CRITICAL: DISSOCIATION DETECTED</p>' : ''}
                </div>

                <!-- Hull Integrity -->
                <div class="hud-card border-l-cyan-400 shadow-[inset_-20px_0_20px_-20px_rgba(34,211,238,0.1)]">
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-[10px] uppercase tracking-widest text-cyan-400/80 flex items-center gap-2">
                            <span class="material-symbols-outlined text-sm">shield</span> Intégrité Station
                        </span>
                        <span class="text-xs font-bold text-cyan-400">${vars.integrity}%</span>
                    </div>
                    <div class="h-1.5 w-full bg-cyan-400/10 rounded-full overflow-hidden border border-cyan-400/5">
                        <div class="h-full bg-gradient-to-r from-cyan-400/40 to-cyan-400 transition-all duration-500" 
                             style="width: ${vars.integrity}%"></div>
                    </div>
                </div>

                <!-- Heart Rate Monitor -->
                <div class="hud-card ${vars.pulse > 140 ? 'border-l-red-500 shadow-[inset_0_0_30px_rgba(239,68,68,0.1)]' : ''}">
                    <div class="flex justify-between items-center mb-1">
                        <span class="text-[10px] uppercase tracking-widest text-primary/80 flex items-center gap-2">
                            <span class="material-symbols-outlined text-sm">favorite</span> Rythme Cardiaque
                        </span>
                        <span class="text-xs font-bold ${pulseColor}">${vars.pulse} BPM</span>
                    </div>
                    
                    <div class="flex items-end gap-[2px] h-8 bg-black/40 rounded-sm border border-primary/5 p-1 relative overflow-hidden group">
                        <!-- Simulated Heart Pulse Grid -->
                        <div class="absolute inset-0 flex items-center justify-around opacity-20 pointer-events-none">
                             ${Array(15).fill().map(() => `<div class="w-[1px] h-full bg-primary/20"></div>`).join('')}
                        </div>
                        
                        <!-- Pulse Icon -->
                        <div class="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 ${pulseAnim} ${pulseColor}">
                            <span class="material-symbols-outlined text-sm">ecg</span>
                            ${vars.pulse > 140 ? '<span class="text-[8px] font-bold">WARNING</span>' : ''}
                        </div>

                        <!-- Mini bars for visual activity -->
                        ${Array(12).fill().map((_, i) => {
            const height = 20 + Math.random() * 60;
            const delay = i * 0.1;
            return `<div class="flex-grow bg-primary/40 rounded-t-[1px] animate-[pulse_1s_infinite]" 
                                         style="height: ${height}%; animation-delay: ${delay}s; opacity: ${0.3 + (i / 12) * 0.7}"></div>`;
        }).join('')}
                    </div>
                </div>
            </div>
        `;
    },
    onComputeEnding: (vars, forceEnding) => {
        let title = 'PERDU DANS L\'ESPACE';
        let text = 'La station devient votre cercueil d\'acier.';
        let color = '#4db6ac';
        let isSuccess = false;
        let isTerminal = false;

        if (vars.integrity <= 0) {
            title = 'DÉCOMPRESSION TOTALE';
            text = 'La coque a cédé. Votre dernier souffle gèle instantanément dans le vide sidéral.';
            color = '#22d3ee'; // Cyan
            isTerminal = true;
        } else if (vars.sanity <= 0) {
            title = 'ISOLEMENT TOTAL';
            text = 'L\'IA n\'est pas la seule à avoir perdu la raison. Vous déconnectez les derniers câbles de votre propre esprit.';
            color = '#ef4444'; // Red
            isTerminal = true;
        } else if (vars.pulse >= 180) {
            title = 'ARRÊT CARDIAQUE';
            text = 'La peur a été plus forte que votre cœur. Le monitoring s\'arrête sur un bip continu.';
            color = '#f87171'; // Light Red
            isTerminal = true;
        } else if (forceEnding) {
            title = 'MISSION ACCOMPLIE';
            text = 'Vous avez repris le contrôle de la station. Kubrick-9 est à nouveau silencieuse, attendant la relève.';
            color = '#4db6ac'; // Teal
            isSuccess = true;
            isTerminal = true;
        }

        return isTerminal ? { title, text, color, isSuccess, isTerminal } : null;
    }
});