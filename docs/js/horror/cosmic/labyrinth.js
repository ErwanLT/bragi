/**
 * Le Labyrinthe Oublié
 * Cosmic Horror Refactor
 */

setupF12Protection('../../magic_word.html');

new StoryEngine({
    storyId: 'labyrinth',
    initialVariables: {
        sanity: 100,
        light: 100,
        orientation: 0
    },
    clamping: {
        sanity: [0, 100],
        light: [0, 100],
        orientation: [0, 100]
    },
    onUpdateHUD: (vars) => {
        // Apply visual distortion based on sanity
        const distortion = vars.sanity < 40 ? `blur(${(40 - vars.sanity) / 10}px) contrast(${1 + (40 - vars.sanity) / 40})` : 'none';
        const body = document.body;
        body.style.filter = distortion;

        // Dynamic classes based on levels
        const lightPulse = vars.light < 30 ? 'animate-pulse text-secondary' : 'text-secondary/80';
        const sanityShake = vars.sanity < 30 ? 'animate-[bounce_0.2s_infinite] text-primary' : 'text-primary/60';

        return `
            <div class="space-y-8 font-heading uppercase tracking-widest text-[10px]">
                
                <!-- Light / Lantern -->
                <div class="space-y-3">
                    <div class="flex justify-between items-center ${lightPulse}">
                        <span class="flex items-center gap-2">
                            <span class="material-symbols-outlined text-sm">light_mode</span> Lanterne
                        </span>
                        <span class="font-bold">${vars.light}%</span>
                    </div>
                    <div class="h-[2px] w-full bg-white/5 relative overflow-hidden">
                        <div class="absolute inset-0 bg-secondary shadow-[0_0_15px_#d4af37] transition-all duration-1000" 
                             style="width: ${vars.light}%; opacity: ${0.3 + (vars.light / 100) * 0.7}"></div>
                    </div>
                    ${vars.light < 20 ? '<p class="text-[8px] text-secondary/40 animate-pulse italic">L\'huile s\'épuise... l\'ombre approche.</p>' : ''}
                </div>

                <!-- Sanity -->
                <div class="space-y-3">
                    <div class="flex justify-between items-center ${sanityShake}">
                        <span class="flex items-center gap-2">
                            <span class="material-symbols-outlined text-sm">psychology</span> Psyché
                        </span>
                        <span class="font-bold">${vars.sanity}%</span>
                    </div>
                    <div class="grid grid-cols-10 gap-1 h-[2px]">
                        ${Array(10).fill().map((_, i) => {
            const opacity = vars.sanity > (i * 10) ? 'bg-primary shadow-[0_0_5px_#ff3333]' : 'bg-white/5';
            return `<div class="h-full ${opacity} transition-all duration-500"></div>`;
        }).join('')}
                    </div>
                </div>

                <!-- Orientation / Compass -->
                <div class="pt-6 border-t border-white/5">
                    <div class="flex flex-col items-center gap-4 text-primary/40">
                        <div class="relative w-16 h-16 flex items-center justify-center border border-current rounded-full transition-transform duration-700" 
                             style="transform: rotate(${vars.orientation * 3.6}deg)">
                            <span class="material-symbols-outlined text-2xl">explore</span>
                            <div class="absolute top-0 w-[1px] h-2 bg-primary animate-flicker"></div>
                        </div>
                        <div class="text-center">
                            <span class="text-[8px] block mb-1 opacity-60">Orientation</span>
                            <span class="text-xs text-primary tracking-[0.3em]">${vars.orientation}%</span>
                        </div>
                    </div>
                </div>

            </div>
        `;
    },
    onComputeEnding: (vars, forceEnding) => {
        let title = 'PERDU DANS LES TÉNÈBRES';
        let text = 'Vos os rejoindront ceux des autres.';
        let color = '#ff3333';
        let isSuccess = false;
        let isTerminal = false;

        if (forceEnding === 'escaped') {
            title = 'LIBÉRATION';
            text = 'La lumière du jour brûle vos yeux désaccoutumés. Vous êtes libre, mais le silence du labyrinthe résonnera à jamais dans votre esprit.';
            color = '#fdfbf7';
            isSuccess = true;
            isTerminal = true;
        } else if (vars.light <= 0) {
            title = 'DÉVORÉ PAR L\'OMBRE';
            text = 'La lanterne s\'éteint. Le silence n\'est plus absolu ; quelque chose glisse sur le sol de pierre vers vous.';
            color = '#000000';
            isTerminal = true;
        } else if (vars.sanity <= 0) {
            title = 'L\'ESPRIT BRISÉ';
            text = 'Le labyrinthe n\'a plus de murs, seulement des souvenirs qui hurlent. Vous faites désormais partie du décor.';
            color = '#4a0e0e';
            isTerminal = true;
        } else if (vars.orientation >= 100) {
            title = 'CARTOGRAPHE DE L\'IMPOSSIBLE';
            text = 'Vous avez percé les secrets de cette géométrie non-euclidienne. Vous sortez triomphant, porteur d\'une connaissance interdite.';
            color = '#d4af37';
            isSuccess = true;
            isTerminal = true;
        } else if (forceEnding) {
            title = 'PERDITION';
            text = 'Vous n\'avez pas trouvé la sortie. Le temps n\'a plus cours ici.';
            color = '#2c2c2c';
            isTerminal = true;
        }

        return isTerminal ? { title, text, color, isSuccess, isTerminal } : null;
    }
});