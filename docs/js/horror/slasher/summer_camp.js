// Setup security
setupF12Protection('../../magic_word.html');

// Expose functions to global scope
window.applyChoice = applyChoice;
window.computeEnding = computeEnding;

const variables = { vie: 100, panique: 0, survivants: 5 };
const choices = {};

function updateDisplay() {
    const hud = document.getElementById('hud');
    if (hud) {
        hud.innerHTML = `
            <div><span>VIE:</span> <span style="color: ${variables.vie < 30 ? '#ff0000' : '#dcdcdc'}">${variables.vie}%</span></div>
            <div><span>PANIQUE:</span> <span style="color: ${variables.panique > 70 ? '#ff0000' : '#dcdcdc'}">${variables.panique}%</span></div>
            <div><span>SURVIVANTS:</span> <span>${variables.survivants}/5</span></div>
        `;
    }
}

function applyChoice(btn) {
    const section = btn.closest('.section');
    const sections = Array.from(document.querySelectorAll('.section'));
    const index = sections.indexOf(section);

    // Get new values using getAttribute to ensure consistent parsing of signs
    // (dataset sometimes behaves oddly with leading + in some contexts, though rare)
    const getVal = (name) => {
        const val = btn.getAttribute(`data-${name}`);
        return val ? parseInt(val, 10) : 0;
    };

    const v = getVal('vie');
    const p = getVal('panique');
    const s = getVal('survivants');

    // Apply immediate visual effect if taking damage
    if (v < 0) {
        document.body.classList.add('damage-effect');
        setTimeout(() => document.body.classList.remove('damage-effect'), 500);
    }

    // Store choice
    choices[index] = { vie: v, panique: p, survivants: s };

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
    variables.vie = 100;
    variables.panique = 0;
    variables.survivants = 5;

    const sortedIndices = Object.keys(choices).sort((a, b) => Number(a) - Number(b));

    for (const idx of sortedIndices) {
        const choice = choices[idx];
        variables.vie += choice.vie;
        variables.panique += choice.panique;
        variables.survivants += choice.survivants;

        // Clamp values
        variables.vie = Math.max(0, Math.min(100, variables.vie));
        variables.panique = Math.max(0, Math.min(100, variables.panique));
        variables.survivants = Math.max(0, Math.min(5, variables.survivants));
    }

    updateDisplay();
}

function computeEnding(forceEnding) {
    let title = 'FIN';
    let text = 'L\'écran devient noir.';
    let color = '#8a0303';

    if (forceEnding === 'police') {
        title = 'SAUVETAGE IN-EXTREMIS';
        text = 'Les gyrophares bleus illuminent la forêt. Le tueur s\'est volatilisé. Vous êtes en sécurité, pour le moment.';
        color = '#3498db';
    } else if (variables.vie <= 0) {
        title = 'MORT TRAGIQUE';
        text = 'Le masque du tueur est la dernière chose que vous voyez. Générique de fin.';
        color = '#ff0000';
    } else if (variables.panique >= 90) {
        title = 'INTERNEMENT';
        text = 'Vous avez survécu, mais votre esprit est resté là-bas. Vous passez vos journées à hurler dans une chambre capitonnée.';
        color = '#555';
    } else if (variables.survivants <= 0) {
        title = 'SEUL SURVIVANT';
        text = 'Tous vos amis sont morts. Vous marchez hébété sur la route, couvert de sang qui n\'est pas (seulement) le vôtre.';
        color = '#8a0303';
    } else if (variables.survivants >= 4 && variables.vie > 50) {
        title = 'FINAL GIRL/BOY';
        text = 'Vous avez non seulement survécu, mais vous avez sauvé presque tout le monde. Vous êtes une légende.';
        color = '#2ecc71';
        if (window.BragiStorage) BragiStorage.markAsFinished('summer_camp');
    } else {
        title = 'SURVIVANT TRAUMATISÉ';
        text = 'Vous vous en êtes sorti. Mais vous ne dormirez plus jamais sans vérifier sous votre lit.';
        color = '#e67e22';
        if (window.BragiStorage) BragiStorage.markAsFinished('summer_camp');
    }

    const story = document.getElementById('story');
    const oldEnding = document.getElementById('ending-block');
    if (oldEnding) oldEnding.remove();

    story.insertAdjacentHTML('beforeend', `
        <div id="ending-block" style="margin-top:40px; border-top: 3px solid ${color}; padding-top: 20px; animation: fadeIn 2s;">
            <h2 style="color:${color}; margin-bottom: 20px; text-align: center;">${title}</h2>
            <p style="text-align:center; font-size: 1.1em;">${text}</p>
            <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:15px; margin-top:30px; padding-top:20px; border-top:2px dashed ${color};">
                <div style="text-align:center">
                    <div style="font-size:0.8rem; color:#666">VIE</div>
                    <div style="font-size:1.3rem; color:${variables.vie < 30 ? '#ff0000' : '#2ecc71'}">${variables.vie}%</div>
                </div>
                <div style="text-align:center">
                    <div style="font-size:0.8rem; color:#666">PANIQUE</div>
                    <div style="font-size:1.3rem; color:#ff8c00">${variables.panique}%</div>
                </div>
                <div style="text-align:center">
                    <div style="font-size:0.8rem; color:#666">SURVIVANTS</div>
                    <div style="font-size:1.3rem; color:#dcdcdc">${variables.survivants}/5</div>
                </div>
            </div>
            <div style="text-align:center; margin-top:25px;">
                <a href="summer_camp.html" style="color: ${color}; text-decoration: none; border: 2px solid ${color}; padding: 10px 20px; display: inline-block; border-radius: 5px; font-weight: bold;">REJOUER LE FILM</a>
            </div>
        </div>
    `);

    setTimeout(() => {
        document.getElementById('ending-block').scrollIntoView({ behavior: 'smooth' });
    }, 100);
}

window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.section').forEach(section => {
        section.querySelectorAll('.choice').forEach(btn => {
            const wrapper = document.createElement('div');
            wrapper.classList.add('choice-wrapper');

            const v = Number(btn.dataset.vie || 0);
            const p = Number(btn.dataset.panique || 0);
            const s = Number(btn.dataset.survivants || 0);

            const effects = [];
            if (v < 0) effects.push(`Vie ${v}%`);
            if (v > 0) effects.push(`Vie +${v}%`);
            if (p > 0) effects.push(`Panique +${p}%`);
            if (p < 0) effects.push(`Panique ${p}%`);
            if (s < 0) effects.push(`Survivant ${s}`);

            wrapper.dataset.info = effects.join(' / ') || '';
            btn.parentNode.insertBefore(wrapper, btn);
            wrapper.appendChild(btn);
        });
    });
    updateDisplay();
});
