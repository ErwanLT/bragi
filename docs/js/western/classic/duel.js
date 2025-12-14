// Setup security
setupF12Protection('../../magic_word.html');

// Expose functions to global scope
window.applyChoice = applyChoice;
window.computeEnding = computeEnding;

const variables = { fortune: 50, honneur: 50, munitions: 6 };
const choices = {};

function updateDisplay() {
    const hud = document.getElementById('hud');
    if (hud) {
        hud.innerHTML = `
            <div><span>FORTUNE:</span> <span>$${variables.fortune}</span></div>
            <div><span>HONNEUR:</span> <span>${variables.honneur}</span></div>
            <div><span>MUNITIONS:</span> <span>${variables.munitions} ⦾</span></div>
        `;
    }
}

function applyChoice(btn) {
    const section = btn.closest('.section');
    const sections = Array.from(document.querySelectorAll('.section'));
    const index = sections.indexOf(section);

    // Get new values
    const f = Number(btn.dataset.fortune || 0);
    const h = Number(btn.dataset.honneur || 0);
    const m = Number(btn.dataset.munitions || 0);

    // Store choice
    choices[index] = { fortune: f, honneur: h, munitions: m };

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
    variables.fortune = 50;
    variables.honneur = 50;
    variables.munitions = 6;

    const sortedIndices = Object.keys(choices).sort((a, b) => Number(a) - Number(b));

    for (const idx of sortedIndices) {
        const choice = choices[idx];
        variables.fortune += choice.fortune;
        variables.honneur += choice.honneur;
        variables.munitions += choice.munitions;
    }

    // Clamp
    variables.fortune = Math.max(0, variables.fortune);
    variables.honneur = Math.max(0, Math.min(100, variables.honneur));
    variables.munitions = Math.max(0, variables.munitions);

    updateDisplay();
}

function computeEnding(forceEnding) {
    let title = 'LE SOLEIL SE COUCHE';
    let text = 'L\'histoire se termine ici.';
    let color = '#5d4037';

    if (forceEnding === 'rich') {
        title = 'RETRAITE DORÉE';
        text = 'Avec tout cet or, vous achetez un ranch au Mexique. Adieu la vie de chasseur de primes.';
        color = '#ffb300';
    } else if (variables.munitions <= 0) {
        title = 'CLICK... CLICK...';
        text = 'Votre barillet est vide. Le bandit sourit. C\'est la fin pour vous, gringo.';
        color = '#d84315';
    } else if (variables.honneur <= 10) {
        title = 'HORS-LA-LOI';
        text = 'Vous avez tué le bandit, mais vous êtes devenu comme lui. Votre tête est mise à prix.';
        color = '#3e2723';
    } else if (variables.honneur >= 90) {
        title = 'LÉGENDE DE L\'OUEST';
        text = 'Vous ramenez le bandit vivant. Le shérif vous serre la main. Les enfants joueront à être vous.';
        color = '#ffd700';
    } else {
        title = 'JUSTICE EST FAITE';
        text = 'Une prime empochée, une tombe creusée. Juste une autre journée dans l\'Ouest.';
        color = '#8d6e63';
    }

    const story = document.getElementById('story');
    const oldEnding = document.getElementById('ending-block');
    if (oldEnding) oldEnding.remove();

    story.insertAdjacentHTML('beforeend', `
        <div id="ending-block" style="margin-top:40px; border-top: 2px dashed #5d4037; padding-top: 20px; animation: fadeIn 2s;">
            <h2 style="color:${color}; margin-bottom: 20px; border:none;">${title}</h2>
            <p style="text-align:center; font-style:italic;">${text}</p>
            <div style="text-align:center; margin-top:20px;">
                <a href="duel.html" style="color: #5d4037; text-decoration: none; border-bottom: 1px solid #5d4037;">Recharger la partie</a>
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

            const f = Number(btn.dataset.fortune || 0);
            const h = Number(btn.dataset.honneur || 0);
            const m = Number(btn.dataset.munitions || 0);

            const effects = [];
            if (f < 0) effects.push(`-$${Math.abs(f)}`);
            if (h < 0) effects.push(`Honneur ${h}`);
            if (m < 0) effects.push(`Balle ${m}`);
            if (f > 0) effects.push(`+$${f}`);
            if (h > 0) effects.push(`Honneur +${h}`);
            if (m > 0) effects.push(`Balle +${m}`);

            wrapper.dataset.info = effects.join(' / ') || '';
            btn.parentNode.insertBefore(wrapper, btn);
            wrapper.appendChild(btn);
        });
    });
    updateDisplay();
});