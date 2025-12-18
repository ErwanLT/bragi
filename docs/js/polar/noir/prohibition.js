// Setup security
setupF12Protection('../../magic_word.html');

// Expose functions to global scope
window.applyChoice = applyChoice;
window.computeEnding = computeEnding;

const variables = { indices: 0, respect: 50, sangFroid: 100 };
const choices = {};

function updateDisplay() {
    const hud = document.getElementById('hud');
    if (hud) {
        hud.innerHTML = `
            <div><span>INDICES:</span> <span>${variables.indices}/100</span></div>
            <div><span>RESPECT:</span> <span>${variables.respect}%</span></div>
            <div><span>SANG-FROID:</span> <span>${variables.sangFroid}%</span></div>
        `;
    }
}

function applyChoice(btn) {
    const section = btn.closest('.section');
    const sections = Array.from(document.querySelectorAll('.section'));
    const index = sections.indexOf(section);

    // Get new values
    const i = Number(btn.dataset.indices || 0);
    const r = Number(btn.dataset.respect || 0);
    const s = Number(btn.dataset.sangfroid || 0);

    // Store choice
    choices[index] = { indices: i, respect: r, sangFroid: s };

    // Visual update
    section.querySelectorAll('.choice').forEach(b => {
        b.classList.remove('selected');
    });
    btn.classList.add('selected');

    recalculateState();

    // Scroll to next section if exists
    if (sections[index + 1]) {
        sections[index + 1].scrollIntoView({ behavior: 'smooth' });
    }
}

function recalculateState() {
    variables.indices = 0;
    variables.respect = 50;
    variables.sangFroid = 100;

    const sortedIndices = Object.keys(choices).sort((a, b) => Number(a) - Number(b));

    for (const idx of sortedIndices) {
        const choice = choices[idx];
        variables.indices += choice.indices;
        variables.respect += choice.respect;
        variables.sangFroid += choice.sangFroid;

        // Clamp at each step
        // INDICES is 0-100+
        // RESPECT is 0-100 (0=Hated, 100=Godfather/Hero)
        // SANGFROID is 0-100 (0=Panic)
        variables.indices = Math.max(0, variables.indices);
        variables.respect = Math.max(0, Math.min(100, variables.respect));
        variables.sangFroid = Math.max(0, Math.min(100, variables.sangFroid));
    }

    updateDisplay();
}

function computeEnding(forceEnding) {
    let title = 'AFFAIRE CLASSÉE';
    let text = 'Le dossier prend la poussière.';
    let color = '#333';

    if (forceEnding === 'attempt_solve') {
        if (variables.indices >= 80) {
            title = 'AFFAIRE RÉSOLUE';
            text = 'Capone ira en prison. Vous êtes le héros de Chicago.';
            color = '#000';
            if (window.BragiStorage) BragiStorage.markAsFinished('prohibition');
        } else {
            title = 'PREUVES INSUFFISANTES';
            text = 'Le Capitaine secoue la tête. "C\'est tout ce que vous avez ?" Capone est relâché faute de preuves.';
            color = '#555';
        }
    } else if (variables.sangFroid <= 0) {
        title = 'NERFS À VIF';
        text = 'Vous avez craqué sous la pression. L\'alcool est votre seul ami maintenant.';
        color = '#8a0303';
    } else if (variables.respect <= 0) {
        title = 'DANS LE LAC MICHIGAN';
        text = 'On vous a retrouvé avec des chaussures en béton.';
        color = '#555';
    } else if (forceEnding === 'corrupted') {
        title = 'NOUVEL ASSOCIÉ';
        text = 'Vous avez vendu votre âme. Vous êtes riche, mais à quel prix ?';
        color = '#666';
    } else {
        title = 'ENQUÊTE BACLÉE';
        text = 'Pas assez de preuves. Le coupable court toujours.';
        color = '#999';
    }

    const story = document.getElementById('story');
    const oldEnding = document.getElementById('ending-block');
    if (oldEnding) oldEnding.remove();

    story.insertAdjacentHTML('beforeend', `
        <div id="ending-block" style="margin-top:40px; border-top: 2px solid #000; padding-top: 20px; animation: fadeIn 2s;">
            <h2 style="color:${color}; margin-bottom: 20px; border:none; font-family: 'Special Elite', cursive;">${title}</h2>
            <p style="text-align:center; font-family: 'Courier Prime', monospace;">${text}</p>
            <div style="text-align:center; margin-top:20px;">
                <a href="prohibition.html" style="color: #8a0303; text-decoration: underline;">Rouvrir le dossier</a>
            </div>
        </div>
    `);

    // Scroll to ending
    setTimeout(() => {
        document.getElementById('ending-block').scrollIntoView({ behavior: 'smooth' });
    }, 100);
}

window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.section').forEach(section => {
        section.querySelectorAll('.choice').forEach(btn => {
            const wrapper = document.createElement('div');
            wrapper.classList.add('choice-wrapper');

            const i = Number(btn.dataset.indices || 0);
            const r = Number(btn.dataset.respect || 0);
            const s = Number(btn.dataset.sangfroid || 0);

            const effects = [];
            if (i > 0) effects.push(`Indices +${i}`);
            if (r < 0) effects.push(`Respect ${r}%`);
            if (s < 0) effects.push(`Sang-froid ${s}%`);
            if (r > 0) effects.push(`Respect +${r}%`);
            if (s > 0) effects.push(`Sang-froid +${s}%`);

            wrapper.dataset.info = effects.join(' / ') || '';
            btn.parentNode.insertBefore(wrapper, btn);
            wrapper.appendChild(btn);
        });
    });
    updateDisplay();
});