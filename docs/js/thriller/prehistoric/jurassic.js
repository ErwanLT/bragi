// Setup security
setupF12Protection('../../magic_word.html');

// Expose functions to global scope
window.applyChoice = applyChoice;
window.computeEnding = computeEnding;

const variables = { sante: 100, munitions: 50, securite: 80 };
const choices = {};

function updateDisplay() {
    const hud = document.getElementById('hud');
    if (hud) {
        hud.innerHTML = `
            <div><span>SANTÉ:</span> <span style="color: ${variables.sante < 30 ? '#8b0000' : '#2ecc71'}">${variables.sante}%</span></div>
            <div><span>MUNITIONS:</span> <span>${variables.munitions}</span></div>
            <div><span>SÉCURITÉ:</span> <span>${variables.securite}%</span></div>
        `;
    }
}

function applyChoice(btn) {
    const section = btn.closest('.section');
    const sections = Array.from(document.querySelectorAll('.section'));
    const index = sections.indexOf(section);

    const s = Number(btn.dataset.sante || 0);
    const m = Number(btn.dataset.munitions || 0);
    const sec = Number(btn.dataset.securite || 0);

    choices[index] = { sante: s, munitions: m, securite: sec };

    section.querySelectorAll('.choice').forEach(b => {
        b.classList.remove('selected');
    });
    btn.classList.add('selected');

    recalculateState();
}

function recalculateState() {
    variables.sante = 100;
    variables.munitions = 50;
    variables.securite = 80;

    const sortedIndices = Object.keys(choices).sort((a, b) => Number(a) - Number(b));

    for (const idx of sortedIndices) {
        const choice = choices[idx];
        variables.sante += choice.sante;
        variables.munitions += choice.munitions;
        variables.securite += choice.securite;

        variables.sante = Math.max(0, Math.min(100, variables.sante));
        variables.munitions = Math.max(0, variables.munitions);
        variables.securite = Math.max(0, Math.min(100, variables.securite));
    }

    updateDisplay();
}

function computeEnding(forceEnding) {
    let title = 'FIN INCONNUE';
    let text = 'Votre histoire se termine ici...';
    let color = '#ff8c00';

    if (forceEnding === 'hero') {
        title = '🦸 HÉROS DE NUBLAR';
        text = 'Vous avez sauvé tout le monde et restauré la sécurité. InGen vous propose un poste de directeur de la sécurité. Vous refusez poliment et prenez le premier hélicoptère.';
        color = '#2ecc71';
        if (window.BragiStorage) BragiStorage.markAsFinished('jurassic');
    } else if (forceEnding === 'escape') {
        title = '🚁 ÉVACUATION RÉUSSIE';
        text = 'Vous avez survécu et quitté l\'île. Les cauchemars de dinosaures vous hanteront, mais vous êtes vivant. C\'est déjà ça.';
        color = '#3498db';
        if (window.BragiStorage) BragiStorage.markAsFinished('jurassic');
    } else if (forceEnding === 'sacrifice') {
        title = '💔 SACRIFICE HÉROÏQUE';
        text = 'Vous avez donné votre vie pour sauver les autres. Votre nom sera gravé sur une plaque commémorative... que personne ne verra jamais car l\'île est fermée.';
        color = '#e74c3c';
    } else if (variables.sante <= 0) {
        title = '☠️ DÉVORÉ';
        text = 'Un Velociraptor vous a eu. Vos dernières pensées : "Clever girl..."';
        color = '#8b0000';
    } else if (variables.securite <= 10) {
        title = '🦖 CHAOS TOTAL';
        text = 'Le parc est devenu un enfer. Les dinosaures règnent en maîtres. Vous errez, perdu, attendant l\'inévitable.';
        color = '#ff6b6b';
    } else if (variables.munitions <= 0 && variables.sante < 50) {
        title = '🔫 SANS DÉFENSE';
        text = 'Plus de munitions, blessé, épuisé. Un Dilophosaure vous crache son venin. Game over.';
        color = '#9b59b6';
    } else {
        title = '🏝️ SURVIE PRÉCAIRE';
        text = 'Vous survivez... pour l\'instant. Mais combien de temps tiendrez-vous sur cette île maudite ?';
        color = '#f39c12';
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
                    <div style="font-size:0.8rem; color:#666">SANTÉ</div>
                    <div style="font-size:1.3rem; color:${variables.sante < 30 ? '#8b0000' : '#2ecc71'}">${variables.sante}%</div>
                </div>
                <div style="text-align:center">
                    <div style="font-size:0.8rem; color:#666">MUNITIONS</div>
                    <div style="font-size:1.3rem; color:#ff8c00">${variables.munitions}</div>
                </div>
                <div style="text-align:center">
                    <div style="font-size:0.8rem; color:#666">SÉCURITÉ</div>
                    <div style="font-size:1.3rem; color:#2d5016">${variables.securite}%</div>
                </div>
            </div>
            <div style="text-align:center; margin-top:25px;">
                <a href="jurassic.html" style="color: ${color}; text-decoration: none; border: 2px solid ${color}; padding: 10px 20px; display: inline-block; border-radius: 5px; font-weight: bold;">🔄 RECOMMENCER</a>
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

            const s = Number(btn.dataset.sante || 0);
            const m = Number(btn.dataset.munitions || 0);
            const sec = Number(btn.dataset.securite || 0);

            const effects = [];
            if (s < 0) effects.push(`Santé ${s}%`);
            if (m < 0) effects.push(`Munitions ${m}`);
            if (sec < 0) effects.push(`Sécurité ${sec}%`);
            if (s > 0) effects.push(`Santé +${s}%`);
            if (m > 0) effects.push(`Munitions +${m}`);
            if (sec > 0) effects.push(`Sécurité +${sec}%`);

            wrapper.dataset.info = effects.join(' / ') || '';
            btn.parentNode.insertBefore(wrapper, btn);
            wrapper.appendChild(btn);
        });
    });
    updateDisplay();
});