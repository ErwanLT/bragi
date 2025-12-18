/**
 * Bragi Story Engine
 * Centralizes common logic for interactive stories.
 */
class StoryEngine {
    constructor(config) {
        this.storyId = config.storyId;
        // initialVariables should be an object like { sanity: 100, light: 100 }
        this.initialVariables = { ...config.initialVariables };
        this.variables = { ...config.initialVariables };
        this.choices = {}; // Stores chosen effects per section index

        // Hooks
        this.onUpdateHUD = config.onUpdateHUD; // (vars) => string
        this.onComputeEnding = config.onComputeEnding; // (vars, forceEnding) => { title, text, color }
        this.clamping = config.clamping || {}; // { sanity: [0, 100], light: [0, 100] }

        // Bindings
        window.applyChoice = this.applyChoice.bind(this);
        window.computeEnding = this.computeEnding.bind(this);

        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupUI();
            this.updateDisplay();
        });
    }

    /**
     * Enhances the HTML by adding choice wrappers and tooltips.
     */
    setupUI() {
        document.querySelectorAll('.section').forEach(section => {
            section.querySelectorAll('.choice').forEach(btn => {
                const wrapper = document.createElement('div');
                wrapper.classList.add('choice-wrapper');

                const effects = [];
                for (const [key, value] of Object.entries(btn.dataset)) {
                    // Skip internal attributes if any
                    const val = Number(value);
                    if (!isNaN(val) && val !== 0) {
                        const name = key.charAt(0) + key.slice(1); // Keep as is or capitalize?
                        effects.push(`${name} ${val > 0 ? '+' : ''}${val}`);
                    }
                }

                wrapper.dataset.info = effects.join(' / ') || '';
                btn.parentNode.insertBefore(wrapper, btn);
                wrapper.appendChild(btn);
            });
        });
    }

    applyChoice(btn) {
        const section = btn.closest('.section');
        const sections = Array.from(document.querySelectorAll('.section'));
        const index = sections.indexOf(section);

        // Capture all numeric data attributes
        const effects = {};
        for (const [key, value] of Object.entries(btn.dataset)) {
            const num = Number(value);
            if (!isNaN(num)) effects[key] = num;
        }

        this.choices[index] = effects;

        // UI Update
        section.querySelectorAll('.choice').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');

        this.recalculateState();

        // Scroll
        if (sections[index + 1]) {
            sections[index + 1].scrollIntoView({ behavior: 'smooth' });
        }
    }

    recalculateState() {
        // Reset to initial
        this.variables = { ...this.initialVariables };

        // Replay sorted choices
        const sortedIndices = Object.keys(this.choices).sort((a, b) => Number(a) - Number(b));

        for (const idx of sortedIndices) {
            const effects = this.choices[idx];
            for (const [key, val] of Object.entries(effects)) {
                if (this.variables.hasOwnProperty(key)) {
                    this.variables[key] += val;
                }
            }
            this.clampAll();
        }

        this.updateDisplay();
    }

    clampAll() {
        for (const [key, range] of Object.entries(this.clamping)) {
            if (this.variables.hasOwnProperty(key)) {
                this.variables[key] = Math.max(range[0], Math.min(range[1], this.variables[key]));
            }
        }
    }

    updateDisplay() {
        const hud = document.getElementById('hud');
        if (hud && this.onUpdateHUD) {
            hud.innerHTML = this.onUpdateHUD(this.variables);
        }
    }

    computeEnding(forceEnding) {
        if (!this.onComputeEnding) return;

        const result = this.onComputeEnding(this.variables, forceEnding);
        if (!result) return;

        const { title, text, color, isSuccess } = result;

        // Persistence
        if (isSuccess && window.BragiStorage) {
            BragiStorage.markAsFinished(this.storyId);
        }

        const story = document.getElementById('story');
        const oldEnding = document.getElementById('ending-block');
        if (oldEnding) oldEnding.remove();

        story.insertAdjacentHTML('beforeend', `
            <div id="ending-block" style="margin-top:40px; border-top: 2px dashed ${color || '#555'}; padding-top: 20px; animation: fadeIn 2s;">
                <h2 style="color:${color || '#fff'}; margin-bottom: 20px; border:none;">${title}</h2>
                <p style="text-align:center; font-style:italic;">${text}</p>
                <div style="text-align:center; margin-top:20px;">
                    <a href="" onclick="window.location.reload(); return false;" style="color: ${color || '#fff'}; text-decoration: none; border-bottom: 1px solid ${color || '#fff'};">Recommencer l'aventure</a>
                </div>
            </div>
        `);

        setTimeout(() => {
            document.getElementById('ending-block').scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }
}

window.StoryEngine = StoryEngine;
