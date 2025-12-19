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
            this.injectStyles();
            this.setupUI();
            this.syncSections();
            this.updateDisplay();
        });
    }

    injectStyles() {
        const style = document.createElement('style');
        style.innerHTML = `
            .section {
                opacity: 0;
                display: none;
                transition: opacity 0.8s ease-in-out;
            }
            .section.visible {
                display: block;
                opacity: 1;
            }
            .section.locked {
                pointer-events: none;
                filter: grayscale(0.5) blur(1px);
                opacity: 0.4;
            }
            #ending-block {
                animation: fadeIn 1.5s ease-out;
            }
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Enhances the HTML by adding choice wrappers and tooltips.
     */
    setupUI() {
        document.querySelectorAll('.section').forEach((section, sIdx) => {
            section.querySelectorAll('.choice').forEach(btn => {
                const wrapper = document.createElement('div');
                wrapper.classList.add('choice-wrapper');

                const effects = [];
                for (const [key, value] of Object.entries(btn.dataset)) {
                    const val = Number(value);
                    if (!isNaN(val) && val !== 0) {
                        effects.push(`${key} ${val > 0 ? '+' : ''}${val}`);
                    }
                }

                wrapper.dataset.info = effects.join(' / ') || '';
                btn.parentNode.insertBefore(wrapper, btn);
                wrapper.appendChild(btn);
            });
        });
    }

    syncSections() {
        const sections = Array.from(document.querySelectorAll('.section'));
        const lastChoiceIndex = Math.max(-1, ...Object.keys(this.choices).map(Number));
        const isTerminated = document.getElementById('ending-block') !== null;

        sections.forEach((section, index) => {
            const hasChoice = this.choices.hasOwnProperty(index);

            // Show sections that have a choice, OR the next section if not terminated
            if (index <= lastChoiceIndex || (index === lastChoiceIndex + 1 && !isTerminated)) {
                section.classList.add('visible');
            } else {
                section.classList.remove('visible');
            }

            // Always clear the buttons if the section has no recorded choice in this.choices or is hidden
            if (!hasChoice || !section.classList.contains('visible')) {
                section.querySelectorAll('.choice').forEach(btn => btn.classList.remove('selected'));
            }

            // Disable interaction with "future" sections
            const maxInteractiveIndex = isTerminated ? lastChoiceIndex : lastChoiceIndex + 1;
            if (index > maxInteractiveIndex) {
                section.classList.add('locked');
            } else {
                section.classList.remove('locked');
            }
        });
    }

    applyChoice(btn) {
        const section = btn.closest('.section');
        const sections = Array.from(document.querySelectorAll('.section'));
        const index = sections.indexOf(section);

        // Anti-triche : Reset any choice that was made "after" this one
        Object.keys(this.choices).forEach(key => {
            if (Number(key) > index) delete this.choices[key];
        });

        // Supprimer l'éventuel bloc de fin si on change un choix passé
        const endingBlock = document.getElementById('ending-block');
        if (endingBlock) endingBlock.remove();

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

        // We MUST check auto-ending BEFORE syncSections to know if we should reveal the next one
        this.checkAutoEnding();
        this.syncSections();

        // Scroll
        if (sections[index + 1] && !document.getElementById('ending-block')) {
            sections[index + 1].scrollIntoView({ behavior: 'smooth' });
        }
    }

    checkAutoEnding() {
        if (!this.onComputeEnding) return;

        // We call onComputeEnding without a forceEnding to see if the current state is terminal
        const result = this.onComputeEnding(this.variables);
        if (result && result.isTerminal) {
            this.renderEnding(result);
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

        this.renderEnding(result);
    }

    renderEnding(result) {
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
            this.syncSections(); // Hide potential next section that was revealed
            const endingBlock = document.getElementById('ending-block');
            if (endingBlock) endingBlock.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }
}

window.StoryEngine = StoryEngine;
