/**
 * L'OMBRE DE L'ABÎME - Configuration du Moteur
 */

// Protection anti-triche
setupF12Protection('../../magic_word.html');

// Initialisation des variables de l'histoire
const initialVariables = {
    sanity: 80,
    corruption: 0,
    blood: 50
};

// Configuration de l'Engine
const storyConfig = {
    storyId: 'abyss',
    initialVariables: initialVariables,
    clamping: {
        sanity: [0, 100],
        corruption: [0, 100],
        blood: [0, 100]
    },

    // Mise à jour de l'interface (HUD)
    onUpdateHUD: (state) => {
        // Calcul du statut de corruption
        let status = "Pur";
        let statusColor = "text-emerald-400";
        if (state.corruption > 60) { status = "Maudit"; statusColor = "text-red-600"; }
        else if (state.corruption > 30) { status = "Souillé"; statusColor = "text-orange-500"; }

        return `
            <div class="space-y-6 font-mono">
                <div class="hud-item flex justify-between items-center border-b border-white/5 pb-2">
                    <span class="text-slate-500 text-[10px] tracking-widest uppercase">Équilibre Mental</span>
                    <span class="font-bold ${state.sanity < 30 ? 'text-red-500 animate-pulse' : 'text-white'}">${state.sanity}%</span>
                </div>
                
                <div class="hud-item flex justify-between items-center border-b border-white/5 pb-2">
                    <span class="text-slate-500 text-[10px] tracking-widest uppercase">Essence Vitale</span>
                    <span class="font-bold text-red-500">${state.blood} / 100</span>
                </div>

                <div class="hud-item space-y-3">
                    <div class="flex justify-between items-center">
                        <span class="text-slate-500 text-[10px] tracking-widest uppercase">État de l'Âme</span>
                        <span class="font-bold ${statusColor} uppercase text-[9px] tracking-tighter">${status}</span>
                    </div>
                    <div class="corruption-bar-container h-1.5 w-full bg-black/40 rounded-full border border-white/5 overflow-hidden">
                        <div class="corruption-bar-fill h-full transition-all duration-1000 ease-out" 
                             style="width: ${state.corruption}%; background: linear-gradient(90deg, #94a3b8, #ef4444, #7f1d1d); box-shadow: 0 0 10px ${statusColor === 'text-red-600' ? 'rgba(239, 68, 68, 0.4)' : 'transparent'}">
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // Calcul des fins
    onComputeEnding: (state, forceEnding) => {
        const endings = {
            folie: {
                title: "Labyrinthe de l'Esprit",
                text: "Votre esprit se brise face à l'immensité de l'Abîme. Vous n'êtes plus qu'une ombre hurlante dans les couloirs du temps.",
                color: "#ef4444",
                isSuccess: false,
                isTerminal: true
            },
            mort: {
                title: "Retour à la Poussière",
                text: "Votre sang irrigue la terre desséchée de l'Ancien Royaume. Le cycle continue, sans vous.",
                color: "#7f1d1d",
                isSuccess: false,
                isTerminal: true
            },
            corruption_totale: {
                title: "Vaisseau des Ténèbres",
                text: "Il n'y a plus rien d'humain en vous. Vous êtes devenu ce que vous étiez censé détruire.",
                color: "#991b1b",
                isSuccess: false,
                isTerminal: true
            },
            redemption: {
                title: "Lumière dans les Ténèbres",
                text: "L'amulette brille d'un éclat pur. Vous avez purifié l'Abîme au prix d'un immense sacrifice.",
                color: "#fbbf24",
                isSuccess: true,
                isTerminal: true
            },
            seigneur_abime: {
                title: "Le Nouveau Trône",
                text: "L'Abîme vous reconnaît comme son maître. Les ombres se courbent devant votre volonté.",
                color: "#ef4444",
                isSuccess: true,
                isTerminal: true
            }
        };

        if (state.sanity <= 0) return endings.folie;
        if (state.blood <= 0) return endings.mort;
        if (state.corruption >= 100) return endings.corruption_totale;

        if (forceEnding) {
            if (state.corruption < 30) return endings.redemption;
            return endings.seigneur_abime;
        }

        return null;
    }
};

// Initialisation de l'Engine
if (window.StoryEngine) {
    window.engine = new StoryEngine(storyConfig);
}
