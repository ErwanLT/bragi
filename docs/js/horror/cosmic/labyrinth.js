const variables = { sanity: 100, light: 100, orientation: 0 };
const choices = {};

document.addEventListener('keydown', function (event) {
    if (event.key === 'F12' || event.keyCode === 123 ||
        (event.ctrlKey && event.shiftKey && ['I', 'J', 'C'].includes(event.key)) ||
        (event.metaKey && event.altKey && ['I', 'J', 'C'].includes(event.key))) {
        event.preventDefault();
        window.location.href = "../../magic_word.html";
    }
});

function updateDisplay() {
    const hud = document.getElementById('hud');
    if (hud) {
        hud.innerHTML = `
            <div><span>SANTÉ MENTALE:</span> <span>${variables.sanity}%</span></div>
            <div><span>LUMIÈRE:</span> <span>${variables.light}%</span></div>
            <div><span>ORIENTATION:</span> <span>${variables.orientation}%</span></div>
        `;
    }
}

function applyChoice(btn) {
    const section = btn.closest('.section');
    const sections = Array.from(document.querySelectorAll('.section'));
    const index = sections.indexOf(section);

    // Get new values
    const s = Number(btn.dataset.sanity || 0);
    const l = Number(btn.dataset.light || 0);
    const o = Number(btn.dataset.orientation || 0);

    // Store choice
    choices[index] = { sanity: s, light: l, orientation: o };

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
    variables.sanity = 100;
    variables.light = 100;
    variables.orientation = 0;

    const sortedIndices = Object.keys(choices).sort((a, b) => Number(a) - Number(b));

    for (const idx of sortedIndices) {
        const choice = choices[idx];
        variables.sanity += choice.sanity;
        variables.light += choice.light;
        variables.orientation += choice.orientation;

        // Clamp at each step
        variables.sanity = Math.max(0, Math.min(100, variables.sanity));
        variables.light = Math.max(0, Math.min(100, variables.light));
        variables.orientation = Math.max(0, Math.min(100, variables.orientation));
    }

    updateDisplay();
}

function computeEnding(forceEnding) {
    let title = 'PERDU DANS LES TÉNÈBRES';
    let text = 'Vos os rejoindront ceux des autres.';
    let color = '#555';

    if (forceEnding === 'escaped') {
        title = 'LIBRE !';
        text = 'Vous avez trouvé la sortie. La lumière du soleil n\'a jamais été aussi belle.';
        color = '#dcdcdc'; // White/Grey
    } else if (variables.light <= 0) {
        title = 'DÉVORÉ PAR L\'OMBRE';
        text = 'Votre lanterne s\'éteint. Vous n\'êtes plus seul dans le noir.';
        color = '#000';
    } else if (variables.sanity <= 0) {
        title = 'ESPRIT BRISÉ';
        text = 'Le labyrinthe est désormais votre maison. Vous riez dans le noir.';
        color = '#8a0303';
    } else if (variables.orientation >= 100) {
        title = 'MAÎTRE DU DÉDALE';
        text = 'Vous avez cartographié l\'impossible. Vous sortez, mais le labyrinthe reste en vous.';
        color = '#ff3333';
    } else {
        title = 'UNE FIN ?';
        text = 'Vous errez encore... Peut-être trouverez-vous la sortie un jour.';
        color = '#666';
    }

    const story = document.getElementById('story');
    const oldEnding = document.getElementById('ending-block');
    if (oldEnding) oldEnding.remove();

    story.insertAdjacentHTML('beforeend', `
        <div id="ending-block" style="margin-top:40px; border-top: 2px dashed #8a0303; padding-top: 20px; animation: fadeIn 2s;">
            <h2 style="color:${color}; margin-bottom: 20px; border:none;">${title}</h2>
            <p style="text-align:center; font-style:italic;">${text}</p>
            <div style="text-align:center; margin-top:20px;">
                <a href="labyrinth.html" style="color: #dcdcdc; text-decoration: none; border-bottom: 1px solid #dcdcdc;">Rallumer la lanterne</a>
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

            const s = Number(btn.dataset.sanity || 0);
            const l = Number(btn.dataset.light || 0);
            const o = Number(btn.dataset.orientation || 0);

            const effects = [];
            if (s < 0) effects.push(`Santé ${s}%`);
            if (l < 0) effects.push(`Lumière ${l}%`);
            if (o < 0) effects.push(`Orientation ${o}%`);
            if (s > 0) effects.push(`Santé +${s}%`);
            if (l > 0) effects.push(`Lumière +${l}%`);
            if (o > 0) effects.push(`Orientation +${o}%`);

            wrapper.dataset.info = effects.join(' / ') || '';
            btn.parentNode.insertBefore(wrapper, btn);
            wrapper.appendChild(btn);
        });
    });
    updateDisplay();
});