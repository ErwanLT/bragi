// Setup security
setupF12Protection('../../magic_word.html');

window.applyChoice = applyChoice;
window.computeEnding = computeEnding;

const variables = { signal: 100, squad: 4, ammo: 10 };
// signal: radio quality/battery. If 0, game over.
// squad: number of team members. If 0, game over.
// ammo: obscure resource.

const choices = {};

function updateDisplay() {
    const hud = document.getElementById('hud');
    if (hud) {
        hud.innerHTML = `
            <div><span>SIGNAL:</span> <span>${variables.signal}%</span></div>
            <div><span>ESCOUADE:</span> <span>${variables.squad}/4</span></div>
            <div><span>MUNITIONS:</span> <span>${variables.ammo}</span></div>
        `;
    }
}

function applyChoice(btn) {
    const section = btn.closest('.section');
    const sections = Array.from(document.querySelectorAll('.section'));
    const index = sections.indexOf(section);

    const s = Number(btn.dataset.signal || 0);
    const sq = Number(btn.dataset.squad || 0);
    const a = Number(btn.dataset.ammo || 0);

    choices[index] = { signal: s, squad: sq, ammo: a };

    section.querySelectorAll('.choice').forEach(b => {
        b.classList.remove('selected');
    });
    btn.classList.add('selected');

    recalculateState();
}

function recalculateState() {
    variables.signal = 100;
    variables.squad = 4;
    variables.ammo = 10;

    const sortedIndices = Object.keys(choices).sort((a, b) => Number(a) - Number(b));

    for (const idx of sortedIndices) {
        const choice = choices[idx];
        variables.signal += choice.signal;
        variables.squad += choice.squad;
        variables.ammo += choice.ammo;

        variables.signal = Math.max(0, Math.min(100, variables.signal));
        variables.squad = Math.max(0, variables.squad);
    }

    updateDisplay();
}

function computeEnding(forceEnding) {
    let title = 'CONNEXION PERDU';
    let text = 'La radio ne répond plus.';
    let color = '#fff';

    if (forceEnding === 'abandon') {
        title = 'SILENCE RADIO';
        text = 'Vous avez éteint la radio. Leurs cris ont cessé, mais pas vos cauchemars.';
        color = '#555';
    } else if (variables.squad <= 0) {
        title = 'TEAM ELIMINATED';
        text = 'Le dernier bio-signal s\'est éteint. Vous êtes seul dans le bunker.';
        color = '#d32f2f';
    } else if (variables.signal <= 0) {
        title = 'SIGNAL LOST';
        text = 'Les batteries sont vides. Ils sont livrés à eux-mêmes dans le noir.';
        color = '#ff9800';
    } else {
        title = 'MISSION ACCOMPLISHED';
        text = 'Ils ont atteint la zone d\'extraction. Vous entendez le rotor de l\'hélico. Bon travail, Opérateur.';
        color = '#4caf50';
        if (window.BragiStorage) BragiStorage.markAsFinished('signal_zero');
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
                    <div style="font-size:0.8rem; color:#666">SIGNAL</div>
                    <div style="font-size:1.2rem; color:#ff9800">${variables.signal}%</div>
                </div>
                <div style="text-align:center">
                    <div style="font-size:0.8rem; color:#666">ESCOUADE</div>
                    <div style="font-size:1.2rem; color:#fff">${variables.squad}/4</div>
                </div>
                 <div style="text-align:center">
                    <div style="font-size:0.8rem; color:#666">AMMO</div>
                    <div style="font-size:1.2rem; color:#fff">${variables.ammo}</div>
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

            const s = Number(btn.dataset.signal || 0);
            const sq = Number(btn.dataset.squad || 0);
            const a = Number(btn.dataset.ammo || 0);

            const effects = [];
            if (s !== 0) effects.push(`Signal ${s > 0 ? '+' : ''}${s}`);
            if (sq !== 0) effects.push(`Escouade ${sq > 0 ? '+' : ''}${sq}`);
            if (a !== 0) effects.push(`Ammo ${a > 0 ? '+' : ''}${a}`);

            wrapper.dataset.info = effects.join(' / ') || 'Aucun effet immédiat';
            btn.parentNode.insertBefore(wrapper, btn);
            wrapper.appendChild(btn);
        });
    });
    updateDisplay();
});
