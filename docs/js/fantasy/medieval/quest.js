// Setup security
setupF12Protection('../../magic_word.html');

// Expose functions to global scope for HTML access
window.applyChoice = applyChoice;
window.computeEnding = computeEnding;

const variables = { mana: 50, xp: 0, karma: 50 };
const choices = {}; // Stores chosen values for each section index

function updateDisplay() {
    const hud = document.getElementById('hud');
    if (hud) {
        hud.innerHTML = `
            <div>✨ MANA: ${variables.mana}</div>
            <div>⚔️ XP: ${variables.xp}</div>
            <div>⚖️ KARMA: ${variables.karma}</div>
        `;
    }
}

function applyChoice(btn) {
    const section = btn.closest('.section');
    const sections = Array.from(document.querySelectorAll('.section'));
    const index = sections.indexOf(section);

    // Get new values
    const m = Number(btn.dataset.mana || 0);
    const x = Number(btn.dataset.xp || 0);
    const k = Number(btn.dataset.karma || 0);

    // Store choice
    choices[index] = { mana: m, xp: x, karma: k };

    // Visual update
    section.querySelectorAll('.choice').forEach(b => {
        b.classList.remove('selected');
    });
    btn.classList.add('selected');

    recalculateState();
}

function recalculateState() {
    // Reset to initial
    variables.mana = 50;
    variables.xp = 0;
    variables.karma = 50;

    // Replay all choices
    const sortedIndices = Object.keys(choices).sort((a, b) => Number(a) - Number(b));

    for (const idx of sortedIndices) {
        const choice = choices[idx];
        variables.mana += choice.mana;
        variables.xp += choice.xp;
        variables.karma += choice.karma;

        // Clamp at each step to match intended game rules
        variables.mana = Math.max(0, Math.min(100, variables.mana));
        variables.karma = Math.max(0, Math.min(100, variables.karma));
    }

    updateDisplay();
    // checkProgress removed per user request
}

function computeEnding() {
    let title = 'Fin Inconnue';
    let text = 'Le destin est trouble...';

    // Logic for endings
    if (variables.mana <= 0) {
        title = '👻 Fantôme du Commit (Burnout)';
        text = 'Votre énergie vitale s\'est dissipée. Vous errez désormais dans le git log, un spectre hantant les Pull Requests abandonnées. Vous avez oublié de prendre des pauses.';
    } else if (variables.xp >= 80 && variables.karma >= 70) {
        title = '🧙 Grand Archimage (CTO Légendaire)';
        text = 'Vous avez vaincu le Dragon Monolithique avec élégance et sagesse. Le Code Ancestral est propre, documenté, et testé. Les bardes chanteront vos louanges sur HackerNews.';
        if (window.BragiStorage) BragiStorage.markAsFinished('quest');
    } else if (variables.xp >= 60 && variables.karma <= 30) {
        title = '💀 Nécromancien du Spaghetti';
        text = 'Le Dragon est mort, mais à quel prix ? Votre code est un labyrinthe de hacks obscurs et de magie noire. Ça marche, mais personne n\'ose relire votre travail. Vous régnez sur un royaume de Chaos.';
        if (window.BragiStorage) BragiStorage.markAsFinished('quest');
    } else {
        title = '🛡️ Garde du Donjon (Le "Ça Passe")';
        text = 'Vous avez survécu. Le projet est en prod. Ce n\'est pas parfait, il y a des bugs, mais le client paie. Vous êtes un aventurier honnête, ni héros ni vilain.';
        if (window.BragiStorage) BragiStorage.markAsFinished('quest');
    }

    const story = document.getElementById('story');
    const oldEnding = document.getElementById('ending-block');
    if (oldEnding) oldEnding.remove();

    story.insertAdjacentHTML('beforeend', `
        <div id="ending-block" class="section" style="border-left-color: var(--accent-magic);">
            <h2 style="color: var(--accent-magic);">${title}</h2>
            <p>${text}</p>
            <div style="margin-top: 2rem; font-weight: bold;">
                Stats Finales: Mana ${variables.mana} | XP ${variables.xp} | Karma ${variables.karma}
            </div>
        </div>
    `);
}

window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.section').forEach(section => {
        section.querySelectorAll('.choice').forEach(btn => {
            const wrapper = document.createElement('div');
            wrapper.classList.add('choice-wrapper');
            const m = Number(btn.dataset.mana || 0);
            const x = Number(btn.dataset.xp || 0);
            const k = Number(btn.dataset.karma || 0);

            const effects = [];
            if (m !== 0) effects.push(`Mana ${m > 0 ? '+' + m : m}`);
            if (x !== 0) effects.push(`XP ${x > 0 ? '+' + x : x}`);
            if (k !== 0) effects.push(`Karma ${k > 0 ? '+' + k : k}`);

            wrapper.dataset.info = effects.join(' / ') || 'Aucun effet';
            btn.parentNode.insertBefore(wrapper, btn);
            wrapper.appendChild(btn);
        });
    });
    updateDisplay();
});