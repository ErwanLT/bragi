const variables = { sanity: 100, battery: 100 };
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
            <div><span>SANTÉ MENTALE:</span> <span style="color: ${variables.sanity < 30 ? '#c0392b' : '#dcdcdc'}">${variables.sanity}%</span></div>
            <div><span>BATTERIE:</span> <span style="color: ${variables.battery < 20 ? '#c0392b' : '#dcdcdc'}">${variables.battery}%</span></div>
        `;
    }
}

function applyChoice(btn) {
    const section = btn.closest('.section');
    const sections = Array.from(document.querySelectorAll('.section'));
    const index = sections.indexOf(section);

    // Get new values
    const s = Number(btn.dataset.sanity || 0);
    const b = Number(btn.dataset.battery || 0);

    // Store choice (if previous choice exists, overwrite it - simple model)
    choices[index] = { sanity: s, battery: b };

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
    variables.battery = 100;

    const sortedIndices = Object.keys(choices).sort((a, b) => Number(a) - Number(b));

    for (const idx of sortedIndices) {
        const choice = choices[idx];
        variables.sanity += choice.sanity;
        variables.battery += choice.battery;

        // Clamp at each step to prevent overflow
        variables.sanity = Math.max(0, Math.min(100, variables.sanity));
        variables.battery = Math.max(0, Math.min(100, variables.battery));
    }

    updateDisplay();
}

function computeEnding(forceEnding) {
    let title = 'LA FIN ?';
    let text = 'Tout devient noir...';
    let color = '#dcdcdc';

    if (forceEnding === 'flee') {
        title = 'FUITE HONTEUSE';
        text = 'Vous courez sans vous retourner. Le manoir restera un mystère, mais vous êtes en vie. Pour l\'instant.';
        color = '#dcdcdc';
    } else if (variables.sanity <= 0) {
        title = 'FOLIE';
        text = 'Votre esprit se brise. Vous riez, seul dans le noir. Vous faites désormais partie du décor.';
        color = '#c0392b';
    } else if (variables.battery <= 0) {
        title = 'OBSCURITÉ';
        text = 'Votre lampe s\'éteint pour de bon. Quelque chose vous frôle. Ce n\'est pas un meuble. Adieu.';
        color = '#333';
    } else {
        title = 'SURVIVANT';
        text = 'Le soleil se lève enfin. Vous sortez, tremblant mais vivant. Les ombres reculent, pour l\'instant. Personne ne vous croira.';
        color = '#4caf50';
    }

    const story = document.getElementById('story');
    const oldEnding = document.getElementById('ending-block');
    if (oldEnding) oldEnding.remove();

    story.insertAdjacentHTML('beforeend', `
        <div id="ending-block" style="margin-top:40px; border-top: 1px solid #333; padding-top: 20px; animation: fadeIn 2s;">
            <h2 style="color:${color}; margin-bottom: 20px;">${title}</h2>
            <p>${text}</p>
            <div style="text-align:center; margin-top:20px;">
                <a href="manor.html" style="color: #c0392b; text-decoration: none; border-bottom: 1px solid #c0392b;">Recommencer</a>
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
            const b = Number(btn.dataset.battery || 0);

            const effects = [];
            if (s < 0) effects.push(`Santé ${s}`);
            if (b < 0) effects.push(`Batterie ${b}`);
            if (s > 0) effects.push(`Santé +${s}`);
            if (b > 0) effects.push(`Batterie +${b}`);

            wrapper.dataset.info = effects.join(' / ') || '';
            btn.parentNode.insertBefore(wrapper, btn);
            wrapper.appendChild(btn);
        });
    });
    updateDisplay();
});