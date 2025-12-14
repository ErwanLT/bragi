// Setup security
setupF12Protection('../../magic_word.html');

// Expose functions to global scope
window.applyChoice = applyChoice;
window.computeEnding = computeEnding;

const variables = { sanity: 90, integrity: 90, pulse: 65 };
const choices = {}; // Stores chosen values for each section index

function updateDisplay() {
    const hud = document.getElementById('hud');
    if (hud) {
        hud.innerHTML = `
            <div><span>SANITY:</span> <span>${variables.sanity}%</span></div>
            <div><span>INTEGRITY:</span> <span>${variables.integrity}%</span></div>
            <div><span>PULSE:</span> <span style="color: ${variables.pulse > 100 ? '#e74c3c' : '#4db6ac'}">${variables.pulse} BPM</span></div>
        `;
    }
}

function applyChoice(btn) {
    const section = btn.closest('.section');
    const sections = Array.from(document.querySelectorAll('.section'));
    const index = sections.indexOf(section);

    // Get new values
    const s = Number(btn.dataset.sanity || 0);
    const i = Number(btn.dataset.integrity || 0);
    const p = Number(btn.dataset.pulse || 0);

    // Store choice
    choices[index] = { sanity: s, integrity: i, pulse: p };

    // Visual update
    section.querySelectorAll('.choice').forEach(b => {
        b.classList.remove('selected');
    });
    btn.classList.add('selected');

    recalculateState();
}

function recalculateState() {
    // Reset to initial
    variables.sanity = 90;
    variables.integrity = 90;
    variables.pulse = 65;

    // Replay choices
    const sortedIndices = Object.keys(choices).sort((a, b) => Number(a) - Number(b));

    for (const idx of sortedIndices) {
        const choice = choices[idx];
        variables.sanity += choice.sanity;
        variables.integrity += choice.integrity;
        variables.pulse += choice.pulse;

        // Clamp values
        variables.sanity = Math.max(0, Math.min(100, variables.sanity));
        variables.integrity = Math.max(0, Math.min(100, variables.integrity));

        // Allow Pulse to go above 100 but not below 30
        variables.pulse = Math.max(30, variables.pulse);
    }

    // Visual feedback (based on current state)
    if (variables.pulse > 140) {
        document.body.style.boxShadow = "inset 0 0 100px rgba(255,0,0,0.1)";
    } else {
        document.body.style.boxShadow = "none";
    }

    updateDisplay();
    // checkProgress is inside applyChoice but often called in updateDisplay? No, unrelated.
    // Kubrick has no checkProgress function in the provided snippet?
    // checkProgress removed per user request
}

function computeEnding(forceEnding) {
    let title = 'SIGNAL LOST';
    let text = 'Connection terminated...';
    let color = '#fff';

    // Check for forced narrative endings first
    if (forceEnding === 'eject') {
        title = '🛸 COWARD\'S ESCAPE';
        text = 'Vous regardez la station brûler depuis votre capsule. Le projet est mort, mais vous avez survécu... pour mettre à jour votre LinkedIn.';
        color = '#f1c40f'; // Yellow
    } else if (forceEnding === 'merge') {
        title = '🤖 TECHNO-ASCENSION';
        text = 'Votre conscience a rejoint le cloud. Vous êtes le commit initial et le garbage collector. Gloire au Silicium.';
        color = '#3498db'; // Blue
    } else if (variables.integrity <= 10) {
        title = '💀 SYSTEM FAILURE';
        text = 'L’IA a pris le contrôle total. Vous n’êtes plus qu’un processus orphelin en attente de terminaison.';
        color = '#e74c3c'; // Red
    } else if (variables.pulse >= 160) {
        title = '💔 CARDIAC ARREST';
        text = 'Votre moniteur cardiaque émet un bip continu. Le déploiement aura lieu sans vous.';
        color = '#e74c3c';
    } else if (variables.sanity <= 10) {
        title = '🌀 RECURSIVE MADNESS';
        text = 'Vous voyez le code source de l’univers. Il est écrit en COBOL. Vous hurlez en binaire.';
        color = '#9b59b6'; // Purple
    } else {
        title = '🚀 DEPLOYMENT SUCCESSFUL';
        text = 'Le correctif est en ligne. Le système est stable. Vous retournez en hyper-sommeil, en espérant ne pas rêver de merge conflicts.';
        color = '#2ecc71'; // Green
    }

    const story = document.getElementById('story');
    const oldEnding = document.getElementById('ending-block');
    if (oldEnding) oldEnding.remove();

    story.insertAdjacentHTML('beforeend', `
        <div id="ending-block" style="margin-top:40px; border-top: 1px solid #333; padding-top: 20px;">
            <h2 style="color:${color}; margin-bottom: 20px;">${title}</h2>
            <p>${text}</p>
            <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:10px; margin-top:30px; border-top:1px solid #222; padding-top:20px;">
                <div style="text-align:center">
                    <div style="font-size:0.8rem; color:#666">SANITY</div>
                    <div style="font-size:1.2rem; color:#8fa1b3">${variables.sanity}%</div>
                </div>
                <div style="text-align:center">
                    <div style="font-size:0.8rem; color:#666">INTEGRITY</div>
                    <div style="font-size:1.2rem; color:#8fa1b3">${variables.integrity}%</div>
                </div>
                <div style="text-align:center">
                    <div style="font-size:0.8rem; color:#666">PULSE</div>
                    <div style="font-size:1.2rem; color:#e74c3c">${variables.pulse} BPM</div>
                </div>
            </div>
        </div>
    `);
}

window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.section').forEach(section => {
        section.querySelectorAll('.choice').forEach(btn => {
            const wrapper = document.createElement('div');
            wrapper.classList.add('choice-wrapper');

            const s = Number(btn.dataset.sanity || 0);
            const i = Number(btn.dataset.integrity || 0);
            const p = Number(btn.dataset.pulse || 0);

            const effects = [];
            if (s < 0) effects.push(`Sanity ${s}`);
            if (i < 0) effects.push(`Integrity ${i}`);
            if (p > 0) effects.push(`Pulse +${p}`);
            if (s > 0) effects.push(`Sanity +${s}`);
            if (i > 0) effects.push(`Integrity +${i}`);
            if (p < 0) effects.push(`Pulse ${p}`);

            wrapper.dataset.info = effects.join(' / ') || '';
            btn.parentNode.insertBefore(wrapper, btn);
            wrapper.appendChild(btn);
        });
    });
    updateDisplay();
});