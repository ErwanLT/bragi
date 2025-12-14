// Setup security
setupF12Protection('../../magic_word.html');

// Expose functions to global scope
window.applyChoice = applyChoice;
window.computeEnding = computeEnding;

const variables = { loyalte: 80, vivres: 100, or: 100 };
const choices = {};

function updateDisplay() {
    const hud = document.getElementById('hud');
    if (hud) {
        hud.innerHTML = `
            <div><span>LOYAUTÉ:</span> <span>${variables.loyalte}%</span></div>
            <div><span>VIVRES:</span> <span>${variables.vivres}%</span></div>
            <div><span>OR:</span> <span>${variables.or} 💰</span></div>
        `;
    }
}

function applyChoice(btn) {
    const section = btn.closest('.section');
    const sections = Array.from(document.querySelectorAll('.section'));
    const index = sections.indexOf(section);

    // Get new values
    const l = Number(btn.dataset.loyalte || 0);
    const v = Number(btn.dataset.vivres || 0);
    const o = Number(btn.dataset.or || 0);

    // Store choice
    choices[index] = { loyalte: l, vivres: v, or: o };

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
    variables.loyalte = 80;
    variables.vivres = 100;
    variables.or = 100;

    const sortedIndices = Object.keys(choices).sort((a, b) => Number(a) - Number(b));

    for (const idx of sortedIndices) {
        const choice = choices[idx];
        variables.loyalte += choice.loyalte;
        variables.vivres += choice.vivres;
        variables.or += choice.or;

        // Clamp at each step to prevent hidden surplus
        variables.loyalte = Math.max(0, Math.min(100, variables.loyalte));
        variables.vivres = Math.max(0, Math.min(100, variables.vivres));
        variables.or = Math.max(0, variables.or);
    }

    // Clamp


    updateDisplay();
}

function computeEnding(forceEnding) {
    let title = 'LA MER EST CALME';
    let text = 'L\'aventure se termine ici.';
    let color = '#3e2723';

    if (forceEnding === 'rich') {
        title = 'ROI DES PIRATES';
        text = 'Avec ce trésor, vous construisez une flotte. Votre nom fera trembler les sept mers !';
        color = '#ffd700';
    } else if (variables.loyalte <= 0) {
        title = 'MUTINERIE !';
        text = 'L\'équipage vous abandonne sur un îlot désert. Ils partent avec le navire.';
        color = '#8b0000';
    } else if (variables.vivres <= 0) {
        title = 'SCORBUT ET FAMINE';
        text = 'Sans vivres, l\'équipage meurt lentement. Le navire devient un vaisseau fantôme.';
        color = '#555';
    } else if (forceEnding === 'cursed') {
        title = 'MAUDIT POUR L\'ÉTERNITÉ';
        text = 'Vous avez touché l\'or maudit. Vous rejoignez l\'équipage des damnés.';
        color = '#4b0082';
    } else {
        title = 'RETOUR AU PORT';
        text = 'Pas de gloire, mais pas de mort. Une histoire à raconter à la taverne.';
        color = '#e6ccb2';
    }

    const story = document.getElementById('story');
    const oldEnding = document.getElementById('ending-block');
    if (oldEnding) oldEnding.remove();

    story.insertAdjacentHTML('beforeend', `
        <div id="ending-block" style="margin-top:40px; border-top: 2px dashed #8b0000; padding-top: 20px; animation: fadeIn 2s;">
            <h2 style="color:${color}; margin-bottom: 20px; border:none;">${title}</h2>
            <p style="text-align:center; font-style:italic;">${text}</p>
            <div style="text-align:center; margin-top:20px;">
                <a href="treasure.html" style="color: #3e2723; text-decoration: none; border-bottom: 1px solid #3e2723;">Hisser les voiles à nouveau</a>
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

            const l = Number(btn.dataset.loyalte || 0);
            const v = Number(btn.dataset.vivres || 0);
            const o = Number(btn.dataset.or || 0);

            const effects = [];
            if (l < 0) effects.push(`Loyauté ${l}%`);
            if (v < 0) effects.push(`Vivres ${v}%`);
            if (o < 0) effects.push(`Or ${o}`);
            if (l > 0) effects.push(`Loyauté +${l}%`);
            if (v > 0) effects.push(`Vivres +${v}%`);
            if (o > 0) effects.push(`Or +${o}`);

            wrapper.dataset.info = effects.join(' / ') || '';
            btn.parentNode.insertBefore(wrapper, btn);
            wrapper.appendChild(btn);
        });
    });
    updateDisplay();
});